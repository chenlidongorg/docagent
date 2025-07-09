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
    const userToken = formData.get('user_token') as string;

    if (!userToken) {
      return createErrorResponse('缺少用户认证信息，请重新登录', 401);
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
          return createErrorResponse('文件处理失败', 400);
        }
      }
    }

    if (files.length === 0 && !userPrompt.trim()) {
      return createErrorResponse('请上传文件或描述您的文档需求', 400);
    }

    // 请求体
    const requestBody: UploadRequest = {
      files: files,
      user_prompt: userPrompt,
      user_id: userToken
    };

    const response = await fetch('https://docapi.endlessai.org/api/v1/ppt/generate', {
      method: 'POST',
      headers: {
        'X-API-Key': env.PPT_AI_AGENT_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    let result: any;
    const responseText = await response.text();

    if (responseText.trim().startsWith('<')) {
      return createErrorResponse('服务器内部错误，请稍后重试', 500);
    }

    try {
      result = JSON.parse(responseText);
    } catch (jsonError) {
      return createErrorResponse('服务器返回了无效的响应格式', 500);
    }

    if (!response.ok || !result.success) {
      const errorMessage = result.message || result.error || '任务创建失败';
      return createErrorResponse(errorMessage, response.status);
    }

    // 保存任务到数据库
    if (result.success && result.task_id) {
      try {
        let userId = userToken;

        try {
          const tokenData = JSON.parse(atob(userToken.split('.')[1] || ''));
          userId = tokenData.user_id || tokenData.id || userToken;
        } catch (e) {
          userId = userToken;
        }

        const stmt = env.D1.prepare(`
          INSERT INTO pptaiagent (taskid, userid, filename, note, createat, status, hasdeleted)
          VALUES (?, ?, '', ?, ?, 'processing', 0)
        `);
        await stmt.bind(
          result.task_id,
          userId,
          result.message || 'AI智能体正在处理任务',
          Date.now()
        ).run();
      } catch (dbError) {
        // 忽略数据库错误
      }
    }

    return createSuccessResponse(result);

  } catch (error) {
    return createErrorResponse('处理请求时发生错误', 500);
  }
}