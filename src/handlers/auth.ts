// ========== src/handlers/auth.ts ==========
import { CloudflareEnv } from '../types';
import { createErrorResponse } from '../utils/response';

export function checkAccess(request: Request, env: CloudflareEnv): Response | null {
  const url = new URL(request.url);
  const path = url.pathname;

  // 检查访问权限 - 只对API路径进行严格检查
  if (path.startsWith('/api/')) {
    const accessKey = url.searchParams.get('access_key');
    if (!accessKey || accessKey !== env.ACCESS_KEY) {
      return createErrorResponse('Unauthorized access', 401);
    }
  }

  return null;
}

export function handleUnauthorizedPage(): Response {
  // 如果没有access_key，显示输入页面
  const html = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>访问受限 - Access Restricted</title>
    <style>
        /* 样式保持不变 */
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🔒</div>
        <h1 id="title">访问受限</h1>
        <p id="description">请输入访问密钥以继续使用服务</p>
        <input type="password" class="form-input" id="accessKey" placeholder="请输入访问密钥">
        <button class="btn" onclick="checkAccess()" id="accessBtn">访问</button>
    </div>

    <script>
        function checkAccess() {
            const accessKey = document.getElementById('accessKey').value;
            if (accessKey) {
                const url = new URL(window.location);
                url.searchParams.set('access_key', accessKey);
                // 不再需要userid参数，用户可以通过登录获取
                window.location.href = url.toString();
            }
        }
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}