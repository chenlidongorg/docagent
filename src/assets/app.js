// ========== src/assets/app.js ==========
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

    // 文件上传相关方法 (保持原有逻辑)
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
        fileList.innerHTML = this.selectedFiles.map((file, index) => `
            <div class="file-item">
                <div class="file-info">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">(${this.formatFileSize(file.size)})</span>
                </div>
                <button class="btn btn-sm btn-danger" onclick="app.removeFile(${index})">
                    <i data-feather="x"></i>
                </button>
            </div>
        `).join('');

        feather.replace();
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

        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modalActions.innerHTML = '';

        actions.forEach(action => {
            const button = document.createElement('button');
            button.className = `btn ${action.className || 'btn-secondary'}`;
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

        // 登录表单回车事件
        document.getElementById('loginEmail').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendVerificationCode();
        });

        document.getElementById('loginCode').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.verifyCode();
        });
    }

    // 任务管理方法 (保持原有逻辑)
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
        const content = `
            <div class="success-animation">
                <div class="success-icon">✅</div>
                <h3>${this.t('task_submitted')}</h3>
                <p>${this.t('task_submitted_message')}</p>
                <p><strong>Task ID:</strong> ${taskId}</p>
                <div id="autoReturnCountdown" style="margin-top: 1rem; color: var(--text-muted);"></div>
            </div>
        `;

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

    // 任务相关方法 (保持原有代码不变)
    async loadTasks(reset = false) {
        if (!this.currentUser) return;

        if (reset) {
            this.currentPage = 1;
            document.getElementById('tasksList').innerHTML = '';
        }

        try {
            const response = await fetch(
                `/api/tasks?userid=${this.currentUser.user_id}&page=${this.currentPage}&limit=10&access_key=${this.getAccessKey()}`
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
        taskElement.innerHTML = `
            <div class="task-header">
                <div class="task-info">
                    <div class="task-id">ID: ${task.task_id}</div>
                    <div class="task-note" onclick="app.editNote('${task.task_id}', this)">${task.note || this.t('no_note')}</div>
                    <div class="task-meta">
                        <span>${this.formatDate(task.created_at)}</span>
                        <span class="task-status ${task.status}">
                            ${task.status_text || task.status}
                        </span>
                        <span>${this.t('format_' + task.file_format)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${task.progress}%"></div>
                    </div>
                </div>
                <div class="task-actions">
                    ${task.status === 'completed' && task.filename ?
                        `<button class="btn btn-success btn-sm" onclick="app.downloadFile('${task.task_id}')">
                            <i data-feather="download"></i>
                            ${this.t('download')}
                        </button>` : ''
                    }
                    <button class="btn btn-danger btn-sm" onclick="app.deleteTask('${task.task_id}')">
                        <i data-feather="trash-2"></i>
                        ${this.t('delete')}
                    </button>
                </div>
            </div>
        `;

        feather.replace();
        return taskElement;
    }

    async downloadFile(taskId) {
        try {
            const response = await fetch(`/api/download?task_id=${taskId}&access_key=${this.getAccessKey()}`);

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
                    `/api/delete?task_id=${taskId}&userid=${this.currentUser.user_id}&access_key=${this.getAccessKey()}`,
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
        const currentNote = element.textContent;
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
                    element.textContent = input.value || this.t('no_note');
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
                    `/api/check-pending?userid=${this.currentUser.user_id}&access_key=${this.getAccessKey()}`
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