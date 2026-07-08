import type { DesignBrief, KyronStyle } from '@/types';

export function generateCSS(brief: DesignBrief): string {
  const { colors, typography, style, motion } = brief;
  const base = generateBase(colors, typography);
  const specific = generateSpecific(style, colors, brief);
  const motionCss = generateMotionCSS(motion);
  const responsive = generateResponsive();
  return `@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=clash-display@400,500,600,700&f[]=space-grotesk@400,500,600,700&f[]=dm-mono@400&f[]=playfair-display@400,500,600,700&f[]=inter@400,500,600,700&f[]=outfit@300,400,500,600&f[]=archivo@400,500,600,700,800,900&f[]=archivo-black@400&display=swap');\n\n${base}\n${specific}\n${motionCss}\n${responsive}`;
}

function generateBase(c: DesignBrief['colors'], t: DesignBrief['typography']): string {
  return `:root{--primary:${c.primary};--secondary:${c.secondary};--accent:${c.accent};--bg:${c.background};--surface:${c.surface};--text:${c.text};--muted:${c.muted};--heading-font:${t.headingFont};--body-font:${t.bodyFont};--heading-weight:${t.headingWeight};--base-size:${t.baseSize}}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;font-size:var(--base-size)}
body{font-family:var(--body-font);background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4,h5,h6{font-family:var(--heading-font);font-weight:var(--heading-weight);line-height:1.1}
h1{font-size:clamp(2.5rem,8vw,5rem)}h2{font-size:clamp(2rem,5vw,3.5rem)}h3{font-size:clamp(1.25rem,3vw,1.75rem)}
p{font-size:clamp(1rem,2vw,1.125rem);color:var(--muted);max-width:65ch}
a{color:var(--primary);text-decoration:none}a:hover{opacity:0.8}
.container{width:100%;max-width:1200px;margin:0 auto;padding:0 clamp(1rem,5vw,4rem)}
section{padding:clamp(4rem,10vh,8rem) 0;position:relative}
.btn{display:inline-flex;align-items:center;gap:0.5rem;padding:0.875rem 2rem;font-family:var(--body-font);font-size:1rem;font-weight:600;border:none;cursor:pointer;transition:all 0.3s ease;text-decoration:none}
.btn-primary{background:var(--primary);color:#fff}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px color-mix(in srgb,var(--primary) 40%,transparent)}
.btn-secondary{background:transparent;color:var(--text);border:2px solid var(--text)}
.btn-secondary:hover{background:var(--text);color:var(--bg)}
.section-label{display:inline-block;font-size:0.75rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--primary);margin-bottom:1rem}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem}
.reveal{opacity:0;transform:translateY(30px);transition:opacity 0.8s ease,transform 0.8s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
.reveal-delay-1{transition-delay:0.1s}.reveal-delay-2{transition-delay:0.2s}.reveal-delay-3{transition-delay:0.3s}.reveal-delay-4{transition-delay:0.4s}`;
}

function generateSpecific(style: KyronStyle, colors: DesignBrief['colors'], brief: DesignBrief): string {
  if (style === 'cyber-brutalism') return `[data-style="cyber-brutalism"] .hero{display:grid;grid-template-columns:1fr 1fr;min-height:100vh;align-items:center;border-bottom:2px solid var(--primary)}[data-style="cyber-brutalism"] .hero h1{font-size:clamp(3rem,10vw,7rem);line-height:0.9;text-shadow:4px 4px 0 var(--primary),8px 8px 0 var(--secondary)}[data-style="cyber-brutalism"] .hero p{border-left:4px solid var(--primary);padding-left:1rem;margin:1.5rem 0}[data-style="cyber-brutalism"] .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1px;background:var(--muted)}[data-style="cyber-brutalism"] .feature-card{background:var(--surface);padding:3rem 2rem;border:1px solid transparent}[data-style="cyber-brutalism"] .feature-card:hover{border-color:var(--primary)}[data-style="cyber-brutalism"] .about-section{display:grid;grid-template-columns:1fr 1fr;gap:4rem}[data-style="cyber-brutalism"] .cta-section{text-align:center;border-top:2px solid var(--primary);border-bottom:2px solid var(--primary)}`;
  if (style === 'scrollytelling') return `[data-style="scrollytelling"] .hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}[data-style="scrollytelling"] .hero h1{font-size:clamp(3rem,10vw,6rem)}[data-style="scrollytelling"] .chapter{min-height:80vh;display:flex;flex-direction:column;justify-content:center;max-width:800px;margin:0 auto;padding:4rem 2rem}[data-style="scrollytelling"] .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:3rem}[data-style="scrollytelling"] .feature-card{opacity:0;transform:translateY(30px);transition:all 0.8s ease}[data-style="scrollytelling"] .feature-card.visible{opacity:1;transform:translateY(0)}[data-style="scrollytelling"] .progress-bar{position:fixed;top:0;left:0;width:0;height:3px;background:var(--primary);z-index:9999}`;
  if (style === 'kinetic-typography') return `[data-style="kinetic-typography"] .hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center}[data-style="kinetic-typography"] .hero h1{font-size:clamp(3rem,12vw,8rem);font-weight:500;letter-spacing:-0.03em}[data-style="kinetic-typography"] .hero h1 .char{display:inline-block}[data-style="kinetic-typography"] .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem}[data-style="kinetic-typography"] .feature-card{padding:2rem;border:1px solid color-mix(in srgb,var(--text) 15%,transparent)}[data-style="kinetic-typography"] .feature-card:hover{border-color:var(--primary);transform:translateY(-4px)}[data-style="kinetic-typography"] .about-section{display:grid;grid-template-columns:1fr 1fr;gap:4rem}[data-style="kinetic-typography"] .cta-section{text-align:center}`;
  if (style === 'glass-aurora') return `[data-style="glass-aurora"] .hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center}[data-style="glass-aurora"] .hero-content{position:relative;z-index:2;max-width:800px;padding:3rem;background:var(--surface);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);border-radius:24px}[data-style="glass-aurora"] .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}[data-style="glass-aurora"] .feature-card{padding:2rem;background:var(--surface);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.08);border-radius:20px}[data-style="glass-aurora"] .feature-card:hover{transform:translateY(-4px)}[data-style="glass-aurora"] .about-section{display:grid;grid-template-columns:1fr 1fr;gap:4rem}[data-style="glass-aurora"] .about-card{padding:3rem;background:var(--surface);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.08);border-radius:24px}[data-style="glass-aurora"] .cta-section{text-align:center}[data-style="glass-aurora"] .cta-card{max-width:600px;margin:0 auto;padding:4rem;background:var(--surface);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);border-radius:32px}[data-style="glass-aurora"] .btn-primary{border-radius:50px}`;
  if (style === 'neo-brutalism') return `[data-style="neo-brutalism"]{--text:#000000;--bg:#ffffff;--surface:#f5f5f5;--muted:#666666}[data-style="neo-brutalism"] .hero{min-height:100vh;display:flex;align-items:center}[data-style="neo-brutalism"] .hero h1{font-size:clamp(3rem,10vw,6rem);font-weight:900;color:#000;text-transform:uppercase}[data-style="neo-brutalism"] .hero p{color:#333;border-left:8px solid var(--primary);padding-left:1.5rem}[data-style="neo-brutalism"] .btn-primary{background:#000;color:#fff;border:3px solid #000;font-weight:800;text-transform:uppercase;box-shadow:6px 6px 0 var(--primary)}[data-style="neo-brutalism"] .btn-primary:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 var(--primary)}[data-style="neo-brutalism"] .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}[data-style="neo-brutalism"] .feature-card{background:#fff;padding:2rem;border:3px solid #000;box-shadow:6px 6px 0 #000}[data-style="neo-brutalism"] .feature-card:hover{transform:translate(-3px,-3px);box-shadow:9px 9px 0 #000}[data-style="neo-brutalism"] .about-section{display:grid;grid-template-columns:1fr 1fr;gap:4rem}[data-style="neo-brutalism"] .about-text{background:#fff;padding:3rem;border:3px solid #000;box-shadow:8px 8px 0 #000}[data-style="neo-brutalism"] .cta-section{text-align:center;background:var(--primary);padding:6rem 2rem;border-top:4px solid #000;border-bottom:4px solid #000}[data-style="neo-brutalism"] .cta-section h2{color:#000}[data-style="neo-brutalism"] .cta-section .btn-primary{background:#fff;color:#000;box-shadow:6px 6px 0 #000}`;
  return '';
}

function generateMotionCSS(motion: DesignBrief['motion']): string {
  let css = '';
  if (motion.scrollReveal) css += `.reveal{opacity:0;transform:translateY(30px);transition:opacity 0.8s ease,transform 0.8s ease}.reveal.visible{opacity:1;transform:translateY(0)}`;
  return css;
}

function generateResponsive(): string {
  return `@media(max-width:768px){
[data-style="cyber-brutalism"] .hero,[data-style="cyber-brutalism"] .about-section,
[data-style="kinetic-typography"] .about-section,[data-style="glass-aurora"] .about-section,
[data-style="neo-brutalism"] .about-section,[data-style="scrollytelling"] .about-section{grid-template-columns:1fr;gap:2rem}
[data-style="cyber-brutalism"] .hero{min-height:auto;padding:4rem 0}
[data-style="scrollytelling"] .chapter{min-height:auto;padding:4rem 1.5rem}
[data-style="neo-brutalism"] .hero{min-height:auto;padding:4rem 1.5rem}
.grid{grid-template-columns:1fr}
[data-style="glass-aurora"] .hero-content,[data-style="glass-aurora"] .cta-card{padding:2rem;margin:1rem}
}`;
}
