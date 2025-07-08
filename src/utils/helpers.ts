export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  try {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 8192;
    let result = '';

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      result += String.fromCharCode.apply(null, Array.from(chunk));
    }

    return btoa(result);
  } catch (error) {
    throw new Error('Failed to encode file content');
  }
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

export async function updateTaskStatus(
  env: { D1: D1Database },
  taskId: string,
  userId: string,
  note: string,
  status: string
): Promise<void> {
  try {
    const stmt = env.D1.prepare(`
      UPDATE pptaiagent
      SET note = ?, status = ?
      WHERE taskid = ? AND userid = ? AND hasdeleted = 0
    `);
    await stmt.bind(note, status, taskId, userId).run();
  } catch (error) {
    // 忽略错误
  }
}

export async function updateTaskWithFilename(
  env: { D1: D1Database },
  taskId: string,
  userId: string,
  filename: string,
  note: string
): Promise<void> {
  try {
    const stmt = env.D1.prepare(`
      UPDATE pptaiagent
      SET filename = ?, note = ?, status = 'completed'
      WHERE taskid = ? AND userid = ? AND hasdeleted = 0
    `);
    await stmt.bind(filename, note, taskId, userId).run();
  } catch (error) {
    // 忽略错误
  }
}