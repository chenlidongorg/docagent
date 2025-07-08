import { ApiResponse } from '@/types';

export function createResponse<T>(data: ApiResponse<T>, status: number = 200, headers: HeadersInit = {}) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS, PUT',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    ...headers
  };

  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders
  });
}

export function createSuccessResponse<T>(data: T, message?: string) {
  return createResponse({ success: true, data, message });
}

export function createErrorResponse(error: string, status: number = 500, details?: string) {
  return createResponse(
    { success: false, error, details },
    status
  );
}

export function createOptionsResponse() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS, PUT',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}