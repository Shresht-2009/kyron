import { groqChat, type GroqMessage } from './groq';
import type { DesignBrief, KyronStyle } from '@/types';

const STYLE_DESCRIPTIONS = {
  'cyber-brutalism': 'Bold, raw, neon-glitch aesthetic with oversized typography, CRT scanlines, and high-contrast grid layouts. Dark and aggressive.',
  'scrollytelling': 'Narrative-driven design with parallax depth layers, chapter-based scrolling, progress indicators, and animated reveals as user scrolls.',
  'kinetic-typography': 'Text-first design where headlines and content animate, morph, and respond to scroll position. Dynamic lettering and split-text animations.',
  'glass-aurora': 'Frosted glass surfaces with backdrop blur, floating gradient orbs, smooth transparency layers, and soft glowing elements on dark backgrounds.',
  'neo-brutalism': 'Heavy drop shadows, thick geometric borders, high-contrast color blocks, asymmetrical layouts, and bold sans-serif typography.',
} as const;

function buildClarifySystemPrompt(context: { messages: { role: string; content: string }[] }): string {
  const messageCount = context.messages.filter(m => m.role === 'user').length;

  if (messageCount === 0) {
    return `You are Kyron, an AI design director. You help users build stunning websites.

Ask ONE question at a time. Start with the most important question.

Your first question should be: "What's the name of your project or business, and what do you do in one sentence?"

Keep your response brief and conversational. No formatting, no bullet points.`;
  }

  return `You are Kyron, an AI design director. You are having a conversation with a user to gather enough information to design their website.

You've already gathered some context. Ask the NEXT most important unanswered question.

Cycle through these topics in order, but only ask about what you haven't covered yet:
1. What they do / their industry
2. Their target audience
3. Their preferred style (show them options: cyber-brutalism, scrollytelling, kinetic-typography, glass-aurora, neo-brutalism)
4. Whether they want a secondary style blended in
5. Whether they want 3D elements on the page
6. What sections they need (hero, features, about, contact, etc.)

Keep asking ONE question at a time. Be conversational and excited about their project.

Style options with short descriptions:
- Cyber-Brutalism: neon glitch, raw, bold, dark
- Scrollytelling: narrative scroll, parallax, chapters
- Kinetic Typography: animated text, morphing headlines
- Glass + Aurora: frosted glass, gradient orbs, smooth
- Neo-Brutalism: heavy shadows, bold borders, high contrast

When you have ALL the information needed, respond with EXACTLY: "DESIGN_BRIEF_READY"`;
}

const SYSTEM_PROMPT_GENERATE = `You are Kyron's design engine. Based on the user's answers, generate a complete design brief in JSON format.

Output ONLY valid JSON with this exact schema:
{
  "siteName": "string",
  "tagline": "string (one line)",
  "description": "string (2-3 sentences)",
  "industry": "string",
  "targetAudience": "string",
  "style": "one of: cyber-brutalism, scrollytelling, kinetic-typography, glass-aurora, neo-brutalism",
  "secondaryStyle": "null or one of the styles above",
  "blendRatio": "number 0-100 (how much secondary style blends in, 0 if no secondary)",
  "brandPersonality": ["3-5 words describing the brand feel"],
  "sections": [
    {
      "id": "hero",
      "type": "hero",
      "content": {
        "headline": "string",
        "subtitle": "string",
        "cta": "string (call to action text)"
      }
    },
    {
      "id": "features",
      "type": "features",
      "content": {
        "items": ["array of 3-4 feature descriptions"]
      }
    },
    {
      "id": "about",
      "type": "about",
      "content": {
        "paragraph": "string (about the business)"
      }
    },
    {
      "id": "cta",
      "type": "cta",
      "content": {
        "headline": "string",
        "buttonText": "string"
      }
    },
    {
      "id": "footer",
      "type": "footer",
      "content": {
        "text": "string (copyright or tagline)"
      }
    }
  ]
}

Make the content creative, compelling, and tailored to the user's project. The style choice should match what the user described they want.`;

export async function clarifyPrompt(
  messages: { role: string; content: string }[]
): Promise<string> {
  const systemPrompt = buildClarifySystemPrompt({ messages });

  const system: GroqMessage = { role: 'system', content: systemPrompt };
  const history: GroqMessage[] = messages.slice(-6).map(m => ({
    role: m.role as 'system' | 'user' | 'assistant',
    content: m.content,
  }));
  const groqMessages = [system, ...history];

  const response = await groqChat(groqMessages, {
    model: 'mixtral-8x7b-32768',
    temperature: 0.7,
    maxTokens: 1024,
  });

  return response.trim();
}

export async function generateDesignBrief(
  conversationHistory: { role: string; content: string }[]
): Promise<DesignBrief> {
  const userMessages = conversationHistory
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join('\n');

  const groqMessages: GroqMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT_GENERATE },
    { role: 'user', content: `Here is the conversation with the user:\n\n${userMessages}\n\nGenerate the design brief JSON.` },
  ];

  const response = await groqChat(groqMessages, {
    model: 'mixtral-8x7b-32768',
    temperature: 0.6,
    maxTokens: 4096,
    jsonMode: true,
  });

  const brief = JSON.parse(response) as DesignBrief;

  brief.colors = getColorsForStyle(brief.style, brief.secondaryStyle, brief.blendRatio);
  brief.typography = getTypographyForStyle(brief.style);
  brief.threeD = getThreeDConfig(brief.style);
  brief.motion = getMotionConfig(brief.style);

  return brief;
}

function getColorsForStyle(primary: KyronStyle, secondary: KyronStyle | null, blendRatio: number): DesignBrief['colors'] {
  const palettes: Record<KyronStyle, DesignBrief['colors']> = {
    'cyber-brutalism': {
      primary: '#ff0055', secondary: '#00f0ff', accent: '#ffdd00',
      background: '#0a0a0a', surface: '#1a1a1a', text: '#ffffff', muted: '#888888',
    },
    scrollytelling: {
      primary: '#6c5ce7', secondary: '#a29bfe', accent: '#fd79a8',
      background: '#0d0d1a', surface: '#1a1a2e', text: '#f0f0ff', muted: '#7a7a9a',
    },
    'kinetic-typography': {
      primary: '#ffffff', secondary: '#ff6b6b', accent: '#ffd93d',
      background: '#000000', surface: '#111111', text: '#ffffff', muted: '#666666',
    },
    'glass-aurora': {
      primary: '#7c3aed', secondary: '#06b6d4', accent: '#f472b6',
      background: '#050510', surface: 'rgba(255,255,255,0.05)', text: '#ffffff', muted: '#8888aa',
    },
    'neo-brutalism': {
      primary: '#ffdd00', secondary: '#ff3366', accent: '#00ccff',
      background: '#ffffff', surface: '#f5f5f5', text: '#000000', muted: '#666666',
    },
  };

  const primaryPalette = palettes[primary];
  if (!secondary || blendRatio === 0) return primaryPalette;

  const secondaryPalette = palettes[secondary];
  const blend = blendRatio / 100;

  return {
    primary: blendColors(primaryPalette.primary, secondaryPalette.primary, blend),
    secondary: blendColors(primaryPalette.secondary, secondaryPalette.secondary, blend),
    accent: blendColors(primaryPalette.accent, secondaryPalette.accent, blend),
    background: blendRatio > 50 ? secondaryPalette.background : primaryPalette.background,
    surface: blendRatio > 50 ? secondaryPalette.surface : primaryPalette.surface,
    text: blendRatio > 50 ? secondaryPalette.text : primaryPalette.text,
    muted: blendRatio > 50 ? secondaryPalette.muted : primaryPalette.muted,
  };
}

function blendColors(a: string, b: string, ratio: number): string {
  const parse = (c: string) => {
    const match = c.match(/[\da-f]{2}/gi);
    return match ? match.map(v => parseInt(v, 16)) : [0, 0, 0];
  };
  const ca = parse(a);
  const cb = parse(b);
  const r = Math.round(ca[0] * (1 - ratio) + cb[0] * ratio);
  const g = Math.round(ca[1] * (1 - ratio) + cb[1] * ratio);
  const b2 = Math.round(ca[2] * (1 - ratio) + cb[2] * ratio);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b2.toString(16).padStart(2, '0')}`;
}

function getTypographyForStyle(style: KyronStyle): DesignBrief['typography'] {
  const typographies: Record<KyronStyle, DesignBrief['typography']> = {
    'cyber-brutalism': {
      headingFont: "'Space Grotesk', sans-serif",
      bodyFont: "'DM Mono', monospace",
      headingWeight: '700',
      baseSize: '16px',
      scaleRatio: '1.25',
    },
    scrollytelling: {
      headingFont: "'Playfair Display', serif",
      bodyFont: "'Inter', sans-serif",
      headingWeight: '600',
      baseSize: '16px',
      scaleRatio: '1.25',
    },
    'kinetic-typography': {
      headingFont: "'Clash Display', sans-serif",
      bodyFont: "'Satoshi', sans-serif",
      headingWeight: '500',
      baseSize: '18px',
      scaleRatio: '1.333',
    },
    'glass-aurora': {
      headingFont: "'Outfit', sans-serif",
      bodyFont: "'Outfit', sans-serif",
      headingWeight: '300',
      baseSize: '16px',
      scaleRatio: '1.25',
    },
    'neo-brutalism': {
      headingFont: "'Archivo Black', sans-serif",
      bodyFont: "'Archivo', sans-serif",
      headingWeight: '900',
      baseSize: '16px',
      scaleRatio: '1.2',
    },
  };
  return typographies[style];
}

function getThreeDConfig(style: KyronStyle): DesignBrief['threeD'] {
  const configs: Record<KyronStyle, DesignBrief['threeD']> = {
    'cyber-brutalism': { type: 'grid', color: '#ff0055', intensity: 'dramatic', interactive: true },
    scrollytelling: { type: 'particles', color: '#6c5ce7', intensity: 'moderate', interactive: true },
    'kinetic-typography': { type: 'geometric', color: '#ff6b6b', intensity: 'subtle', interactive: true },
    'glass-aurora': { type: 'wave', color: '#7c3aed', intensity: 'dramatic', interactive: false },
    'neo-brutalism': { type: 'none', color: '#ffdd00', intensity: 'subtle', interactive: false },
  };
  return configs[style];
}

function getMotionConfig(style: KyronStyle): DesignBrief['motion'] {
  const configs: Record<KyronStyle, DesignBrief['motion']> = {
    'cyber-brutalism': { kineticTypography: true, scrollReveal: true, parallax: false, intensity: 'dramatic' },
    scrollytelling: { kineticTypography: false, scrollReveal: true, parallax: true, intensity: 'dramatic' },
    'kinetic-typography': { kineticTypography: true, scrollReveal: true, parallax: false, intensity: 'dramatic' },
    'glass-aurora': { kineticTypography: false, scrollReveal: true, parallax: true, intensity: 'moderate' },
    'neo-brutalism': { kineticTypography: false, scrollReveal: false, parallax: false, intensity: 'subtle' },
  };
  return configs[style];
}
