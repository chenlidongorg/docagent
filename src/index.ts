// src/index.ts 合理且安全的示例代码
import { CloudflareEnv } from './types';
import { createOptionsResponse } from './utils/response';
import { generateHTML } from './templates/html';
import { handleUpload } from './handlers/upload';
import { handleTasks, handleUpdateNote, handleDelete, handleHasPending, handleCheckPending, handleCleanupTask, handleStatus } from './handlers/tasks';
import { handleDownload, handleDownloadWithData } from './handlers/download';

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // OPTIONS
    if (request.method === 'OPTIONS') return createOptionsResponse();

    switch (path) {
      case '/': return new Response(generateHTML(), { headers: { 'Content-Type': 'text/html; charset=utf-8' }});
      case '/api/upload': return handleUpload(request, env, ctx);
      case '/api/tasks': return handleTasks(request, env, ctx);
      case '/api/update-note': return handleUpdateNote(request, env);
      case '/api/delete': return handleDelete(request, env);
      case '/api/download': return handleDownload(request, env);
      case '/api/download-with-data': return handleDownloadWithData(request, env);
      case '/api/status': return handleStatus(request, env);
      case '/api/check-pending': return handleCheckPending(request, env, ctx);
      case '/api/has-pending': return handleHasPending(request, env);
      case '/api/cleanup-task': return handleCleanupTask(request, env);

      default: return new Response('Not Found', { status: 404 });
    }
  }
};