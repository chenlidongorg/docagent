// src/handlers/i18n.ts
import { CloudflareEnv } from '../types';
import { createSuccessResponse } from '../utils/response';
import { i18nConfig } from '../utils/i18n';

export function handleI18n(request: Request, env: CloudflareEnv): Response {
  return createSuccessResponse(i18nConfig);
}