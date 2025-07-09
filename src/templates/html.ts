// ========== src/templates/html.ts ==========
export function generateHTML(locale: string = 'auto'): string {
  return `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="doc_ai_agent">文档生成智能体</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        ${getInlineCSS()}
    </style>
</head>
<body>
    ${getHTMLContent()}
    <script>
        ${getInlineJS()}
    </script>
</body>
</html>`;
}

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
    --cooldown-bg: #6b7280;
    --cooldown-hover: #4b5563;
}

[data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-secondary: rgba(255, 255, 255, 0.95);
    --bg-tertiary: rgba(248, 250, 252, 0.95);
    --border-color: rgba(226, 232, 240, 0.8);
    --border-hover: #22c55e;
    --text-primary: #1e293b;
    --text-secondary: rgba(30, 41, 59, 0.8);
    --text-muted: rgba(30, 41, 59, 0.6);
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

@media (prefers-color-scheme: light) {
    :root {
        --bg-primary: #ffffff;
        --bg-secondary: rgba(255, 255, 255, 0.95);
        --bg-tertiary: rgba(248, 250, 252, 0.95);
        --border-color: rgba(226, 232, 240, 0.8);
        --border-hover: #22c55e;
        --text-primary: #1e293b;
        --text-secondary: rgba(30, 41, 59, 0.8);
        --text-muted: rgba(30, 41, 59, 0.6);
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
    transition: all 0.3s ease;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
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
    font-size: 1.2rem;
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
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-color), var(--success-color));
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
    position: relative;
    overflow: hidden;
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
}

.btn:hover::before {
    left: 100%;
}

.btn-primary {
    background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

.btn-secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    border-color: var(--border-hover);
    transform: translateY(-1px);
}

.btn-danger {
    background: linear-gradient(135deg, var(--danger-color), var(--danger-hover));
    color: white;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.btn-danger:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
}

.btn-success {
    background: linear-gradient(135deg, var(--success-color), var(--success-hover));
    color: white;
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

.btn-success:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-lg {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
}

.btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
}

/* Main Content */
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
    position: relative;
    overflow: hidden;
}

.upload-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent-color), var(--success-color));
}

.upload-area {
    border: 2px dashed var(--border-color);
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
}

.upload-area:hover {
    border-color: var(--border-hover);
    background: var(--bg-tertiary);
    transform: translateY(-2px);
}

.upload-area.drag-over {
    border-color: var(--accent-color);
    background: var(--bg-tertiary);
    transform: scale(1.02);
}

.upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.8;
    color: var(--accent-color);
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
    padding: 1rem;
    background: var(--bg-tertiary);
    border-radius: 8px;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
    border-left: 3px solid var(--accent-color);
}

.file-item:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px var(--shadow-color);
}

.file-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
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
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-primary);
}

.form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    transform: translateY(-1px);
}

.form-input::placeholder {
    color: var(--text-placeholder);
}

.form-textarea {
    min-height: 120px;
    resize: vertical;
}

/* Tasks Section */
.tasks-section {
    background: var(--bg-secondary);
    backdrop-filter: var(--backdrop-filter);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    position: relative;
    overflow: hidden;
}

.tasks-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--success-color), var(--info-color));
}

.tasks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.tasks-title {
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
    position: relative;
    overflow: hidden;
}

.task-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, var(--accent-color), var(--success-color));
    opacity: 0;
    transition: opacity 0.3s ease;
}

.task-item:hover::before {
    opacity: 1;
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
    transition: color 0.3s ease;
}

.task-note:hover {
    color: var(--accent-color);
}

.task-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
}

.task-status {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
}

.task-status.processing {
    background: linear-gradient(135deg, var(--warning-color), #fbbf24);
    color: white;
}

.task-status.completed {
    background: linear-gradient(135deg, var(--success-color), var(--success-hover));
    color: white;
}

.task-status.failed {
    background: linear-gradient(135deg, var(--danger-color), var(--danger-hover));
    color: white;
}

.task-actions {
    display: flex;
    gap: 0.5rem;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background: var(--border-color);
    border-radius: 3px;
    overflow: hidden;
    margin-top: 0.5rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-color), var(--success-color));
    transition: width 0.3s ease;
    border-radius: 3px;
}

/* Modal */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
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
    border-radius: 16px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    transform: scale(0.9);
    transition: transform 0.3s ease;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
    transition: color 0.3s ease;
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

/* Loading */
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

/* Success Animation */
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

/* Responsive */
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }

    .header-content {
        flex-direction: column;
        gap: 1rem;
    }

    .logo {
        font-size: 1.1rem;
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

    .upload-area {
        padding: 2rem 1rem;
    }
}

/* Login Modal Specific */
.login-modal-content {
    text-align: center;
}

.login-iframe {
    width: 100%;
    height: 400px;
    border: none;
    border-radius: 8px;
    background: white;
}

.login-message {
    margin-bottom: 1.5rem;
    color: var(--text-secondary);
}

/* Footer */
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

/* Hidden elements */
.hidden {
    display: none !important;
}

/* 新增状态指示器 */
.status-indicator {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 0.5rem;
}

.status-indicator.processing {
    background: var(--warning-color);
    animation: pulse 1.5s ease-in-out infinite;
}

.status-indicator.completed {
    background: var(--success-color);
}

.status-indicator.failed {
    background: var(--danger-color);
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
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
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <span class="logo-text" data-i18n="doc_ai_agent_short">文档智能体</span>
                </div>
                <div class="header-actions">
                    <div id="userInfo" class="user-info hidden">
                        <div class="user-avatar" id="userAvatar"></div>
                        <span id="userEmail"></span>
                    </div>
                    <button id="loginBtn" class="btn btn-primary">
                        <i class="fas fa-sign-in-alt"></i>
                        <span data-i18n="login">登录</span>
                    </button>
                    <button id="logoutBtn" class="btn btn-secondary hidden">
                        <i class="fas fa-sign-out-alt"></i>
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
                    <i class="fas fa-plus-circle" style="color: var(--accent-color); margin-right: 0.5rem;"></i>
                    <span data-i18n="create_document">创建文档</span>
                </h2>

                <div class="upload-area" id="uploadArea">
                    <div class="upload-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <p data-i18n="drag_or_click">拖拽文件到此处或点击选择文件(可选)</p>
                    <p class="text-muted" data-i18n="supported_formats">支持 PDF, PNG, JPG, DOCX, PPTX, XLSX 等格式</p>
                    <input type="file" id="fileInput" class="file-input" multiple accept=".pdf,.png,.jpg,.jpeg,.docx,.pptx,.xlsx,.md,.txt">
                </div>

                <div id="fileList" class="file-list hidden"></div>

                <div class="form-group">
                    <label class="form-label" for="promptInput">
                        <i class="fas fa-edit" style="color: var(--accent-color); margin-right: 0.5rem;"></i>
                        <span data-i18n="document_requirements">文档需求描述</span>
                    </label>
                    <textarea
                        id="promptInput"
                        class="form-input form-textarea"
                        data-i18n-placeholder="requirements_placeholder"
                        placeholder="请描述您希望生成的文档内容和格式要求（如未上传文件则必填）..."></textarea>
                </div>

                <button id="generateBtn" class="btn btn-primary btn-lg">
                    <i class="fas fa-magic"></i>
                    <span data-i18n="generate_document_btn">开始生成</span>
                </button>
            </section>

            <!-- Tasks Section -->
            <section class="tasks-section">
                <div class="tasks-header">
                    <h2 class="tasks-title">
                        <i class="fas fa-folder-open" style="color: var(--success-color); margin-right: 0.5rem;"></i>
                        <span data-i18n="my_documents">我的文档</span>
                    </h2>
                    <button id="refreshBtn" class="btn btn-secondary">
                        <i class="fas fa-sync-alt"></i>
                        <span data-i18n="refresh">刷新</span>
                    </button>
                </div>

                <div id="tasksList"></div>
                <div id="noTasks" class="text-center text-muted hidden">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p data-i18n="no_document_records">暂无文档记录</p>
                </div>
                <div id="loadMoreContainer" class="text-center">
                    <button id="loadMoreBtn" class="btn btn-secondary hidden">
                        <i class="fas fa-arrow-down"></i>
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
                <i class="fas fa-copyright"></i>
                <span>2025 Endless AI LLC.</span>
                <span data-i18n="copyright">版权所有</span>
            </div>
        </div>
    </footer>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content login-modal-content">
            <div class="modal-header">
                <h3 class="modal-title">
                    <i class="fas fa-user-circle" style="color: var(--accent-color); margin-right: 0.5rem;"></i>
                    <span data-i18n="login_required">请先登录</span>
                </h3>
                <button class="modal-close" onclick="app.closeLoginModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p class="login-message" data-i18n="login_required_message">您需要登录后才能使用文档生成服务</p>
                <div id="loginContent">
                    <button id="openLoginBtn" class="btn btn-primary">
                        <i class="fas fa-sign-in-alt"></i>
                        <span data-i18n="login">登录</span>
                    </button>
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
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" id="genericModalBody"></div>
            <div class="modal-actions" id="genericModalActions"></div>
        </div>
    </div>
  `;
}

function getInlineJS(): string {
  return `
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

        // 检查登录结果
        this.checkLoginResult();

        // 初始化UI
        this.updateLanguage();
        this.initFileUpload();
        this.initEventListeners();

        // 加载任务列表
        if (this.currentUser) {
            this.loadTasks();
        }
    }

    async loadI18n() {
        try {
            const response = await fetch('/api/i18n');
            this.i18n = await response.json();
        } catch (error) {
            console.error('Failed to load i18n:', error);
            // 使用默认配置
            this.i18n = {
                zh: {
                    doc_ai_agent: '文档生成智能体',
                    // ... 其他默认配置
                },
                en: {
                    doc_ai_agent: 'Document Generation Agent',
                    // ... 其他默认配置
                }
            };
        }
    }

    t(key) {
        return this.i18n[this.currentLanguage] && this.i18n[this.currentLanguage][key] || key;
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

    // 用户认证相关方法
    loadUserFromStorage() {
        const userStr = localStorage.getItem('docagent_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.expires_at && user.expires_at > Date.now()) {
                    this.currentUser = user;
                    this.updateUserUI();
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

    handleLogin() {
        const loginUrl = new URL('https://user.endlessai.org/login');
        loginUrl.searchParams.set('locale', this.currentLanguage);
        loginUrl.searchParams.set('redirect_uri', window.location.origin + window.location.pathname);
        loginUrl.searchParams.set('client_id', 'docagent');

        const popup = window.open(
            loginUrl.toString(),
            'docagent_login',
            'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        const checkClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkClosed);
                this.checkLoginResult();
            }
        }, 1000);

        const messageHandler = (event) => {
            if (event.origin !== 'https://user.endlessai.org') return;

            if (event.data.type === 'login_success') {
                clearInterval(checkClosed);
                popup.close();
                this.handleLoginSuccess(event.data.user);
                window.removeEventListener('message', messageHandler);
            } else if (event.data.type === 'login_error') {
                clearInterval(checkClosed);
                popup.close();
                this.showMessage(event.data.message || this.t('login_failed'), 'error');
                window.removeEventListener('message', messageHandler);
            }
        };

        window.addEventListener('message', messageHandler);
    }

    checkLoginResult() {
        const urlParams = new URLSearchParams(window.location.search);
        const userToken = urlParams.get('token');
        const userEmail = urlParams.get('email');

        if (userToken && userEmail) {
            const user = {
                token: userToken,
                user_id: userToken,
                email: userEmail,
                expires_at: Date.now() + (24 * 60 * 60 * 1000)
            };

            this.handleLoginSuccess(user);

            const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
            if (this.getAccessKey()) {
                newUrl += '?access_key=' + this.getAccessKey();
            }
            window.history.replaceState({}, document.title, newUrl);
        }
    }

    handleLoginSuccess(user) {
        this.currentUser = user;
        localStorage.setItem('docagent_user', JSON.stringify(user));
        this.updateUserUI();
        this.closeLoginModal();
        this.showMessage(this.t('login_success'), 'success');
    }

    handleLogout() {
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
        fileList.innerHTML = this.selectedFiles.map((file, index) => {
            const fileIcon = this.getFileIcon(file.name);
            return \`
                <div class="file-item">
                    <div class="file-info">
                        <i class="\${fileIcon}" style="color: var(--accent-color); margin-right: 0.5rem;"></i>
                        <span class="file-name">\${file.name}</span>
                        <span class="file-size">(\${this.formatFileSize(file.size)})</span>
                    </div>
                    <button class="btn btn-sm btn-danger" onclick="app.removeFile(\${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            \`;
        }).join('');
    }

    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'pdf': 'fas fa-file-pdf',
            'png': 'fas fa-image',
            'jpg': 'fas fa-image',
            'jpeg': 'fas fa-image',
            'docx': 'fas fa-file-word',
            'pptx': 'fas fa-file-powerpoint',
            'xlsx': 'fas fa-file-excel',
            'md': 'fas fa-file-alt',
            'txt': 'fas fa-file-alt'
        };
        return iconMap[ext] || 'fas fa-file';
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateFileList();
    }

    // 工具方法
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

        modalTitle.innerHTML = \`<i class="fas fa-info-circle" style="color: var(--accent-color); margin-right: 0.5rem;"></i>\${title}\`;
        modalBody.innerHTML = content;
        modalActions.innerHTML = '';

        actions.forEach(action => {
            const button = document.createElement('button');
            button.className = \`btn \${action.className || 'btn-secondary'}\`;
            button.innerHTML = \`<i class="fas fa-check"></i> \${action.text}\`;
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
        document.getElementById('loginBtn').addEventListener('click', () => this.handleLogin());
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        document.getElementById('openLoginBtn').addEventListener('click', () => {
            this.closeLoginModal();
            this.handleLogin();
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

        // 页面可见性变化时重新检查任务
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.currentUser) {
                this.loadTasks(true);
            }
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
    }

    // 任务管理方法
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
        const originalText = generateBtn.innerHTML;
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
            generateBtn.innerHTML = originalText;
        }
    }

    showTaskSubmittedSuccess(taskId) {
        const content = \`
            <div class="success-animation">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
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

    async loadTasks(reset = false) {
        if (!this.currentUser) return;

        if (reset) {
            this.currentPage = 1;
            document.getElementById('tasksList').innerHTML = '';
        }

        try {
            const response = await fetch(
                \`/api/tasks?userid=\${this.currentUser.user_id}&page=\${this.currentPage}&limit=10&access_key=\${this.getAccessKey()}\`
            );

            const result = await response.json();

            if (result.success) {
                const tasksList = document.getElementById('tasksList');
                const noTasks = document.getElementById('noTasks');
                const loadMoreBtn = document.getElementById('loadMoreBtn');

                if (result.data.tasks.length === 0 && this.currentPage === 1) {
                    noTasks.classList.remove('hidden');
                    tasksList.innerHTML = '';
                } else {
                    noTasks.classList.add('hidden');

                    if (reset) {
                        tasksList.innerHTML = '';
                    }

                    result.data.tasks.forEach(task => {
                        tasksList.appendChild(this.createTaskElement(task));
                    });
                }

                this.hasMoreTasks = result.data.has_more;
                if (this.hasMoreTasks) {
                    loadMoreBtn.classList.remove('hidden');
                } else {
                    loadMoreBtn.classList.add('hidden');
                }

                // 检查是否有待处理任务
                const hasPendingTasks = result.data.tasks.some(task =>
                    task.status === 'processing' || task.status === 'created' || task.status === 'ai_thinking'
                );

                if (hasPendingTasks) {
                    this.startPolling();
                } else {
                    this.stopPolling();
                }
            }

        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    }

    createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';

        const statusIcon = this.getStatusIcon(task.status);
        const formatIcon = this.getFormatIcon(task.file_format);

        taskElement.innerHTML = \`
            <div class="task-header">
                <div class="task-info">
                    <div class="task-id">
                        <i class="fas fa-hashtag" style="color: var(--text-muted);"></i>
                        ID: \${task.task_id}
                    </div>
                    <div class="task-note" onclick="app.editNote('\${task.task_id}', this)">
                        <i class="fas fa-sticky-note" style="color: var(--accent-color); margin-right: 0.5rem;"></i>
                        \${task.note || this.t('no_note')}
                    </div>
                    <div class="task-meta">
                        <span>
                            <i class="fas fa-calendar-alt"></i>
                            \${this.formatDate(task.created_at)}
                        </span>
                        <span class="task-status \${task.status}">
                            <span class="status-indicator \${task.status}"></span>
                            \${statusIcon}
                            \${task.status_text || task.status}
                        </span>
                        <span>
                            \${formatIcon}
                            \${this.t('format_' + task.file_format)}
                        </span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: \${task.progress}%"></div>
                    </div>
                </div>
                <div class="task-actions">
                    \${task.status === 'completed' && task.filename ?
                        \`<button class="btn btn-success btn-sm" onclick="app.downloadFile('\${task.task_id}')">
                            <i class="fas fa-download"></i>
                            \${this.t('download')}
                        </button>\` : ''
                    }
                    <button class="btn btn-danger btn-sm" onclick="app.deleteTask('\${task.task_id}')">
                        <i class="fas fa-trash-alt"></i>
                        \${this.t('delete')}
                    </button>
                </div>
            </div>
        \`;

        return taskElement;
    }

    getStatusIcon(status) {
        const iconMap = {
            'processing': '<i class="fas fa-cog fa-spin"></i>',
            'completed': '<i class="fas fa-check-circle"></i>',
            'failed': '<i class="fas fa-exclamation-circle"></i>',
            'created': '<i class="fas fa-plus-circle"></i>',
            'ai_thinking': '<i class="fas fa-brain"></i>'
        };
        return iconMap[status] || '<i class="fas fa-question-circle"></i>';
    }

    getFormatIcon(format) {
        const iconMap = {
            'pptx': '<i class="fas fa-file-powerpoint"></i>',
            'pdf': '<i class="fas fa-file-pdf"></i>',
            'docx': '<i class="fas fa-file-word"></i>',
            'xlsx': '<i class="fas fa-file-excel"></i>',
            'png': '<i class="fas fa-image"></i>',
            'md': '<i class="fas fa-file-alt"></i>',
            'html': '<i class="fas fa-code"></i>',
            'json': '<i class="fas fa-file-code"></i>',
            'unknown': '<i class="fas fa-file"></i>'
        };
        return iconMap[format] || '<i class="fas fa-file"></i>';
    }

    async downloadFile(taskId) {
        try {
            const response = await fetch(\`/api/download?task_id=\${taskId}&access_key=\${this.getAccessKey()}\`);

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'document';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.cleanupTask(taskId);
            } else {
                this.showMessage(this.t('download_failed'), 'error');
            }
        } catch (error) {
            this.showMessage(this.t('download_failed') + ': ' + error.message, 'error');
        }
    }

    deleteTask(taskId) {
        this.showConfirm(this.t('confirm_delete'), async () => {
            try {
                const response = await fetch(
                    \`/api/delete?task_id=\${taskId}&userid=\${this.currentUser.user_id}&access_key=\${this.getAccessKey()}\`,
                    { method: 'DELETE' }
                );

                const result = await response.json();

                if (result.success) {
                    this.showMessage(this.t('delete_success'), 'success');
                    this.loadTasks(true);
                } else {
                    this.showMessage(this.t('delete_failed') + ': ' + result.error, 'error');
                }
            } catch (error) {
                this.showMessage(this.t('delete_failed') + ': ' + error.message, 'error');
            }

            this.closeGenericModal();
        });
    }

    async cleanupTask(taskId) {
        try {
            await fetch('/api/cleanup-task?access_key=' + this.getAccessKey(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task_id: taskId,
                    userid: this.currentUser.user_id
                })
            });
        } catch (error) {
            // 忽略清理错误
        }
    }

    editNote(taskId, element) {
        const currentNote = element.textContent.trim();
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentNote === this.t('no_note') ? '' : currentNote;
        input.className = 'form-input';
        input.style.width = '100%';

        const saveNote = async () => {
            try {
                const response = await fetch('/api/update-note?access_key=' + this.getAccessKey(), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        task_id: taskId,
                        note: input.value,
                        userid: this.currentUser.user_id
                    })
                });

                const result = await response.json();

                if (result.success) {
                    element.innerHTML = \`<i class="fas fa-sticky-note" style="color: var(--accent-color); margin-right: 0.5rem;"></i>\${input.value || this.t('no_note')}\`;
                    element.style.display = 'block';
                    input.remove();
                } else {
                    this.showMessage(this.t('update_failed'), 'error');
                }
            } catch (error) {
                this.showMessage(this.t('update_failed') + ': ' + error.message, 'error');
            }
        };

        const cancelEdit = () => {
            element.style.display = 'block';
            input.remove();
        };

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveNote();
            } else if (e.key === 'Escape') {
                cancelEdit();
            }
        });

        input.addEventListener('blur', saveNote);

        element.style.display = 'none';
        element.parentNode.insertBefore(input, element.nextSibling);
        input.focus();
    }

    // 轮询管理
    startPolling() {
        if (this.pollInterval) return;

        this.pollInterval = setInterval(async () => {
            if (!this.currentUser) return;

            try {
                const response = await fetch(
                    \`/api/check-pending?userid=\${this.currentUser.user_id}&access_key=\${this.getAccessKey()}\`
                );

                const result = await response.json();

                if (result.success && result.data.updated_tasks > 0) {
                    this.loadTasks(true);
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 5000);
    }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }
}

// 全局实例
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DocAgentApp();
});
  `;
}