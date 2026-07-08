import { groqChat, type GroqMessage } from './groq';
import type { DesignBrief, KyronStyle } from '@/types';

const STYLE_DESCRIPTIONS = [
  { id: 'cyber-brutalism' as KyronStyle, name: 'Cyber-Brutalism', desc: 'Neon glitch. Oversized type. Raw grids. Dark.' },
  { id: 'scrollytelling' as KyronStyle, name: 'Scrollytelling', desc: 'Narrative scroll. Parallax depth. Chapters.' },
  { id: 'kinetic-typography' as KyronStyle, name: 'Kinetic Typography', desc: 'Animated letters. Morphing headlines.' },
  { id: 'glass-aurora' as KyronStyle, name: 'Glass + Aurora', desc: 'Frosted glass. Gradient orbs. Smooth blur.' },
  { id: 'neo-brutalism' as KyronStyle, name: 'Neo-Brutalism', desc: 'Heavy shadows. Thick borders. High contrast.' },
];

export async function clarifyPrompt(
  messages: { role: string; content: string }[],
  questionCount: number
): Promise<string> {
  const userMessages = messages.filter(m => m.role === 'user');
  const lastUserMessage = userMessages[userMessages.length - 1]?.content || '';

  if (questionCount === 0) {
    return "What's the name of your project or business, and what do you do in one sentence?";
  }

  if (questionCount >= 3) {
    return 'DESIGN_BRIEF_READY';
  }

  const topics = [
    'what industry or field are you in?',
    'who is your target audience?',
    `what style do you want? Options: ${STYLE_DESCRIPTIONS.map(s => `${s.name} (${s.desc})`).join(', ')}`,
    'do you want 3D elements on the page?',
    'what sections do you need? (hero, features, about, contact, etc.)',
    'do users need to create accounts / log in?',
  ];

  const prompt = `You are Kyron, an AI design director. The user said: "${lastUserMessage}"

Based on what they've said so far, pick the SINGLE most relevant question from this list that hasn't been answered yet:
${topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Ask ONLY that one question. No introductions. No explanations. Just the question.`;

  const groqMessages: GroqMessage[] = [
    { role: 'system', content: prompt },
  ];

  const response = await groqChat(groqMessages, {
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
    maxTokens: 256,
  });

  return response.trim();
}

const SYSTEM_PROMPT_GENERATE = `You are Kyron's design engine. Based on the conversation below, generate a design brief in JSON.

Output ONLY valid JSON with this exact schema:
{
  "siteName": "string",
  "tagline": "string (short, one line)",
  "description": "string (2 sentences)",
  "industry": "string",
  "targetAudience": "string",
  "style": "one of: cyber-brutalism, scrollytelling, kinetic-typography, glass-aurora, neo-brutalism",
  "secondaryStyle": "null or a style name",
  "blendRatio": "number 0-100",
  "brandPersonality": ["array of 3-5 words"],
  "needsAuth": "boolean",
  "hasBlog": "boolean",
  "sections": [
    {
      "id": "hero",
      "type": "hero",
      "content": { "headline": "string", "subtitle": "string", "cta": "string" }
    },
    {
      "id": "features",
      "type": "features",
      "content": { "items": ["array of 3-4 feature descriptions"] }
    },
    {
      "id": "about",
      "type": "about",
      "content": { "paragraph": "string" }
    },
    {
      "id": "cta",
      "type": "cta",
      "content": { "headline": "string", "buttonText": "string" }
    },
    {
      "id": "footer",
      "type": "footer",
      "content": { "text": "string" }
    }
  ]
}

Make content creative and specific to the user's project. Always choose a style that fits.`;

export async function generateDesignBrief(
  conversationHistory: { role: string; content: string }[]
): Promise<DesignBrief> {
  const userMessages = conversationHistory
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join('\n');

  const groqMessages: GroqMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT_GENERATE },
    { role: 'user', content: `Here is what the user told me:\n\n${userMessages}\n\nGenerate the design brief JSON.` },
  ];

  const response = await groqChat(groqMessages, {
    model: 'llama-3.3-70b-versatile',
    temperature: 0.6,
    maxTokens: 4096,
    jsonMode: true,
  });

  const raw = JSON.parse(response);
  const brief: DesignBrief = {
    ...raw,
    needsAuth: raw.needsAuth ?? false,
    hasBlog: raw.hasBlog ?? false,
    colors: getColorsForStyle(raw.style, raw.secondaryStyle, raw.blendRatio),
    typography: getTypographyForStyle(raw.style),
    threeD: getThreeDConfig(raw.style),
    motion: getMotionConfig(raw.style),
  };

  return brief;
}

function getColorsForStyle(primary: KyronStyle, secondary: KyronStyle | null, blendRatio: number): DesignBrief['colors'] {
  const palettes: Record<KyronStyle, DesignBrief['colors']> = {
    'cyber-brutalism': { primary: '#ff0055', secondary: '#00f0ff', accent: '#ffdd00', background: '#0a0a0a', surface: '#1a1a1a', text: '#ffffff', muted: '#888888' },
    scrollytelling: { primary: '#6c5ce7', secondary: '#a29bfe', accent: '#fd79a8', background: '#0d0d1a', surface: '#1a1a2e', text: '#f0f0ff', muted: '#7a7a9a' },
    'kinetic-typography': { primary: '#ffffff', secondary: '#ff6b6b', accent: '#ffd93d', background: '#000000', surface: '#111111', text: '#ffffff', muted: '#666666' },
    'glass-aurora': { primary: '#7c3aed', secondary: '#06b6d4', accent: '#f472b6', background: '#050510', surface: 'rgba(255,255,255,0.05)', text: '#ffffff', muted: '#8888aa' },
    'neo-brutalism': { primary: '#ffdd00', secondary: '#ff3366', accent: '#00ccff', background: '#ffffff', surface: '#f5f5f5', text: '#000000', muted: '#666666' },
  };

  const p = palettes[primary];
  if (!secondary || blendRatio === 0) return p;

  const s = palettes[secondary];
  const r = blendRatio / 100;
  return {
    primary: blendColors(p.primary, s.primary, r),
    secondary: blendColors(p.secondary, s.secondary, r),
    accent: blendColors(p.accent, s.accent, r),
    background: r > 0.5 ? s.background : p.background,
    surface: r > 0.5 ? s.surface : p.surface,
    text: r > 0.5 ? s.text : p.text,
    muted: r > 0.5 ? s.muted : p.muted,
  };
}

function blendColors(a: string, b: string, r: number): string {
  const parse = (c: string) => c.match(/[\da-f]{2}/gi)?.map(v => parseInt(v, 16)) || [0, 0, 0];
  const ca = parse(a), cb = parse(b);
  return `#${[0,1,2].map(i => Math.round(ca[i] * (1 - r) + cb[i] * r).toString(16).padStart(2, '0')).join('')}`;
}

function getTypographyForStyle(style: KyronStyle): DesignBrief['typography'] {
  const map: Record<KyronStyle, DesignBrief['typography']> = {
    'cyber-brutalism': { headingFont: "'Space Grotesk', sans-serif", bodyFont: "'DM Mono', monospace", headingWeight: '700', baseSize: '16px', scaleRatio: '1.25' },
    scrollytelling: { headingFont: "'Playfair Display', serif", bodyFont: "'Inter', sans-serif", headingWeight: '600', baseSize: '16px', scaleRatio: '1.25' },
    'kinetic-typography': { headingFont: "'Clash Display', sans-serif", bodyFont: "'Satoshi', sans-serif", headingWeight: '500', baseSize: '18px', scaleRatio: '1.333' },
    'glass-aurora': { headingFont: "'Outfit', sans-serif", bodyFont: "'Outfit', sans-serif", headingWeight: '300', baseSize: '16px', scaleRatio: '1.25' },
    'neo-brutalism': { headingFont: "'Archivo Black', sans-serif", bodyFont: "'Archivo', sans-serif", headingWeight: '900', baseSize: '16px', scaleRatio: '1.2' },
  };
  return map[style];
}

function getThreeDConfig(style: KyronStyle): DesignBrief['threeD'] {
  const map: Record<KyronStyle, DesignBrief['threeD']> = {
    'cyber-brutalism': { type: 'grid', color: '#ff0055', intensity: 'dramatic', interactive: true },
    scrollytelling: { type: 'particles', color: '#6c5ce7', intensity: 'moderate', interactive: true },
    'kinetic-typography': { type: 'geometric', color: '#ff6b6b', intensity: 'subtle', interactive: true },
    'glass-aurora': { type: 'wave', color: '#7c3aed', intensity: 'dramatic', interactive: false },
    'neo-brutalism': { type: 'none', color: '#ffdd00', intensity: 'subtle', interactive: false },
  };
  return map[style];
}

function getMotionConfig(style: KyronStyle): DesignBrief['motion'] {
  const map: Record<KyronStyle, DesignBrief['motion']> = {
    'cyber-brutalism': { kineticTypography: true, scrollReveal: true, parallax: false, intensity: 'dramatic' },
    scrollytelling: { kineticTypography: false, scrollReveal: true, parallax: true, intensity: 'dramatic' },
    'kinetic-typography': { kineticTypography: true, scrollReveal: true, parallax: false, intensity: 'dramatic' },
    'glass-aurora': { kineticTypography: false, scrollReveal: true, parallax: true, intensity: 'moderate' },
    'neo-brutalism': { kineticTypography: false, scrollReveal: false, parallax: false, intensity: 'subtle' },
  };
  return map[style];
}
