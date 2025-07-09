import { CloudflareEnv } from '../types';

export async function handleAssets(request: Request, env: CloudflareEnv): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // 处理静态资源
  if (path === '/assets/styles.css') {
    return new Response(await getStylesCSS(), {
      headers: { 'Content-Type': 'text/css' }
    });
  }

  if (path === '/assets/app.js') {
    return new Response(await getAppJS(), {
      headers: { 'Content-Type': 'application/javascript' }
    });
  }

  if (path === '/assets/logo.png') {
    return handleLogo(env);
  }

  return new Response('Not Found', { status: 404 });
}

async function getStylesCSS(): Promise<string> {
  // 这里返回样式内容，实际部署时应该从文件系统读取
  return `/* 样式内容将在部署时从 styles.css 文件读取 */`;
}

async function getAppJS(): Promise<string> {
  // 这里返回JS内容，实际部署时应该从文件系统读取
  return `/* JavaScript内容将在部署时从 app.js 文件读取 */`;
}

async function handleLogo(env: CloudflareEnv): Promise<Response> {
  try {
    // 从 R2 存储读取 logo 文件
    const object = await env.R2.get('assets/logo.png');

    if (!object) {
      return new Response('Logo not found', { status: 404 });
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  } catch (error) {
    return new Response('Logo not found', { status: 404 });
  }
}