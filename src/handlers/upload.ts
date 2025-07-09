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

    // 🔥 从表单中获取token
    const userToken = formData.get('user_token') as string;

    console.log('🔥 上传请求调试信息:');
    console.log('- userToken 是否存在:', !!userToken);
    console.log('- userToken 类型:', typeof userToken);
    console.log('- userToken 长度:', userToken ? userToken.length : 0);
    console.log('- userToken 前20个字符:', userToken ? userToken.substring(0, 20) + '...' : 'null');
    console.log('- userPrompt 长度:', userPrompt.length);

    // 🔥 检查formData中的所有字段
    console.log('🔥 FormData 所有字段:');
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_')) {
        console.log(`- ${key}: File(${(value as File).name})`);
      } else {
        console.log(`- ${key}: ${typeof value === 'string' ? value.substring(0, 50) + '...' : value}`);
      }
    }

    if (!userToken) {
      console.log('❌ 缺少用户认证信息');
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
          console.log('❌ 文件处理错误:', error);
          return createErrorResponse('文件处理失败', 400);
        }
      }
    }

    console.log('🔥 文件处理完成, 文件数量:', fileCount);

    if (files.length === 0 && !userPrompt.trim()) {
      return createErrorResponse('请上传文件或描述您的文档需求', 400);
    }

    // 🔥 请求体 - 发送userToken作为user_id
    const requestBody: UploadRequest = {
      files: files,
      user_prompt: userPrompt,
      user_id: userToken  // 🔑 发送加密的userToken
    };

    console.log('🔥 发送到智能体服务器的请求体:');
    console.log('- files数量:', files.length);
    console.log('- user_prompt长度:', userPrompt.length);
    console.log('- user_id长度:', userToken.length);

    const response = await fetch('https://docapi.endlessai.org/api/v1/ppt/generate', {
      method: 'POST',
      headers: {
        'X-API-Key': env.PPT_AI_AGENT_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('🔥 智能体响应状态:', response.status);

    let result: any;
    const responseText = await response.text();

    // 检查响应是否为HTML（通常是错误页面）
    if (responseText.trim().startsWith('<')) {
      console.log('❌ 收到HTML响应，可能是服务器错误页面');
      return createErrorResponse('服务器内部错误，请稍后重试', 500);
    }

    // 尝试解析JSON
    try {
      result = JSON.parse(responseText);
    } catch (jsonError) {
      console.log('❌ JSON解析失败:', jsonError);
      console.log('❌ 响应内容:', responseText.substring(0, 200));
      return createErrorResponse('服务器返回了无效的响应格式', 500);
    }

    console.log('🔥 智能体响应:', {
      status: response.status,
      success: result.success,
      error: result.error,
      task_id: result.task_id
    });

    // 处理错误响应
    if (!response.ok || !result.success) {
      const errorMessage = result.message || result.error || '任务创建失败';
      console.log('❌ 智能体返回错误:', errorMessage);
      return createErrorResponse(errorMessage, response.status);
    }

    // 🔥 保存任务到数据库 - 从userToken中提取user_id
    if (result.success && result.task_id) {
      try {
        // 🔥 从token中提取user_id
        let userId = userToken;

        // 如果token包含JWT格式，尝试解析
        if (userToken.includes('.')) {
          try {
            const tokenParts = userToken.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              userId = payload.user_id || payload.id || payload.sub || userToken;
            }
          } catch (e) {
            // 如果解析失败，直接使用token
            userId = userToken;
          }
        }

        console.log('🔥 保存任务到数据库:', {
          task_id: result.task_id,
          user_id: userId,
          message: result.message
        });

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

        console.log('✅ 任务保存成功:', result.task_id);
      } catch (dbError) {
        console.log('⚠️ 数据库保存错误:', dbError);
        // 不因为数据库错误而影响主流程
      }
    }

    return createSuccessResponse(result);

  } catch (error) {
    console.log('❌ 上传处理异常:', error);
    return createErrorResponse('处理请求时发生错误', 500);
  }
}