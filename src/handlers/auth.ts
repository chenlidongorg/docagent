// ========== src/handlers/auth.ts ==========
import { CloudflareEnv } from '../types';
import { createErrorResponse } from '../utils/response';

export function checkAccess(request: Request, env: CloudflareEnv): Response | null {
  // 🔥 完全移除访问权限检查
  // 页面可以直接访问，登录检查在前端处理
  return null;
}

export function handleUnauthorizedPage(): Response {
  // 🔥 这个函数现在基本不会被调用，但保留以防万一
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
        <p>欢迎使用文档生成智能体</p>
        <button class="btn" onclick="goToMainPage()">进入应用</button>
    </div>

    <script>
        function goToMainPage() {
            window.location.href = '/';
        }
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}