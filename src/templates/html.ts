// ========== src/templates/html.ts ==========
function getInlineCSS(): string {
  return `
:root {
    --bg-primary: #000;
    --bg-secondary: rgba(26, 26, 26, 0.95);
    --bg-tertiary: rgba(42, 42, 42, 0.95);
    --border-color: rgba(51, 51, 51, 0.8);
    --border-hover: #22c55e;
    --text-primary: #fff;
    --text-secondary: rgba(255, 255, 255, 0.8);
    --text-muted: rgba(255, 255, 255, 0.6);
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
}

@media (prefers-color-scheme: light) {
    :root {
        --bg-primary: #ffffff;
        --bg-secondary: rgba(255, 255, 255, 0.95);
        --bg-tertiary: rgba(248, 250, 252, 0.95);
        --border-color: rgba(226, 232, 240, 0.8);
        --text-primary: #1e293b;
        --text-secondary: rgba(30, 41, 59, 0.8);
        --text-muted: rgba(30, 41, 59, 0.6);
        --text-placeholder: #94a3b8;
        --shadow-color: rgba(0, 0, 0, 0.1);
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
    transition: all 0.3s ease;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header {
    background: var(--bg-secondary);
    backdrop-filter: var(--backdrop-filter);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 1rem 0;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
}

.logo-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--accent-color), var(--success-color));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border-radius: 8px;
    font-size: 0.9rem;
}

.user-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--accent-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 600;
}

.lang-selector {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 0.5rem;
    color: var(--text-primary);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.lang-selector:hover {
    border-color: var(--border-hover);
}

.btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
}

.btn-primary {
    background: var(--accent-color);
    color: white;
}

.btn-primary:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
}

.btn-secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    border-color: var(--border-hover);
}

.btn-danger {
    background: var(--danger-color);
    color: white;
}

.btn-danger:hover {
    background: var(--danger-hover);
}

.btn-success {
    background: var(--success-color);
    color: white;
}

.btn-success:hover {
    background: var(--success-hover);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
}

.main-content {
    padding: 2rem 0;
    min-height: calc(100vh - 120px);
}

.upload-section {
    background: var(--bg-secondary);
    backdrop-filter: var(--backdrop-filter);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
}

.upload-section h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
}

.upload-area {
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 1.5rem;
}

.upload-area:hover {
    border-color: var(--border-hover);
    background: var(--bg-tertiary);
}

.upload-area.drag-over {
    border-color: var(--accent-color);
    background: var(--bg-tertiary);
}

.upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.6;
}

.file-input {
    display: none;
}

.file-list {
    margin-top: 1rem;
}

.file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border-radius: 6px;
    margin-bottom: 0.5rem;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.file-name {
    font-weight: 500;
}

.file-size {
    color: var(--text-muted);
    font-size: 0.9rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-primary);
}

.form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-input::placeholder {
    color: var(--text-placeholder);
}

.form-textarea {
    min-height: 120px;
    resize: vertical;
}

.generate-btn-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.tasks-section {
    background: var(--bg-secondary);
    backdrop-filter: var(--backdrop-filter);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
}

.tasks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.tasks-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
}

.task-item {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
}

.task-item:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px var(--shadow-color);
}

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.task-info {
    flex: 1;
}

.task-id {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 0.25rem;
}

.task-note {
    font-weight: 500;
    margin-bottom: 0.5rem;
    cursor: pointer;
}

.task-note:hover {
    color: var(--accent-color);
}

.task-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: var(--text-muted);
}

.task-status {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
}

.task-status.processing {
    background: var(--warning-color);
    color: white;
}

.task-status.completed {
    background: var(--success-color);
    color: white;
}

.task-status.failed {
    background: var(--danger-color);
    color: white;
}

.task-actions {
    display: flex;
    gap: 0.5rem;
}

.progress-bar {
    width: 100%;
    height: 4px;
    background: var(--border-color);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 0.5rem;
}

.progress-fill {
    height: 100%;
    background: var(--accent-color);
    transition: width 0.3s ease;
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.modal.show {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
}

.modal-content {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.modal.show .modal-content {
    transform: scale(1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.modal-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.25rem;
}

.modal-close:hover {
    color: var(--text-primary);
}

.modal-body {
    margin-bottom: 1.5rem;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.loading {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--border-color);
    border-top: 2px solid var(--accent-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.success-animation {
    text-align: center;
    padding: 2rem;
}

.success-icon {
    font-size: 4rem;
    color: var(--success-color);
    margin-bottom: 1rem;
    animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
}

.login-form {
    max-width: 400px;
    margin: 0 auto;
}

.login-form .form-group {
    margin-bottom: 1rem;
}

.login-form .btn {
    width: 100%;
    margin-bottom: 1rem;
}

.login-message {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--text-secondary);
}

.footer {
    background: var(--bg-secondary);
    backdrop-filter: var(--backdrop-filter);
    border-top: 1px solid var(--border-color);
    padding: 1rem 0;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.9rem;
}

.footer-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}

.hidden {
    display: none !important;
}

.text-center {
    text-align: center;
}

.text-muted {
    color: var(--text-muted);
}

@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }

    .header-content {
        flex-direction: column;
        gap: 1rem;
    }

    .header-actions {
        flex-direction: row;
        gap: 0.5rem;
    }

    .upload-section,
    .tasks-section {
        padding: 1.5rem;
    }

    .task-header {
        flex-direction: column;
        gap: 1rem;
    }

    .task-actions {
        align-self: flex-start;
    }

    .modal-content {
        width: 95%;
        padding: 1.5rem;
    }
}
  `;
}

function getHTMLContent(): string {
  return `
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <div class="logo-icon">
                        <i data-feather="file-text"></i>
                    </div>
                    <span class="logo-text" data-i18n="doc_ai_agent_short">文档智能体</span>
                </div>
                <div class="header-actions">
                    <div id="userInfo" class="user-info hidden">
                        <div class="user-avatar" id="userAvatar"></div>
                        <span id="userEmail"></span>
                    </div>
                    <button id="loginBtn" class="btn btn-primary">
                        <i data-feather="log-in"></i>
                        <span data-i18n="login">登录</span>
                    </button>
                    <button id="logoutBtn" class="btn btn-secondary hidden">
                        <i data-feather="log-out"></i>
                        <span data-i18n="logout">退出</span>
                    </button>
                    <select id="languageSelect" class="lang-selector">
                        <option value="zh">🇨🇳 中文</option>
                        <option value="en">🇺🇸 English</option>
                    </select>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <!-- Upload Section -->
            <section class="upload-section">
                <h2>
                    <i data-feather="plus-circle"></i>
                    <span data-i18n="create_document">创建文档</span>
                </h2>

                <div class="upload-area" id="uploadArea">
                    <div class="upload-icon">
                        <i data-feather="upload-cloud"></i>
                    </div>
                    <p data-i18n="drag_or_click">拖拽文件到此处或点击选择文件(可选)</p>
                    <p class="text-muted" data-i18n="supported_formats">支持 PDF, PNG, JPG, DOCX, PPTX, XLSX 等格式</p>
                    <input type="file" id="fileInput" class="file-input" multiple accept=".pdf,.png,.jpg,.jpeg,.docx,.pptx,.xlsx,.md,.txt">
                </div>

                <div id="fileList" class="file-list hidden"></div>

                <div class="form-group">
                    <label class="form-label" for="promptInput">
                        <i data-feather="edit-3"></i>
                        <span data-i18n="document_requirements">文档需求描述</span>
                    </label>
                    <textarea
                        id="promptInput"
                        class="form-input form-textarea"
                        data-i18n-placeholder="requirements_placeholder"
                        placeholder="请描述您希望生成的文档内容和格式要求（如未上传文件则必填）..."></textarea>
                </div>

                <div class="generate-btn-container">
                    <button id="generateBtn" class="btn btn-primary btn-lg">
                        <i data-feather="zap"></i>
                        <span data-i18n="generate_document_btn">开始生成</span>
                    </button>
                </div>
            </section>

            <!-- Tasks Section -->
            <section class="tasks-section">
                <div class="tasks-header">
                    <h2 class="tasks-title">
                        <i data-feather="folder"></i>
                        <span data-i18n="my_documents">我的文档</span>
                    </h2>
                    <button id="refreshBtn" class="btn btn-secondary">
                        <i data-feather="refresh-cw"></i>
                        <span data-i18n="refresh">刷新</span>
                    </button>
                </div>

                <div id="tasksList"></div>
                <div id="noTasks" class="text-center text-muted hidden">
                    <i data-feather="inbox" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p data-i18n="no_document_records">暂无文档记录</p>
                </div>
                <div id="loadMoreContainer" class="text-center">
                    <button id="loadMoreBtn" class="btn btn-secondary hidden">
                        <i data-feather="chevron-down"></i>
                        <span data-i18n="load_more">加载更多</span>
                    </button>
                </div>
            </section>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <i data-feather="copyright"></i>
                <span>2025 Endless AI LLC.</span>
                <span data-i18n="copyright">版权所有</span>
            </div>
        </div>
    </footer>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">
                    <i data-feather="user"></i>
                    <span data-i18n="login_required">请先登录</span>
                </h3>
                <button class="modal-close" onclick="app.closeLoginModal()">
                    <i data-feather="x"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="login-form">
                    <div id="emailStep">
                        <div class="form-group">
                            <label class="form-label" for="loginEmail">
                                <i data-feather="mail"></i>
                                <span data-i18n="email">邮箱</span>
                            </label>
                            <input
                                type="email"
                                id="loginEmail"
                                class="form-input"
                                data-i18n-placeholder="email_placeholder"
                                placeholder="请输入您的邮箱地址">
                        </div>
                        <button id="sendCodeBtn" class="btn btn-primary">
                            <i data-feather="send"></i>
                            <span data-i18n="send_verification">发送验证码</span>
                        </button>
                    </div>

                    <div id="codeStep" class="hidden">
                        <div class="form-group">
                            <label class="form-label" for="loginCode">
                                <i data-feather="key"></i>
                                <span data-i18n="verification_code">验证码</span>
                            </label>
                            <input
                                type="text"
                                id="loginCode"
                                class="form-input"
                                data-i18n-placeholder="code_placeholder"
                                placeholder="请输入6位验证码"
                                maxlength="6">
                        </div>
                        <button id="verifyCodeBtn" class="btn btn-success">
                            <i data-feather="check"></i>
                            <span data-i18n="verify_code">验证登录</span>
                        </button>
                        <button id="backToEmailBtn" class="btn btn-secondary">
                            <i data-feather="arrow-left"></i>
                            <span data-i18n="back">返回</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Generic Modal -->
    <div id="genericModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="genericModalTitle"></h3>
                <button class="modal-close" onclick="app.closeGenericModal()">
                    <i data-feather="x"></i>
                </button>
            </div>
            <div class="modal-body" id="genericModalBody"></div>
            <div class="modal-actions" id="genericModalActions"></div>
        </div>
    </div>
  `;
}

export function generateHTML(): string {
  return `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文档生成智能体 - Document Generation Agent</title>
    <script src="https://unpkg.com/feather-icons"></script>
    <style>${getInlineCSS()}</style>
</head>
<body>
    ${getHTMLContent()}

    <script>
        // Include the app.js content here
        ${getAppJS()}
    </script>
</body>
</html>`;
}

function getAppJS(): string {
  return `
// App.js content will be included here
class DocAgentApp {
    constructor() {
        this.currentLanguage = 'zh';
        this.selectedFiles = [];
        this.isUploading = false;
        this.currentPage = 1;
        this.hasMoreTasks = false;
        this.pollInterval = null;
        this.currentUser = null;
        this.i18n = null;
        this.authApiBase = 'https://user.endlessai.org/api/auth';

        this.init();
    }

    async init() {
        // 加载国际化配置
        await this.loadI18n();

        // 检查访问权限
        if (!this.getAccessKey()) {
            document.body.innerHTML = '<div style="text-align: center; margin-top: 100px;"><h2>请提供访问密钥</h2></div>';
            return;
        }

        // 初始化语言
        const savedLanguage = localStorage.getItem('docagent_language') || 'zh';
        this.currentLanguage = savedLanguage;
        document.getElementById('languageSelect').value = this.currentLanguage;

        // 加载用户信息
        this.loadUserFromStorage();
        this.updateUserUI();

        // 初始化UI
        this.updateLanguage();
        this.initFileUpload();
        this.initEventListeners();

        // 加载任务列表
        if (this.currentUser) {
            this.loadTasks();
        }

        // 渲染图标
        feather.replace();
    }

    async loadI18n() {
        try {
            const response = await fetch('/api/i18n');
            this.i18n = await response.json();
        } catch (error) {
            console.error('Failed to load i18n:', error);
            this.i18n = {
                zh: { doc_ai_agent: '文档生成智能体' },
                en: { doc_ai_agent: 'Document Generation Agent' }
            };
        }
    }

    t(key) {
        return this.i18n[this.currentLanguage][key] || key;
    }

    updateLanguage() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
    }

    getAccessKey() {
        return new URLSearchParams(window.location.search).get('access_key');
    }

    // 认证相关方法
    loadUserFromStorage() {
        const userStr = localStorage.getItem('docagent_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.expires_at && user.expires_at > Date.now()) {
                    this.currentUser = user;
                    return true;
                } else {
                    localStorage.removeItem('docagent_user');
                }
            } catch (e) {
                localStorage.removeItem('docagent_user');
            }
        }
        return false;
    }

    updateUserUI() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userInfo = document.getElementById('userInfo');
        const userAvatar = document.getElementById('userAvatar');
        const userEmail = document.getElementById('userEmail');

        if (this.currentUser) {
            loginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
            userInfo.classList.remove('hidden');

            const initial = this.currentUser.email ? this.currentUser.email.charAt(0).toUpperCase() : 'U';
            userAvatar.textContent = initial;
            userEmail.textContent = this.currentUser.email || '';
        } else {
            loginBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
            userInfo.classList.add('hidden');
        }
    }

    async sendVerificationCode() {
        const email = document.getElementById('loginEmail').value.trim();
        if (!email) {
            this.showMessage('请输入邮箱地址', 'error');
            return;
        }

        const sendBtn = document.getElementById('sendCodeBtn');
        const originalText = sendBtn.textContent;
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<div class="loading"><div class="loading-spinner"></div>发送中...</div>';

        try {
            const response = await fetch(this.authApiBase + '/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage(this.t('code_sent_message'), 'success');
                document.getElementById('emailStep').classList.add('hidden');
                document.getElementById('codeStep').classList.remove('hidden');
                document.getElementById('loginCode').focus();
            } else {
                this.showMessage(result.message || '发送失败', 'error');
            }
        } catch (error) {
            this.showMessage('网络错误，请重试', 'error');
        } finally {
            sendBtn.disabled = false;
            sendBtn.textContent = originalText;
        }
    }

    async verifyCode() {
        const email = document.getElementById('loginEmail').value.trim();
        const code = document.getElementById('loginCode').value.trim();

        if (!code) {
            this.showMessage('请输入验证码', 'error');
            return;
        }

        const verifyBtn = document.getElementById('verifyCodeBtn');
        const originalText = verifyBtn.textContent;
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '<div class="loading"><div class="loading-spinner"></div>验证中...</div>';

        try {
            const response = await fetch(this.authApiBase + '/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            const result = await response.json();

            if (result.success) {
                const user = {
                    token: result.data.token,
                    user_id: result.data.user.id,
                    email: result.data.user.email,
                    expires_at: Date.now() + (24 * 60 * 60 * 1000)
                };

                this.currentUser = user;
                localStorage.setItem('docagent_user', JSON.stringify(user));
                this.updateUserUI();
                this.closeLoginModal();
                this.showMessage(this.t('login_success'), 'success');
                this.loadTasks();
            } else {
                this.showMessage(result.message || '验证失败', 'error');
            }
        } catch (error) {
            this.showMessage('网络错误，请重试', 'error');
        } finally {
            verifyBtn.disabled = false;
            verifyBtn.textContent = originalText;
        }
    }

    async handleLogout() {
        if (this.currentUser && this.currentUser.token) {
            try {
                await fetch(this.authApiBase + '/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + this.currentUser.token,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                // 忽略登出API错误
            }
        }

        this.currentUser = null;
        localStorage.removeItem('docagent_user');
        this.updateUserUI();
        this.showMessage(this.t('logout_success'), 'success');
    }

    // 文件上传相关方法
    initFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            this.handleFileSelection(files);
        });

        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFileSelection(files);
        });
    }

    handleFileSelection(files) {
        files.forEach(file => {
            if (file.size > 50 * 1024 * 1024) {
                this.showMessage(this.t('file_too_large'), 'error');
                return;
            }

            if (!this.selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                this.selectedFiles.push(file);
            }
        });

        this.updateFileList();
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');

        if (this.selectedFiles.length === 0) {
            fileList.classList.add('hidden');
            return;
        }

        fileList.classList.remove('hidden');
        fileList.innerHTML = this.selectedFiles.map((file, index) => \`
            <div class="file-item">
                <div class="file-info">
                    <span class="file-name">\${file.name}</span>
                    <span class="file-size">(\${this.formatFileSize(file.size)})</span>
                </div>
                <button class="btn btn-sm btn-danger" onclick="app.removeFile(\${index})">
                    <i data-feather="x"></i>
                </button>
            </div>
        \`).join('');

        feather.replace();
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateFileList();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(timestamp) {
        return new Date(timestamp).toLocaleString(this.currentLanguage === 'zh' ? 'zh-CN' : 'en-US');
    }

    // 模态框方法
    showModal(title, content, actions = [], type = 'info') {
        const modal = document.getElementById('genericModal');
        const modalTitle = document.getElementById('genericModalTitle');
        const modalBody = document.getElementById('genericModalBody');
        const modalActions = document.getElementById('genericModalActions');

        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modalActions.innerHTML = '';

        actions.forEach(action => {
            const button = document.createElement('button');
            button.className = \`btn \${action.className || 'btn-secondary'}\`;
            button.textContent = action.text;
            button.onclick = action.onClick;
            modalActions.appendChild(button);
        });

        modal.classList.add('show');
    }

    closeGenericModal() {
        document.getElementById('genericModal').classList.remove('show');
    }

    showLoginModal() {
        document.getElementById('loginModal').classList.add('show');
        document.getElementById('emailStep').classList.remove('hidden');
        document.getElementById('codeStep').classList.add('hidden');
        document.getElementById('loginEmail').focus();
    }

    closeLoginModal() {
        document.getElementById('loginModal').classList.remove('show');
    }

    showMessage(message, type = 'success') {
        const actions = [{
            text: this.t('ok'),
            className: 'btn-primary',
            onClick: () => this.closeGenericModal()
        }];

        this.showModal(this.t(type), message, actions, type);
    }

    showConfirm(message, onConfirm, onCancel) {
        const actions = [
            {
                text: this.t('cancel'),
                className: 'btn-secondary',
                onClick: onCancel || (() => this.closeGenericModal())
            },
            {
                text: this.t('confirm'),
                className: 'btn-primary',
                onClick: onConfirm
            }
        ];

        this.showModal(this.t('confirm'), message, actions, 'warning');
    }

    requireLogin() {
        if (!this.currentUser) {
            this.showLoginModal();
            return false;
        }
        return true;
    }

    // 事件监听器初始化
    initEventListeners() {
        // 语言切换
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            localStorage.setItem('docagent_language', this.currentLanguage);
            this.updateLanguage();
        });

        // 登录/退出
        document.getElementById('loginBtn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());

        // 登录表单
        document.getElementById('sendCodeBtn').addEventListener('click', () => this.sendVerificationCode());
        document.getElementById('verifyCodeBtn').addEventListener('click', () => this.verifyCode());
        document.getElementById('backToEmailBtn').addEventListener('click', () => {
            document.getElementById('emailStep').classList.remove('hidden');
            document.getElementById('codeStep').classList.add('hidden');
        });

        // 生成文档
        document.getElementById('generateBtn').addEventListener('click', () => this.generateDocument());

        // 刷新任务
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadTasks(true));

        // 加载更多
        document.getElementById('loadMoreBtn').addEventListener('click', () => {
            this.currentPage++;
            this.loadTasks();
        });

        // 关闭模态框
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeGenericModal();
                this.closeLoginModal();
            }
        });

        // 登录表单回车事件
        document.getElementById('loginEmail').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendVerificationCode();
        });

        document.getElementById('loginCode').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.verifyCode();
        });
    }

    // 任务相关方法 (简化版，完整版本需要从原始代码复制)
    async generateDocument() {
        if (!this.requireLogin()) return;

        const prompt = document.getElementById('promptInput').value.trim();

        if (this.selectedFiles.length === 0 && !prompt) {
            this.showMessage(this.t('files_or_prompt_required'), 'error');
            return;
        }

        if (this.isUploading) return;

        this.isUploading = true;
        const generateBtn = document.getElementById('generateBtn');
        const originalText = generateBtn.textContent;
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<div class="loading"><div class="loading-spinner"></div>' + this.t('uploading') + '</div>';

        try {
            const formData = new FormData();
            formData.append('user_prompt', prompt);
            formData.append('userid', this.currentUser.user_id);

            this.selectedFiles.forEach((file, index) => {
                formData.append('file_' + index, file);
            });

            const response = await fetch('/api/upload?access_key=' + this.getAccessKey(), {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showTaskSubmittedSuccess(result.data.task_id);
                this.selectedFiles = [];
                this.updateFileList();
                document.getElementById('promptInput').value = '';
            } else {
                if (result.error === 'COOLDOWN_ACTIVE') {
                    this.showMessage(this.t('cooldown_wait_hint'), 'warning');
                } else {
                    this.showMessage(this.t('upload_failed') + ': ' + result.error, 'error');
                }
            }

        } catch (error) {
            this.showMessage(this.t('upload_failed') + ': ' + error.message, 'error');
        } finally {
            this.isUploading = false;
            generateBtn.disabled = false;
            generateBtn.textContent = originalText;
        }
    }

    showTaskSubmittedSuccess(taskId) {
        const content = \`
            <div class="success-animation">
                <div class="success-icon">✅</div>
                <h3>\${this.t('task_submitted')}</h3>
                <p>\${this.t('task_submitted_message')}</p>
                <p><strong>Task ID:</strong> \${taskId}</p>
                <div id="autoReturnCountdown" style="margin-top: 1rem; color: var(--text-muted);"></div>
            </div>
        \`;

        const actions = [{
            text: this.t('return_to_list'),
            className: 'btn-primary',
            onClick: () => {
                this.closeGenericModal();
                this.loadTasks();
            }
        }];

        this.showModal(this.t('success'), content, actions, 'success');

        // 倒计时自动返回
        let countdown = 4;
        const countdownElement = document.getElementById('autoReturnCountdown');

        const updateCountdown = () => {
            if (countdownElement) {
                countdownElement.textContent = countdown + ' ' + this.t('auto_return_seconds');
                countdown--;

                if (countdown < 0) {
                    this.closeGenericModal();
                    this.loadTasks();
                    return;
                }
            }
            setTimeout(updateCountdown, 1000);
        };

        updateCountdown();
    }

    // 任务列表相关方法需要完整实现
    async loadTasks(reset = false) {
        if (!this.currentUser) return;
        // 实现加载任务列表的逻辑
    }

    createTaskElement(task) {
        // 实现创建任务元素的逻辑
    }

    // 其他方法...
}

// 全局实例
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DocAgentApp();
});
  `;
}