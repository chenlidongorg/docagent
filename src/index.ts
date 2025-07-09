import { CloudflareEnv } from './types';
import { createOptionsResponse } from './utils/response';
import { handleUpload } from './handlers/upload';
import { handleTasks, handleUpdateNote, handleDelete, handleStatus, handleCheckPending, handleHasPending, handleCleanupTask } from './handlers/tasks';
import { handleDownload, handleDownloadWithData } from './handlers/download';
import { generateHTML } from './templates/html';

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
      return createOptionsResponse();
    }

    // 🔥 优雅的静态资源处理
    if (path.startsWith('/assets/')) {
      return handleStaticAssets(request, env);
    }

    // API 路由
    switch (path) {
      case '/':
        return new Response(generateHTML(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });

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

// 🔥 优雅的静态资源处理函数
async function handleStaticAssets(request: Request, env: CloudflareEnv): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // 定义资源映射
  const assetMap: Record<string, () => Promise<{ content: string; contentType: string }>> = {
    '/assets/styles.css': async () => ({
      content: await import('../public/assets/styles.css?raw').then(m => m.default),
      contentType: 'text/css'
    }),
    '/assets/app.js': async () => ({
      content: await import('../public/assets/app.js?raw').then(m => m.default),
      contentType: 'application/javascript'
    }),
    '/assets/logo.png': async () => ({
      content: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline></svg>`,
      contentType: 'image/svg+xml'
    })
  };

  const assetLoader = assetMap[path];
  if (!assetLoader) {
    return new Response('Not Found', { status: 404 });
  }

  try {
    const { content, contentType } = await assetLoader();
    return new Response(content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}