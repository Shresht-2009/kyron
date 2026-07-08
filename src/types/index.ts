export type KyronStyle =
  | 'cyber-brutalism'
  | 'scrollytelling'
  | 'kinetic-typography'
  | 'glass-aurora'
  | 'neo-brutalism';

export interface StyleDefinition {
  id: KyronStyle;
  name: string;
  description: string;
  vibe: string;
  colors: ColorPalette;
  typography: TypographyScale;
  threeD: ThreeDConfig;
  motion: MotionConfig;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
}

export interface TypographyScale {
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  baseSize: string;
  scaleRatio: string;
}

export interface ThreeDConfig {
  type: 'particles' | 'geometric' | 'wireframe-globe' | 'wave' | 'grid' | 'none';
  color: string;
  intensity: 'subtle' | 'moderate' | 'dramatic';
  interactive: boolean;
}

export interface MotionConfig {
  kineticTypography: boolean;
  scrollReveal: boolean;
  parallax: boolean;
  intensity: 'subtle' | 'moderate' | 'dramatic';
}

export interface SiteSection {
  id: string;
  type: 'hero' | 'features' | 'about' | 'cta' | 'footer';
  content: Record<string, string | string[]>;
}

export interface DesignBrief {
  siteName: string;
  tagline: string;
  description: string;
  industry: string;
  targetAudience: string;
  style: KyronStyle;
  secondaryStyle: KyronStyle | null;
  blendRatio: number;
  colors: ColorPalette;
  typography: TypographyScale;
  threeD: ThreeDConfig;
  motion: MotionConfig;
  sections: SiteSection[];
  brandPersonality: string[];
}

export interface ClarificationMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  type?: 'question' | 'answer' | 'options' | 'plan' | 'result';
  options?: string[];
}

export interface GenerationProgress {
  phase: string;
  progress: number;
  message: string;
}

export interface GeneratedSite {
  html: string;
  css: string;
  js: string;
  files: Record<string, string>;
}

export interface DeployResult {
  repoUrl: string;
  pagesUrl: string;
  success: boolean;
  message: string;
}
