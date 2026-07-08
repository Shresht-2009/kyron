import { NextRequest, NextResponse } from 'next/server';
import { deployToGitHub } from '@/lib/deploy';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteName, files, githubToken } = body as {
      siteName: string;
      files: Record<string, string>;
      githubToken?: string;
    };

    if (!siteName || !files || !files['index.html']) {
      return NextResponse.json(
        { error: 'siteName and files with index.html are required' },
        { status: 400 }
      );
    }

    const result = await deployToGitHub(siteName, files, githubToken);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Deploy API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to deploy' },
      { status: 500 }
    );
  }
}
