export async function handleUpload(
  request: Request,
  env: CloudflareEnv,
  ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== 'POST') {
    return createErrorResponse('METHOD_NOT_ALLOWED', 405);
  }

  try {
    const formData = await request.formData();
    const files: FileData[] = [];
    const userPrompt = formData.get('user_prompt') as string || '';

    // 🔥 关键修改：从表单中获取token而不是userid
    const userToken = formData.get('user_token') as string;
    const userId = formData.get('user_id') as string; // 登录系统的user_id

    if (!userToken || !userId) {
      return createErrorResponse('VALIDATION_ERROR - Missing user authentication', 400);
    }

    // 处理上传的文件
    let fileCount = 0;
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        if (value.size > 50 * 1024 * 1024) {
          return createErrorResponse('FILE_TOO_LARGE', 413);
        }

        try {
          const arrayBuffer = await value.arrayBuffer();
          const base64Content = arrayBufferToBase64(arrayBuffer);

          files.push({
            filename: value.name,
            content: base64Content,
            content_type: value.type
          });

          fileCount++;
        } catch (error) {
          return createErrorResponse('FILE_PROCESSING_ERROR', 400);
        }
      }
    }

    if (files.length === 0 && !userPrompt.trim()) {
      return createErrorResponse('VALIDATION_ERROR', 400);
    }

    const baseCharge = 1;
    const totalCharge = baseCharge + fileCount;

    // 🔥 关键修改：发送token给文件生成智能体服务
    const requestBody: UploadRequest = {
      files: files,
      user_prompt: userPrompt,
      user_token: userToken, // 🔑 发送加密token
      user_id: userId,       // 🔑 用于标识用户
      constraints: {
        max_slides: 20,
        include_animations: true,
        language: 'auto'
      },
      storage: {
        type: 'r2',
        bucket: env.BUCKET_NAME,
        access_key: env.R2_ACCESS_KEY,
        secret_key: env.R2_SECRET_KEY,
        endpoint: env.R2_ENDPOINT
      }
    };

    const response = await fetch('https://docapi.endlessai.org/api/v1/ppt/generate', {
      method: 'POST',
      headers: {
        'X-API-Key': env.PPT_AI_AGENT_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      return createErrorResponse('RESPONSE_PARSE_ERROR', 500);
    }

    if (!response.ok) {
      if (response.status === 429) {
        return createErrorResponse('COOLDOWN_ACTIVE', 429);
      }
      return createErrorResponse(`HTTP_${response.status}`, response.status);
    }

    // 🔥 关键修改：保存任务时使用登录系统的user_id
    if (result.success && result.task_id) {
      try {
        const stmt = env.D1.prepare(`
          INSERT INTO pptaiagent (taskid, userid, filename, note, createat, status, hasdeleted)
          VALUES (?, ?, '', ?, ?, 'processing', 0)
        `);
        await stmt.bind(
          result.task_id,
          userId, // 🔑 使用登录系统的user_id
          result.message || 'AI智能体正在处理任务',
          Date.now()
        ).run();
      } catch (dbError) {
        console.log('⚠️ 数据库保存错误:', dbError);
      }
    }

    const enhancedResult = {
      ...result,
      billing_info: {
        base_charge: baseCharge,
        file_count: fileCount,
        total_charge: totalCharge,
        billing_formula: "1 + file_count",
        charged_immediately: true
      }
    };

    return createSuccessResponse(enhancedResult);

  } catch (error) {
    return createErrorResponse('NETWORK_ERROR', 500);
  }
}