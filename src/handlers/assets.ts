// src/handlers/assets.ts
import { CloudflareEnv } from '../types';

export async function handleAssets(request: Request, env: CloudflareEnv): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/assets/styles.css') {
    return new Response(getStylesCSS(), {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (path === '/assets/app.js') {
    return new Response(getAppJS(), {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (path === '/assets/logo.png') {
    // 返回一个简单的SVG图标作为fallback
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline></svg>`;
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  return new Response('Not Found', { status: 404 });
}

function getStylesCSS(): string {
  return `/* CSS 内容 - 将您的 public/assets/styles.css 内容复制到这里 */
:root {
  --primary-color: #ff6b35;
  --secondary-color: #1a1a1a;
  --accent-color: #007bff;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
  --text-color: #ffffff;
  --text-muted: #6c757d;
  --border-color: rgba(51, 51, 51, 0.8);
  --bg-color: #000000;
  --card-bg: rgba(26, 26, 26, 0.95);
  --input-bg: rgba(51, 51, 51, 0.8);
  --hover-bg: rgba(255, 255, 255, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.header {
  background: rgba(26, 26, 26, 0.95);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
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
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.lang-selector {
  background: var(--input-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
}

/* Main Content */
.main-content {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

.upload-section {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.upload-section h2 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.upload-area:hover {
  border-color: var(--primary-color);
  background: var(--hover-bg);
}

.upload-area.drag-over {
  border-color: var(--primary-color);
  background: var(--hover-bg);
}

.upload-icon i {
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.file-input {
  display: none;
}

.file-list {
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.file-item:last-child {
  border-bottom: none;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 500;
  color: var(--text-color);
}

.file-size {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

/* Form Elements */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  user-select: none;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: #e55a2b;
}

.btn-secondary {
  background: var(--secondary-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--hover-bg);
}

.btn-success {
  background: var(--success-color);
  color: white;
}

.btn-success:hover {
  background: #218838;
}

.btn-danger {
  background: var(--danger-color);
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.1rem;
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

.generate-btn-container {
  text-align: center;
  margin-top: 2rem;
}

/* Tasks Section */
.tasks-section {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.tasks-title {
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-item {
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.task-item:hover {
  background: var(--hover-bg);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.task-info {
  flex: 1;
}

.task-id {
  font-family: monospace;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.task-note {
  color: var(--text-color);
  margin: 0.5rem 0;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.task-note:hover {
  background: var(--hover-bg);
}

.task-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.task-meta span {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.task-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.task-status.processing {
  background: var(--info-color);
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

.task-status.created {
  background: var(--warning-color);
  color: black;
}

.task-status.ai_thinking {
  background: var(--accent-color);
  color: white;
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
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  transition: width 0.3s ease;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.task-actions .btn i {
  width: 14px;
  height: 14px;
}

/* Modal */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal.show {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalShow 0.3s ease;
}

@keyframes modalShow {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.modal-close:hover {
  background: var(--hover-bg);
}

.modal-body {
  padding: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* Loading */
.loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Success Animation */
.success-animation {
  text-align: center;
  padding: 2rem;
}

.success-animation .success-icon {
  margin-bottom: 1rem;
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* Footer */
.footer {
  background: var(--card-bg);
  border-top: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-top: 2rem;
}

.footer-content {
  text-align: center;
  color: var(--text-muted);
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

.text-primary {
  color: var(--primary-color);
}

.text-success {
  color: var(--success-color);
}

.text-danger {
  color: var(--danger-color);
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
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
  }

  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .upload-area {
    padding: 2rem 1rem;
  }

  .btn {
    padding: 0.5rem 1rem;
  }

  .btn-lg {
    padding: 0.75rem 1.5rem;
  }
}`;
}

function getAppJS(): string {
  return `// 这里放置您的 public/assets/app.js 的完整内容
// 由于内容太长，我建议您将 public/assets/app.js 的内容复制到这里

// 或者使用一个简化版本先测试
console.log('App.js loaded successfully');

// 全局变量
let currentLanguage = 'zh';
let selectedFiles = [];
let isUploading = false;
let currentPage = 1;
let hasMoreTasks = false;
let pollInterval = null;
let currentUser = null;
let i18nData = null;

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化...');

    // 渲染图标
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    console.log('JavaScript 加载成功');
});

// 暴露一些基本函数给全局使用
window.showLoginModal = function() {
    console.log('显示登录模态框');
};

window.closeLoginModal = function() {
    console.log('关闭登录模态框');
};

window.closeGenericModal = function() {
    console.log('关闭通用模态框');
};
`;
}