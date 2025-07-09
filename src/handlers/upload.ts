// ========== src/handlers/upload.ts ==========
import { CloudflareEnv, FileData, UploadRequest } from '../types';
import { createErrorResponse, createSuccessResponse } from '../utils/response';
import { arrayBufferToBase64 } from '../utils/helpers';

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
    const userId = formData.get('user_id') as string;

    console.log('上传请求验证:', {
      hasToken: !!userToken,
      hasUserId: !!userId,
      tokenLength: userToken ? userToken.length : 0,
      userId: userId
    });

    if (!userToken || !userId) {
      console.log('认证失败: 缺少token或userId');
      return createErrorResponse('缺少用户认证信息，请重新登录', 400);
    }

    // 处理上传的文件
    let fileCount = 0;
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        if (value.size > 50 * 1024 * 1024) {
          return createErrorResponse('文件过大，最大支持50MB', 413);
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
          console.log('文件处理错误:', error);
          return createErrorResponse('文件处理失败', 400);
        }
      }
    }

    if (files.length === 0 && !userPrompt.trim()) {
      return createErrorResponse('请上传文件或描述您的文档需求', 400);
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

    console.log('发送到智能体的请求:', {
      fileCount: files.length,
      promptLength: userPrompt.length,
      hasToken: !!userToken,
      userId: userId
    });

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
      console.log('解析响应失败:', jsonError);
      return createErrorResponse('服务器响应格式错误', 500);
    }

    console.log('智能体响应:', {
      status: response.status,
      success: result.success,
      error: result.error
    });

    if (!response.ok) {
      if (response.status === 429) {
        return createErrorResponse('请求过于频繁，请稍后再试', 429);
      }

      const errorMessage = result.message || result.error || `服务器错误 (${response.status})`;
      return createErrorResponse(errorMessage, response.status);
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

        console.log('任务保存成功:', result.task_id);
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
    console.log('上传处理异常:', error);
    return createErrorResponse('网络连接失败，请重试', 500);
  }
}