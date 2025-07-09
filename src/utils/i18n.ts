// src/utils/i18n.ts
export const i18nConfig = {
  zh: {
    // Logo和标题
    doc_ai_agent: '文档生成智能体',
    doc_ai_agent_short: '文档智能体',

    // 登录相关
    login: '登录',
    logout: '退出',
    login_required: '请先登录',
    login_required_message: '您需要登录后才能使用文档生成服务',
    login_success: '登录成功',
    logout_success: '已退出登录',
    send_verification: '发送验证码',
    verify_code: '验证登录',
    email: '邮箱',
    verification_code: '验证码',
    email_placeholder: '请输入您的邮箱地址',
    code_placeholder: '请输入6位验证码',
    code_sent: '验证码已发送',
    code_sent_message: '验证码已发送到您的邮箱，请查收',
    invalid_code: '验证码无效或已过期',
    login_failed: '登录失败',
    back: '返回',

    // 文档创建
    create_document: '创建文档',
    drag_or_click: '拖拽文件到此处或点击选择文件(可选)',
    supported_formats: '支持 PDF, PNG, JPG, DOCX, PPTX, XLSX 等格式',
    document_requirements: '文档需求描述',
    requirements_placeholder: '请描述您希望生成的文档内容和格式要求（如未上传文件则必填）...',
    generate_document_btn: '开始生成',
    uploading: '上传中...',

    // 任务管理
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

    // 状态
    processing: '处理中',
    completed: '已完成',
    failed: '失败',

    // 文件格式
    format_pptx: 'PPT演示',
    format_pdf: 'PDF文档',
    format_docx: 'Word文档',
    format_xlsx: 'Excel表格',
    format_png: '图片',
    format_md: 'Markdown',
    format_html: '网页',
    format_json: 'JSON',
    format_unknown: '未知格式',

    // 消息
    upload_failed: '上传失败',
    download_failed: '下载失败',
    delete_failed: '删除失败',
    update_failed: '更新失败',
    delete_success: '删除成功',
    file_too_large: '文件过大，最大支持50MB',
    files_or_prompt_required: '请上传文件或描述您的文档需求',
    cooldown_wait_hint: '请求过于频繁，请稍后再试',
    confirm_delete: '确定要删除这个文档吗？',

    // 通用
    confirm: '确定',
    cancel: '取消',
    ok: '好的',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '提示',

    // 版权
    copyright: '版权所有'
  },
  en: {
    // Logo和标题
    doc_ai_agent: 'Document Generation Agent',
    doc_ai_agent_short: 'Doc Agent',

    // 登录相关
    login: 'Login',
    logout: 'Logout',
    login_required: 'Login Required',
    login_required_message: 'You need to login to use the document generation service',
    login_success: 'Login successful',
    logout_success: 'Logged out successfully',
    send_verification: 'Send Code',
    verify_code: 'Verify Login',
    email: 'Email',
    verification_code: 'Verification Code',
    email_placeholder: 'Please enter your email address',
    code_placeholder: 'Please enter 6-digit code',
    code_sent: 'Code Sent',
    code_sent_message: 'Verification code has been sent to your email',
    invalid_code: 'Invalid or expired code',
    login_failed: 'Login failed',
    back: 'Back',

    // 文档创建
    create_document: 'Create Document',
    drag_or_click: 'Drag files here or click to select (optional)',
    supported_formats: 'Supports PDF, PNG, JPG, DOCX, PPTX, XLSX formats',
    document_requirements: 'Document Requirements',
    requirements_placeholder: 'Please describe the content and format requirements for your document (required if no files uploaded)...',
    generate_document_btn: 'Start Generate',
    uploading: 'Uploading...',

    // 任务管理
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

    // 状态
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',

    // 文件格式
    format_pptx: 'PPT',
    format_pdf: 'PDF',
    format_docx: 'Word',
    format_xlsx: 'Excel',
    format_png: 'Image',
    format_md: 'Markdown',
    format_html: 'HTML',
    format_json: 'JSON',
    format_unknown: 'Unknown',

    // 消息
    upload_failed: 'Upload failed',
    download_failed: 'Download failed',
    delete_failed: 'Delete failed',
    update_failed: 'Update failed',
    delete_success: 'Delete successful',
    file_too_large: 'File too large, maximum 50MB supported',
    files_or_prompt_required: 'Please upload files or describe your document requirements',
    cooldown_wait_hint: 'Too frequent requests, please try again later',
    confirm_delete: 'Are you sure you want to delete this document?',

    // 通用
    confirm: 'Confirm',
    cancel: 'Cancel',
    ok: 'OK',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',

    // 版权
    copyright: 'All rights reserved'
  }
};