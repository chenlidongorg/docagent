// src/templates/html.ts
export function generateHTML(): string {
  return `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文档生成智能体 - Document Generation Agent</title>
    <link rel="stylesheet" href="/assets/styles.css">
    <!-- Feather Icons -->
    <script src="https://unpkg.com/feather-icons"></script>
    <style>
        /* 确保在 CSS 加载前有基本样式 */
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .hidden { display: none !important; }
        .loading { opacity: 0.6; }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <div class="logo-icon">
                        <img src="/assets/logo.png" alt="Logo" onerror="this.style.display='none'; this.parentNode.innerHTML='<i data-feather=\'file-text\'></i>'">
                    </div>
                    <span class="logo-text" data-i18n="doc_ai_agent_short">文档智能体</span>
                </div>
                <div class="header-actions">
                    <div id="userInfo" class="user-info hidden">
                        <div class="user-avatar" id="userAvatar"></div>
                        <span id="userEmail"></span>
                    </div>
                    <button id="loginBtn" class="btn btn-primary" type="button">
                        <i data-feather="log-in"></i>
                        <span data-i18n="login">登录</span>
                    </button>
                    <button id="logoutBtn" class="btn btn-secondary hidden" type="button">
                        <i data-feather="log-out"></i>
                        <span data-i18n="logout">退出</span>
                    </button>
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
                <h2>
                    <i data-feather="plus-circle"></i>
                    <span data-i18n="create_document">创建文档</span>
                </h2>

                <div class="upload-area" id="uploadArea">
                    <div class="upload-icon">
                        <i data-feather="upload-cloud" style="width: 48px; height: 48px;"></i>
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
                    <button id="generateBtn" class="btn btn-primary btn-lg" type="button">
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
                    <button id="refreshBtn" class="btn btn-secondary" type="button">
                        <i data-feather="refresh-cw"></i>
                        <span data-i18n="refresh">刷新</span>
                    </button>
                </div>

                <div id="tasksList"></div>
                <div id="noTasks" class="text-center text-muted hidden">
                    <div style="font-size: 48px; margin-bottom: 1rem; opacity: 0.5;">
                        <i data-feather="inbox" style="width: 64px; height: 64px;"></i>
                    </div>
                    <p data-i18n="no_document_records">暂无文档记录</p>
                </div>
                <div id="loadMoreContainer" class="text-center">
                    <button id="loadMoreBtn" class="btn btn-secondary hidden" type="button">
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
                <button class="modal-close" type="button" onclick="closeLoginModal()">
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
                        <button id="sendCodeBtn" class="btn btn-primary" type="button">
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
                        <button id="verifyCodeBtn" class="btn btn-success" type="button">
                            <i data-feather="check"></i>
                            <span data-i18n="verify_code">验证登录</span>
                        </button>
                        <button id="backToEmailBtn" class="btn btn-secondary" type="button">
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
                <button class="modal-close" type="button" onclick="closeGenericModal()">
                    <i data-feather="x"></i>
                </button>
            </div>
            <div class="modal-body" id="genericModalBody"></div>
            <div class="modal-actions" id="genericModalActions"></div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="/assets/app.js"></script>
    <script>
        // 确保 JavaScript 正确加载
        document.addEventListener('DOMContentLoaded', function() {
            console.log('页面加载完成');

            // 渲染图标
            if (typeof feather !== 'undefined') {
                feather.replace();
            }

            // 检查是否有错误
            window.addEventListener('error', function(e) {
                console.error('JavaScript错误:', e.error);
            });

            // 如果主 JS 文件没有加载，显示错误信息
            setTimeout(function() {
                if (typeof initApp !== 'function') {
                    document.body.innerHTML = '<div style="text-align: center; padding: 2rem;"><h2>资源加载失败</h2><p>请刷新页面重试</p></div>';
                }
            }, 3000);
        });
    </script>
</body>
</html>`;
}