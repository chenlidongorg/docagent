// ========== src/handlers/auth.ts ==========
import { CloudflareEnv } from '../types';
import { createErrorResponse } from '../utils/response';

export function checkAccess(request: Request, env: CloudflareEnv): Response | null {
  const url = new URL(request.url);
  const path = url.pathname;

  // 🔥 修改访问权限检查 - 对于API路径，如果没有access_key则使用默认值
  if (path.startsWith('/api/')) {
    const accessKey = url.searchParams.get('access_key');
    if (!accessKey) {
      // 如果没有access_key，使用默认值或允许通过
      // 这里可以设置一个默认的access_key或者完全移除检查
      return null; // 暂时允许通过，依赖登录系统进行权限控制
    }

    // 如果有access_key，则进行验证
    if (accessKey !== env.ACCESS_KEY && accessKey !== 'default') {
      return createErrorResponse('Unauthorized access', 401);
    }
  }

  return null;
}

export function handleUnauthorizedPage(): Response {
  // 🔥 修改未授权页面 - 直接跳转到登录
  const html = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文档生成智能体</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
        .container {
            text-align: center;
            max-width: 400px;
            padding: 40px;
            background: rgba(26, 26, 26, 0.95);
            border-radius: 12px;
            border: 1px solid rgba(51, 51, 51, 0.8);
        }
        .btn {
            background: #ff6b35;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>文档生成智能体</h1>
        <p>请登录后使用服务</p>
        <button class="btn" onclick="goToMainPage()">进入应用</button>
    </div>

    <script>
        function goToMainPage() {
            const url = new URL(window.location);
            url.searchParams.set('access_key', 'default');
            window.location.href = url.toString();
        }
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}