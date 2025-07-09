// ========== src/templates/html.ts ==========
export function generateHTML(locale: string = 'auto'): string {
  return `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="doc_ai_agent">文档生成智能体</title>
    <script src="https://cdn.jsdelivr.net/npm/feather-icons@4.29.0/dist/feather.min.js"></script>
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
  // 这里可以直接读取 CSS 文件内容，或者保持内联
  return `/* CSS 内容从 src/assets/styles.css 移过来 */`;
}

function getHTMLContent(): string {
  return `
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <span class="logo-icon">📄</span>
                    <span class="logo-text" data-i18n="doc_ai_agent_short">文档智能体</span>
                </div>
                <div class="header-actions">
                    <div id="userInfo" class="user-info hidden">
                        <div class="user-avatar" id="userAvatar"></div>
                        <span id="userEmail"></span>
                    </div>
                    <button id="loginBtn" class="btn btn-primary" data-i18n="login">登录</button>
                    <button id="logoutBtn" class="btn btn-secondary hidden" data-i18n="logout">退出</button>
                    <select id="languageSelect" class="lang-selector">
                        <option value="zh">中文</option>
                        <option value="en">English</option>
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
                <h2 data-i18n="create_document">创建文档</h2>

                <div class="upload-area" id="uploadArea">
                    <div class="upload-icon">📁</div>
                    <p data-i18n="drag_or_click">拖拽文件到此处或点击选择文件(可选)</p>
                    <p class="text-muted" data-i18n="supported_formats">支持 PDF, PNG, JPG, DOCX, PPTX, XLSX 等格式</p>
                    <input type="file" id="fileInput" class="file-input" multiple accept=".pdf,.png,.jpg,.jpeg,.docx,.pptx,.xlsx,.md,.txt">
                </div>

                <div id="fileList" class="file-list hidden"></div>

                <div class="form-group">
                    <label class="form-label" for="promptInput" data-i18n="document_requirements">文档需求描述</label>
                    <textarea
                        id="promptInput"
                        class="form-input form-textarea"
                        data-i18n-placeholder="requirements_placeholder"
                        placeholder="请描述您希望生成的文档内容和格式要求（如未上传文件则必填）..."></textarea>
                </div>

                <button id="generateBtn" class="btn btn-primary btn-lg" data-i18n="generate_document_btn">开始生成</button>
            </section>

            <!-- Tasks Section -->
            <section class="tasks-section">
                <div class="tasks-header">
                    <h2 class="tasks-title" data-i18n="my_documents">我的文档</h2>
                    <button id="refreshBtn" class="btn btn-secondary">
                        <i data-feather="refresh-cw"></i>
                        <span data-i18n="refresh">刷新</span>
                    </button>
                </div>

                <div id="tasksList"></div>
                <div id="noTasks" class="text-center text-muted hidden">
                    <p data-i18n="no_document_records">暂无文档记录</p>
                </div>
                <div id="loadMoreContainer" class="text-center">
                    <button id="loadMoreBtn" class="btn btn-secondary hidden" data-i18n="load_more">加载更多</button>
                </div>
            </section>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <span>© 2025 Endless AI LLC.</span>
                <span data-i18n="copyright">版权所有</span>
            </div>
        </div>
    </footer>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content login-modal-content">
            <div class="modal-header">
                <h3 class="modal-title" data-i18n="login_required">请先登录</h3>
                <button class="modal-close" onclick="app.closeLoginModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p class="login-message" data-i18n="login_required_message">您需要登录后才能使用文档生成服务</p>
                <div id="loginContent">
                    <button id="openLoginBtn" class="btn btn-primary" data-i18n="login">登录</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Generic Modal -->
    <div id="genericModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="genericModalTitle"></h3>
                <button class="modal-close" onclick="app.closeGenericModal()">&times;</button>
            </div>
            <div class="modal-body" id="genericModalBody"></div>
            <div class="modal-actions" id="genericModalActions"></div>
        </div>
    </div>
  `;
}

function getInlineJS(): string {
  // 这里可以直接读取 JS 文件内容，或者保持内联
  return `/* JavaScript 内容从 src/assets/app.js 移过来 */`;
}