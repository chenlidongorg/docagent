// ========== src/index.ts ==========
import { CloudflareEnv } from '@/types';
import { createOptionsResponse } from '@/utils/response';
import { checkAccess, handleUnauthorizedPage } from '@/handlers/auth';
import { handleUpload } from '@/handlers/upload';
import { handleTasks, handleUpdateNote, handleDelete, handleStatus, handleCheckPending, handleHasPending, handleCleanupTask } from '@/handlers/tasks';
import { handleDownload, handleDownloadWithData } from '@/handlers/download';
import { handleI18n } from '@/handlers/i18n';
import { generateHTML } from '@/templates/html';

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
      return createOptionsResponse();
    }

    // 检查访问权限
    const authError = checkAccess(request, env);
    if (authError) {
      return authError;
    }

    // 路由处理
    switch (path) {
      case '/':
        const accessKey = url.searchParams.get('access_key');
        if (!accessKey) {
          return handleUnauthorizedPage();
        }
        return new Response(generateHTML(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });

      case '/api/i18n':
        return handleI18n(request, env);

      case '/api/upload':
        return handleUpload(request, env, ctx);

      case '/api/tasks':
        return handleTasks(request, env, ctx);

      case '/api/update-note':
        return handleUpdateNote(request, env);

      case '/api/delete':
        return handleDelete(request, env);

      case '/api/download':
        return handleDownload(request, env);

      case '/api/download-with-data':
        return handleDownloadWithData(request, env);

      case '/api/status':
        return handleStatus(request, env);

      case '/api/check-pending':
        return handleCheckPending(request, env, ctx);

      case '/api/has-pending':
        return handleHasPending(request, env);

      case '/api/cleanup-task':
        return handleCleanupTask(request, env);

      default:
        return new Response('Not Found', { status: 404 });
    }
  }
};