import { NextRequest, NextResponse } from 'next/server';
import { clarifyPrompt, generateDesignBrief } from '@/lib/design-brief';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, action } = body as {
      messages: { role: string; content: string }[];
      action: 'ask' | 'generate';
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    if (action === 'generate') {
      const brief = await generateDesignBrief(messages);
      return NextResponse.json({ brief, ready: true });
    }

    const response = await clarifyPrompt(messages);
    const isReady = response.trim() === 'DESIGN_BRIEF_READY';

    if (isReady) {
      const brief = await generateDesignBrief(messages);
      return NextResponse.json({ brief, ready: true, message: 'I have enough information to design your site!' });
    }

    return NextResponse.json({
      message: response,
      ready: false,
    });
  } catch (error: any) {
    console.error('Clarify API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
