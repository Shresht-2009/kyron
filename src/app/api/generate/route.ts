import { NextRequest, NextResponse } from 'next/server';
import { generateFullStackProject } from '@/lib/codegen/fullstack';
import { storeSite, generateId } from '@/lib/site-store';
import type { DesignBrief } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brief } = body as { brief: DesignBrief };

    if (!brief?.siteName || !brief?.style) {
      return NextResponse.json(
        { error: 'Invalid design brief. siteName and style are required.' },
        { status: 400 }
      );
    }

    const files = generateFullStackProject(brief);
    const filesRecord: Record<string, string> = {};
    let mainHtml = '';

    for (const f of files) {
      filesRecord[f.path] = f.content;
      if (f.path.endsWith('/index.html') || f.path === 'index.html') {
        if (!mainHtml) mainHtml = f.content;
      }
    }

    if (!mainHtml) mainHtml = files[0]?.content || '';

    // Store for local preview
    const siteId = generateId();
    storeSite(siteId, brief.siteName, filesRecord);

    return NextResponse.json({
      html: mainHtml,
      files: filesRecord,
      structure: files.map(f => f.path).join('\n'),
      siteId,
      previewUrl: `/api/preview/${siteId}/`,
      success: true,
    });
  } catch (error: any) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate site' },
      { status: 500 }
    );
  }
}
