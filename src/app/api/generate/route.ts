import { NextRequest, NextResponse } from 'next/server';
import { generateSite } from '@/lib/codegen';
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

    const site = await generateSite(brief);

    return NextResponse.json({
      html: site.html,
      files: site.files,
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
