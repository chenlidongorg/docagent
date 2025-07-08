import { CloudflareEnv } from '@/types';
import { createErrorResponse } from '@/utils/response';

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
  const html = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>访问受限 - Access Restricted</title>
    <style>
        :root {
            --bg-primary: #000;
            --bg-secondary: rgba(26, 26, 26, 0.95);
            --border-color: rgba(51, 51, 51, 0.8);
            --text-primary: #fff;
            --text-secondary: rgba(255, 255, 255, 0.7);
            --text-placeholder: rgba(255, 255, 255, 0.5);
            --accent-color: #ff6b35;
            --accent-hover: #e55a2b;
        }

        [data-theme="light"] {
            --bg-primary: #f8fafc;
            --bg-secondary: rgba(255, 255, 255, 0.95);
            --border-color: rgba(226, 232, 240, 0.8);
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --text-placeholder: #94a3b8;
            --accent-color: #ff6b35;
            --accent-hover: #e55a2b;
        }

        @media (prefers-color-scheme: light) {
            :root {
                --bg-primary: #f8fafc;
                --bg-secondary: rgba(255, 255, 255, 0.95);
                --border-color: rgba(226, 232, 240, 0.8);
                --text-primary: #1e293b;
                --text-secondary: #64748b;
                --text-placeholder: #94a3b8;
                --accent-color: #ff6b35;
                --accent-hover: #e55a2b;
            }
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-primary);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-primary);
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .container {
            background: var(--bg-secondary);
            backdrop-filter: blur(10px);
            border: 1px solid var(--border-color);
            padding: 40px;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        .icon {
            font-size: 4rem;
            margin-bottom: 20px;
            opacity: 0.8;
        }

        h1 {
            color: var(--text-primary);
            margin-bottom: 20px;
            font-weight: 600;
        }

        p {
            color: var(--text-secondary);
            margin-bottom: 30px;
            line-height: 1.5;
        }

        .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            font-size: 16px;
            margin-bottom: 20px;
            box-sizing: border-box;
            background: var(--bg-primary);
            color: var(--text-primary);
            transition: all 0.3s ease;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--accent-color);
        }

        .form-input::placeholder {
            color: var(--text-placeholder);
        }

        .btn {
            background: var(--accent-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s ease;
            font-weight: 500;
        }

        .btn:hover {
            background: var(--accent-hover);
            transform: translateY(-1px);
        }

        .btn:active {
            transform: translateY(0);
        }

        .lang-toggle {
            position: absolute;
            top: 20px;
            right: 20px;
            background: var(--accent-color);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <button class="lang-toggle" onclick="toggleLanguage()" id="langToggle">EN</button>

    <div class="container">
        <div class="icon">🔒</div>
        <h1 id="title">访问受限</h1>
        <p id="description">请输入访问密钥以继续使用服务</p>
        <input type="password" class="form-input" id="accessKey" placeholder="请输入访问密钥">
        <button class="btn" onclick="checkAccess()" id="accessBtn">访问</button>
    </div>

    <script>
        let currentLang = 'zh';

        const i18n = {
            zh: {
                title: '访问受限',
                description: '请输入访问密钥以继续使用服务',
                placeholder: '请输入访问密钥',
                button: '访问',
                toggleBtn: 'EN'
            },
            en: {
                title: 'Access Restricted',
                description: 'Please enter access key to continue using the service',
                placeholder: 'Please enter access key',
                button: 'Access',
                toggleBtn: '中文'
            }
        };

        function toggleLanguage() {
            currentLang = currentLang === 'zh' ? 'en' : 'zh';
            updateLanguage();
        }

        function updateLanguage() {
            const texts = i18n[currentLang];
            document.getElementById('title').textContent = texts.title;
            document.getElementById('description').textContent = texts.description;
            document.getElementById('accessKey').placeholder = texts.placeholder;
            document.getElementById('accessBtn').textContent = texts.button;
            document.getElementById('langToggle').textContent = texts.toggleBtn;
        }

        function checkAccess() {
            const accessKey = document.getElementById('accessKey').value;
            if (accessKey) {
                const url = new URL(window.location);
                url.searchParams.set('access_key', accessKey);
                window.location.href = url.toString();
            }
        }

        document.getElementById('accessKey').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAccess();
            }
        });
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}