export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 处理 OPTIONS 请求...
    if (request.method === 'OPTIONS') return createOptionsResponse();

    // 🔥 删除下面这几行代码
    // if (path.startsWith('/assets/')) {
    //   return handleAssets(request, env);
    // }

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