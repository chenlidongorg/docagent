// src/handlers/i18n.ts - 更新国际化配置
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

    // 文档创建
    create_document: '创建文档',
    drag_or_click: '拖拽文件到此处或点击选择文件(可选)',
    supported_formats: '支持 PDF, PNG, JPG, DOCX, PPTX, XLSX 等格式',
    document_requirements: '文档需求描述',
    requirements_placeholder: '请描述您希望生成的文档内容和格式要求（如未上传文件则必填）...',
    generate_document_btn: '开始生成',

    // 任务管理
    my_documents: '我的文档',
    no_document_records: '暂无文档记录',
    load_more: '加载更多',
    refresh: '刷新',
    download: '下载',
    delete: '删除',
    no_note: '无备注',

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
    file_too_large: '文件过大，最大支持50MB',
    files_or_prompt_required: '请上传文件或描述您的文档需求',
    cooldown_wait_hint: '请求过于频繁，请稍后再试',

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

    // 文档创建
    create_document: 'Create Document',
    drag_or_click: 'Drag files here or click to select (optional)',
    supported_formats: 'Supports PDF, PNG, JPG, DOCX, PPTX, XLSX formats',
    document_requirements: 'Document Requirements',
    requirements_placeholder: 'Please describe the content and format requirements for your document (required if no files uploaded)...',
    generate_document_btn: 'Start Generate',

    // 任务管理
    my_documents: 'My Documents',
    no_document_records: 'No document records',
    load_more: 'Load More',
    refresh: 'Refresh',
    download: 'Download',
    delete: 'Delete',
    no_note: 'No note',

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
    file_too_large: 'File too large, maximum 50MB supported',
    files_or_prompt_required: 'Please upload files or describe your document requirements',
    cooldown_wait_hint: 'Too frequent requests, please try again later',

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