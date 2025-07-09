import { CloudflareEnv } from '../types';

export async function handleAssets(request: Request, env: CloudflareEnv): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/assets/styles.css') {
    const css = await getStylesCSS();
    return new Response(css, {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }

  if (path === '/assets/app.js') {
    const js = await getAppJS();
    return new Response(js, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }

  if (path === '/assets/logo.png') {
    return handleLogo(env);
  }

  return new Response('Not Found', { status: 404 });
}

async function getStylesCSS(): Promise<string> {
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

/* Header Styles */
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
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    background: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
}

.logo-icon:hover {
    transform: scale(1.05);
}

.logo-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

/* Button Styles */
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

.btn i {
    width: 16px;
    height: 16px;
    margin-right: 0.5rem;
}

.btn-sm i {
    width: 14px;
    height: 14px;
}

.btn-lg i {
    width: 18px;
    height: 18px;
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

.btn-cooldown {
    background: linear-gradient(135deg, var(--cooldown-bg), var(--cooldown-hover));
    color: white;
    opacity: 0.8;
    cursor: not-allowed;
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

/* Main Content */
.main-content {
    padding: 2rem 0;
    min-height: calc(100vh - 120px);
}

/* Upload Section */
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

.upload-icon i {
    color: var(--text-muted);
    margin-bottom: 1rem;
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

.file-item .btn i {
    width: 12px;
    height: 12px;
    margin-right: 0;
}

/* Form Styles */
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

.form-label i {
    margin-right: 0.5rem;
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

/* Tasks Section */
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

.tasks-title i {
    margin-right: 0.5rem;
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

.task-actions .btn i {
    width: 14px;
    height: 14px;
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

/* Modal Styles */
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

.modal-title i {
    margin-right: 0.5rem;
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

.modal-content button {
    cursor: pointer;
}

/* Loading Animation */
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

.success-animation .success-icon {
    margin-bottom: 1rem;
    animation: bounce 0.6s ease-in-out;
}

/* Login Form */
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

/* Task item inline buttons */
.task-item [onclick] {
    cursor: pointer;
}

/* Utility Classes */
.hidden {
    display: none !important;
}

.text-center {
    text-align: center;
}

.text-muted {
    color: var(--text-muted);
}

/* Responsive Design */
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

async function getAppJS(): Promise<string> {
  return `
// 全局变量
let currentLanguage = 'zh';
let selectedFiles = [];
let isUploading = false;
let currentPage = 1;
let hasMoreTasks = false;
let pollInterval = null;
let currentUser = null;
let i18nData = null;
let hasActiveTasks = false;
let smartPollingTimer = null;
let pendingCheckTimer = null;
let clientCooldownEndTime = 0;
let cooldownTimer = null;
let isEventListenersInitialized = false;
let autoReturnTimer = null;

const authApiBase = 'https://user.endlessai.org/api/auth';

// 任务状态定义
const TaskStatus = {
    CREATED: 'created',
    AI_THINKING: 'ai_thinking',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

// 统一的国际化配置
const i18nConfig = {
    zh: {
        doc_ai_agent: '文档生成智能体',
        doc_ai_agent_short: '文档智能体',
        login: '登录',
        logout: '退出',
        login_required: '请先登录',
        login_success: '登录成功',
        logout_success: '已退出登录',
        send_verification: '发送验证码',
        verify_code: '验证登录',
        email: '邮箱',
        verification_code: '验证码',
        email_placeholder: '请输入您的邮箱地址',
        code_placeholder: '请输入6位验证码',
        code_sent_message: '验证码已发送到您的邮箱，请查收',
        create_document: '创建文档',
        drag_or_click: '拖拽文件到此处或点击选择文件(可选)',
        supported_formats: '支持 PDF, PNG, JPG, DOCX, PPTX, XLSX 等格式',
        document_requirements: '文档需求描述',
        requirements_placeholder: '请描述您希望生成的文档内容和格式要求（如未上传文件则必填）...',
        generate_document_btn: '开始生成',
        uploading: '上传中...',
        my_documents: '我的文档',
        no_document_records: '暂无文档记录',
        load_more: '加载更多',
        refresh: '刷新',
        download: '下载',
        delete: '删除',
        no_note: '无备注',
        task_submitted: '任务提交成功！',
        task_submitted_message: 'AI智能体正在分析您的需求并选择最佳文档格式。任务已进入队列处理，您可以离开页面稍后查看结果。',
        return_to_list: '返回列表',
        auto_return_seconds: '秒后自动返回',
        upload_failed: '上传失败',
        download_failed: '下载失败',
        delete_failed: '删除失败',
        update_failed: '更新失败',
        delete_success: '删除成功',
        file_too_large: '文件过大，最大支持50MB',
        files_or_prompt_required: '请上传文件或描述您的文档需求',
        cooldown_wait_hint: '请求过于频繁，请稍后再试',
        confirm_delete: '确定要删除这个文档吗？',
        confirm: '确定',
        cancel: '取消',
        ok: '好的',
        success: '成功',
        error: '错误',
        warning: '警告',
        info: '提示',
        copyright: '版权所有',
        format_pptx: 'PPT演示',
        format_pdf: 'PDF文档',
        format_docx: 'Word文档',
        format_xlsx: 'Excel表格',
        format_png: '图片',
        format_md: 'Markdown',
        format_html: '网页',
        format_json: 'JSON',
        format_unknown: '未知格式',
        back: '返回',
        processing: '处理中',
        completed: '已完成',
        failed: '失败'
    },
    en: {
        doc_ai_agent: 'Document Generation Agent',
        doc_ai_agent_short: 'Doc Agent',
        login: 'Login',
        logout: 'Logout',
        login_required: 'Login Required',
        login_success: 'Login successful',
        logout_success: 'Logged out successfully',
        send_verification: 'Send Code',
        verify_code: 'Verify Login',
        email: 'Email',
        verification_code: 'Verification Code',
        email_placeholder: 'Please enter your email address',
        code_placeholder: 'Please enter 6-digit code',
        code_sent_message: 'Verification code has been sent to your email',
        create_document: 'Create Document',
        drag_or_click: 'Drag files here or click to select (optional)',
        supported_formats: 'Supports PDF, PNG, JPG, DOCX, PPTX, XLSX formats',
        document_requirements: 'Document Requirements',
        requirements_placeholder: 'Please describe the content and format requirements for your document (required if no files uploaded)...',
        generate_document_btn: 'Start Generate',
        uploading: 'Uploading...',
        my_documents: 'My Documents',
        no_document_records: 'No document records',
        load_more: 'Load More',
        refresh: 'Refresh',
        download: 'Download',
        delete: 'Delete',
        no_note: 'No note',
        task_submitted: 'Task Submitted Successfully!',
        task_submitted_message: 'AI agent is analyzing your requirements and selecting the best document format. The task has been queued for processing, you can leave the page and check results later.',
        return_to_list: 'Return to List',
        auto_return_seconds: 's until auto return',
        upload_failed: 'Upload failed',
        download_failed: 'Download failed',
        delete_failed: 'Delete failed',
        update_failed: 'Update failed',
        delete_success: 'Delete successful',
        file_too_large: 'File too large, maximum 50MB supported',
        files_or_prompt_required: 'Please upload files or describe your document requirements',
        cooldown_wait_hint: 'Too frequent requests, please try again later',
        confirm_delete: 'Are you sure you want to delete this document?',
        confirm: 'Confirm',
        cancel: 'Cancel',
        ok: 'OK',
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info',
        copyright: 'All rights reserved',
        format_pptx: 'PPT',
        format_pdf: 'PDF',
        format_docx: 'Word',
        format_xlsx: 'Excel',
        format_png: 'Image',
        format_md: 'Markdown',
        format_html: 'HTML',
        format_json: 'JSON',
        format_unknown: 'Unknown',
        back: 'Back',
        processing: 'Processing',
        completed: 'Completed',
        failed: 'Failed'
    }
};

// 辅助函数：为 API 路径添加 access_key
function apiUrl(path) {
    const accessKey = getAccessKey();
    if (!accessKey) return path;
    const separator = path.includes('?') ? '&' : '?';
    return path + separator + 'access_key=' + encodeURIComponent(accessKey);
}

// 获取访问密钥
function getAccessKey() {
    return new URLSearchParams(window.location.search).get('access_key');
}

// 获取用户ID
function getUserId() {
    return new URLSearchParams(window.location.search).get('userid');
}

// 翻译函数
function t(key) {
    return i18nConfig[currentLanguage][key] || key;
}

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化...');
    initApp();
});

async function initApp() {
    console.log('初始化应用...');

 /*
    // 检查访问权限
     if (!getAccessKey()) {
         document.body.innerHTML = '<div style="text-align: center; margin-top: 100px;"><h2>请提供访问密钥</h2></div>';
         return;
     }

     // 检查用户ID
     if (!getUserId()) {
         document.body.innerHTML = '<div style="text-align: center; margin-top: 100px;"><h2>请提供用户ID</h2></div>';
         return;
     }
 */

    // 使用内置的国际化配置
    i18nData = i18nConfig;

    // 初始化语言
    const savedLanguage = localStorage.getItem('docagent_language') || 'zh';
    currentLanguage = savedLanguage;
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }

    // 加载用户信息
    loadUserFromStorage();
    updateUserUI();

    // 初始化UI
    updateLanguage();

    // 等待DOM完全准备好后再初始化事件
    setTimeout(() => {
        initFileUpload();
        initEventListeners();

        // 加载任务列表
        if (currentUser) {
            loadTasks();
        }

        // 启动智能轮询
        startSmartPolling();
    }, 100);

    console.log('应用初始化完成');
}

function updateLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
}

// 认证相关方法
function loadUserFromStorage() {
    const userStr = localStorage.getItem('docagent_user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.expires_at && user.expires_at > Date.now()) {
                currentUser = user;
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

function updateUserUI() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const userAvatar = document.getElementById('userAvatar');
    const userEmail = document.getElementById('userEmail');

    if (currentUser) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (userInfo) userInfo.classList.remove('hidden');

        if (userAvatar && userEmail) {
            const initial = currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U';
            userAvatar.textContent = initial;
            userEmail.textContent = currentUser.email || '';
        }
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (userInfo) userInfo.classList.add('hidden');
    }
}

// 登录相关函数
async function sendVerificationCode() {
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) {
        showMessage('请输入邮箱地址', 'error');
        return;
    }

    const sendBtn = document.getElementById('sendCodeBtn');
    const originalText = sendBtn.textContent;
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<div class="loading"><div class="loading-spinner"></div>发送中...</div>';

    try {
        const response = await fetch(authApiBase + '/send-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (result.success) {
            showMessage(t('code_sent_message'), 'success');
            document.getElementById('emailStep').classList.add('hidden');
            document.getElementById('codeStep').classList.remove('hidden');
            document.getElementById('loginCode').focus();
        } else {
            showMessage(result.message || '发送失败', 'error');
        }
    } catch (error) {
        showMessage('网络错误，请重试', 'error');
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = originalText;
    }
}

async function verifyCode() {
    const email = document.getElementById('loginEmail').value.trim();
    const code = document.getElementById('loginCode').value.trim();

    if (!code) {
        showMessage('请输入验证码', 'error');
        return;
    }

    const verifyBtn = document.getElementById('verifyCodeBtn');
    const originalText = verifyBtn.textContent;
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = '<div class="loading"><div class="loading-spinner"></div>验证中...</div>';

    try {
        const response = await fetch(authApiBase + '/verify-code', {
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

            currentUser = user;
            localStorage.setItem('docagent_user', JSON.stringify(user));
            updateUserUI();
            closeLoginModal();
            showMessage(t('login_success'), 'success');
            loadTasks();
        } else {
            showMessage(result.message || '验证失败', 'error');
        }
    } catch (error) {
        showMessage('网络错误，请重试', 'error');
    } finally {
        verifyBtn.disabled = false;
        verifyBtn.textContent = originalText;
    }
}

async function handleLogout() {
    if (currentUser && currentUser.token) {
        try {
            await fetch(authApiBase + '/logout', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + currentUser.token,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            // 忽略登出API错误
        }
    }

    currentUser = null;
    localStorage.removeItem('docagent_user');
    updateUserUI();
    showMessage(t('logout_success'), 'success');

    // 清空任务列表
    const tasksList = document.getElementById('tasksList');
    if (tasksList) tasksList.innerHTML = '';

    const noTasks = document.getElementById('noTasks');
    if (noTasks) noTasks.classList.remove('hidden');
}

// 文件上传相关方法
function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    if (!uploadArea || !fileInput) {
        console.error('上传区域或文件输入元素未找到');
        return;
    }

    uploadArea.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        handleFileSelection(files);
    });

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileSelection(files);
    });
}

function handleFileSelection(files) {
    files.forEach(file => {
        if (file.size > 50 * 1024 * 1024) {
            showMessage(t('file_too_large'), 'error');
            return;
        }

        if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
            selectedFiles.push(file);
        }
    });

    updateFileList();
}

function updateFileList() {
    const fileList = document.getElementById('fileList');
    if (!fileList) return;

    if (selectedFiles.length === 0) {
        fileList.classList.add('hidden');
        return;
    }

    fileList.classList.remove('hidden');
    fileList.innerHTML = selectedFiles.map((file, index) => \`
        <div class="file-item">
            <div class="file-info">
                <span class="file-name">\${file.name}</span>
                <span class="file-size">(\${formatFileSize(file.size)})</span>
            </div>
            <button class="btn btn-sm btn-danger" onclick="removeFile(\${index})" type="button">
                <i data-feather="x"></i>
            </button>
        </div>
    \`).join('');

    // 重新渲染图标
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateFileList();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US');
}

// 模态框方法
function showModal(title, content, actions = [], type = 'info') {
    const modal = document.getElementById('genericModal');
    const modalTitle = document.getElementById('genericModalTitle');
    const modalBody = document.getElementById('genericModalBody');
    const modalActions = document.getElementById('genericModalActions');

    if (!modal || !modalTitle || !modalBody || !modalActions) return;

    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modalActions.innerHTML = '';

    actions.forEach(action => {
        const button = document.createElement('button');
        button.className = \`btn \${action.className || 'btn-secondary'}\`;
        button.textContent = action.text;
        button.type = 'button';
        button.onclick = action.onClick;
        modalActions.appendChild(button);
    });

    modal.classList.add('show');

    // 重新渲染图标
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function closeGenericModal() {
    const modal = document.getElementById('genericModal');
    if (modal) modal.classList.remove('show');
}

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
        document.getElementById('emailStep').classList.remove('hidden');
        document.getElementById('codeStep').classList.add('hidden');
        document.getElementById('loginEmail').focus();
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('show');
}

function showMessage(message, type = 'success') {
    const actions = [{
        text: t('ok') || '确定',
        className: 'btn-primary',
        onClick: () => closeGenericModal()
    }];

    showModal(t(type) || type, message, actions, type);
}

function showConfirm(message, onConfirm, onCancel) {
    const actions = [
        {
            text: t('cancel') || '取消',
            className: 'btn-secondary',
            onClick: onCancel || (() => closeGenericModal())
        },
        {
            text: t('confirm') || '确定',
            className: 'btn-primary',
            onClick: onConfirm
        }
    ];

    showModal(t('confirm') || '确认', message, actions, 'warning');
}

function requireLogin() {
    if (!currentUser) {
        showLoginModal();
        return false;
    }
    return true;
}

// 事件监听器初始化
function initEventListeners() {
    // 语言切换
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function(e) {
            currentLanguage = e.target.value;
            localStorage.setItem('docagent_language', currentLanguage);
            updateLanguage();
        });
    }

    // 登录按钮
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginModal();
        });
    }

    // 退出按钮
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    // 发送验证码按钮
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sendVerificationCode();
        });
    }

    // 验证码按钮
    const verifyCodeBtn = document.getElementById('verifyCodeBtn');
    if (verifyCodeBtn) {
        verifyCodeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            verifyCode();
        });
    }

    // 返回按钮
    const backToEmailBtn = document.getElementById('backToEmailBtn');
    if (backToEmailBtn) {
        backToEmailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('emailStep').classList.remove('hidden');
            document.getElementById('codeStep').classList.add('hidden');
        });
    }

    // 生成文档按钮
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            generateDocument();
        });
    }

    // 刷新按钮
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadTasks(true);
        });
    }

    // 加载更多按钮
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage++;
            loadTasks();
        });
    }

    // 模态框背景点击关闭
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });

    // 键盘事件
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeGenericModal();
            closeLoginModal();
        }
    });

    // 登录表单回车事件
    const loginEmail = document.getElementById('loginEmail');
    const loginCode = document.getElementById('loginCode');

    if (loginEmail) {
        loginEmail.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendVerificationCode();
            }
        });
    }

    if (loginCode) {
        loginCode.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifyCode();
            }
        });
    }
}

// 任务管理方法
async function generateDocument() {
    if (!requireLogin()) return;

    const promptInput = document.getElementById('promptInput');
    const prompt = promptInput ? promptInput.value.trim() : '';

    if (selectedFiles.length === 0 && !prompt) {
        showMessage(t('files_or_prompt_required'), 'error');
        return;
    }

    if (isUploading) return;

    isUploading = true;
    const generateBtn = document.getElementById('generateBtn');
    const originalText = generateBtn.textContent;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<div class="loading"><div class="loading-spinner"></div>' + t('uploading') + '</div>';

    try {
        const formData = new FormData();
        formData.append('user_prompt', prompt);
        formData.append('userid', getUserId());

        selectedFiles.forEach((file, index) => {
            formData.append('file_' + index, file);
        });

        const response = await fetch(apiUrl('/api/upload'), {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showTaskSubmittedSuccess(result.task_id);
            selectedFiles = [];
            updateFileList();
            if (promptInput) promptInput.value = '';
        } else {
            if (result.error === 'COOLDOWN_ACTIVE') {
                showMessage(t('cooldown_wait_hint'), 'warning');
            } else {
                showMessage(t('upload_failed') + ': ' + result.error, 'error');
            }
        }

    } catch (error) {
        showMessage(t('upload_failed') + ': ' + error.message, 'error');
    } finally {
        isUploading = false;
        generateBtn.disabled = false;
        generateBtn.textContent = originalText;
    }
}

function showTaskSubmittedSuccess(taskId) {
    const content = \`
        <div class="success-animation">
            <div class="success-icon">
                <i data-feather="check-circle" style="width: 64px; height: 64px; color: var(--success-color);"></i>
            </div>
            <h3>\${t('task_submitted')}</h3>
            <p>\${t('task_submitted_message')}</p>
            <p><strong>Task ID:</strong> \${taskId}</p>
            <div id="autoReturnCountdown" style="margin-top: 1rem; color: var(--text-muted);"></div>
        </div>
    \`;

    const actions = [{
        text: t('return_to_list'),
        className: 'btn-primary',
        onClick: () => {
            closeGenericModal();
            loadTasks();
        }
    }];

    showModal(t('success'), content, actions, 'success');

    // 重新渲染图标
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // 倒计时自动返回
    let countdown = 4;
    const countdownElement = document.getElementById('autoReturnCountdown');

    const updateCountdown = () => {
        if (countdownElement) {
            countdownElement.textContent = countdown + ' ' + t('auto_return_seconds');
            countdown--;

            if (countdown < 0) {
                closeGenericModal();
                loadTasks();
                return;
            }
        }
        setTimeout(updateCountdown, 1000);
    };

    updateCountdown();
}

// 任务加载函数
async function loadTasks(reset = false) {
    if (reset) {
        currentPage = 1;
        const tasksList = document.getElementById('tasksList');
        if (tasksList) tasksList.innerHTML = '';
    }

    try {
        const response = await fetch(
            apiUrl(\`/api/tasks?userid=\${getUserId()}&page=\${currentPage}&limit=10\`)
        );

        const result = await response.json();

        if (result.success) {
            const tasksList = document.getElementById('tasksList');
            const noTasks = document.getElementById('noTasks');
            const loadMoreBtn = document.getElementById('loadMoreBtn');

            if (result.data.tasks.length === 0 && currentPage === 1) {
                if (noTasks) noTasks.classList.remove('hidden');
                if (tasksList) tasksList.innerHTML = '';
            } else {
                if (noTasks) noTasks.classList.add('hidden');

                if (reset && tasksList) {
                    tasksList.innerHTML = '';
                }

                result.data.tasks.forEach(task => {
                    if (tasksList) {
                        tasksList.appendChild(createTaskElement(task));
                    }
                });
            }

            hasMoreTasks = result.data.has_more;
            if (loadMoreBtn) {
                if (hasMoreTasks) {
                    loadMoreBtn.classList.remove('hidden');
                } else {
                    loadMoreBtn.classList.add('hidden');
                }
            }

            // 检查是否有待处理任务
            const hasPendingTasks = result.data.tasks.some(task =>
                task.status === 'processing' || task.status === 'created' || task.status === 'ai_thinking'
            );

            if (hasPendingTasks) {
                startPolling();
            } else {
                stopPolling();
            }

            // 重新渲染图标
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

    } catch (error) {
        console.error('Failed to load tasks:', error);
    }
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.innerHTML = \`
        <div class="task-header">
            <div class="task-info">
                <div class="task-id">ID: \${task.task_id}</div>
                <div class="task-note" onclick="editNote('\${task.task_id}', this)">\${task.note || t('no_note')}</div>
                <div class="task-meta">
                    <span>\${formatDate(task.created_at)}</span>
                    <span class="task-status \${task.status}">
                        \${task.status_text || task.status}
                    </span>
                    <span>\${t('format_' + task.file_format)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: \${task.progress}%"></div>
                </div>
            </div>
            <div class="task-actions">
                \${task.status === 'completed' && task.filename ?
                    \`<button class="btn btn-success btn-sm" onclick="downloadFile('\${task.task_id}')" type="button">
                        <i data-feather="download"></i>
                        \${t('download')}
                    </button>\` : ''
                }
                <button class="btn btn-danger btn-sm" onclick="deleteTask('\${task.task_id}')" type="button">
                    <i data-feather="trash-2"></i>
                    \${t('delete')}
                </button>
            </div>
        </div>
    \`;

    return taskElement;
}

async function downloadFile(taskId) {
    try {
        const response = await fetch(apiUrl(\`/api/download?task_id=\${taskId}\`));

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
        } else {
            showMessage(t('download_failed'), 'error');
        }
    } catch (error) {
        showMessage(t('download_failed') + ': ' + error.message, 'error');
    }
}

function deleteTask(taskId) {
    showConfirm(t('confirm_delete'), async () => {
        try {
            const response = await fetch(
                apiUrl(\`/api/delete?task_id=\${taskId}&userid=\${getUserId()}\`),
                { method: 'DELETE' }
            );

            const result = await response.json();

            if (result.success) {
                showMessage(t('delete_success'), 'success');
                loadTasks(true);
            } else {
                showMessage(t('delete_failed') + ': ' + result.error, 'error');
            }
        } catch (error) {
            showMessage(t('delete_failed') + ': ' + error.message, 'error');
        }

        closeGenericModal();
    });
}

function editNote(taskId, element) {
    const currentNote = element.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentNote === t('no_note') ? '' : currentNote;
    input.className = 'form-input';
    input.style.width = '100%';

    const saveNote = async () => {
        try {
            const response = await fetch(apiUrl('/api/update-note'), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task_id: taskId,
                    note: input.value,
                    userid: getUserId()
                })
            });

            const result = await response.json();

            if (result.success) {
                element.textContent = input.value || t('no_note');
                element.style.display = 'block';
                input.remove();
            } else {
                showMessage(t('update_failed'), 'error');
            }
        } catch (error) {
            showMessage(t('update_failed') + ': ' + error.message, 'error');
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
function startPolling() {
    if (pollInterval) return;

    pollInterval = setInterval(async () => {
        if (!getUserId()) return;

        try {
            const response = await fetch(
                apiUrl(\`/api/check-pending?userid=\${getUserId()}\`)
            );

            const result = await response.json();

            if (result.success && result.data.updated_tasks > 0) {
                loadTasks(true);
            }
        } catch (error) {
            console.error('Polling error:', error);
        }
    }, 5000);
}

function stopPolling() {
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
}

// 智能轮询系统
function startSmartPolling() {
    // 每30秒检查一次是否有待处理任务
    pendingCheckTimer = setInterval(async () => {
        try {
            const response = await fetch(apiUrl(\`/api/has-pending?userid=\${getUserId()}\`));
            const result = await response.json();

            if (result.success) {
                const hadActiveTasks = hasActiveTasks;
                hasActiveTasks = result.has_pending;

                if (hasActiveTasks && !hadActiveTasks) {
                    startFrequentPolling();
                } else if (!hasActiveTasks && hadActiveTasks) {
                    stopFrequentPolling();
                }
            }
        } catch (error) {
            // 忽略错误
        }
    }, 30000);
}

function startFrequentPolling() {
    if (smartPollingTimer) return;

    smartPollingTimer = setInterval(async () => {
        try {
            const response = await fetch(apiUrl(\`/api/check-pending?userid=\${getUserId()}\`));
            const result = await response.json();

            if (result.success && result.data.updated_tasks > 0) {
                loadTasks(true);
            }
        } catch (error) {
            // 忽略错误
        }
    }, 10000);
}

function stopFrequentPolling() {
    if (smartPollingTimer) {
        clearInterval(smartPollingTimer);
        smartPollingTimer = null;
    }
}

// 暴露全局函数
window.showLoginModal = showLoginModal;
window.closeLoginModal = closeLoginModal;
window.closeGenericModal = closeGenericModal;
window.removeFile = removeFile;
window.downloadFile = downloadFile;
window.deleteTask = deleteTask;
window.editNote = editNote;
window.sendVerificationCode = sendVerificationCode;
window.verifyCode = verifyCode;
window.handleLogout = handleLogout;
window.generateDocument = generateDocument;
window.loadTasks = loadTasks;

console.log('JavaScript 文件加载完成');
`;
}

async function handleLogo(env: CloudflareEnv): Promise<Response> {
  // 创建一个简单的 SVG logo
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#ff6b35"/>
      <path d="M12 14h16v2H12v-2zm0 4h16v2H12v-2zm0 4h12v2H12v-2z" fill="white"/>
      <path d="M26 22l4 4-4 4v-8z" fill="white"/>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000'
    }
  });
}