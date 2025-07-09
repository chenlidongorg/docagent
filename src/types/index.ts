// ========== src/types/index.ts ==========
export interface CloudflareEnv {
  PPT_AI_AGENT_API_KEY: string;
  D1: D1Database;
  R2: R2Bucket;
}

export interface TaskData {
  taskid: string;
  filename: string;
  note: string;
  createat: number;
  status: string;
  hasdeleted: number;
  userid: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FileData {
  filename: string;
  content: string;
  content_type: string;
}

export interface UploadRequest {
  files: FileData[];
  user_prompt: string;
  user_id: string; //string = user_token //发送加密的 user_id
}

export interface UserInfo {
  token: string;
  user_id: string;
  email: string;
  username?: string;
  avatar?: string;
  created_at?: number;
  expires_at?: number;
}

export const TaskStatus = {
  CREATED: 'created',
  AI_THINKING: 'ai_thinking',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;

export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];