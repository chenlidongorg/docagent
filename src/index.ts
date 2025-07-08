// ========== src/index.ts ==========
interface CloudflareEnv {
  PPT_AI_AGENT_API_KEY: string;
  ACCESS_KEY: string;
  BUCKET_NAME: string;
  R2_ACCESS_KEY: string;
  R2_SECRET_KEY: string;
  R2_ENDPOINT: string;
  D1: D1Database;
  R2: R2Bucket;
}

// 工具函数
function createResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS, PUT',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    }
  });
}

function createSuccessResponse(data: any, message?: string) {
  return createResponse({ success: true, data, message });
}

function createErrorResponse(error: string, status: number = 500) {
  return createResponse({ success: false, error }, status);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192;
  let result = '';

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    result += String.fromCharCode.apply(null, Array.from(chunk));
  }

  return btoa(result);
}

// 权限检查
function checkAccess(request: Request, env: CloudflareEnv): Response | null {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.startsWith('/api/')) {
    const accessKey = url.searchParams.get('access_key');
    if (!accessKey || accessKey !== env.ACCESS_KEY) {
      return createErrorResponse('Unauthorized access', 401);
    }
  }

  return null;
}

// 处理上传
async function handleUpload(request: Request, env: CloudflareEnv): Promise<Response> {
  if (request.method !== 'POST') {
    return createErrorResponse('Method not allowed', 405);
  }

  try {
    const formData = await request.formData();
    const files: any[] = [];
    const userPrompt = formData.get('user_prompt') as string || '';
    const userId = formData.get('userid') as string;

    if (!userId) {
      return createErrorResponse('Missing userid', 400);
    }

    // 处理文件
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        if (value.size > 50 * 1024 * 1024) {
          return createErrorResponse('File too large', 413);
        }

        const arrayBuffer = await value.arrayBuffer();
        const base64Content = arrayBufferToBase64(arrayBuffer);

        files.push({
          filename: value.name,
          content: base64Content,
          content_type: value.type
        });
      }
    }

    if (files.length === 0 && !userPrompt.trim()) {
      return createErrorResponse('No files or prompt provided', 400);
    }

    const requestBody = {
      files: files,
      user_prompt: userPrompt,
      user_id: userId,
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

    const response = await fetch('https://docapi.endlessai.org/api/v1/ppt/generate', {
      method: 'POST',
      headers: {
        'X-API-Key': env.PPT_AI_AGENT_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    if (!response.ok) {
      return createErrorResponse(`API Error: ${result.error || 'Unknown error'}`, response.status);
    }

    // 保存到数据库
    if (result.success && result.task_id) {
      try {
        const stmt = env.D1.prepare(`
          INSERT INTO pptaiagent (taskid, userid, filename, note, createat, status, hasdeleted)
          VALUES (?, ?, '', ?, ?, 'processing', 0)
        `);
        await stmt.bind(
          result.task_id,
          userId,
          result.message || 'AI正在处理任务',
          Date.now()
        ).run();
      } catch (dbError) {
        console.log('Database save error:', dbError);
      }
    }

    return createSuccessResponse(result);

  } catch (error) {
    return createErrorResponse('Upload failed', 500);
  }
}

// 处理任务列表
async function handleTasks(request: Request, env: CloudflareEnv): Promise<Response> {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userid');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  if (!userId) {
    return createErrorResponse('Missing userid', 400);
  }

  try {
    const stmt = env.D1.prepare(`
      SELECT taskid, filename, note, createat, status
      FROM pptaiagent
      WHERE userid = ? AND hasdeleted = 0
      ORDER BY createat DESC
      LIMIT ? OFFSET ?
    `);
    const { results } = await stmt.bind(userId, limit, offset).all();

    const tasks = results.map((task: any) => ({
      task_id: task.taskid,
      filename: task.filename,
      note: task.note,
      created_at: task.createat,
      status: task.status,
      progress: task.filename ? 100 : 50
    }));

    return createSuccessResponse({ tasks });

  } catch (error) {
    return createErrorResponse('Failed to fetch tasks', 500);
  }
}

// 处理下载
async function handleDownload(request: Request, env: CloudflareEnv): Promise<Response> {
  const url = new URL(request.url);
  const taskId = url.searchParams.get('task_id');

  if (!taskId) {
    return createErrorResponse('Missing task_id', 400);
  }

  try {
    const stmt = env.D1.prepare('SELECT filename FROM pptaiagent WHERE taskid = ? AND hasdeleted = 0');
    const taskInfo = await stmt.bind(taskId).first();

    if (!taskInfo || !taskInfo.filename) {
      return createErrorResponse('File not found', 404);
    }

    const object = await env.R2.get("aiagentppt/" + taskInfo.filename);
    if (!object) {
      return createErrorResponse('File not found in storage', 404);
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${taskInfo.filename}"`,
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return createErrorResponse('Download failed', 500);
  }
}

// 生成HTML页面
function generateHTML(): string {
  return `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文档生成智能体</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .upload-area {
            border: 2px dashed #ccc;
            padding: 40px;
            text-align: center;
            margin: 20px 0;
            cursor: pointer;
        }
        .upload-area:hover { border-color: #007bff; }
        .form-group { margin: 20px 0; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea, button { width: 100%; padding: 10px; margin-bottom: 10px; }
        button { background: #007bff; color: white; border: none; cursor: pointer; }
        button:hover { background: #0056b3; }
        .task-list { margin-top: 40px; }
        .task-item {
            border: 1px solid #ddd;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>文档生成智能体</h1>

        <div class="upload-area" onclick="document.getElementById('fileInput').click()">
            <p>点击或拖拽文件到这里</p>
            <input type="file" id="fileInput" style="display: none;" multiple>
        </div>

        <div class="form-group">
            <label for="prompt">文档需求描述:</label>
            <textarea id="prompt" placeholder="请描述您希望生成的文档内容..."></textarea>
        </div>

        <div class="form-group">
            <label for="userid">用户ID:</label>
            <input type="text" id="userid" placeholder="请输入用户ID">
        </div>

        <button onclick="generateDocument()">生成文档</button>

        <div class="task-list">
            <h2>我的文档</h2>
            <div id="taskList"></div>
            <button onclick="loadTasks()">刷新列表</button>
        </div>
    </div>

    <script>
        let selectedFiles = [];

        document.getElementById('fileInput').addEventListener('change', function(e) {
            selectedFiles = Array.from(e.target.files);
            updateFileDisplay();
        });

        function updateFileDisplay() {
            const uploadArea = document.querySelector('.upload-area');
            if (selectedFiles.length > 0) {
                uploadArea.innerHTML = '<p>已选择 ' + selectedFiles.length + ' 个文件</p>';
            } else {
                uploadArea.innerHTML = '<p>点击或拖拽文件到这里</p>';
            }
        }

        async function generateDocument() {
            const prompt = document.getElementById('prompt').value;
            const userid = document.getElementById('userid').value;

            if (!userid) {
                alert('请输入用户ID');
                return;
            }

            if (selectedFiles.length === 0 && !prompt.trim()) {
                alert('请上传文件或描述文档需求');
                return;
            }

            const formData = new FormData();
            formData.append('user_prompt', prompt);
            formData.append('userid', userid);

            selectedFiles.forEach((file, index) => {
                formData.append('file_' + index, file);
            });

            try {
                const response = await fetch('/api/upload?access_key=' + new URLSearchParams(window.location.search).get('access_key'), {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    alert('任务提交成功！任务ID: ' + result.data.task_id);
                    loadTasks();
                } else {
                    alert('任务提交失败: ' + result.error);
                }
            } catch (error) {
                alert('提交失败: ' + error.message);
            }
        }

        async function loadTasks() {
            const userid = document.getElementById('userid').value;
            if (!userid) return;

            try {
                const response = await fetch('/api/tasks?userid=' + userid + '&access_key=' + new URLSearchParams(window.location.search).get('access_key'));
                const result = await response.json();

                if (result.success) {
                    const taskList = document.getElementById('taskList');
                    taskList.innerHTML = '';

                    result.data.tasks.forEach(task => {
                        const taskItem = document.createElement('div');
                        taskItem.className = 'task-item';
                        taskItem.innerHTML = \`
                            <strong>任务ID:</strong> \${task.task_id}<br>
                            <strong>状态:</strong> \${task.status}<br>
                            <strong>备注:</strong> \${task.note}<br>
                            <strong>创建时间:</strong> \${new Date(task.created_at).toLocaleString()}<br>
                            \${task.filename ? '<button onclick="downloadFile(\\'' + task.task_id + '\\')">下载文件</button>' : ''}
                        \`;
                        taskList.appendChild(taskItem);
                    });
                }
            } catch (error) {
                console.error('加载任务失败:', error);
            }
        }

        async function downloadFile(taskId) {
            const accessKey = new URLSearchParams(window.location.search).get('access_key');
            window.open('/api/download?task_id=' + taskId + '&access_key=' + accessKey);
        }

        // 页面加载时检查访问权限
        window.onload = function() {
            const accessKey = new URLSearchParams(window.location.search).get('access_key');
            if (!accessKey) {
                document.body.innerHTML = '<div style="text-align: center; margin-top: 100px;"><h2>请提供访问密钥</h2></div>';
            }
        };
    </script>
</body>
</html>`;
}

// 主处理函数
export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS, PUT',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // 检查访问权限
    const authError = checkAccess(request, env);
    if (authError) {
      return authError;
    }

    // 路由处理
    if (path === '/') {
      return new Response(generateHTML(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    if (path === '/api/upload') {
      return handleUpload(request, env);
    }

    if (path === '/api/tasks') {
      return handleTasks(request, env);
    }

    if (path === '/api/download') {
      return handleDownload(request, env);
    }

    return createErrorResponse('Not Found', 404);
  }
};