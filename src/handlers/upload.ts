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
      user_id: userToken       // 🔑 发送加密token，里面包含了user_id，对方服务器会自己解析，此备注不要修改
    };

    console.log('发送到智能体的请求:', {
      fileCount: files.length,
      promptLength: userPrompt.length,
      hasToken: !!userToken,
      userId: userId
    });

    // 🔥 增加超时和错误处理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    let response: Response;
    try {
      response = await fetch('https://docapi.endlessai.org/api/v1/ppt/generate', {
        method: 'POST',
        headers: {
          'X-API-Key': env.PPT_AI_AGENT_API_KEY,
          'Content-Type': 'application/json',
          'User-Agent': 'DocAgent/1.0'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.log('网络请求失败:', fetchError);

      if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
        return createErrorResponse('请求超时，请稍后重试', 408);
      }

      return createErrorResponse('无法连接到服务器，请检查网络连接', 503);
    }

    clearTimeout(timeoutId);

    console.log('智能体响应状态:', response.status);

    // 🔥 增强的响应处理
    let result: any;
    const responseText = await response.text();

    // 检查响应是否为HTML（通常是错误页面）
    if (responseText.trim().startsWith('<')) {
      console.log('收到HTML响应，可能是服务器错误页面');
      return createErrorResponse('服务器内部错误，请稍后重试', 500);
    }

    // 尝试解析JSON
    try {
      result = JSON.parse(responseText);
    } catch (jsonError) {
      console.log('JSON解析失败:', jsonError);
      console.log('响应内容:', responseText.substring(0, 200));
      return createErrorResponse('服务器返回了无效的响应格式', 500);
    }

    console.log('智能体响应:', {
      status: response.status,
      success: result.success,
      error: result.error
    });

    // 🔥 详细的状态码处理
    if (!response.ok) {
      let errorMessage = '服务器错误';

      switch (response.status) {
        case 400:
          errorMessage = result.message || '请求参数错误';
          break;
        case 401:
          errorMessage = '认证失败，请重新登录';
          break;
        case 403:
          errorMessage = '权限不足';
          break;
        case 429:
          errorMessage = '请求过于频繁，请稍后再试';
          break;
        case 500:
          errorMessage = '服务器内部错误，请稍后重试';
          break;
        case 502:
        case 503:
          errorMessage = '服务暂时不可用，请稍后重试';
          break;
        default:
          errorMessage = result.message || result.error || `服务器错误 (${response.status})`;
      }

      return createErrorResponse(errorMessage, response.status);
    }

    // 🔥 检查业务逻辑错误
    if (!result.success) {
      const errorMessage = result.message || result.error || '任务创建失败';
      return createErrorResponse(errorMessage, 400);
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
        // 数据库错误不阻止返回成功结果
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

    // 🔥 增强的错误分类
    let errorMessage = '处理请求时发生错误';
    let statusCode = 500;

    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = '网络连接失败，请检查网络连接';
      statusCode = 503;
    } else if (error instanceof SyntaxError) {
      errorMessage = '数据格式错误';
      statusCode = 400;
    }

    return createErrorResponse(errorMessage, statusCode);
  }
}