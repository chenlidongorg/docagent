// ========== src/handlers/tasks.ts - 部分修改 ==========
export async function handleTasks(
  request: Request,
  env: CloudflareEnv,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userid');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  // 🔥 如果没有userid，返回空列表而不是错误
  if (!userId) {
    return createSuccessResponse({
      tasks: [],
      total: 0,
      page: page,
      limit: limit,
      has_more: false
    });
  }

  // 其余代码保持不变...
  try {
    // 获取总数
    const countStmt = env.D1.prepare('SELECT COUNT(*) as total FROM pptaiagent WHERE userid = ? AND hasdeleted = 0');
    const countResult = await countStmt.bind(userId).first();
    const total = countResult?.total as number || 0;

    // 查询任务列表
    const stmt = env.D1.prepare(`
      SELECT taskid, filename, note, createat, status
      FROM pptaiagent
      WHERE userid = ? AND hasdeleted = 0
      ORDER BY createat DESC
      LIMIT ? OFFSET ?
    `);
    const { results } = await stmt.bind(userId, limit, offset).all();

    // 动态检查远程API状态
    const tasksWithStatus = await Promise.all(results.map(async (task: any) => {
      let status: TaskStatusType = TaskStatus.PROCESSING;
      let realTimeNote = task.note;
      let statusText = '';
      let progress = 0;

      const hasValidFilename = task.filename && task.filename.trim() !== '';
      const isCompletedByStatus = task.status === TaskStatus.COMPLETED;
      const hasCompletionNote = task.note && (
        task.note.includes('已生成') ||
        task.note.includes('完成') ||
        task.note.includes('成功') ||
        task.note.includes('generated') ||
        task.note.includes('completed') ||
        task.note.includes('finished')
      );

      if (hasValidFilename || isCompletedByStatus || hasCompletionNote) {
        status = TaskStatus.COMPLETED;
        statusText = '已完成';
        progress = 100;

        if (hasValidFilename && task.status !== TaskStatus.COMPLETED) {
          ctx.waitUntil(updateTaskStatus(env, task.taskid, userId, realTimeNote, TaskStatus.COMPLETED));
        }
      } else if (task.note && (
        task.note.includes('失败') ||
        task.note.includes('超时') ||
        task.note.includes('Failed') ||
        task.note.includes('Error')
      )) {
        status = TaskStatus.FAILED;
        statusText = '失败';
        progress = 0;
      } else {
        try {
          const response = await fetch(`https://docapi.endlessai.org/api/v1/tasks/${task.taskid}`, {
            headers: {
              'X-API-Key': env.PPT_AI_AGENT_API_KEY
            }
          });

          if (response.ok) {
            const result = await response.json();
            status = result.status;
            progress = result.progress || 0;

            switch(result.status) {
              case TaskStatus.CREATED:
                statusText = '任务创建中';
                realTimeNote = '任务已创建，等待AI智能体处理';
                progress = 5;
                break;
              case TaskStatus.AI_THINKING:
                statusText = 'AI分析中';
                realTimeNote = 'AI智能体正在分析需求并选择最佳文档格式';
                progress = 30;
                break;
              case TaskStatus.PROCESSING:
                statusText = '正在生成';
                realTimeNote = 'AI智能体正在生成文档内容';
                progress = 70;
                break;
              case TaskStatus.COMPLETED:
                status = TaskStatus.COMPLETED;
                statusText = '已完成';
                progress = 100;
                if (result.result_url) {
                  realTimeNote = result.note || 'AI智能体任务完成';
                  ctx.waitUntil(updateTaskWithFilename(env, task.taskid, userId, result.result_url, realTimeNote));
                }
                break;
              case TaskStatus.FAILED:
                status = TaskStatus.FAILED;
                statusText = '失败';
                progress = 0;
                realTimeNote = result.note || '任务处理失败';
                ctx.waitUntil(updateTaskStatus(env, task.taskid, userId, realTimeNote, status));
                break;
              default:
                statusText = '处理中';
                realTimeNote = result.note || '任务正在处理中';
                progress = result.progress || 50;
            }

            if (result.status !== TaskStatus.COMPLETED &&
                (result.note !== task.note || result.status !== task.status)) {
              ctx.waitUntil(updateTaskStatus(env, task.taskid, userId, result.note || realTimeNote, result.status));
            }
          }
        } catch (error) {
          statusText = '处理中';
          progress = 50;
        }
      }

      let fileFormat = 'unknown';
      if (task.filename) {
        const ext = task.filename.split('.').pop()?.toLowerCase();
        fileFormat = ext || 'unknown';
      }

      return {
        task_id: task.taskid,
        filename: task.filename,
        note: realTimeNote,
        created_at: task.createat,
        file_format: fileFormat,
        status: status,
        status_text: statusText,
        progress: progress
      };
    }));

    return createSuccessResponse({
      tasks: tasksWithStatus,
      total: total,
      page: page,
      limit: limit,
      has_more: offset + limit < total
    });

  } catch (error) {
    return createErrorResponse('Failed to fetch tasks', 500);
  }
}

// 🔥 修改其他需要userid的API，都采用类似处理
export async function handleHasPending(
  request: Request,
  env: CloudflareEnv
): Promise<Response> {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userid');

  // 🔥 如果没有userid，返回false而不是错误
  if (!userId) {
    return createSuccessResponse({
      has_pending: false,
      pending_count: 0
    });
  }

  try {
    const stmt = env.D1.prepare(`
      SELECT COUNT(*) as count FROM pptaiagent
      WHERE userid = ?
      AND hasdeleted = 0
      AND (filename = '' OR filename IS NULL)
      AND (
        note NOT LIKE '%失败%' AND
        note NOT LIKE '%超时%' AND
        note NOT LIKE '%Failed%' AND
        note NOT LIKE '%Error%'
      )
    `);
    const result = await stmt.bind(userId).first();

    return createSuccessResponse({
      has_pending: (result?.count as number || 0) > 0,
      pending_count: result?.count as number || 0
    });

  } catch (error) {
    return createErrorResponse('Failed to check pending tasks', 500);
  }
}

export async function handleCheckPending(
  request: Request,
  env: CloudflareEnv,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userid');

  // 🔥 如果没有userid，返回空结果而不是错误
  if (!userId) {
    return createSuccessResponse({
      message: 'No user specified',
      checked_tasks: 0,
      updated_tasks: 0
    });
  }

  // 其余代码保持不变...
  try {
    const stmt = env.D1.prepare(`
      SELECT taskid, note FROM pptaiagent
      WHERE userid = ?
      AND hasdeleted = 0
      AND (filename = '' OR filename IS NULL)
      AND (
        note NOT LIKE '%失败%' AND
        note NOT LIKE '%超时%' AND
        note NOT LIKE '%Failed%' AND
        note NOT LIKE '%Error%'
      )
      ORDER BY createat DESC
      LIMIT 20
    `);
    const { results } = await stmt.bind(userId).all();

    let updatedTasks = 0;

    const concurrentLimit = 3;
    for (let i = 0; i < results.length; i += concurrentLimit) {
      const batch = results.slice(i, i + concurrentLimit);
      const promises = batch.map(task => checkAndUpdateSingleTask(env, task, userId));

      const batchResults = await Promise.allSettled(promises);
      const batchUpdated = batchResults.filter(result =>
        result.status === 'fulfilled' && result.value === true
      ).length;

      updatedTasks += batchUpdated;

      if (i + concurrentLimit < results.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return createSuccessResponse({
      message: 'Pending tasks checked',
      checked_tasks: results.length,
      updated_tasks: updatedTasks
    });

  } catch (error) {
    return createErrorResponse('Failed to check pending tasks', 500);
  }
}