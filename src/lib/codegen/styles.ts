import type { DesignBrief, KyronStyle } from '@/types';

export function generateCSS(brief: DesignBrief): string {
  const { colors, typography, style, motion } = brief;
  const base = generateBaseStyles(colors, typography);
  const styleSpecific = generateStyleSpecificCSS(style, colors, brief);
  const motionStyles = generateMotionCSS(motion);
  const responsive = generateResponsiveCSS();
  const customProps = generateCustomProperties(brief);
  return `${customProps}\n${base}\n${styleSpecific}\n${motionStyles}\n${responsive}`;
}

function generateCustomProperties(brief: DesignBrief): string {
  const { colors, typography } = brief;
  return `:root {
  --primary: ${colors.primary};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
  --bg: ${colors.background};
  --surface: ${colors.surface};
  --text: ${colors.text};
  --muted: ${colors.muted};
  --heading-font: ${typography.headingFont};
  --body-font: ${typography.bodyFont};
  --heading-weight: ${typography.headingWeight};
  --base-size: ${typography.baseSize};
}`;
}

function generateBaseStyles(colors: DesignBrief['colors'], typography: DesignBrief['typography']): string {
  return `
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=clash-display@400,500,600,700&f[]=space-grotesk@400,500,600,700&f[]=dm-mono@400&f[]=playfair-display@400,500,600,700&f[]=inter@400,500,600,700&f[]=outfit@300,400,500,600&f[]=archivo@400,500,600,700,800,900&f[]=archivo-black@400&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; font-size: var(--base-size); }

body {
  font-family: var(--body-font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading-font);
  font-weight: var(--heading-weight);
  line-height: 1.1;
}

h1 { font-size: clamp(2.5rem, 8vw, 5rem); }
h2 { font-size: clamp(2rem, 5vw, 3.5rem); }
h3 { font-size: clamp(1.25rem, 3vw, 1.75rem); }

p { font-size: clamp(1rem, 2vw, 1.125rem); color: var(--muted); max-width: 65ch; }

a { color: var(--primary); text-decoration: none; }
a:hover { opacity: 0.8; }

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 5vw, 4rem);
}

section {
  padding: clamp(4rem, 10vh, 8rem) 0;
  position: relative;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  font-family: var(--body-font);
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--primary) 40%, transparent);
}

.btn-secondary {
  background: transparent;
  color: var(--text);
  border: 2px solid var(--text);
}

.btn-secondary:hover {
  background: var(--text);
  color: var(--bg);
}

.section-label {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}`;
}

function generateStyleSpecificCSS(style: KyronStyle, colors: DesignBrief['colors'], brief: DesignBrief): string {
  const blendClass = brief.secondaryStyle ? `style-blend-${brief.secondaryStyle}` : '';
  const base = `[data-style="${style}"] `;

  const styleCSS: Record<KyronStyle, string> = {
    'cyber-brutalism': `
[data-style="cyber-brutalism"] {
  --glitch-color-1: ${colors.primary};
  --glitch-color-2: ${colors.secondary};
}

[data-style="cyber-brutalism"] h1, 
[data-style="cyber-brutalism"] h2 {
  text-transform: uppercase;
  letter-spacing: -0.02em;
  position: relative;
}

[data-style="cyber-brutalism"] .hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  align-items: center;
  border-bottom: 2px solid var(--primary);
}

[data-style="cyber-brutalism"] .hero-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
}

[data-style="cyber-brutalism"] .hero h1 {
  font-size: clamp(3rem, 10vw, 7rem);
  line-height: 0.9;
  text-shadow: 4px 4px 0 var(--primary), 8px 8px 0 var(--secondary);
}

[data-style="cyber-brutalism"] .hero p {
  font-size: 1.125rem;
  color: var(--muted);
  border-left: 4px solid var(--primary);
  padding-left: 1rem;
  margin: 1.5rem 0;
}

[data-style="cyber-brutalism"] .features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1px;
  background: var(--muted);
}

[data-style="cyber-brutalism"] .feature-card {
  background: var(--surface);
  padding: 3rem 2rem;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

[data-style="cyber-brutalism"] .feature-card:hover {
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 10%, var(--surface));
}

[data-style="cyber-brutalism"] .feature-card h3 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--primary);
  margin-bottom: 0.75rem;
}

[data-style="cyber-brutalism"] .about-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

[data-style="cyber-brutalism"] .about-text {
  position: relative;
  z-index: 2;
}

[data-style="cyber-brutalism"] .about-text::before {
  content: '◆';
  position: absolute;
  top: -2rem;
  left: 0;
  font-size: 2rem;
  color: var(--primary);
}

[data-style="cyber-brutalism"] .cta-section {
  text-align: center;
  border-top: 2px solid var(--primary);
  border-bottom: 2px solid var(--primary);
}

[data-style="cyber-brutalism"] .cta-section h2 {
  max-width: 800px;
  margin: 0 auto 1.5rem;
}

[data-style="cyber-brutalism"] footer {
  padding: 2rem 0;
  text-align: center;
  border-top: 1px solid var(--muted);
  font-size: 0.875rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
`,
    scrollytelling: `
[data-style="scrollytelling"] .hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
}

[data-style="scrollytelling"] .hero h1 {
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 600;
}

[data-style="scrollytelling"] .hero p {
  font-size: 1.25rem;
  margin-top: 1rem;
}

[data-style="scrollytelling"] .scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--muted);
}

[data-style="scrollytelling"] .scroll-indicator span {
  display: block;
  width: 1px;
  height: 40px;
  background: var(--muted);
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(0.5); }
  50% { opacity: 1; transform: scaleY(1); }
}

[data-style="scrollytelling"] .chapter {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

[data-style="scrollytelling"] .chapter-number {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--primary);
  margin-bottom: 1rem;
}

[data-style="scrollytelling"] .features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
}

[data-style="scrollytelling"] .feature-card {
  text-align: center;
  padding: 2rem;
  opacity: 0;
  transform: translateY(30px);
}

[data-style="scrollytelling"] .feature-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: color-mix(in srgb, var(--primary) 20%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

[data-style="scrollytelling"] .cta-section {
  text-align: center;
  padding: 8rem 2rem;
}

[data-style="scrollytelling"] .progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--primary);
  z-index: 9999;
}
`,
    'kinetic-typography': `
[data-style="kinetic-typography"] .hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

[data-style="kinetic-typography"] .hero h1 {
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1;
}

[data-style="kinetic-typography"] .hero h1 .word {
  display: inline-block;
  opacity: 0;
}

[data-style="kinetic-typography"] .hero h1 .char {
  display: inline-block;
}

[data-style="kinetic-typography"] .hero p {
  font-size: 1.25rem;
  margin-top: 1.5rem;
  overflow: hidden;
}

[data-style="kinetic-typography"] .hero p .word {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
}

[data-style="kinetic-typography"] .section-title {
  overflow: hidden;
  margin-bottom: 3rem;
}

[data-style="kinetic-typography"] .section-title span {
  display: inline-block;
}

[data-style="kinetic-typography"] .features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

[data-style="kinetic-typography"] .feature-card {
  padding: 2rem;
  border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
  transition: all 0.4s ease;
}

[data-style="kinetic-typography"] .feature-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
}

[data-style="kinetic-typography"] .feature-card h3 {
  margin-bottom: 0.75rem;
}

[data-style="kinetic-typography"] .about-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

[data-style="kinetic-typography"] .cta-section {
  text-align: center;
  overflow: hidden;
}

[data-style="kinetic-typography"] .cta-section h2 {
  margin-bottom: 2rem;
}
`,
    'glass-aurora': `
[data-style="glass-aurora"] {
  --aurora-color-1: ${colors.primary};
  --aurora-color-2: ${colors.secondary};
  --aurora-color-3: ${colors.accent};
}

[data-style="glass-aurora"] .hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

[data-style="glass-aurora"] .hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 3rem;
  background: var(--surface);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
}

[data-style="glass-aurora"] .hero h1 {
  font-weight: 300;
  letter-spacing: -0.02em;
}

[data-style="glass-aurora"] .hero p {
  margin: 1.5rem auto;
}

[data-style="glass-aurora"] .aurora-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

[data-style="glass-aurora"] .aurora-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

[data-style="glass-aurora"] .features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

[data-style="glass-aurora"] .feature-card {
  padding: 2rem;
  background: var(--surface);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  transition: all 0.3s ease;
}

[data-style="glass-aurora"] .feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255,255,255,0.2);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

[data-style="glass-aurora"] .feature-card h3 {
  margin-bottom: 0.75rem;
  font-weight: 400;
}

[data-style="glass-aurora"] .about-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

[data-style="glass-aurora"] .about-card {
  padding: 3rem;
  background: var(--surface);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
}

[data-style="glass-aurora"] .cta-section {
  text-align: center;
}

[data-style="glass-aurora"] .cta-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 4rem;
  background: var(--surface);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 32px;
}

[data-style="glass-aurora"] .btn-primary {
  border-radius: 50px;
}

[data-style="glass-aurora"] footer {
  text-align: center;
  padding: 2rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  font-size: 0.875rem;
  color: var(--muted);
}
`,
    'neo-brutalism': `
[data-style="neo-brutalism"] .hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  border-bottom: 4px solid #000;
}

[data-style="neo-brutalism"] .hero-content {
  max-width: 800px;
}

[data-style="neo-brutalism"] .hero h1 {
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 900;
  color: #000;
  text-transform: uppercase;
}

[data-style="neo-brutalism"] .hero p {
  color: #333;
  font-size: 1.25rem;
  border-left: 8px solid var(--primary);
  padding-left: 1.5rem;
  margin: 1.5rem 0;
}

[data-style="neo-brutalism"] .btn-primary {
  background: #000;
  color: #fff;
  border: 3px solid #000;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.875rem;
  padding: 1rem 2.5rem;
  box-shadow: 6px 6px 0 var(--primary);
}

[data-style="neo-brutalism"] .btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 var(--primary);
}

[data-style="neo-brutalism"] .features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

[data-style="neo-brutalism"] .feature-card {
  background: var(--surface);
  padding: 2rem;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
  transition: all 0.2s ease;
}

[data-style="neo-brutalism"] .feature-card:hover {
  transform: translate(-3px, -3px);
  box-shadow: 9px 9px 0 #000;
}

[data-style="neo-brutalism"] .feature-card h3 {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

[data-style="neo-brutalism"] .about-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

[data-style="neo-brutalism"] .about-text {
  background: var(--surface);
  padding: 3rem;
  border: 3px solid #000;
  box-shadow: 8px 8px 0 #000;
}

[data-style="neo-brutalism"] .cta-section {
  text-align: center;
  background: var(--primary);
  padding: 6rem 2rem;
  border-top: 4px solid #000;
  border-bottom: 4px solid #000;
}

[data-style="neo-brutalism"] .cta-section h2 {
  color: #000;
}

[data-style="neo-brutalism"] .cta-section .btn-primary {
  background: #fff;
  color: #000;
  border-color: #000;
  box-shadow: 6px 6px 0 #000;
}

[data-style="neo-brutalism"] footer {
  padding: 2rem;
  text-align: center;
  border-top: 3px solid #000;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}
`,
  };

  return (styleCSS[style] || '') + (blendClass ? `\n.${blendClass} {\n  /* secondary style blend mixins would go here */\n}` : '');
}

function generateMotionCSS(motion: DesignBrief['motion']): string {
  let css = '\n/* Motion Styles */\n';
  if (motion.scrollReveal) {
    css += `
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }
`;
  }
  if (motion.parallax) {
    css += `
.parallax-layer {
  will-change: transform;
}
.parallax-slow { transform: translateZ(-1px) scale(1.5); }
.parallax-medium { transform: translateZ(-0.5px) scale(1.25); }
.parallax-fast { transform: translateZ(0); }
`;
  }
  return css;
}

function generateResponsiveCSS(): string {
  return `
@media (max-width: 768px) {
  [data-style="cyber-brutalism"] .hero,
  [data-style="cyber-brutalism"] .about-section,
  [data-style="kinetic-typography"] .about-section,
  [data-style="glass-aurora"] .about-section,
  [data-style="neo-brutalism"] .about-section,
  [data-style="scrollytelling"] .about-section {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  [data-style="cyber-brutalism"] .hero {
    min-height: auto;
    padding: 4rem 0;
  }
  [data-style="cyber-brutalism"] .hero-content {
    padding: 0;
  }
  [data-style="scrollytelling"] .chapter {
    min-height: auto;
    padding: 4rem 1.5rem;
  }
  [data-style="glass-aurora"] .hero-content {
    padding: 2rem;
    margin: 1rem;
    border-radius: 16px;
  }
  [data-style="glass-aurora"] .cta-card {
    padding: 2rem;
    margin: 1rem;
  }
  [data-style="neo-brutalism"] .hero {
    min-height: auto;
    padding: 4rem 1.5rem;
  }
  .grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  h1 { font-size: clamp(2rem, 12vw, 2.5rem); }
  h2 { font-size: clamp(1.5rem, 8vw, 2rem); }
  .btn { width: 100%; justify-content: center; }
}`;
}
