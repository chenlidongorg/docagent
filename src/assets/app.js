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
const authApiBase = 'https://user.endlessai.org/api/auth';

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化...');
    initApp();
});

async function initApp() {
    console.log('初始化应用...');

    // 检查访问权限
    if (!getAccessKey()) {
        document.body.innerHTML = '<div style="text-align: center; margin-top: 100px;"><h2>请提供访问密钥</h2></div>';
        return;
    }

    // 加载国际化配置
    await loadI18n();

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
    initFileUpload();
    initEventListeners();

    // 加载任务列表
    if (currentUser) {
        loadTasks();
    }

    console.log('应用初始化完成');
}

async function loadI18n() {
    try {
        const response = await fetch('/api/i18n?access_key=' + getAccessKey());
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                i18nData = result.data;
                console.log('国际化配置加载成功');
            } else {
                throw new Error('API返回错误');
            }
        } else {
            throw new Error('HTTP错误: ' + response.status);
        }
    } catch (error) {
        console.error('加载国际化配置失败:', error);
        // 使用默认配置
        i18nData = {
            zh: {
                doc_ai_agent: '文档生成智能体',
                doc_ai_agent_short: '文档智能体',
                login: '登录',
                logout: '退出',
                create_document: '创建文档',
                my_documents: '我的文档',
                upload_failed: '上传失败',
                download_failed: '下载失败',
                confirm: '确定',
                cancel: '取消',
                ok: '好的',
                success: '成功',
                error: '错误',
                warning: '警告',
                info: '提示',
                copyright: '版权所有'
            },
            en: {
                doc_ai_agent: 'Document Generation Agent',
                doc_ai_agent_short: 'Doc Agent',
                login: 'Login',
                logout: 'Logout',
                create_document: 'Create Document',
                my_documents: 'My Documents',
                upload_failed: 'Upload failed',
                download_failed: 'Download failed',
                confirm: 'Confirm',
                cancel: 'Cancel',
                ok: 'OK',
                success: 'Success',
                error: 'Error',
                warning: 'Warning',
                info: 'Info',
                copyright: 'All rights reserved'
            }
        };
    }
}

function t(key) {
    if (!i18nData || !i18nData[currentLanguage]) {
        return key;
    }
    return i18nData[currentLanguage][key] || key;
}

function updateLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = t(key);
        if (text !== key) {
            element.textContent = text;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const text = t(key);
        if (text !== key) {
            element.placeholder = text;
        }
    });
}

function getAccessKey() {
    return new URLSearchParams(window.location.search).get('access_key');
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

    console.log('初始化文件上传功能');

    uploadArea.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('点击上传区域');
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
    console.log('处理文件选择:', files.length);

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
                ×
            </button>
        </div>
    \`).join('');
}

function removeFile(index) {
    console.log('删除文件:', index);
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
}

function closeGenericModal() {
    const modal = document.getElementById('genericModal');
    if (modal) modal.classList.remove('show');
}

function showLoginModal() {
    console.log('显示登录模态框');
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
    console.log('初始化事件监听器...');

    // 语言切换
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function(e) {
            console.log('语言切换:', e.target.value);
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
            console.log('登录按钮被点击');
            showLoginModal();
        });
    }

    // 退出按钮
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('退出按钮被点击');
            handleLogout();
        });
    }

    // 发送验证码按钮
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('发送验证码按钮被点击');
            sendVerificationCode();
        });
    }

    // 验证码按钮
    const verifyCodeBtn = document.getElementById('verifyCodeBtn');
    if (verifyCodeBtn) {
        verifyCodeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('验证码按钮被点击');
            verifyCode();
        });
    }

    // 返回按钮
    const backToEmailBtn = document.getElementById('backToEmailBtn');
    if (backToEmailBtn) {
        backToEmailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('返回按钮被点击');
            document.getElementById('emailStep').classList.remove('hidden');
            document.getElementById('codeStep').classList.add('hidden');
        });
    }

    // 生成文档按钮
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('生成按钮被点击');
            generateDocument();
        });
    }

    // 刷新按钮
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('刷新按钮被点击');
            loadTasks(true);
        });
    }

    // 加载更多按钮
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('加载更多按钮被点击');
            currentPage++;
            loadTasks();
        });
    }

    // 模态框背景点击关闭
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            console.log('点击模态框背景关闭');
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

    console.log('事件监听器初始化完成');
}

// 任务管理方法
async function generateDocument() {
    console.log('开始生成文档...');

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
    generateBtn.innerHTML = '<div class="loading"><div class="loading-spinner"></div>' + (t('uploading') || '上传中...') + '</div>';

    try {
        const formData = new FormData();
        formData.append('user_prompt', prompt);
        formData.append('userid', currentUser.user_id);

        selectedFiles.forEach((file, index) => {
            formData.append('file_' + index, file);
        });

        const response = await fetch('/api/upload?access_key=' + getAccessKey(), {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showTaskSubmittedSuccess(result.data.task_id);
            selectedFiles = [];
            updateFileList();
            if (promptInput) promptInput.value = '';
        } else {
            if (result.error === 'COOLDOWN_ACTIVE') {
                showMessage(t('cooldown_wait_hint'), 'warning');
            } else {
                showMessage((t('upload_failed') || '上传失败') + ': ' + result.error, 'error');
            }
        }

    } catch (error) {
        showMessage((t('upload_failed') || '上传失败') + ': ' + error.message, 'error');
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
                <div style="font-size: 64px; color: #22c55e;">✅</div>
            </div>
            <h3>\${t('task_submitted') || '任务提交成功！'}</h3>
            <p>\${t('task_submitted_message') || 'AI智能体正在分析您的需求并选择最佳文档格式。任务已进入队列处理，您可以离开页面稍后查看结果。'}</p>
            <p><strong>Task ID:</strong> \${taskId}</p>
            <div id="autoReturnCountdown" style="margin-top: 1rem; color: var(--text-muted);"></div>
        </div>
    \`;

    const actions = [{
        text: t('return_to_list') || '返回列表',
        className: 'btn-primary',
        onClick: () => {
            closeGenericModal();
            loadTasks();
        }
    }];

    showModal(t('success') || '成功', content, actions, 'success');

    // 倒计时自动返回
    let countdown = 4;
    const countdownElement = document.getElementById('autoReturnCountdown');

    const updateCountdown = () => {
        if (countdownElement) {
            countdownElement.textContent = countdown + ' ' + (t('auto_return_seconds') || '秒后自动返回');
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
    if (!currentUser) return;

    console.log('加载任务列表...');

    if (reset) {
        currentPage = 1;
        const tasksList = document.getElementById('tasksList');
        if (tasksList) tasksList.innerHTML = '';
    }

    try {
        const response = await fetch(
            \`/api/tasks?userid=\${currentUser.user_id}&page=\${currentPage}&limit=10&access_key=\${getAccessKey()}\`
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
                        📥 \${t('download')}
                    </button>\` : ''
                }
                <button class="btn btn-danger btn-sm" onclick="deleteTask('\${task.task_id}')" type="button">
                    🗑️ \${t('delete')}
                </button>
            </div>
        </div>
    \`;

    return taskElement;
}

async function downloadFile(taskId) {
    console.log('下载文件:', taskId);

    try {
        const response = await fetch(\`/api/download?task_id=\${taskId}&access_key=\${getAccessKey()}\`);

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
            showMessage(t('download_failed') || '下载失败', 'error');
        }
    } catch (error) {
        showMessage((t('download_failed') || '下载失败') + ': ' + error.message, 'error');
    }
}

function deleteTask(taskId) {
    console.log('删除任务:', taskId);

    showConfirm(t('confirm_delete') || '确定要删除这个文档吗？', async () => {
        try {
            const response = await fetch(
                \`/api/delete?task_id=\${taskId}&userid=\${currentUser.user_id}&access_key=\${getAccessKey()}\`,
                { method: 'DELETE' }
            );

            const result = await response.json();

            if (result.success) {
                showMessage(t('delete_success') || '删除成功', 'success');
                loadTasks(true);
            } else {
                showMessage((t('delete_failed') || '删除失败') + ': ' + result.error, 'error');
            }
        } catch (error) {
            showMessage((t('delete_failed') || '删除失败') + ': ' + error.message, 'error');
        }

        closeGenericModal();
    });
}

function editNote(taskId, element) {
    console.log('编辑备注:', taskId);

    const currentNote = element.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentNote === (t('no_note') || '无备注') ? '' : currentNote;
    input.className = 'form-input';
    input.style.width = '100%';

    const saveNote = async () => {
        try {
            const response = await fetch('/api/update-note?access_key=' + getAccessKey(), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task_id: taskId,
                    note: input.value,
                    userid: currentUser.user_id
                })
            });

            const result = await response.json();

            if (result.success) {
                element.textContent = input.value || (t('no_note') || '无备注');
                element.style.display = 'block';
                input.remove();
            } else {
                showMessage(t('update_failed') || '更新失败', 'error');
            }
        } catch (error) {
            showMessage((t('update_failed') || '更新失败') + ': ' + error.message, 'error');
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
        if (!currentUser) return;

        try {
            const response = await fetch(
                \`/api/check-pending?userid=\${currentUser.user_id}&access_key=\${getAccessKey()}\`
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

// 暴露全局函数（为了 onclick 事件）
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