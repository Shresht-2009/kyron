import type { DesignBrief, SiteSection } from '@/types';

export function generateSections(brief: DesignBrief): string {
  return brief.sections
    .map(section => generateSection(section, brief))
    .join('\n\n');
}

function generateSection(section: SiteSection, brief: DesignBrief): string {
  switch (section.type) {
    case 'hero': return generateHero(section, brief);
    case 'features': return generateFeatures(section, brief);
    case 'about': return generateAbout(section, brief);
    case 'cta': return generateCTA(section, brief);
    case 'footer': return generateFooter(section, brief);
    default: return '';
  }
}

function generateHero(section: SiteSection, brief: DesignBrief): string {
  const headline = (section.content.headline as string) || brief.tagline || brief.siteName;
  const subtitle = (section.content.subtitle as string) || brief.description;
  const cta = (section.content.cta as string) || 'Get Started';
  const has3D = brief.threeD.type !== 'none';

  return `<!-- Hero Section -->
  <section class="hero" id="hero">
    ${has3D ? '<div id="three-container" style="position:absolute;inset:0;z-index:0;"></div>' : ''}
    <div class="hero-content container${has3D ? '' : ''}" style="position:relative;z-index:${has3D ? 2 : 1};">
      <p class="section-label reveal">${brief.siteName}</p>
      <h1 class="reveal">${headline}</h1>
      <p class="reveal reveal-delay-1">${subtitle}</p>
      <div class="reveal reveal-delay-2" style="margin-top:2rem;display:flex;gap:1rem;flex-wrap:wrap;">
        <a href="#features" class="btn btn-primary">${cta}</a>
        <a href="#about" class="btn btn-secondary">Learn More</a>
      </div>
    </div>
    ${brief.style === 'scrollytelling' ? '<div class="scroll-indicator">Scroll<span></span></div>' : ''}
  </section>`;
}

function generateFeatures(section: SiteSection, brief: DesignBrief): string {
  const items = section.content.items as string[] || [];
  const title = `What We ${['cyber-brutalism', 'neo-brutalism'].includes(brief.style) ? 'BUILD' : 'Offer'}`;

  const cards = items.map((item, i) => `
      <div class="feature-card reveal reveal-delay-${Math.min(i, 4)}">
        ${brief.style === 'scrollytelling' ? '<div class="feature-icon">✦</div>' : ''}
        <h3>${item.split(':')[0] || `Feature ${i + 1}`}</h3>
        <p>${item.split(':')[1] || item}</p>
      </div>`).join('');

  return `<!-- Features Section -->
  <section id="features" class="container">
    <p class="section-label reveal">Features</p>
    <h2 class="section-title reveal">${title}</h2>
    <div class="features-grid">
      ${cards}
    </div>
  </section>`;
}

function generateAbout(section: SiteSection, brief: DesignBrief): string {
  const paragraph = (section.content.paragraph as string) || `We are ${brief.siteName}. ${brief.description}`;

  return `<!-- About Section -->
  <section id="about" class="container about-section">
    ${brief.style === 'glass-aurora' ? `
    <div class="about-card reveal">
      <p class="section-label">About</p>
      <h2 class="section-title">Our Story</h2>
      <p>${paragraph}</p>
    </div>
    <div class="about-card reveal reveal-delay-1">
      <p style="font-size:0.875rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-bottom:1rem;">For ${brief.targetAudience}</p>
      <p style="color:var(--text);font-size:1.125rem;">${brief.industry}</p>
    </div>` : `
    <div class="about-text reveal">
      <p class="section-label">About</p>
      <h2 class="section-title">Our Story</h2>
      <p>${paragraph}</p>
    </div>
    <div class="about-text reveal reveal-delay-1">
      <p style="font-size:0.875rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-bottom:1rem;">For ${brief.targetAudience}</p>
      <p style="color:var(--text);font-size:1.125rem;">${brief.industry}</p>
      ${brief.brandPersonality.length ? `
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:1.5rem;">
        ${brief.brandPersonality.map(t => `<span style="display:inline-block;padding:0.25rem 0.75rem;font-size:0.75rem;border:1px solid var(--muted);border-radius:100px;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;">${t}</span>`).join('')}
      </div>` : ''}
    </div>`}
  </section>`;
}

function generateCTA(section: SiteSection, brief: DesignBrief): string {
  const headline = (section.content.headline as string) || 'Ready to Get Started?';
  const buttonText = (section.content.buttonText as string) || 'Get in Touch';

  return `<!-- CTA Section -->
  <section id="cta" class="cta-section">
    ${brief.style === 'glass-aurora' ? `
    <div class="cta-card reveal">
      <h2>${headline}</h2>
      <p style="margin-bottom:2rem;">Let's build something amazing together.</p>
      <a href="mailto:hello@${brief.siteName.toLowerCase().replace(/\s+/g, '')}.com" class="btn btn-primary">${buttonText}</a>
    </div>` : `
    <div class="container reveal">
      <h2>${headline}</h2>
      <p style="margin-bottom:2rem;">Let's build something amazing together.</p>
      <a href="mailto:hello@${brief.siteName.toLowerCase().replace(/\s+/g, '')}.com" class="btn btn-primary">${buttonText}</a>
      <br>
      <a href="#hero" style="display:inline-block;margin-top:1rem;font-size:0.875rem;color:var(--muted);">Back to top ↑</a>
    </div>`}
  </section>`;
}

function generateFooter(section: SiteSection, brief: DesignBrief): string {
  const text = (section.content.text as string) || `© ${new Date().getFullYear()} ${brief.siteName}. All rights reserved.`;

  return `<!-- Footer -->
  <footer>
    <div class="container">
      <p>${text}</p>
    </div>
  </footer>`;
}
