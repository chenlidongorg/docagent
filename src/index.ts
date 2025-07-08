import { CloudflareEnv } from '@/types';
import { checkAccess, handleUnauthorizedPage } from '@/handlers/auth';
import { handleAPI } from '@/handlers/api';
import { generateHTML } from '@/templates/html';

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      // 检查访问权限
      const authError = checkAccess(request, env);
      if (authError) {
        return authError;
      }

      // 处理主页面
      if (request.method === 'GET' && path === '/') {
        const accessKey = url.searchParams.get('access_key');
        if (!accessKey || accessKey !== env.ACCESS_KEY) {
          return handleUnauthorizedPage();
        }

        const locale = url.searchParams.get('locale') || 'auto';
        const html = generateHTML(locale);
        return new Response(html, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // API 路由
      if (path.startsWith('/api/')) {
        return handleAPI(request, env, ctx, path);
      }

      return new Response(JSON.stringify({
        success: false,
        error: 'Not Found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal Server Error',
        details: (error as Error).message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },
};