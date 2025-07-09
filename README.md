### `README.md`
```markdown
# Document Agent - 文档生成智能体

基于 Cloudflare Workers 的文档生成智能体，支持多种文档格式生成。

## 功能特性

- 📄 支持多种文档格式生成 (PPT, PDF, Word, Excel 等)
- 🌐 多语言支持 (中文/英文)
- 📱 响应式设计，支持移动端
- 🔐 访问权限控制
- 📊 任务进度跟踪
- 💾 文件存储与管理

## 部署说明

### 1. 环境变量配置

在 Cloudflare Workers 控制台设置以下环境变量：

```bash
PPT_AI_AGENT_API_KEY=your-api-key
ACCESS_KEY=your-access-key
BUCKET_NAME=your-bucket-name
R2_ACCESS_KEY=your-r2-access-key
R2_SECRET_KEY=your-r2-secret-key
R2_ENDPOINT=your-r2-endpoint
```

### 2. 数据库配置

创建 D1 数据库并执行以下 SQL：

```sql
CREATE TABLE pptaiagent (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taskid TEXT NOT NULL,
    userid TEXT NOT NULL,
    filename TEXT DEFAULT '',
    note TEXT DEFAULT '',
    createat INTEGER NOT NULL,
    status TEXT DEFAULT 'processing',
    hasdeleted INTEGER DEFAULT 0
);

CREATE INDEX idx_userid ON pptaiagent(userid);
CREATE INDEX idx_taskid ON pptaiagent(taskid);
```

### 3. 部署步骤

```bash
# 1. 安装依赖
npm install

# 2. 登录 Cloudflare
npx wrangler login

# 3. 部署
npm run deploy
```

### 4. 绑定资源

在 Cloudflare Workers 控制台手动绑定：
- D1 数据库 (binding: D1)
- R2 存储桶 (binding: R2)

## 项目结构

```

```

## 本地开发

```bash
# 启动开发服务器
npm run dev

# 构建项目
npm run build
```

## API 接口

### 上传文件
```
POST /api/upload?access_key=xxx
```

### 获取任务列表
```
GET /api/tasks?userid=xxx&access_key=xxx
```

### 下载文件
```
GET /api/download?task_id=xxx&access_key=xxx
```

### 删除任务
```
DELETE /api/delete?task_id=xxx&userid=xxx&access_key=xxx
```

## 许可证

© 2025 Endless AI LLC. 版权所有
```

## 部署说明

1. **准备工作**：
   - 确保已安装 Node.js 和 npm
   - 安装 Wrangler CLI: `npm install -g wrangler`

2. **配置环境**：
   ```bash
   # 克隆项目
   git clone <your-repo-url>
   cd docagent
   
   # 安装依赖
   npm install
   
   # 登录 Cloudflare
   npx wrangler login
   ```

3. **设置资源**：
    - 创建 D1 数据库
    - 创建 R2 存储桶
    - 在 `wrangler.toml` 中更新相应的 ID

4. **部署**：
   ```bash
   npm run deploy
   ```

5. **配置环境变量**：
   在 Cloudflare Workers 控制台设置所需的环境变量

这个重构后的项目保持了原有的所有功能，但代码结构更清晰，更易于维护和扩展。每个模块都有明确的职责，类型定义完善，便于后续开发和调试。


这个项目是从旧项目扩展来的，我提供旧的项目给你参考，

export default {
async fetch(request, env, ctx) {
try {
const url = new URL(request.url);
const path = url.pathname;

            // 检查访问权限 - 只对API路径进行严格检查
            if (path.startsWith('/api/')) {
                const accessKey = url.searchParams.get('access_key');
                if (!accessKey || accessKey !== env.ACCESS_KEY) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Unauthorized access'
                    }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }
            
            // 对于主页面，可以更宽松的检查或者在页面中处理
            if (request.method === 'GET' && path === '/') {
                const accessKey = url.searchParams.get('access_key');
                if (!accessKey || accessKey !== env.ACCESS_KEY) {
                    return handleUnauthorizedPage();
                }
                
                return handleHomePage(url);
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
                details: error.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    },
};

// 任务状态定义
const TaskStatus = {
CREATED: 'created',
AI_THINKING: 'ai_thinking',
PROCESSING: 'processing',
COMPLETED: 'completed',
FAILED: 'failed'
};

// 处理未授权访问页面
function handleUnauthorizedPage() {
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

// 处理主页
async function handleHomePage(url) {
const locale = url.searchParams.get('locale') || 'auto';
const html = generateHTML(locale);
return new Response(html, {
headers: { 'Content-Type': 'text/html; charset=utf-8' }
});
}

// 处理 API 请求
async function handleAPI(request, env, ctx, path) {
const corsHeaders = {
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS, PUT',
'Access-Control-Allow-Headers': 'Content-Type',
'Content-Type': 'application/json'
};

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }
    
    try {
        switch (path) {
            case '/api/upload':
                return await handleUpload(request, env, ctx, corsHeaders);
            case '/api/status':
                return await handleStatus(request, env, corsHeaders);
            case '/api/download':
                return await handleDownload(request, env, corsHeaders);
            case '/api/download-with-data':
                return await handleDownloadWithData(request, env, corsHeaders);
            case '/api/tasks':
                return await handleTasks(request, env, ctx, corsHeaders);
            case '/api/update-note':
                return await handleUpdateNote(request, env, corsHeaders);
            case '/api/delete':
                return await handleDelete(request, env, corsHeaders);
            case '/api/check-pending':
                return await handleCheckPending(request, env, ctx, corsHeaders);
            case '/api/has-pending':
                return await handleHasPending(request, env, corsHeaders);
            case '/api/cleanup-task':
                return await handleCleanupTask(request, env, corsHeaders);
            default:
                return new Response(JSON.stringify({
                    success: false,
                    error: 'API endpoint not found'
                }), {
                    status: 404,
                    headers: corsHeaders
                });
        }
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Internal server error',
            type: error.constructor.name
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 🔥 下载文件并返回文件数据的接口
async function handleDownloadWithData(request, env, corsHeaders) {
const url = new URL(request.url);
const taskId = url.searchParams.get('task_id');

    if (!taskId) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Missing task_id parameter'
        }), {
            status: 400,
            headers: corsHeaders
        });
    }
    
    try {
        // 从数据库获取文件名
        const stmt = env.D1.prepare('SELECT filename FROM pptaiagent WHERE taskid = ? AND hasdeleted = 0');
        const taskInfo = await stmt.bind(taskId).first();
        
        if (!taskInfo || !taskInfo.filename || taskInfo.filename.trim() === '') {
            return new Response(JSON.stringify({
                success: false,
                error: 'File not found or not ready'
            }), {
                status: 404,
                headers: corsHeaders
            });
        }
        
        // 直接从 R2 获取文件
        const object = await env.R2.get("aiagentppt/"+taskInfo.filename);
        
        if (!object) {
            return new Response(JSON.stringify({
                success: false,
                error: 'File not found in storage'
            }), {
                status: 404,
                headers: corsHeaders
            });
        }
        
        // 读取文件内容为 ArrayBuffer
        const arrayBuffer = await object.arrayBuffer();
        
        // 转换为 Base64
        const base64Data = arrayBufferToBase64(arrayBuffer);
        
        // 根据文件扩展名确定 Content-Type
        const fileExtension = taskInfo.filename.split('.').pop()?.toLowerCase();
        const contentTypes = {
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
        
        const contentType = contentTypes[fileExtension] || 'application/octet-stream';
        
        return new Response(JSON.stringify({
            success: true,
            data: {
                filename: taskInfo.filename,
                content_type: contentType,
                size: arrayBuffer.byteLength,
                base64_data: base64Data
            }
        }), {
            headers: corsHeaders
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Download failed'
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 🔥 清理服务端任务的接口
async function handleCleanupTask(request, env, corsHeaders) {
if (request.method !== 'POST') {
return new Response(JSON.stringify({
success: false,
error: 'Method not allowed'
}), {
status: 405,
headers: corsHeaders
});
}

    try {
        const { task_id, userid } = await request.json();
        
        if (!task_id || !userid) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Missing required parameters'
            }), {
                status: 400,
                headers: corsHeaders
            });
        }
        
        // 验证任务是否存在且属于该用户
        const stmt = env.D1.prepare('SELECT taskid, filename FROM pptaiagent WHERE taskid = ? AND userid = ? AND hasdeleted = 0');
        const taskInfo = await stmt.bind(task_id, userid).first();
        
        if (!taskInfo) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Task not found'
            }), {
                status: 404,
                headers: corsHeaders
            });
        }
        
        // 只清理已完成的任务
        if (!taskInfo.filename || taskInfo.filename.trim() === '') {
            return new Response(JSON.stringify({
                success: false,
                error: 'Task not completed yet'
            }), {
                status: 400,
                headers: corsHeaders
            });
        }
        
        // 调用服务端清理API
        try {
            const response = await fetch(`https://docapi.endlessai.org/api/v1/tasks/${task_id}/cleanup`, {
                method: 'DELETE',
                headers: {
                    'X-API-Key': env.PPT_AI_AGENT_API_KEY
                }
            });
            
            // 不管服务端清理是否成功，都返回成功（因为文件已经在R2中）
            return new Response(JSON.stringify({
                success: true,
                message: 'Task cleanup requested',
                server_cleanup_success: response.ok
            }), {
                headers: corsHeaders
            });
            
        } catch (error) {
            // 服务端清理失败，但任务数据完整，仍返回成功
            return new Response(JSON.stringify({
                success: true,
                message: 'Task cleanup requested (server cleanup failed)',
                server_cleanup_success: false,
                error: error.message
            }), {
                headers: corsHeaders
            });
        }
        
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Cleanup failed'
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 检查是否有待处理任务
async function handleHasPending(request, env, corsHeaders) {
const url = new URL(request.url);
const userId = url.searchParams.get('userid');

    if (!userId) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Missing userid parameter'
        }), {
            status: 400,
            headers: corsHeaders
        });
    }
    
    try {
        const stmt = env.D1.prepare(`
            SELECT COUNT(*) as count FROM pptaiagent 
            WHERE userid = ? 
            AND hasdeleted = 0
            AND (filename = '' OR filename IS NULL)
            AND (
                note NOT LIKE '%失败%' AND 
                note NOT LIKE '%超时%' AND 
                note NOT LIKE '%Failed%' AND 
                note NOT LIKE '%Error%'
            )
        `);
        const result = await stmt.bind(userId).first();
        
        return new Response(JSON.stringify({
            success: true,
            has_pending: result.count > 0,
            pending_count: result.count
        }), {
            headers: corsHeaders
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Failed to check pending tasks'
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 安全的 Base64 编码函数
function arrayBufferToBase64(buffer) {
try {
const bytes = new Uint8Array(buffer);
const chunkSize = 8192;
let result = '';

        for (let i = 0; i < bytes.length; i += chunkSize) {
            const chunk = bytes.subarray(i, i + chunkSize);
            result += String.fromCharCode.apply(null, chunk);
        }
        
        return btoa(result);
    } catch (error) {
        throw new Error('Failed to encode file content');
    }
}

// 🔥 修正后的 handleUpload 函数 - 简化冷却期提示
async function handleUpload(request, env, ctx, corsHeaders) {
if (request.method !== 'POST') {
return new Response(JSON.stringify({
success: false,
error: 'METHOD_NOT_ALLOWED',
message: '请求方法不允许'
}), {
status: 405,
headers: corsHeaders
});
}

    try {
        const formData = await request.formData();
        const files = [];
        const userPrompt = formData.get('user_prompt') || '';
        const userId = formData.get('userid');
        
        if (!userId) {
            return new Response(JSON.stringify({
                success: false,
                error: 'VALIDATION_ERROR',
                message: '缺少用户ID参数'
            }), {
                status: 400,
                headers: corsHeaders
            });
        }
        
        // 🔥 在服务端精确计算附件数量
        let fileCount = 0;
        
        // 处理上传的文件
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('file_') && value instanceof File) {
                if (value.size > 50 * 1024 * 1024) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'FILE_TOO_LARGE',
                        message: `文件 ${value.name} 过大，最大支持50MB`
                    }), {
                        status: 413,
                        headers: corsHeaders
                    });
                }
                
                try {
                    const arrayBuffer = await value.arrayBuffer();
                    const base64Content = arrayBufferToBase64(arrayBuffer);
                    
                    files.push({
                        filename: value.name,
                        content: base64Content,
                        content_type: value.type
                    });
                    
                    fileCount++;
                } catch (error) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'FILE_PROCESSING_ERROR',
                        message: `处理文件 ${value.name} 时出错：${error.message}`
                    }), {
                        status: 400,
                        headers: corsHeaders
                    });
                }
            }
        }
        
        if (files.length === 0 && (!userPrompt || userPrompt.trim() === '')) {
            return new Response(JSON.stringify({
                success: false,
                error: 'VALIDATION_ERROR',
                message: '请提供文件或描述您的需求'
            }), {
                status: 400,
                headers: corsHeaders
            });
        }
        
        // 🔥 核心修复：服务端计算精确扣费数量
        const baseCharge = 1;
        const totalCharge = baseCharge + fileCount;
        
        // 🔥 添加用户来源标识到请求体
        const requestBody = {
            files: files,
            user_prompt: userPrompt,
            user_id: userId,  // 🔑 关键：添加用户ID用于冷却期管理
            constraints: {
                max_slides: 20,
                include_animations: true,
                language: 'auto'
            },
            storage: {
                type: 'r2',
                bucket: env.BUCKET_NAME,
                access_key: env.R2_ACCESS_KEY,
                secret_key: env.R2_SECRET_KEY,
                endpoint: env.R2_ENDPOINT
            }
        };
        
        // 🔥 调用智能体任务 API
        const response = await fetch('https://docapi.endlessai.org/api/v1/ppt/generate', {
            method: 'POST',
            headers: {
                'X-API-Key': env.PPT_AI_AGENT_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            // 🔥 JSON解析失败时的处理
            return new Response(JSON.stringify({
                success: false,
                error: 'RESPONSE_PARSE_ERROR',
                message: '服务器返回了无效的响应格式，请稍后重试或联系技术支持'
            }), {
                status: 500,
                headers: corsHeaders
            });
        }
        
        // 🔥 处理非成功响应
        if (!response.ok) {
            // 🔥 冷却期错误特殊处理 - HTTP 429
            if (response.status === 429) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'COOLDOWN_ACTIVE',
                    message: '请求过于频繁，需要间隔30秒提交任务',
                    data: {
                        cooldown_remaining: 30,
                        preserve_form: true
                    }
                }), {
                    status: 429,
                    headers: corsHeaders
                });
            }
            
            // 🔥 其他HTTP错误的友好处理
            const errorMessages = {
                400: '请求参数错误，请检查输入内容',
                401: '访问被拒绝，请检查访问权限',
                403: '权限不足，无法执行此操作',
                404: '请求的服务不存在',
                413: '上传的文件过大，请减小文件大小',
                500: '服务器内部错误，请稍后重试',
                502: '服务器网关错误，请稍后重试',
                503: '服务暂时不可用，请稍后重试'
            };
            
            const userFriendlyMessage = errorMessages[response.status] || `服务器错误 (${response.status})，请稍后重试`;
            
            return new Response(JSON.stringify({
                success: false,
                error: `HTTP_${response.status}`,
                message: userFriendlyMessage,
                technical_details: `HTTP ${response.status} - ${response.statusText}`,
                server_message: result?.message || ''
            }), {
                status: response.status,
                headers: corsHeaders
            });
        }
        
        // 🔥 任务创建成功后，立即保存到数据库
        if (result.success && result.task_id) {
            try {
                const stmt = env.D1.prepare(`
                    INSERT INTO pptaiagent (taskid, userid, filename, note, createat, status, hasdeleted) 
                    VALUES (?, ?, '', ?, ?, 'processing', 0)
                `);
                await stmt.bind(
                    result.task_id,
                    userId,
                    result.message || 'AI智能体正在处理任务',
                    Date.now()
                ).run();
                
            } catch (dbError) {
                console.log('⚠️ 数据库保存错误:', dbError);
            }
        }
        
        // 🔥 在响应中包含精确的扣费信息
        const enhancedResult = {
            ...result,
            billing_info: {
                base_charge: baseCharge,
                file_count: fileCount,
                total_charge: totalCharge,
                billing_formula: "1 + file_count",
                charged_immediately: true
            }
        };
        
        return new Response(JSON.stringify(enhancedResult), {
            headers: corsHeaders
        });
        
    } catch (error) {
        // 🔥 网络和其他异常的友好处理
        let userMessage = '网络连接失败，请检查网络后重试';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            userMessage = '无法连接到服务器，请检查网络连接';
        } else if (error.name === 'AbortError') {
            userMessage = '请求超时，请稍后重试';
        } else if (error.message.includes('JSON')) {
            userMessage = '服务器响应格式错误，请联系技术支持';
        }
        
        return new Response(JSON.stringify({
            success: false,
            error: 'NETWORK_ERROR',
            message: userMessage,
            technical_details: error.message
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 查询任务状态
async function handleStatus(request, env, corsHeaders) {
const url = new URL(request.url);
const taskId = url.searchParams.get('task_id');

    if (!taskId) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Missing task_id parameter'
        }), {
            status: 400,
            headers: corsHeaders
        });
    }
    
    try {
        const response = await fetch(`https://docapi.endlessai.org/api/v1/tasks/${taskId}`, {
            headers: {
                'X-API-Key': env.PPT_AI_AGENT_API_KEY
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            return new Response(JSON.stringify({
                success: false,
                error: `Failed to get task status: ${response.status}`,
                details: errorText
            }), {
                status: response.status,
                headers: corsHeaders
            });
        }
        
        const result = await response.json();
        return new Response(JSON.stringify(result), {
            headers: corsHeaders
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Failed to check task status'
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 直接从 R2 下载文件
async function handleDownload(request, env, corsHeaders) {
const url = new URL(request.url);
const taskId = url.searchParams.get('task_id');

    if (!taskId) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Missing task_id parameter'
        }), {
            status: 400,
            headers: corsHeaders
        });
    }
    
    try {
        // 从数据库获取文件名
        const stmt = env.D1.prepare('SELECT filename FROM pptaiagent WHERE taskid = ? AND hasdeleted = 0');
        const taskInfo = await stmt.bind(taskId).first();
        
        if (!taskInfo || !taskInfo.filename || taskInfo.filename.trim() === '') {
            return new Response(JSON.stringify({
                success: false,
                error: 'File not found or not ready'
            }), {
                status: 404,
                headers: corsHeaders
            });
        }
        
        // 直接从 R2 获取文件
        const object = await env.R2.get("aiagentppt/"+taskInfo.filename);
        
        if (!object) {
            return new Response(JSON.stringify({
                success: false,
                error: 'File not found in storage'
            }), {
                status: 404,
                headers: corsHeaders
            });
        }
        
        // 根据文件扩展名确定 Content-Type
        const fileExtension = taskInfo.filename.split('.').pop()?.toLowerCase();
        const contentTypes = {
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
        
        const contentType = contentTypes[fileExtension] || 'application/octet-stream';
        
        return new Response(object.body, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${taskInfo.filename}"`,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=31536000'
            }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Download failed'
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 获取任务列表
async function handleTasks(request, env, ctx, corsHeaders) {
const url = new URL(request.url);
const userId = url.searchParams.get('userid');
const page = parseInt(url.searchParams.get('page') || '1');
const limit = parseInt(url.searchParams.get('limit') || '10');
const offset = (page - 1) * limit;

    if (!userId) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Missing userid parameter'
        }), {
            status: 400,
            headers: corsHeaders
        });
    }
    
    try {
        // 获取总数（只统计未删除的）
        const countStmt = env.D1.prepare('SELECT COUNT(*) as total FROM pptaiagent WHERE userid = ? AND hasdeleted = 0');
        const countResult = await countStmt.bind(userId).first();
        const total = countResult.total;
        
        // 查询任务列表
        const stmt = env.D1.prepare(`
            SELECT taskid, filename, note, createat, status 
            FROM pptaiagent 
            WHERE userid = ? AND hasdeleted = 0
            ORDER BY createat DESC 
            LIMIT ? OFFSET ?
        `);
        const { results } = await stmt.bind(userId, limit, offset).all();
        
        // 动态检查远程API状态并返回处理过的任务
        const tasksWithStatus = await Promise.all(results.map(async (task) => {
            let status = TaskStatus.PROCESSING;
            let realTimeNote = task.note;
            let statusText = '';
            let progress = 0;
            
            // 🔥 更宽松的完成判断条件
            const hasValidFilename = task.filename && task.filename.trim() !== '';
            const isCompletedByStatus = task.status === TaskStatus.COMPLETED;
            const hasCompletionNote = task.note && (
                task.note.includes('已生成') ||
                task.note.includes('完成') ||
                task.note.includes('成功') ||
                task.note.includes('generated') ||
                task.note.includes('completed') ||
                task.note.includes('finished')
            );
            
            // 🔥 核心修复：更智能的完成状态判断
            if (hasValidFilename || isCompletedByStatus || hasCompletionNote) {
                status = TaskStatus.COMPLETED;
                statusText = '已完成';
                progress = 100;
                
                // 🔥 如果有文件名但数据库状态还没更新，尝试更新
                if (hasValidFilename && task.status !== TaskStatus.COMPLETED) {
                    ctx.waitUntil(updateTaskStatus(env, task.taskid, userId, realTimeNote, TaskStatus.COMPLETED));
                }
            }
            // 检查备注中的失败信息
            else if (task.note && (
                task.note.includes('失败') ||
                task.note.includes('超时') ||
                task.note.includes('Failed') ||
                task.note.includes('Error')
            )) {
                status = TaskStatus.FAILED;
                statusText = '失败';
                progress = 0;
            }
            // 对于处理中的任务，实时检查远程API状态
            else {
                try {
                    const response = await fetch(`https://docapi.endlessai.org/api/v1/tasks/${task.taskid}`, {
                        headers: {
                            'X-API-Key': env.PPT_AI_AGENT_API_KEY
                        }
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        status = result.status;
                        progress = result.progress || 0;
                        
                        switch(result.status) {
                            case TaskStatus.CREATED:
                                statusText = '任务创建中';
                                realTimeNote = '任务已创建，等待AI智能体处理';
                                progress = 5;
                                break;
                            case TaskStatus.AI_THINKING:
                                statusText = 'AI分析中';
                                realTimeNote = 'AI智能体正在分析需求并选择最佳文档格式';
                                progress = 30;
                                break;
                            case TaskStatus.PROCESSING:
                                statusText = '正在生成';
                                realTimeNote = 'AI智能体正在生成文档内容';
                                progress = 70;
                                break;
                            case TaskStatus.COMPLETED:
                                status = TaskStatus.COMPLETED;
                                statusText = '已完成';
                                progress = 100;
                                if (result.result_url) {
                                    realTimeNote = result.note || 'AI智能体任务完成';
                                    // 保存filename到数据库
                                    ctx.waitUntil(updateTaskWithFilename(env, task.taskid, userId, result.result_url, realTimeNote));
                                }
                                break;
                            case TaskStatus.FAILED:
                                status = TaskStatus.FAILED;
                                statusText = '失败';
                                progress = 0;
                                realTimeNote = result.note || '任务处理失败';
                                ctx.waitUntil(updateTaskStatus(env, task.taskid, userId, realTimeNote, status));
                                break;
                            default:
                                statusText = '处理中';
                                realTimeNote = result.note || '任务正在处理中';
                                progress = result.progress || 50;
                        }
                        
                        if (result.status !== TaskStatus.COMPLETED &&
                            (result.note !== task.note || result.status !== task.status)) {
                            ctx.waitUntil(updateTaskStatus(env, task.taskid, userId, result.note || realTimeNote, result.status));
                        }
                    }
                } catch (error) {
                    statusText = '处理中';
                    progress = 50;
                }
            }
            
            // 从filename推断格式
            let fileFormat = 'unknown';
            if (task.filename) {
                const ext = task.filename.split('.').pop()?.toLowerCase();
                fileFormat = ext || 'unknown';
            }
            
            return {
                task_id: task.taskid,
                filename: task.filename,
                note: realTimeNote,
                created_at: task.createat,
                file_format: fileFormat,
                status: status,
                status_text: statusText,
                progress: progress
            };
        }));
        
        return new Response(JSON.stringify({
            success: true,
            data: {
                tasks: tasksWithStatus,
                total: total,
                page: page,
                limit: limit,
                has_more: offset + limit < total
            }
        }), {
            headers: corsHeaders
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Failed to fetch tasks'
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 更新任务文件名的辅助函数
async function updateTaskWithFilename(env, taskId, userId, filename, note) {
try {
const stmt = env.D1.prepare(`
UPDATE pptaiagent
SET filename = ?, note = ?, status = 'completed'
WHERE taskid = ? AND userid = ? AND hasdeleted = 0
`);
await stmt.bind(filename, note, taskId, userId).run();
} catch (error) {
// 忽略错误
}
}

// 更新任务状态的辅助函数
async function updateTaskStatus(env, taskId, userId, note, status) {
try {
const stmt = env.D1.prepare(`
UPDATE pptaiagent
SET note = ?, status = ?
WHERE taskid = ? AND userid = ? AND hasdeleted = 0
`);
await stmt.bind(note, status, taskId, userId).run();
} catch (error) {
// 忽略错误
}
}

// 更新备注
async function handleUpdateNote(request, env, corsHeaders) {
if (request.method !== 'PUT') {
return new Response(JSON.stringify({
success: false,
error: 'Method not allowed'
}), {
status: 405,
headers: corsHeaders
});
}

    try {
        const { task_id, note, userid } = await request.json();
        
        if (!task_id || !userid) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Missing required parameters'
            }), {
                status: 400,
                headers: corsHeaders
            });
        }
        
        const stmt = env.D1.prepare(`
            UPDATE pptaiagent 
            SET note = ? 
            WHERE taskid = ? AND userid = ? AND hasdeleted = 0
        `);
        await stmt.bind(note || '无备注', task_id, userid).run();
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Note updated successfully'
        }), {
            headers: corsHeaders
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Failed to update note'
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 删除保存的文件（假删除）
async function handleDelete(request, env, corsHeaders) {
if (request.method !== 'DELETE') {
return new Response(JSON.stringify({
success: false,
error: 'Method not allowed'
}), {
status: 405,
headers: corsHeaders
});
}

    try {
        const url = new URL(request.url);
        const taskId = url.searchParams.get('task_id');
        const userid = url.searchParams.get('userid');
        
        if (!taskId || !userid) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Missing required parameters'
            }), {
                status: 400,
                headers: corsHeaders
            });
        }
        
        // 假删除：只更新 hasdeleted 标志为 1
        const deleteStmt = env.D1.prepare('UPDATE pptaiagent SET hasdeleted = 1 WHERE taskid = ? AND userid = ?');
        await deleteStmt.bind(taskId, userid).run();
        
        return new Response(JSON.stringify({
            success: true,
            message: 'File deleted successfully'
        }), {
            headers: corsHeaders
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Failed to delete file'
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 检查和处理未完成的任务
async function handleCheckPending(request, env, ctx, corsHeaders) {
const url = new URL(request.url);
const userId = url.searchParams.get('userid');

    if (!userId) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Missing userid parameter'
        }), {
            status: 400,
            headers: corsHeaders
        });
    }
    
    try {
        // 查找需要检查的任务
        const stmt = env.D1.prepare(`
            SELECT taskid, note FROM pptaiagent 
            WHERE userid = ? 
            AND hasdeleted = 0
            AND (filename = '' OR filename IS NULL)
            AND (
                note NOT LIKE '%失败%' AND 
                note NOT LIKE '%超时%' AND 
                note NOT LIKE '%Failed%' AND 
                note NOT LIKE '%Error%'
            )
            ORDER BY createat DESC
            LIMIT 20
        `);
        const { results } = await stmt.bind(userId).all();
        
        let updatedTasks = 0;
        
        // 并发检查多个任务
        const concurrentLimit = 3;
        for (let i = 0; i < results.length; i += concurrentLimit) {
            const batch = results.slice(i, i + concurrentLimit);
            const promises = batch.map(task => checkAndUpdateSingleTask(env, task, userId));
            
            const batchResults = await Promise.allSettled(promises);
            const batchUpdated = batchResults.filter(result =>
                result.status === 'fulfilled' && result.value === true
            ).length;
            
            updatedTasks += batchUpdated;
            
            if (i + concurrentLimit < results.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Pending tasks checked',
            checked_tasks: results.length,
            updated_tasks: updatedTasks
        }), {
            headers: corsHeaders
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Failed to check pending tasks'
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 单个任务检查和更新函数
async function checkAndUpdateSingleTask(env, task, userId) {
try {
const response = await fetch(`https://docapi.endlessai.org/api/v1/tasks/${task.taskid}`, {
headers: {
'X-API-Key': env.PPT_AI_AGENT_API_KEY
}
});

        if (response.ok) {
            const result = await response.json();
            
            if (result.status === 'completed' && result.result_url) {
                // 保存文件名到数据库（智能体已将文件保存到 R2）
                await updateTaskWithFilename(env, task.taskid, userId, result.result_url, result.note || 'AI生成完成');
                return true;
                
            } else if (result.status === 'failed') {
                await updateTaskStatus(env, task.taskid, userId, '任务处理失败', result.status);
                return true;
                
            } else if (result.note && result.note !== task.note) {
                await updateTaskStatus(env, task.taskid, userId, result.note, result.status);
                return true;
            }
        }
        
        return false;
        
    } catch (error) {
        return false;
    }
}

// 生成HTML页面
function generateHTML(locale = 'auto') {
return `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="doc_ai_agent">文档生成智能体</title>
    <script src="https://cdn.jsdelivr.net/npm/feather-icons@4.29.0/dist/feather.min.js"></script>
    <style>
        /* CSS 变量定义 - 暗色模式（默认） */
        :root {
            --bg-primary: #000;
            --bg-secondary: #1a1a1a;
            --bg-tertiary: #2a2a2a;
            --border-color: #333;
            --border-hover: #22c55e;
            --text-primary: #fff;
            --text-secondary: #ccc;
            --text-muted: #666;
            --text-placeholder: rgba(255, 255, 255, 0.5);
            --accent-color: #ff6b35;
            --accent-hover: #e55a2b;
            --success-color: #22c55e;
            --success-hover: #16a34a;
            --danger-color: #ef4444;
            --danger-hover: #dc2626;
            --warning-color: #f59e0b;
            --info-color: #3b82f6;
            --shadow-color: rgba(0, 0, 0, 0.3);
            --backdrop-filter: blur(10px);
            --cooldown-bg: #6b7280;
            --cooldown-hover: #4b5563;
        }

        /* 亮色模式 */
        [data-theme="light"] {
            --bg-primary: #ffffff;
            --bg-secondary: #f8fafc;
            --bg-tertiary: #e2e8f0;
            --border-color: #e2e8f0;
            --border-hover: #22c55e;
            --text-primary: #1e293b;
            --text-secondary: #475569;
            --text-muted: #94a3b8;
            --text-placeholder: #94a3b8;
            --accent-color: #ff6b35;
            --accent-hover: #e55a2b;
            --success-color: #22c55e;
            --success-hover: #16a34a;
            --danger-color: #ef4444;
            --danger-hover: #dc2626;
            --warning-color: #f59e0b;
            --info-color: #3b82f6;
            --shadow-color: rgba(0, 0, 0, 0.1);
            --backdrop-filter: blur(10px);
            --cooldown-bg: #9ca3af;
            --cooldown-hover: #6b7280;
        }

        /* 系统偏好 - 亮色模式 */
        @media (prefers-color-scheme: light) {
            :root {
                --bg-primary: #ffffff;
                --bg-secondary: #f8fafc;
                --bg-tertiary: #e2e8f0;
                --border-color: #e2e8f0;
                --border-hover: #22c55e;
                --text-primary: #1e293b;
                --text-secondary: #475569;
                --text-muted: #94a3b8;
                --text-placeholder: #94a3b8;
                --accent-color: #ff6b35;
                --accent-hover: #e55a2b;
                --success-color: #22c55e;
                --success-hover: #16a34a;
                --danger-color: #ef4444;
                --danger-hover: #dc2626;
                --warning-color: #f59e0b;
                --info-color: #3b82f6;
                --shadow-color: rgba(0, 0, 0, 0.1);
                --backdrop-filter: blur(10px);
                --cooldown-bg: #9ca3af;
                --cooldown-hover: #6b7280;
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
            color: var(--text-primary);
            transition: background-color 0.3s ease, color 0.3s ease;
            padding-bottom: 60px;
        }
        
        /* Header 样式 */
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 20px;
            border-bottom: 1px solid var(--border-color);
            background: var(--bg-secondary);
            transition: all 0.3s ease;
        }
        
        .header-left {
            display: flex;
            align-items: center;
        }
        
        .logo {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            box-shadow: 0 4px 8px var(--shadow-color);
            margin-right: 15px;
        }
        
        .title {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        /* 语言下拉选择器 */
        .lang-dropdown {
            position: relative;
            display: inline-block;
        }

        .lang-select {
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--bg-tertiary);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            min-width: 80px;
        }

        .lang-select:hover {
            background: var(--bg-secondary);
            border-color: var(--border-hover);
        }

        .lang-dropdown-content {
            display: none;
            position: absolute;
            right: 0;
            top: 100%;
            margin-top: 4px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            min-width: 120px;
            box-shadow: 0 8px 32px var(--shadow-color);
            z-index: 1000;
        }

        .lang-dropdown-content.show {
            display: block;
        }

        .lang-option {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            color: var(--text-primary);
        }

        .lang-option:hover {
            background: var(--bg-tertiary);
        }

        .lang-option.selected {
            background: var(--accent-color);
            color: white;
        }

        /* 响应式标题 */
        @media (max-width: 768px) {
            .title {
                font-size: 1rem;
            }
            
            .title-long {
                display: none;
            }
            
            .title-short {
                display: inline;
            }
        }

        @media (min-width: 769px) {
            .title-long {
                display: inline;
            }
            
            .title-short {
                display: none;
            }
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .main-section {
            background: var(--bg-secondary);
            border-radius: 8px;
            border: 1px solid var(--border-color);
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }
        
        .section-header {
            padding: 20px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .section-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .section-body {
            padding: 20px;
        }
        
        .upload-area {
            border: 2px dashed var(--border-color);
            border-radius: 6px;
            padding: 30px;
            text-align: center;
            margin-bottom: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
            background: var(--bg-primary);
        }
        
        .upload-area:hover {
            border-color: var(--border-hover);
            background: var(--bg-tertiary);
        }
        
        .upload-area.dragover {
            border-color: var(--border-hover);
            background: var(--bg-tertiary);
        }
        
        .upload-icon {
            margin-bottom: 15px;
            display: flex;
            justify-content: center;
        }
        
        .upload-icon svg {
            color: var(--text-muted);
        }
        
        .upload-text {
            color: var(--text-secondary);
            margin-bottom: 10px;
        }
        
        .upload-formats {
            color: var(--text-muted);
            font-size: 14px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-secondary);
        }
        
        .form-input {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            font-size: 16px;
            background: var(--bg-primary);
            color: var(--text-primary);
            transition: all 0.3s ease;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--border-hover);
        }
        
        .form-input::placeholder {
            color: var(--text-placeholder);
        }
        
        .form-textarea {
            min-height: 100px;
            resize: vertical;
        }
        
        .btn {
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-primary {
            background: var(--accent-color);
            color: white;
            width: 70%;
            margin: 0 auto;
            display: flex;
            justify-content: center;
        }
        
        .btn-primary:hover {
            background: var(--accent-hover);
        }
        
        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .btn-success {
            background: var(--success-color);
            color: white;
            margin-right: 10px;
        }
        
        .btn-success:hover {
            background: var(--success-hover);
        }
        
        .btn-danger {
            background: var(--danger-color);
            color: white;
        }
        
        .btn-danger:hover {
            background: var(--danger-hover);
        }
        
        .btn-secondary {
            background: var(--text-muted);
            color: white;
        }
        
        .btn-secondary:hover {
            background: var(--text-secondary);
        }

        /* 🔥 冷却期按钮样式 */
        .btn-cooldown {
            background: linear-gradient(135deg, var(--cooldown-bg), var(--cooldown-hover));
            color: white;
            width: 70%;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            opacity: 0.8;
            cursor: not-allowed;
            box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
        }

        .btn-cooldown:hover {
            background: linear-gradient(135deg, var(--cooldown-hover), #374151);
            transform: none;
        }
        
        .file-list {
            margin-top: 15px;
        }
        
        .file-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            background: var(--bg-tertiary);
            border-radius: 4px;
            margin-bottom: 8px;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
        }
        
        .file-name {
            flex: 1;
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .file-size {
            font-size: 12px;
            color: var(--text-muted);
            margin-right: 10px;
        }
        
        .file-remove {
            background: var(--danger-color);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
        }
        
        .submitting-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: var(--backdrop-filter);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        
        .submitting-overlay.active {
            display: flex;
        }
        
        .submitting-content {
            text-align: center;
            padding: 40px;
            background: var(--bg-secondary);
            border-radius: 12px;
            border: 1px solid var(--border-color);
            max-width: 400px;
            box-shadow: 0 8px 32px var(--shadow-color);
        }
        
        .submitting-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid var(--border-color);
            border-top: 4px solid var(--accent-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        .submitting-text {
            font-size: 18px;
            color: var(--text-primary);
            margin-bottom: 10px;
        }
        
        .submitting-status {
            color: var(--text-secondary);
            font-size: 14px;
        }

        /* 🔥 自定义对话框样式 */
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 2000;
            align-items: center;
            justify-content: center;
        }

        .modal-overlay.active {
            display: flex;
        }

        .modal-content {
            background: var(--bg-secondary);
            border-radius: 12px;
            border: 1px solid var(--border-color);
            padding: 30px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px var(--shadow-color);
            text-align: center;
            animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        .modal-icon {
            margin-bottom: 20px;
            font-size: 3rem;
        }

        .modal-icon.error {
            color: var(--danger-color);
        }

        .modal-icon.warning {
            color: var(--warning-color);
        }

        .modal-icon.success {
            color: var(--success-color);
        }

        .modal-icon.info {
            color: var(--info-color);
        }

        .modal-title {
            font-size: 1.4rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 15px;
        }

        .modal-message {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 25px;
            font-size: 16px;
        }

        .modal-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .modal-btn {
            padding: 10px 20px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            min-width: 80px;
        }

        .modal-btn-primary {
            background: var(--accent-color);
            color: white;
        }

        .modal-btn-primary:hover {
            background: var(--accent-hover);
        }

        .modal-btn-secondary {
            background: var(--text-muted);
            color: white;
        }

        .modal-btn-secondary:hover {
            background: var(--text-secondary);
        }

        /* 🔥 增强的模态框样式 */
        .modal-content.warning {
            border-left: 4px solid var(--warning-color);
        }

        .modal-content.error {
            border-left: 4px solid var(--danger-color);
        }

        .error-details {
            background: var(--bg-tertiary);
            padding: 10px;
            border-radius: 4px;
            margin-top: 15px;
            font-size: 12px;
            color: var(--text-muted);
            border-left: 3px solid var(--text-muted);
            text-align: left;
        }
        
        .progress-section {
            display: none;
            text-align: center;
            padding: 40px 20px;
        }
        
        .success-section {
            text-align: center;
            padding: 40px 20px;
        }
        
        .success-icon {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
        }
        
        .success-icon svg {
            color: var(--success-color);
        }
        
        .success-title {
            font-size: 24px;
            color: var(--text-primary);
            margin-bottom: 20px;
            font-weight: 600;
        }
        
        .success-message {
            color: var(--text-secondary);
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 35px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .success-actions {
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
        }
        
        .btn-back {
            background: var(--success-color);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-back:hover {
            background: var(--success-hover);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
        }
        
        .auto-return-text {
            color: var(--text-muted);
            font-size: 14px;
            font-weight: 500;
        }
        
        .progress-circle {
            width: 80px;
            height: 80px;
            border: 4px solid var(--border-color);
            border-top: 4px solid var(--accent-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .progress-text {
            font-size: 18px;
            margin-bottom: 10px;
            color: var(--text-primary);
        }
        
        .progress-status {
            color: var(--text-secondary);
            font-size: 14px;
        }
        
        .task-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px;
            border-bottom: 1px solid var(--border-color);
            background: var(--bg-secondary);
            transition: all 0.3s ease;
        }
        
        .task-item:last-child {
            border-bottom: none;
        }
        
        .task-item.processing {
            border-left: 4px solid var(--accent-color);
        }
        
        .task-item.completed {
            border-left: 4px solid var(--success-color);
        }
        
        .task-item.failed {
            border-left: 4px solid var(--danger-color);
        }
        
        .task-info {
            flex: 1;
        }
        
        .task-filename {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: var(--text-primary);
            margin-bottom: 5px;
        }
        
        .format-badge {
            display: inline-block;
            background: var(--accent-color);
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: 500;
        }
        
        .task-status {
            font-size: 12px;
            padding: 3px 8px;
            border-radius: 3px;
            margin-bottom: 5px;
            font-weight: 500;
            display: inline-block;
        }
        
        .task-status.processing {
            background: rgba(255, 107, 53, 0.2);
            color: var(--accent-color);
        }
        
        .task-status.completed {
            background: rgba(34, 197, 94, 0.2);
            color: var(--success-color);
        }
        
        .task-status.failed {
            background: rgba(239, 68, 68, 0.2);
            color: var(--danger-color);
        }
        
        .task-note {
            font-size: 12px;
            color: var(--text-muted);
            margin-bottom: 5px;
            cursor: pointer;
            transition: color 0.3s;
        }
        
        .task-note:hover {
            color: var(--text-secondary);
        }
        
        .task-note.editing {
            display: none;
        }
        
        .task-note-input {
            display: none;
            width: 100%;
            padding: 4px 8px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-size: 12px;
        }
        
        .task-note-input.editing {
            display: block;
        }
        
        .task-date {
            font-size: 12px;
            color: var(--text-muted);
        }
        
        .task-actions {
            display: flex;
            gap: 8px;
        }
        
        .hidden {
            display: none !important;
        }

        #loadMoreSection {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 20px;
            border-top: 1px solid var(--border-color);
            background: var(--bg-secondary);
        }
        
        .load-more-section {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 15px;
            width: 100%;
        }
        
        .load-more-btn {
            background: var(--accent-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .load-more-btn:hover {
            background: var(--accent-hover);
        }
        
        .load-more-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .loading-indicator {
            display: none;
            align-items: center;
            gap: 10px;
            color: var(--text-muted);
            font-size: 14px;
        }
        
        .loading-indicator.active {
            display: flex;
        }
        
        .loading-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid var(--border-color);
            border-top: 2px solid var(--accent-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .footer {
            background: var(--bg-secondary);
            border-top: 1px solid var(--border-color);
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 40px;
        }

        .footer a {
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .footer a:hover {
            color: var(--accent-color);
        }

        /* 移动端优化 */
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header {
                padding: 10px 15px;
            }
            
            .section-body {
                padding: 15px;
            }
            
            .upload-area {
                padding: 20px;
            }
            
            .task-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            
            .task-actions {
                width: 100%;
                justify-content: flex-end;
            }
            
            .submitting-content {
                margin: 20px;
                padding: 30px;
            }
            
            .success-message {
                font-size: 16px;
                margin-bottom: 30px;
            }
            
            .btn-back {
                padding: 12px 24px;
                font-size: 16px;
            }
            
            .load-more-section {
                padding: 15px;
                gap: 10px;
            }
            
            .load-more-btn {
                padding: 10px 20px;
                font-size: 13px;
            }
            
            .loading-indicator {
                font-size: 13px;
            }

            .footer {
                font-size: 11px;
                padding: 15px;
            }

            .lang-dropdown-content {
                min-width: 100px;
            }

            body {
                padding-bottom: 20px;
            }

            .modal-content {
                padding: 25px;
                max-width: 90%;
            }

            .modal-icon {
                font-size: 2.5rem;
            }

            .modal-title {
                font-size: 1.2rem;
            }

            .modal-message {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <!-- 🔥 自定义对话框 -->
    <div id="modalOverlay" class="modal-overlay">
        <div class="modal-content">
            <div id="modalIcon" class="modal-icon">⚠️</div>
            <div id="modalTitle" class="modal-title">提示</div>
            <div id="modalMessage" class="modal-message">这是一个提示消息</div>
            <div id="modalDetails" class="error-details" style="display: none;"></div>
            <div class="modal-buttons">
                <button id="modalConfirmBtn" class="modal-btn modal-btn-primary" onclick="closeModal()">确定</button>
                <button id="modalCancelBtn" class="modal-btn modal-btn-secondary" onclick="closeModal()" style="display: none;">取消</button>
            </div>
        </div>
    </div>

    <!-- 提交中遮罩层 -->
    <div id="submittingOverlay" class="submitting-overlay">
        <div class="submitting-content">
            <div class="submitting-spinner"></div>
            <div class="submitting-text" data-i18n="submitting">任务提交中</div>
            <div class="submitting-status" data-i18n="uploading">正在上传文件并创建任务...</div>
        </div>
    </div>

    <div class="header">
        <div class="header-left">
            <img src="https://files.whiteboardapp.org/companylogo.png" alt="Logo" class="logo">
            <div class="title">
                <span class="title-long" data-i18n="doc_ai_agent">文档生成智能体</span>
                <span class="title-short"data-i18n="doc_ai_agent_short">文档智能体</span>
            </div>
        </div>
        <div class="lang-dropdown">
            <div class="lang-select" onclick="toggleLangDropdown()">
                <span id="currentLangFlag">🌐</span>
                <span id="currentLangText">中文</span>
                <i data-feather="chevron-down" style="width: 16px; height: 16px;"></i>
            </div>
            <div class="lang-dropdown-content" id="langDropdownContent">
                <div class="lang-option" onclick="setLanguage('zh')" data-lang="zh">
                    <span>🇨🇳</span>
                    <span>中文</span>
                </div>
                <div class="lang-option" onclick="setLanguage('en')" data-lang="en">
                    <span>🇺🇸</span>
                    <span>English</span>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <!-- 上传区域 -->
        <div id="uploadSection" class="main-section">
            <div class="section-header">
                <div class="section-title">
                    <i data-feather="plus-circle" style="width: 20px; height: 20px;"></i>
                    <span data-i18n="create_document">创建文档</span>
                </div>
            </div>
            <div class="section-body">
                <form id="uploadForm">
                    <div class="upload-area" id="uploadArea">
                        <div class="upload-icon">
                            <i data-feather="upload-cloud" style="width: 48px; height: 48px;"></i>
                        </div>
                        <div class="upload-text" data-i18n="drag_or_click">拖拽文件到此处或点击选择文件(可选)</div>
                        <div class="upload-formats" data-i18n="supported_formats">支持 PDF, PNG, JPG, DOCX, PPTX, XLSX 等格式</div>
                    </div>
                    <input type="file" id="fileInput" multiple accept=".pdf,.png,.jpg,.jpeg,.gif,.bmp,.tiff,.doc,.docx,.ppt,.pptx,.xls,.xlsx" style="position: absolute; left: -9999px; opacity: 0;">
                    
                    <div class="file-list" id="fileList"></div>
                    
                    <div class="form-group">
                        <label class="form-label" for="userPrompt" data-i18n="document_requirements">文档需求描述</label>
                        <textarea 
                            class="form-input form-textarea" 
                            id="userPrompt" 
                            data-i18n-placeholder="requirements_placeholder"
                            placeholder="请描述您希望生成的文档内容和格式要求（如未上传文件则必填）..."
                        ></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" id="generateBtn" data-i18n="generate_document_btn">
                        <i data-feather="zap" style="width: 18px; height: 18px;"></i>
                        开始生成
                    </button>
                </form>
            </div>
        </div>

        <!-- 成功提示区域 -->
        <div id="successSection" class="main-section" style="display: none;">
            <div class="section-body">
                <div class="success-section" id="successContent">
                    <div class="success-icon">
                        <i data-feather="check-circle" style="width: 64px; height: 64px;"></i>
                    </div>
                    <div class="success-title" data-i18n="task_submitted">任务提交成功！</div>
                    <div class="success-message" data-i18n="task_submitted_message">
                        AI智能体正在分析您的需求并选择最佳文档格式。<br>
                        任务已进入队列处理，您可以离开页面稍后查看结果。
                    </div>
                    <div class="success-actions">
                        <button class="btn-back" onclick="returnToList()" data-i18n="return_to_list">
                            <i data-feather="arrow-left" style="width: 18px; height: 18px;"></i>
                            返回列表
                        </button>
                        <div class="auto-return-text" id="autoReturnText">4秒后自动返回</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 进度区域 -->
        <div id="progressSection" class="main-section hidden">
            <div class="section-body">
                <div class="progress-section">
                    <div class="progress-circle"></div>
                    <div class="progress-text" id="progressText" data-i18n="processing">正在处理...</div>
                    <div class="progress-status" id="progressStatus" data-i18n="can_close_page">任务已提交，您可以关闭页面，稍后回来查看结果</div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button class="btn btn-secondary" onclick="resetForm()" data-i18n="submit_new_task">
                        <i data-feather="plus" style="width: 16px; height: 16px;"></i>
                        提交新任务
                    </button>
                </div>
            </div>
        </div>
        
        
        <!-- 历史记录 -->
        <div id="historySection" class="main-section">
            <div class="section-header">
                <div class="section-title">
                    <i data-feather="folder" style="width: 20px; height: 20px;"></i>
                    <span data-i18n="my_documents">我的文档</span>
                </div>
            </div>
            <div id="tasksList">
                <div class="no-records" data-i18n="no_document_records">
                    暂无文档记录
                </div>
            </div>
            <div id="loadMoreSection" class="load-more-section" style="display: none;">
                <button id="loadMoreBtn" class="load-more-btn" onclick="loadMoreTasks()" data-i18n="load_more">
                    <i data-feather="chevron-down" style="width: 16px; height: 16px;"></i>
                    加载更多
                </button>
                <div id="loadingIndicator" class="loading-indicator">
                    <div class="loading-spinner"></div>
                    <span data-i18n="loading">正在加载...</span>
                </div>
            </div>
        </div>
    </div>

    <div class="footer">
        <span>&copy; since 2025, 由 <a href="https://endlessai.org" target="_blank">Endless AI LLC.</a> <span data-i18n="copyright">版权所有</span></span>
    </div>

    <script>
        // 国际化配置
        const i18nConfig = {
            zh: {
                doc_ai_agent: '文档生成智能体',
                doc_ai_agent_short: '文档智能体',
                submitting: '任务提交中',
                uploading: '正在上传文件并创建任务...',
                create_document: '创建文档',
                drag_or_click: '拖拽文件到此处或点击选择文件(可选)',
                supported_formats: '支持 PDF, PNG, JPG, DOCX, PPTX, XLSX 等格式',
                document_requirements: '文档需求描述',
                requirements_placeholder: '请描述您希望生成的文档内容和格式要求（如未上传文件则必填）...',
                generate_document_btn: '开始生成',
                task_submitted: '任务提交成功！',
                task_submitted_message: 'AI智能体正在分析您的需求并选择最佳文档格式。<br>任务已进入队列处理，您可以离开页面稍后查看结果。',
                return_to_list: '返回列表',
                processing: '正在处理...',
                can_close_page: '任务已提交，您可以关闭页面，稍后回来查看结果',
                submit_new_task: '提交新任务',
                my_documents: '我的文档',
                no_document_records: '暂无文档记录',
                load_more: '加载更多',
                loading: '正在加载...',
                download: '下载',
                download_with_data: '下载文件',
                delete: '删除',
                no_note: '无备注',
                auto_return_seconds: '秒后自动返回',
                confirm_delete: '确定要删除这个文档吗？',
                delete_success: '文档删除成功！',
                note_update_success: '备注更新成功',
                files_or_prompt_required: '请上传文件或描述您的文档需求',
                upload_failed: '上传失败',
                download_failed: '下载失败',
                delete_failed: '删除失败',
                update_failed: '更新失败',
                file_too_large: '文件过大，最大支持50MB',
                format_pptx: 'PPT演示',
                format_pdf: 'PDF文档',
                format_docx: 'Word文档',
                format_xlsx: 'Excel表格',
                format_png: '图片',
                format_md: 'Markdown文档',
                format_html: '网页文档',
                format_json: 'JSON数据',
                copyright: '版权所有',
                cleanup_success: '服务端任务清理成功',
                cleanup_failed: '服务端任务清理失败（不影响文件下载）',
                confirm: '确定',
                cancel: '取消',
                ok: '好的',
                error: '错误',
                warning: '警告',
                success: '成功',
                info: '提示',
                task_create_failed: '任务创建失败',
                retry: '重试',
                network_retry_hint: '网络连接失败，是否要重试？',
                cooldown_wait_hint: '请求过于频繁，需要间隔30秒提交任务', // 🔥 简化的冷却期提示
                technical_details: '技术细节'
            },
            en: {
                doc_ai_agent: 'Document Generation Agent',
                doc_ai_agent_short: 'Doc Agent',
                submitting: 'Submitting Task',
                uploading: 'Uploading files and creating task...',
                create_document: 'Create Document',
                drag_or_click: 'Drag files here or click to select (optional)',
                supported_formats: 'Supports PDF, PNG, JPG, DOCX, PPTX, XLSX formats',
                document_requirements: 'Document Requirements',
                requirements_placeholder: 'Please describe the content and format requirements for your document (required if no files uploaded)...',
                generate_document_btn: 'Start Generate',
                task_submitted: 'Task Submitted Successfully!',
                task_submitted_message: 'AI agent is analyzing your requirements and selecting the best document format.<br>The task has been queued for processing, you can leave the page and check results later.',
                return_to_list: 'Return to List',
                processing: 'Processing...',
                can_close_page: 'Task submitted, you can close the page and check results later',
                submit_new_task: 'Submit New Task',
                my_documents: 'My Documents',
                no_document_records: 'No document records',
                load_more: 'Load More',
                loading: 'Loading...',
                download: 'Download',
                download_with_data: 'Download File',
                delete: 'Delete',
                no_note: 'No note',
                auto_return_seconds: 's until auto return',
                confirm_delete: 'Are you sure you want to delete this document?',
                delete_success: 'Document deleted successfully!',
                note_update_success: 'Note updated successfully',
                files_or_prompt_required: 'Please upload files or describe your document requirements',
                upload_failed: 'Upload failed',
                download_failed: 'Download failed',
                delete_failed: 'Delete failed',
                update_failed: 'Update failed',
                file_too_large: 'File too large, maximum 50MB supported',
                format_pptx: 'PPT',
                format_pdf: 'PDF',
                format_docx: 'Word',
                format_xlsx: 'Excel',
                format_png: 'Infographic',
                format_md: 'Markdown',
                format_html: 'Web',
                format_json: 'JSON',
                copyright: 'All rights reserved',
                cleanup_success: 'Server task cleanup successful',
                cleanup_failed: 'Server task cleanup failed (download not affected)',
                confirm: 'Confirm',
                cancel: 'Cancel',
                ok: 'OK',
                error: 'Error',
                warning: 'Warning',
                success: 'Success',
                info: 'Info',
                task_create_failed: 'Task creation failed',
                retry: 'Retry',
                network_retry_hint: 'Network connection failed, do you want to retry?',
                cooldown_wait_hint: 'Too frequent requests, need to wait 30 seconds between submissions', // 🔥 简化的冷却期提示
                technical_details: 'Technical Details'
            }
        };

        let selectedFiles = [];
        let currentTaskId = null;
        let pollingInterval = null;
        let autoReturnTimer = null;
        let currentLocale = '${locale}';
        let currentPage = 1;
        let isLoading = false;
        let hasMore = true;
        let lastCheckTime = 0;
        let isEventListenersInitialized = false;
        
        // 简化的轮询控制状态
        let hasActiveTasks = false;
        let smartPollingTimer = null;
        let pendingCheckTimer = null;

        // 🔥 冷却期管理状态
        let clientCooldownEndTime = 0;  // 客户端冷却期结束时间戳
        let cooldownTimer = null;       // 冷却期倒计时定时器

        // 获取当前URL参数
        const urlParams = new URLSearchParams(window.location.search);
        const accessKey = urlParams.get('access_key');
        const userId = urlParams.get('userid');

        // 任务状态定义
        const TaskStatus = {
            CREATED: 'created',
            AI_THINKING: 'ai_thinking',
            PROCESSING: 'processing',
            COMPLETED: 'completed',
            FAILED: 'failed'
        };

        // 🔥 自定义对话框函数
        function showModal(options) {
            const {
                type = 'info',
                title,
                message,
                icon,
                confirmText,
                cancelText,
                onConfirm,
                onCancel,
                showCancel = false,
                details
            } = options;

            const modalOverlay = document.getElementById('modalOverlay');
            const modalIcon = document.getElementById('modalIcon');
            const modalTitle = document.getElementById('modalTitle');
            const modalMessage = document.getElementById('modalMessage');
            const modalDetails = document.getElementById('modalDetails');
            const confirmBtn = document.getElementById('modalConfirmBtn');
            const cancelBtn = document.getElementById('modalCancelBtn');
            const modalContent = modalOverlay.querySelector('.modal-content');

            // 设置图标
            if (icon) {
                modalIcon.textContent = icon;
            } else {
                const defaultIcons = {
                    error: '❌',
                    warning: '⚠️',
                    success: '✅',
                    info: 'ℹ️'
                };
                modalIcon.textContent = defaultIcons[type] || 'ℹ️';
            }

            modalIcon.className = \`modal-icon \${type}\`;
            modalTitle.textContent = title || t(type);
            modalMessage.innerHTML = message || '';

            // 🔥 显示技术细节（如果有）
            if (details) {
                modalDetails.textContent = details;
                modalDetails.style.display = 'block';
            } else {
                modalDetails.style.display = 'none';
            }

            // 设置模态框样式类
            modalContent.className = \`modal-content \${type}\`;

            // 设置按钮文本
            confirmBtn.textContent = confirmText || t('ok');
            cancelBtn.textContent = cancelText || t('cancel');

            // 显示/隐藏取消按钮
            cancelBtn.style.display = showCancel ? 'inline-block' : 'none';

            // 设置事件处理器
            confirmBtn.onclick = () => {
                closeModal();
                if (onConfirm) onConfirm();
            };

            cancelBtn.onclick = () => {
                closeModal();
                if (onCancel) onCancel();
            };

            modalOverlay.classList.add('active');
        }

        function closeModal() {
            document.getElementById('modalOverlay').classList.remove('active');
        }

        // 🔥 简化的冷却期错误显示
        function showCooldownErrorModal(result) {
            const data = result.data || {};
            const remaining = data.cooldown_remaining || 30;
            
            // 🔥 启动客户端倒计时
            if (remaining > 0) {
                clientCooldownEndTime = Date.now() + (remaining * 1000);
                localStorage.setItem('cooldown_end_time', clientCooldownEndTime.toString());
                startClientCooldownCountdown();
            }
            
            showModal({
                type: 'warning',
                title: '⏰ ' + t('warning'),
                message: t('cooldown_wait_hint'), // 🔥 使用本地化文本
                icon: '⏰',
                confirmText: t('ok')
            });
        }

        // 🔥 显示用户友好的错误信息
        function showUserFriendlyError(options) {
            const { code, title, message, icon, type, serverMessage, details } = options;
            
            showModal({
                type: type || 'error',
                title: title || t('error'),
                message: message || serverMessage || code || t('task_create_failed'),
                icon: icon || '❌',
                details: details,
                onConfirm: () => {
                    // 🔥 智能重试逻辑
                    if (shouldShowRetryOption(code)) {
                        showRetryOption(code);
                    }
                }
            });
        }

        // 🔥 智能重试功能
        function shouldShowRetryOption(errorCode) {
            const retryableErrors = ['NETWORK_ERROR', 'HTTP_500', 'HTTP_502', 'HTTP_503', 'RESPONSE_PARSE_ERROR'];
            return retryableErrors.includes(errorCode);
        }

        function showRetryOption(errorCode) {
            showModal({
                type: 'warning',
                title: t('network_retry_hint'),
                message: '是否要重试提交？',
                showCancel: true,
                confirmText: t('retry'),
                cancelText: t('cancel'),
                onConfirm: () => {
                    // 重新提交表单
                    setTimeout(() => {
                        const form = document.getElementById('uploadForm');
                        if (form) {
                            const event = new Event('submit', { bubbles: true, cancelable: true });
                            form.dispatchEvent(event);
                        }
                    }, 1000);
                }
            });
        }

        // 🔥 显示成功对话框
        function showSuccessModal(message) {
            showModal({
                type: 'success',
                title: t('success'),
                message: message,
                icon: '✅'
            });
        }

        // 🔥 显示确认对话框
        function showConfirmModal(message, onConfirm, onCancel) {
            showModal({
                type: 'warning',
                title: t('confirm'),
                message: message,
                showCancel: true,
                confirmText: t('confirm'),
                cancelText: t('cancel'),
                onConfirm: onConfirm,
                onCancel: onCancel
            });
        }

        // 初始化
        document.addEventListener('DOMContentLoaded', function() {
            if (!accessKey) {
                showUserFriendlyError({
                    code: 'HTTP_401',
                    serverMessage: '访问密钥缺失'
                });
                return;
            }
            if (!userId) {
                showUserFriendlyError({
                    code: 'VALIDATION_ERROR',
                    serverMessage: '用户ID缺失'
                });
                return;
            }
            
            // 初始化 Feather Icons
            feather.replace();
            
            // 设置语言
            setupLocale();
            
            // 只在页面加载时初始化一次事件监听器
            if (!isEventListenersInitialized) {
                initializeEventListeners();
                isEventListenersInitialized = true;
            }
            
            // 🔥 检查本地存储的冷却期状态
            checkLocalCooldownStatus();
            
            // 加载任务列表
            loadTasks(true);
            
            // 🔥 启动简化的轮询系统
            startSimpleSmartPolling();

            // 点击外部关闭下拉菜单
            document.addEventListener('click', function(event) {
                const dropdown = document.getElementById('langDropdownContent');
                const select = document.querySelector('.lang-select');
                
                if (!select.contains(event.target)) {
                    dropdown.classList.remove('show');
                }
            });

            // 🔥 点击遮罩层关闭对话框
            document.getElementById('modalOverlay').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal();
                }
            });

            // 🔥 ESC键关闭对话框
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });
        });

        // 🔥 检查本地冷却期状态
        function checkLocalCooldownStatus() {
            const storedCooldownEnd = localStorage.getItem('cooldown_end_time');
            if (storedCooldownEnd) {
                const endTime = parseInt(storedCooldownEnd);
                if (endTime > Date.now()) {
                    clientCooldownEndTime = endTime;
                    startClientCooldownCountdown();
                } else {
                    // 清理过期的冷却期记录
                    localStorage.removeItem('cooldown_end_time');
                }
            }
        }

        // 🔥 启动客户端冷却期倒计时
        function startClientCooldownCountdown() {
            if (cooldownTimer) {
                clearInterval(cooldownTimer);
            }

            updateCooldownUI();

            cooldownTimer = setInterval(() => {
                const remaining = Math.max(0, Math.ceil((clientCooldownEndTime - Date.now()) / 1000));
                
                if (remaining <= 0) {
                    // 冷却期结束
                    clearInterval(cooldownTimer);
                    cooldownTimer = null;
                    clientCooldownEndTime = 0;
                    localStorage.removeItem('cooldown_end_time');
                    updateCooldownUI();
                } else {
                    // 更新倒计时显示
                    updateCooldownDisplay(remaining);
                }
            }, 1000);
        }

        // 🔥 更新冷却期UI状态
        function updateCooldownUI() {
            const remaining = Math.max(0, Math.ceil((clientCooldownEndTime - Date.now()) / 1000));
            const generateBtn = document.getElementById('generateBtn');
            
            if (remaining > 0) {
                // 🔥 显示冷却期状态，图标改为闹钟，背景灰色
                generateBtn.disabled = true;
                generateBtn.className = 'btn btn-cooldown';
                
                // 🔥 本地化的等待文本
                const waitText = currentLocale === 'zh' ? \`请等待 \${remaining}s\` : \`Wait \${remaining}s\`;
                generateBtn.innerHTML = \`<i data-feather="clock" style="width: 18px; height: 18px;"></i>\${waitText}\`;
            } else {
                // 恢复正常状态
                generateBtn.disabled = false;
                generateBtn.className = 'btn btn-primary';
                generateBtn.innerHTML = \`<i data-feather="zap" style="width: 18px; height: 18px;"></i>\${t('generate_document_btn')}\`;
            }
            
            feather.replace();
        }

        // 🔥 更新冷却期倒计时显示
        function updateCooldownDisplay(remaining) {
            const generateBtn = document.getElementById('generateBtn');
            
            if (generateBtn && remaining > 0) {
                // 🔥 本地化的等待文本
                const waitText = currentLocale === 'zh' ? \`请等待 \${remaining}s\` : \`Wait \${remaining}s\`;
                generateBtn.innerHTML = \`<i data-feather="clock" style="width: 18px; height: 18px;"></i>\${waitText}\`;
                feather.replace();
            }
        }

        // 🔥 简化的智能轮询系统
        function startSimpleSmartPolling() {
            // 首次检查是否有待处理任务
            checkForActiveTasksAndPoll();
            
            // 🔥 关键优化：定期检查并根据需要启动/停止轮询
            pendingCheckTimer = setInterval(() => {
                checkForActiveTasksAndPoll();
            }, 15000); // 每15秒检查一次
        }

        // 🔥 检查活跃任务并启动轮询
        async function checkForActiveTasksAndPoll() {
            try {
                const response = await fetch('/api/has-pending?userid=' + userId + '&access_key=' + accessKey);
                const result = await response.json();
                
                if (result.success) {
                    const hadActiveTasks = hasActiveTasks;
                    hasActiveTasks = result.has_pending;
                    
                    // 🔥 状态变化处理
                    if (hasActiveTasks && !hadActiveTasks) {
                        // 从无活跃任务变为有活跃任务 - 启动频繁轮询
                        startFrequentPolling();
                    } else if (!hasActiveTasks && hadActiveTasks) {
                        // 从有活跃任务变为无活跃任务 - 停止频繁轮询
                        stopFrequentPolling();
                    }
                }
            } catch (error) {
                // 忽略网络错误
            }
        }

        // 🔥 启动频繁轮询（仅在有进行中的任务时）
        function startFrequentPolling() {
            if (smartPollingTimer) return; // 避免重复启动
            
            // 🔥 立即检查一次并刷新列表
            immediateCheckAndRefresh();
            
            // 🔥 每30秒检查一次并刷新列表（保证体验）
            smartPollingTimer = setInterval(() => {
                immediateCheckAndRefresh();
            }, 30000);
        }

        // 🔥 停止频繁轮询
        function stopFrequentPolling() {
            if (smartPollingTimer) {
                clearInterval(smartPollingTimer);
                smartPollingTimer = null;
            }
        }

        // 🔥 立即检查并刷新
        async function immediateCheckAndRefresh() {
            if (isLoading) return;
            
            try {
                // 🔥 关键：检查待处理任务并立即刷新列表
                const response = await fetch('/api/check-pending?userid=' + userId + '&access_key=' + accessKey);
                const result = await response.json();
                
                if (result.success) {
                    // 🔥 无论是否有更新，都刷新列表以显示最新状态
                    await loadTasks(true);
                    
                    if (result.updated_tasks > 0) {
                        console.log(\`📋 更新了 \${result.updated_tasks} 个任务状态\`);
                    }
                }
            } catch (error) {
                // 忽略错误但仍尝试刷新列表
                await loadTasks(true);
            }
        }

        // 🔥 单个任务完成后立即清理
        async function cleanupSingleCompletedTask(taskId) {
            console.log(\`🧹 清理单个已完成任务: \${taskId}\`);
            
            try {
                const response = await fetch('/api/cleanup-task?access_key=' + accessKey, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        task_id: taskId,
                        userid: userId
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    console.log(\`✅ 任务 \${taskId} 清理成功\`);
                } else {
                    console.log(\`⚠️ 任务 \${taskId} 清理失败: \${result.error}\`);
                }
            } catch (error) {
                console.log(\`❌ 任务 \${taskId} 清理异常: \${error.message}\`);
            }
        }

        // 页面可见性变化处理
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                // 🔥 页面变为可见时，立即检查并刷新
                checkForActiveTasksAndPoll();
            }
        });

        // 页面卸载时清理定时器
        window.addEventListener('beforeunload', function() {
            stopFrequentPolling();
            if (pendingCheckTimer) {
                clearInterval(pendingCheckTimer);
                pendingCheckTimer = null;
            }
            if (cooldownTimer) {
                clearInterval(cooldownTimer);
                cooldownTimer = null;
            }
        });

        // 语言下拉菜单功能
        function toggleLangDropdown() {
            const dropdown = document.getElementById('langDropdownContent');
            dropdown.classList.toggle('show');
        }

        function setLanguage(lang) {
            currentLocale = lang;
            applyTranslations();
            updateLangDisplay();
            
            document.getElementById('langDropdownContent').classList.remove('show');
            loadTasks(true);
        }

        function updateLangDisplay() {
            const flags = {
                'zh': '🇨🇳',
                'en': '🇺🇸'
            };
            
            const names = {
                'zh': '中文',
                'en': 'English'
            };
            
            document.getElementById('currentLangFlag').textContent = flags[currentLocale];
            document.getElementById('currentLangText').textContent = names[currentLocale];
            
            document.querySelectorAll('.lang-option').forEach(option => {
                option.classList.remove('selected');
                if (option.getAttribute('data-lang') === currentLocale) {
                    option.classList.add('selected');
                }
            });
        }

        // 设置语言
        function setupLocale() {
            if (currentLocale === 'auto') {
                const browserLang = navigator.language || navigator.userLanguage;
                currentLocale = browserLang.startsWith('zh') ? 'zh' : 'en';
            }
            
            applyTranslations();
            updateLangDisplay();
        }

        // 获取翻译文本
        function t(key, defaultText = '') {
            return i18nConfig[currentLocale]?.[key] || defaultText || key;
        }

        // 应用翻译
        function applyTranslations() {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = t(key);
                if (translation.includes('<br>')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            });
            
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                element.placeholder = t(key);
            });

            // 🔥 更新冷却期UI文本
            updateCooldownUI();

            feather.replace();
        }

        // 格式化时间戳（国际化）
        function formatTimestamp(timestamp) {
            const ts = typeof timestamp === 'string' ? parseFloat(timestamp) : timestamp;
            
            if (isNaN(ts)) {
                return 'Invalid Date';
            }
            
            const date = new Date(ts);
            
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            
            return date.toLocaleDateString(currentLocale === 'zh' ? 'zh-CN' : 'en-US', options);
        }

        // 获取格式名称
        function getFormatName(format) {
            const formatKey = 'format_' + format;
            return t(formatKey, format.toUpperCase());
        }

        // 事件监听器初始化
        function initializeEventListeners() {
            const uploadArea = document.getElementById('uploadArea');
            const fileInput = document.getElementById('fileInput');
            const uploadForm = document.getElementById('uploadForm');
            const userPromptInput = document.getElementById('userPrompt');

            if (!uploadArea || !fileInput || !uploadForm || !userPromptInput) {
                return;
            }

            // 文件输入事件设置
            function setupFileInputEvents() {
                const newFileInput = fileInput.cloneNode(true);
                fileInput.parentNode.replaceChild(newFileInput, fileInput);
                
                const freshFileInput = document.getElementById('fileInput');
                freshFileInput.addEventListener('change', function(e) {
                    handleFileSelect(e);
                });
            }

            // 上传区域点击事件
            uploadArea.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const currentFileInput = document.getElementById('fileInput');
                if (e.target !== currentFileInput) {
                    currentFileInput.click();
                }
            });

            // 拖拽事件
            uploadArea.addEventListener('dragover', handleDragOver);
            uploadArea.addEventListener('dragleave', handleDragLeave);
            uploadArea.addEventListener('drop', handleDrop);
            
            setupFileInputEvents();

            // 表单提交事件
            uploadForm.addEventListener('submit', function(e) {
                handleSubmit(e);
            });
            
            userPromptInput.addEventListener('input', updateValidationHints);
            
            window.resetFileInputEvents = setupFileInputEvents;
        }

        function handleDragOver(e) {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.add('dragover');
        }

        function handleDragLeave(e) {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove('dragover');
        }

        function handleDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            addFiles(files);
        }

        function handleFileSelect(e) {
            const files = Array.from(e.target.files);
            addFiles(files);
        }
        
        function updateValidationHints() {
            const hasFiles = selectedFiles.length > 0;
            const hasPrompt = document.getElementById('userPrompt').value.trim();
            const generateBtn = document.getElementById('generateBtn');
            
            // 🔥 修改：考虑冷却期状态
            const inCooldown = clientCooldownEndTime > Date.now();
            
            if (inCooldown) {
                updateCooldownUI();
            } else {
                generateBtn.disabled = false;
                generateBtn.className = 'btn btn-primary';
                generateBtn.innerHTML = '<i data-feather="zap" style="width: 18px; height: 18px;"></i>' + t('generate_document_btn');
                feather.replace();
            }
        }

        function addFiles(files) {
            files.forEach(file => {
                if (file.size > 50 * 1024 * 1024) {
                    showUserFriendlyError({
                        code: 'FILE_TOO_LARGE',
                        serverMessage: file.name
                    });
                    return;
                }
                
                if (selectedFiles.length < 20) {
                    selectedFiles.push(file);
                }
            });
            updateFileList();
            updateValidationHints();          
        }

        function removeFile(index) {
            selectedFiles.splice(index, 1);
            updateFileList();
            updateValidationHints();
        }

        function updateFileList() {
            const fileList = document.getElementById('fileList');
            
            if (selectedFiles.length === 0) {
                fileList.innerHTML = '';
                return;
            }

            const fileItems = selectedFiles.map((file, index) => {
                const fileName = file.name.replace(/"/g, '&quot;');
                const fileSize = formatFileSize(file.size);
                
                return \`<div class="file-item">
                    <div class="file-name">\${fileName}</div>
                    <div class="file-size">\${fileSize}</div>
                    <button type="button" class="file-remove" onclick="removeFile(\${index})">
                        <i data-feather="x" style="width: 12px; height: 12px;"></i>
                    </button>
                </div>\`;
            }).join('');
            
            fileList.innerHTML = fileItems;
            feather.replace();
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // 🔥 核心修复：完整的错误处理和用户友好提示
        async function handleSubmit(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 🔥 客户端冷却期检查
            if (clientCooldownEndTime > Date.now()) {
                const remaining = Math.ceil((clientCooldownEndTime - Date.now()) / 1000);
                showCooldownErrorModal({
                    data: {
                        cooldown_remaining: remaining
                    }
                });
                return;
            }
            
            const userPrompt = document.getElementById('userPrompt').value.trim();
            
            if (selectedFiles.length === 0 && !userPrompt) {
                showUserFriendlyError({
                    code: 'VALIDATION_ERROR',
                    serverMessage: t('files_or_prompt_required')
                });
                return;
            }

            const formData = new FormData();
            
            if (selectedFiles.length > 0) {
                selectedFiles.forEach((file, index) => {
                    formData.append('file_' + index, file);
                });
            }
            
            formData.append('user_prompt', userPrompt);
            formData.append('userid', userId);

            try {
                showSubmittingOverlay();
                
                const response = await fetch('/api/upload?access_key=' + accessKey, {
                    method: 'POST',
                    body: formData
                });

                let result;
                try {
                    result = await response.json();
                } catch (jsonError) {
                    hideSubmittingOverlay();
                    showUserFriendlyError({
                        code: 'RESPONSE_PARSE_ERROR',
                        details: jsonError.message
                    });
                    return;
                }
                
                hideSubmittingOverlay();
                
                // 🔥 详细的错误处理
                if (!result.success) {
                    const errorCode = result.error;
                    
                    console.log('服务器错误代码:', errorCode); // 调试用
                    console.log('完整响应:', result); // 调试用
                    
                    // 🔥 特殊处理冷却期错误
                    if (errorCode === 'COOLDOWN_ACTIVE') {
                        showCooldownErrorModal(result);
                        return; // 🔑 保持表单状态
                    }
                    
                    // 🔥 处理其他错误
                    showUserFriendlyError({
                        code: errorCode,
                        serverMessage: result.message,
                        details: result.technical_details
                    });
                    return; // 🔑 保持表单状态
                }
                
                // 🔥 成功情况：清空表单并显示成功页面
                if (result.success) {
                    currentTaskId = result.task_id;
                    resetFormData(); // 🔥 仅在成功时清空表单
                    showSuccessPage();
                    
                    setTimeout(async () => {
                        await loadTasks(true);
                        checkForActiveTasksAndPoll();
                    }, 3000);
                }
                
            } catch (error) {
                hideSubmittingOverlay();
                
                // 🔥 网络错误的友好处理
                let errorCode = 'NETWORK_ERROR';
                
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    errorCode = 'NETWORK_ERROR';
                } else if (error.name === 'AbortError') {
                    errorCode = 'NETWORK_ERROR';
                }
                
                showUserFriendlyError({
                    code: errorCode,
                    details: error.message
                });
            }
        }

        function showSubmittingOverlay() {
            document.getElementById('submittingOverlay').classList.add('active');
        }

        function hideSubmittingOverlay() {
            document.getElementById('submittingOverlay').classList.remove('active');
        }

        // 成功页面显示
        function showSuccessPage() {
            document.getElementById('uploadSection').style.display = 'none';
            document.getElementById('historySection').style.display = 'none';
            document.getElementById('progressSection').style.display = 'none';
            
            const successSection = document.getElementById('successSection');
            successSection.style.display = 'block';
            
            successSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            startAutoReturnCountdown();
        }

        // 自动返回倒计时
        function startAutoReturnCountdown() {
            let countdown = 4;
            const autoReturnText = document.getElementById('autoReturnText');
            
            if (!autoReturnText) {
                return;
            }
            
            if (autoReturnTimer) {
                clearInterval(autoReturnTimer);
            }
            
            autoReturnText.textContent = countdown + t('auto_return_seconds');
            
            autoReturnTimer = setInterval(() => {
                countdown--;
                
                if (countdown > 0) {
                    autoReturnText.textContent = countdown + t('auto_return_seconds');
                } else {
                    clearInterval(autoReturnTimer);
                    autoReturnTimer = null;
                    returnToList();
                }
            }, 1000);
        }

        // 返回列表
        function returnToList() {
            if (autoReturnTimer) {
                clearInterval(autoReturnTimer);
                autoReturnTimer = null;
            }
            
            document.getElementById('successSection').style.display = 'none';
            document.getElementById('progressSection').style.display = 'none';
            document.getElementById('uploadSection').style.display = 'block';
            document.getElementById('historySection').style.display = 'block';
            
            const historySection = document.getElementById('historySection');
            if (historySection) {
                historySection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
            
            // 🔥 返回列表时立即刷新并启动轮询
            loadTasks(true);
            checkForActiveTasksAndPoll();
        }

        // 重置表单
        function resetForm() {
            if (autoReturnTimer) {
                clearInterval(autoReturnTimer);
                autoReturnTimer = null;
            }
            
            resetFormData();
            
            document.getElementById('progressSection').style.display = 'none';
            document.getElementById('successSection').style.display = 'none';
            document.getElementById('uploadSection').style.display = 'block';
            document.getElementById('historySection').style.display = 'block';
        }

        // 🔥 仅重置表单数据
        function resetFormData() {
            selectedFiles = [];
            currentTaskId = null;
            
            const fileInput = document.getElementById('fileInput');
            if (fileInput) {
                fileInput.value = '';
            }
            
            const userPrompt = document.getElementById('userPrompt');
            if (userPrompt) {
                userPrompt.value = '';
            }
            
            updateFileList();
            updateValidationHints();
        }

        // 加载任务列表
        async function loadTasks(reset = false) {
            if (isLoading) return;
            
            isLoading = true;
            
            if (reset) {
                currentPage = 1;
                hasMore = true;
            }
            
            try {
                const response = await fetch('/api/tasks?userid=' + userId + '&access_key=' + accessKey + '&page=' + currentPage + '&limit=10');
                const result = await response.json();
                
                if (result.success) {
                    if (reset) {
                        displayTasks(result.data.tasks, true);
                    } else {
                        appendTasks(result.data.tasks);
                    }
                    
                    hasMore = result.data.has_more;
                    updateLoadMoreButton();
                }
            } catch (error) {
                // 忽略错误
            } finally {
                isLoading = false;
                hideLoadingIndicator();
            }
        }

        // 加载更多任务
        async function loadMoreTasks() {
            if (!hasMore || isLoading) return;
            
            showLoadingIndicator();
            currentPage++;
            await loadTasks(false);
        }

        // 显示任务列表
        function displayTasks(tasks, reset = false) {
            const tasksList = document.getElementById('tasksList');
            
            if (reset && tasks.length === 0) {
                tasksList.innerHTML = '<div style="padding: 40px; text-align: center; color: #666;">' + t('no_document_records') + '</div>';
                document.getElementById('loadMoreSection').style.display = 'none';
                return;
            }

            const tasksHTML = tasks.map((task, index) => {
                const fileFormat = task.file_format || 'unknown';
                
                const formatIcons = {
                    'pptx': 'monitor',
                    'pdf': 'file-text',
                    'docx': 'file-text',
                    'xlsx': 'grid',
                    'png': 'image',
                    'md': 'file',
                    'html': 'globe',
                    'json': 'code',
                    'unknown': 'help-circle'
                };
                
                const fileIcon = formatIcons[fileFormat] || 'help-circle';
                const formatName = fileFormat === 'unknown' ? (currentLocale === 'zh' ? '处理中' : 'Processing') : getFormatName(fileFormat);
                
                // 显示逻辑 - 基于filename而非task.filename
                let displayFilename;
                if (task.filename && task.filename.trim() !== '') {
                    displayFilename = task.filename;
                } else {
                    displayFilename = (task.task_id.slice(0, 8) + '***');
                }
                
                const statusText = task.status_text || (currentLocale === 'zh' ? '处理中' : 'Processing');
                
                // 🔥 更智能的完成状态判断
                const hasValidFilename = task.filename && task.filename.trim() !== '';
                const isCompletedByStatus = task.status === TaskStatus.COMPLETED;
                const hasCompletionIndicators = task.note && (
                    task.note.includes('已生成') ||
                    task.note.includes('完成') ||
                    task.note.includes('成功') ||
                    task.note.includes('generated') ||
                    task.note.includes('completed') ||
                    task.note.includes('finished') ||
                    task.status_text === '已完成' ||
                    task.status_text === 'Completed'
                );
                
                // 🔥 核心修复：更宽松的完成判断条件
                const isCompleted = hasValidFilename || isCompletedByStatus || hasCompletionIndicators;
                const isFailed = task.status === TaskStatus.FAILED;
                
                let downloadBtnHTML = '';
                if (isCompleted) {
                    downloadBtnHTML = \`<button class="btn btn-success" onclick="downloadFile('\${task.task_id}')">
                        <i data-feather="download" style="width: 16px; height: 16px;"></i>
                        \${t('download')}
                    </button>\`;
                } else if (isFailed) {
                    const failedText = currentLocale === 'zh' ? '失败' : 'Failed';
                    downloadBtnHTML = \`<button class="btn btn-danger" disabled>
                        <i data-feather="x-circle" style="width: 16px; height: 16px;"></i>
                        \${failedText}
                    </button>\`;
                } else {
                    const processingText = currentLocale === 'zh' ? '处理中' : 'Processing';
                    downloadBtnHTML = \`<button class="btn btn-secondary" disabled>
                        <i data-feather="clock" style="width: 16px; height: 16px;"></i>
                        \${processingText}
                    </button>\`;
                }
                
                let displayNote = '';
                if (isCompleted) {
                    const noteValue = (task.note || '').replace(/"/g, '&quot;');
                    displayNote = \`
                        <div class="task-note" onclick="editNote('\${task.task_id}')" id="note-\${task.task_id}">
                            \${task.note || t('no_note')}
                        </div>
                        <input type="text" class="task-note-input" id="input-\${task.task_id}" 
                               value="\${noteValue}" 
                               onblur="saveNote('\${task.task_id}')" 
                               onkeypress="handleNoteKeypress(event, '\${task.task_id}')">
                    \`;
                } else {
                    displayNote = \`<div class="task-note">\${task.note || statusText}</div>\`;
                }
                
                let statusClass = '';
                switch(task.status) {
                    case TaskStatus.COMPLETED:
                        statusClass = isCompleted ? 'completed' : 'processing';
                        break;
                    case TaskStatus.FAILED:
                        statusClass = 'failed';
                        break;
                    default:
                        statusClass = isCompleted ? 'completed' : 'processing';
                }
                
                return \`<div class="task-item \${statusClass}">
                    <div class="task-info">
                        <div class="task-status \${statusClass}">
                            \${statusText}
                        </div>
                        <div class="task-filename">
                            <i data-feather="\${fileIcon}" style="width: 16px; height: 16px;"></i>
                            \${displayFilename}
                            <span class="format-badge">\${formatName}</span>
                        </div>
                        \${displayNote}
                        <div class="task-date">\${formatTimestamp(task.created_at)}</div>
                    </div>
                    <div class="task-actions">
                        \${downloadBtnHTML}
                        <button class="btn btn-danger" onclick="deleteFile('\${task.task_id}')">
                            <i data-feather="trash-2" style="width: 16px; height: 16px;"></i>
                            \${t('delete')}
                        </button>
                    </div>
                </div>\`;
            }).join('');

            if (reset) {
                tasksList.innerHTML = tasksHTML;
            } else {
                tasksList.innerHTML += tasksHTML;
            }
            
            if (tasks.length > 0) {
                document.getElementById('loadMoreSection').style.display = 'block';
            }

            feather.replace();
        }

        function appendTasks(tasks) {
            displayTasks(tasks, false);
        }

        function updateLoadMoreButton() {
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (hasMore) {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.disabled = false;
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }

        function showLoadingIndicator() {
            document.getElementById('loadMoreBtn').style.display = 'none';
            document.getElementById('loadingIndicator').classList.add('active');
        }

        function hideLoadingIndicator() {
            document.getElementById('loadingIndicator').classList.remove('active');
            if (hasMore) {
                document.getElementById('loadMoreBtn').style.display = 'block';
            }
        }

        function editNote(taskId) {
            const noteDiv = document.getElementById('note-' + taskId);
            const noteInput = document.getElementById('input-' + taskId);
            
            if (noteDiv && noteInput) {
                noteDiv.classList.add('editing');
                noteInput.classList.add('editing');
                noteInput.focus();
                noteInput.select();
            }
        }

        async function saveNote(taskId) {
            const noteDiv = document.getElementById('note-' + taskId);
            const noteInput = document.getElementById('input-' + taskId);
            
            if (!noteDiv || !noteInput) return;
            
            const newNote = noteInput.value.trim() || t('no_note');
            
            try {
                const response = await fetch('/api/update-note?access_key=' + accessKey, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        task_id: taskId,
                        note: newNote,
                        userid: userId
                    })
                });

                const result = await response.json();
                
                if (result.success) {
                    noteDiv.textContent = newNote;
                    showSuccessModal(t('note_update_success'));
                } else {
                    throw new Error(result.error || 'Update failed');
                }
            } catch (error) {
                showUserFriendlyError({
                    code: 'VALIDATION_ERROR',
                    serverMessage: t('update_failed') + ': ' + error.message
                });
            }
            
            noteDiv.classList.remove('editing');
            noteInput.classList.remove('editing');
        }

        function handleNoteKeypress(event, taskId) {
            if (event.key === 'Enter') {
                saveNote(taskId);
            } else if (event.key === 'Escape') {
                const noteDiv = document.getElementById('note-' + taskId);
                const noteInput = document.getElementById('input-' + taskId);
                
                if (noteDiv && noteInput) {
                    noteDiv.classList.remove('editing');
                    noteInput.classList.remove('editing');
                }
            }
        }

        // 🔥 下载文件函数 - 支持单个任务清理
        async function downloadFile(taskId) {
            try {
                const response = await fetch('/api/download?task_id=' + taskId + '&access_key=' + accessKey);
                
                if (response.ok) {
                    const blob = await response.blob();
                    const contentDisposition = response.headers.get('content-disposition');
                    let filename = taskId + '.file';
                    
                    if (contentDisposition) {
                        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                        if (filenameMatch) {
                            filename = filenameMatch[1];
                        }
                    }
                    
                    // 🔥 触发下载
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    
                    // 🔥 下载成功后，立即清理单个任务
                    setTimeout(() => {
                        cleanupSingleCompletedTask(taskId);
                    }, 2000);
                    
                } else {
                    const result = await response.json();
                    throw new Error(result.error || 'Download failed');
                }
            } catch (error) {
                showUserFriendlyError({
                    code: 'VALIDATION_ERROR',
                    serverMessage: t('download_failed') + ': ' + error.message
                });
            }
        }

        // 🔥 下载文件数据函数 - 用于应用内集成
        async function downloadFileWithData(taskId) {
            try {
                const response = await fetch('/api/download-with-data?task_id=' + taskId + '&access_key=' + accessKey);
                
                if (response.ok) {
                    const result = await response.json();
                    
                    if (result.success) {
                        // 🔥 暴露文件数据给应用使用
                        const fileData = {
                            filename: result.data.filename,
                            contentType: result.data.content_type,
                            size: result.data.size,
                            base64Data: result.data.base64_data
                        };
                        
                        // 🔥 可以在这里调用回调函数或触发自定义事件
                        if (window.onFileDataReceived) {
                            window.onFileDataReceived(fileData);
                        }
                        
                        // 🔥 或者触发自定义事件
                        const event = new CustomEvent('fileDataReceived', { detail: fileData });
                        window.dispatchEvent(event);
                        
                        // 🔥 数据获取成功后，立即清理单个任务
                        setTimeout(() => {
                            cleanupSingleCompletedTask(taskId);
                        }, 2000);
                        
                        return fileData;
                    } else {
                        throw new Error(result.error || 'Failed to get file data');
                    }
                } else {
                    const result = await response.json();
                    throw new Error(result.error || 'Download failed');
                }
            } catch (error) {
                showUserFriendlyError({
                    code: 'VALIDATION_ERROR',
                    serverMessage: t('download_failed') + ': ' + error.message
                });
                throw error;
            }
        }

        async function deleteFile(taskId) {
            showConfirmModal(
                t('confirm_delete'),
                async () => {
                    try {
                        const response = await fetch('/api/delete?task_id=' + taskId + '&userid=' + userId + '&access_key=' + accessKey, {
                            method: 'DELETE'
                        });

                        const result = await response.json();
                        
                        if (result.success) {
                            showSuccessModal(t('delete_success'));
                            
                            // 🔥 删除任务后立即刷新列表
                            await loadTasks(true);
                            
                            // 🔥 删除任务后，重新检查活跃任务状态
                            setTimeout(() => {
                                checkForActiveTasksAndPoll();
                            }, 1000);
                        } else {
                            throw new Error(result.error || 'Delete failed');
                        }
                    } catch (error) {
                        showUserFriendlyError({
                            code: 'VALIDATION_ERROR',
                            serverMessage: t('delete_failed') + ': ' + error.message
                        });
                    }
                }
            );
        }

        // 🔥 暴露全局函数供其他应用使用
        window.downloadFileWithData = downloadFileWithData;
        
        // 🔥 示例：监听文件数据接收事件
        window.addEventListener('fileDataReceived', function(event) {
            const fileData = event.detail;
            // 在这里可以处理接收到的文件数据
        });

        // 添加窗口焦点事件监听
        window.addEventListener('focus', function() {
            if (document.getElementById('successSection').style.display === 'block' && !autoReturnTimer) {
                startAutoReturnCountdown();
            }
        });
    </script>
</body>
</html>`;
}


麻烦你修改加强这个扩展加强版的项目（主要是添加了登录功能。）