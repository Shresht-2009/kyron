import { NextRequest, NextResponse } from 'next/server';
import { getSite } from '@/lib/site-store';

function getMime(path: string): string {
  if (path.endsWith('.html')) return 'text/html;charset=utf-8';
  if (path.endsWith('.css')) return 'text/css;charset=utf-8';
  if (path.endsWith('.js')) return 'application/javascript;charset=utf-8';
  if (path.endsWith('.json')) return 'application/json;charset=utf-8';
  if (path.endsWith('.md')) return 'text/markdown;charset=utf-8';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  return 'text/plain;charset=utf-8';
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; path?: string[] }> }
) {
  const { id, path } = await params;
  const site = getSite(id);
  if (!site) {
    return new NextResponse('Site not found', { status: 404 });
  }

  let filePath = path?.join('/') || '';
  if (!filePath) filePath = 'index.html';

  let content = site.files[filePath];
  if (content === undefined && !filePath.endsWith('.html') && !filePath.includes('.')) {
    content = site.files[filePath + '/index.html'];
  }
  if (content === undefined && !filePath.endsWith('.html')) {
    content = site.files[filePath + '.html'];
  }
  if (content === undefined) {
    return new NextResponse('File not found: ' + filePath, { status: 404 });
  }

  return new NextResponse(content, {
    headers: {
      'Content-Type': getMime(filePath),
      'Access-Control-Allow-Origin': '*',
    },
  });
}
