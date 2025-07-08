import { CloudflareEnv } from '@/types';
import { createErrorResponse, createSuccessResponse } from '@/utils/response';
import { arrayBufferToBase64 } from '@/utils/helpers';

export async function handleDownload(
  request: Request,
  env: CloudflareEnv
): Promise<Response> {
  const url = new URL(request.url);
  const taskId = url.searchParams.get('task_id');

  if (!taskId) {
    return createErrorResponse('Missing task_id parameter', 400);
  }

  try {
    const stmt = env.D1.prepare('SELECT filename FROM pptaiagent WHERE taskid = ? AND hasdeleted = 0');
    const taskInfo = await stmt.bind(taskId).first();

    if (!taskInfo || !taskInfo.filename || (taskInfo.filename as string).trim() === '') {
      return createErrorResponse('File not found or not ready', 404);
    }

    const object = await env.R2.get("aiagentppt/" + taskInfo.filename);

    if (!object) {
      return createErrorResponse('File not found in storage', 404);
    }

    const fileExtension = (taskInfo.filename as string).split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'pdf': 'application/pdf',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'md': 'text/markdown',
      'html': 'text/html',
      'json': 'application/json',
      'txt': 'text/plain'
    };

    const contentType = contentTypes[fileExtension || ''] || 'application/octet-stream';

    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${taskInfo.filename}"`,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000'
      }
    });

  } catch (error) {
    return createErrorResponse('Download failed', 500);
  }
}

export async function handleDownloadWithData(
  request: Request,
  env: CloudflareEnv
): Promise<Response> {
  const url = new URL(request.url);
  const taskId = url.searchParams.get('task_id');

  if (!taskId) {
    return createErrorResponse('Missing task_id parameter', 400);
  }

  try {
    const stmt = env.D1.prepare('SELECT filename FROM pptaiagent WHERE taskid = ? AND hasdeleted = 0');
    const taskInfo = await stmt.bind(taskId).first();

    if (!taskInfo || !taskInfo.filename || (taskInfo.filename as string).trim() === '') {
      return createErrorResponse('File not found or not ready', 404);
    }

    const object = await env.R2.get("aiagentppt/" + taskInfo.filename);

    if (!object) {
      return createErrorResponse('File not found in storage', 404);
    }

    const arrayBuffer = await object.arrayBuffer();
    const base64Data = arrayBufferToBase64(arrayBuffer);

    const fileExtension = (taskInfo.filename as string).split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'pdf': 'application/pdf',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'md': 'text/markdown',
      'html': 'text/html',
      'json': 'application/json',
      'txt': 'text/plain'
    };

    const contentType = contentTypes[fileExtension || ''] || 'application/octet-stream';

    return createSuccessResponse({
      filename: taskInfo.filename,
      content_type: contentType,
      size: arrayBuffer.byteLength,
      base64_data: base64Data
    });

  } catch (error) {
    return createErrorResponse('Download failed', 500);
  }
}