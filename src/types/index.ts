export type KyronStyle =
  | 'cyber-brutalism'
  | 'scrollytelling'
  | 'kinetic-typography'
  | 'glass-aurora'
  | 'neo-brutalism';

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
  secondaryStyles: KyronStyle[];
  blendRatio: number;
  colors: ColorPalette;
  typography: TypographyScale;
  threeD: ThreeDConfig;
  motion: MotionConfig;
  sections: SiteSection[];
  brandPersonality: string[];
  needsAuth?: boolean;
  hasBlog?: boolean;
}

export interface ClarificationMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  type?: 'question' | 'answer' | 'options' | 'plan' | 'result';
  options?: string[];
}

export interface ReasoningChunk {
  type: 'thought' | 'action' | 'progress' | 'complete';
  content: string;
}

export interface ProjectFile {
  path: string;
  content: string;
}

export interface GeneratedProject {
  files: ProjectFile[];
  structure: string;
}

export interface DeployResult {
  repoUrl: string;
  pagesUrl: string;
  success: boolean;
  message: string;
}
