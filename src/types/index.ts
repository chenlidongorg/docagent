export interface CloudflareEnv {
  PPT_AI_AGENT_API_KEY: string;
  ACCESS_KEY: string;
  BUCKET_NAME: string;
  R2_ACCESS_KEY: string;
  R2_SECRET_KEY: string;
  R2_ENDPOINT: string;
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
  user_id: string;
  constraints: {
    max_slides: number;
    include_animations: boolean;
    language: string;
  };
  storage: {
    type: string;
    bucket: string;
    access_key: string;
    secret_key: string;
    endpoint: string;
  };
}

export const TaskStatus = {
  CREATED: 'created',
  AI_THINKING: 'ai_thinking',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;

export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];