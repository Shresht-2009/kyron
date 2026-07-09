import { groqChat, type GroqMessage } from './groq';
import type { DesignBrief, KyronStyle } from '@/types';

const STYLE_OPTIONS: { id: KyronStyle; name: string; desc: string }[] = [
  { id: 'cyber-brutalism', name: 'Cyber-Brutalism', desc: 'Neon glitch, raw, bold, dark' },
  { id: 'scrollytelling', name: 'Scrollytelling', desc: 'Narrative scroll, parallax, chapters' },
  { id: 'kinetic-typography', name: 'Kinetic Typography', desc: 'Animated text, morphing headlines' },
  { id: 'glass-aurora', name: 'Glass + Aurora', desc: 'Frosted glass, gradient orbs, smooth' },
  { id: 'neo-brutalism', name: 'Neo-Brutalism', desc: 'Heavy shadows, bold borders, contrast' },
];

export async function clarifyPrompt(
  messages: { role: string; content: string }[],
  questionCount: number
): Promise<string> {
  if (questionCount === 0) {
    return "What's your project or business called, and what do you do? (Even a one-word answer works — I'll build the rest.)";
  }
  if (questionCount >= 3) return 'DESIGN_BRIEF_READY';

  const last = messages.filter(m => m.role === 'user').pop()?.content || '';

  const topics = [
    'who is this for? (target audience, e.g. "small businesses", "gamers", "creatives")',
    `what vibe do you want? (pick 1-2: cyber-brutalism, scrollytelling, kinetic-typography, glass-aurora, neo-brutalism — or describe the feeling)`,
    'what are the 2-3 most important things your website needs to communicate?',
  ];

  const prompt = `You are Kyron, an AI design director. The user says: "${last}"

Pick ONE unanswered question from this list and ask it:
${topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Ask only that one question. Keep it conversational. No intro, no explanation.`;

  const res = await groqChat([{ role: 'system', content: prompt }], {
    model: 'llama-3.3-70b-versatile', temperature: 0.5, maxTokens: 256,
  });
  return res.trim();
}

const GENERATE_PROMPT = `You are Kyron's senior design engine. Your job: generate a COMPLETE, RICH, SPECIFIC design brief JSON from the user's input — even if they gave almost nothing.

RULES:
1. If the user gave minimal info (just a name or one sentence), INVENT EVERYTHING. Make reasonable, creative assumptions based on the name/industry.
2. Every field must be filled with CONCRETE, SPECIFIC content — not generic or vague text.
3. The headline and tagline must be punchy and brand-specific (e.g. "Brewed Different" for a coffee brand, not "Welcome to Our Site").
4. Features must describe 3-4 REAL-SOUNDING capabilities with benefits, not generic bullet points (e.g. "AI-powered roast profiling ensures every batch tastes exactly as intended").
5. The about paragraph must tell a short, compelling brand story.
6. CTA must be action-oriented and specific to the brand.
7. Pick the best style from: cyber-brutalism, scrollytelling, kinetic-typography, glass-aurora, neo-brutalism. Match the brand personality.
8. Choose secondaryStyles (0-2) and blendRatio thoughtfully to create interesting style blends.
9. brandPersonality must be 3-5 specific adjectives that fit the brand.
10. needsAuth and hasBlog: set to true only if it makes sense for the brand type.

OUTPUT SCHEMA (fill ALL fields — no empty values):
{
  "siteName": "string",
  "tagline": "short powerful tagline",
  "description": "2 specific sentences about what they do",
  "industry": "string",
  "targetAudience": "string",
  "style": "one of the 5 styles",
  "secondaryStyles": ["array of 0-2 other styles"],
  "blendRatio": "number 0-100",
  "brandPersonality": ["3-5 specific adjectives"],
  "needsAuth": "boolean",
  "hasBlog": "boolean",
  "sections": [
    {"id":"hero","type":"hero","content":{"headline":"brand-specific headline","subtitle":"supporting sentence","cta":"action button text"}},
    {"id":"features","type":"features","content":{"items":["specific feature 1 with benefit","specific feature 2 with benefit","specific feature 3 with benefit","specific feature 4 with benefit"]}},
    {"id":"about","type":"about","content":{"paragraph":"compelling brand story (3-4 sentences)"}},
    {"id":"cta","type":"cta","content":{"headline":"persuasive headline","buttonText":"action text"}},
    {"id":"footer","type":"footer","content":{"text":"copyright and brand line"}}
  ]
}

REMEMBER: Even with 1 word of input, output a FULL brief. Invent creatively. Never return empty or generic placeholders.`;

export async function generateDesignBrief(
  history: { role: string; content: string }[]
): Promise<DesignBrief> {
  const userMsgs = history.filter(m => m.role === 'user').map(m => m.content).join('\n');

  const raw = JSON.parse(await groqChat([
    { role: 'system', content: GENERATE_PROMPT },
    { role: 'user', content: `User said:\n${userMsgs}\n\nGenerate brief JSON.` },
  ], { model: 'llama-3.3-70b-versatile', temperature: 0.6, maxTokens: 4096, jsonMode: true }));

  const brief: DesignBrief = {
    ...raw,
    secondaryStyles: raw.secondaryStyles || [],
    needsAuth: raw.needsAuth ?? false,
    hasBlog: raw.hasBlog ?? false,
    colors: getColors(raw.style, raw.secondaryStyles || []),
    typography: getType(raw.style),
    threeD: get3D(raw.style),
    motion: getMotion(raw.style),
  };
  return brief;
}

function getColors(primary: KyronStyle, secondary: KyronStyle[]): DesignBrief['colors'] {
  const palettes: Record<KyronStyle, DesignBrief['colors']> = {
    'cyber-brutalism': { primary: '#ff0055', secondary: '#00f0ff', accent: '#ffdd00', background: '#0a0a0a', surface: '#1a1a1a', text: '#ffffff', muted: '#888888' },
    scrollytelling: { primary: '#6c5ce7', secondary: '#a29bfe', accent: '#fd79a8', background: '#0d0d1a', surface: '#1a1a2e', text: '#f0f0ff', muted: '#7a7a9a' },
    'kinetic-typography': { primary: '#ffffff', secondary: '#ff6b6b', accent: '#ffd93d', background: '#000000', surface: '#111111', text: '#ffffff', muted: '#666666' },
    'glass-aurora': { primary: '#7c3aed', secondary: '#06b6d4', accent: '#f472b6', background: '#050510', surface: 'rgba(255,255,255,0.05)', text: '#ffffff', muted: '#8888aa' },
    'neo-brutalism': { primary: '#ffdd00', secondary: '#ff3366', accent: '#00ccff', background: '#ffffff', surface: '#f5f5f5', text: '#000000', muted: '#666666' },
  };
  const p = palettes[primary];
  if (!secondary?.length) return p;
  const s = palettes[secondary[0]];
  if (!s) return p;
  return {
    primary: blend(p.primary, s.primary, 0.4),
    secondary: blend(p.secondary, s.secondary, 0.4),
    accent: blend(p.accent, s.accent, 0.4),
    background: p.background,
    surface: p.surface,
    text: p.text,
    muted: p.muted,
  };
}

function blend(a: string, b: string, r: number): string {
  const pa = a.match(/[\da-f]{2}/gi)?.map(v => parseInt(v, 16)) || [0,0,0];
  const pb = b.match(/[\da-f]{2}/gi)?.map(v => parseInt(v, 16)) || [0,0,0];
  return `#${[0,1,2].map(i => Math.round(pa[i]*(1-r)+pb[i]*r).toString(16).padStart(2,'0')).join('')}`;
}

function getType(s: KyronStyle): DesignBrief['typography'] {
  const m: Record<KyronStyle, DesignBrief['typography']> = {
    'cyber-brutalism': { headingFont: "'Space Grotesk',sans-serif", bodyFont: "'DM Mono',monospace", headingWeight: '700', baseSize: '16px', scaleRatio: '1.25' },
    scrollytelling: { headingFont: "'Playfair Display',serif", bodyFont: "'Inter',sans-serif", headingWeight: '600', baseSize: '16px', scaleRatio: '1.25' },
    'kinetic-typography': { headingFont: "'Clash Display',sans-serif", bodyFont: "'Satoshi',sans-serif", headingWeight: '500', baseSize: '18px', scaleRatio: '1.333' },
    'glass-aurora': { headingFont: "'Outfit',sans-serif", bodyFont: "'Outfit',sans-serif", headingWeight: '300', baseSize: '16px', scaleRatio: '1.25' },
    'neo-brutalism': { headingFont: "'Archivo Black',sans-serif", bodyFont: "'Archivo',sans-serif", headingWeight: '900', baseSize: '16px', scaleRatio: '1.2' },
  };
  return m[s];
}

function get3D(s: KyronStyle): DesignBrief['threeD'] {
  const m: Record<KyronStyle, DesignBrief['threeD']> = {
    'cyber-brutalism': { type: 'grid', color: '#ff0055', intensity: 'dramatic', interactive: true },
    scrollytelling: { type: 'particles', color: '#6c5ce7', intensity: 'moderate', interactive: true },
    'kinetic-typography': { type: 'geometric', color: '#ff6b6b', intensity: 'subtle', interactive: true },
    'glass-aurora': { type: 'wave', color: '#7c3aed', intensity: 'dramatic', interactive: false },
    'neo-brutalism': { type: 'none', color: '#ffdd00', intensity: 'subtle', interactive: false },
  };
  return m[s];
}

function getMotion(s: KyronStyle): DesignBrief['motion'] {
  const m: Record<KyronStyle, DesignBrief['motion']> = {
    'cyber-brutalism': { kineticTypography: true, scrollReveal: true, parallax: false, intensity: 'dramatic' },
    scrollytelling: { kineticTypography: false, scrollReveal: true, parallax: true, intensity: 'dramatic' },
    'kinetic-typography': { kineticTypography: true, scrollReveal: true, parallax: false, intensity: 'dramatic' },
    'glass-aurora': { kineticTypography: false, scrollReveal: true, parallax: true, intensity: 'moderate' },
    'neo-brutalism': { kineticTypography: false, scrollReveal: false, parallax: false, intensity: 'subtle' },
  };
  return m[s];
}
