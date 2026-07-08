import type { DesignBrief, ProjectFile } from '@/types';
import { generateCSS } from './styles';

export function generateFullStackProject(brief: DesignBrief): ProjectFile[] {
  const files: ProjectFile[] = [];
  const name = brief.siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '') || 'project';
  const slug = name;

  const css = generateCSS(brief);
  const heroContent = generateHeroHTML(brief);
  const featuresContent = generateFeaturesHTML(brief);
  const aboutContent = generateAboutHTML(brief);
  const ctaContent = generateCTAHTML(brief);
  const footerContent = generateFooterHTML(brief);
  const useThree = brief.threeD.type !== 'none';
  const useGSAP = brief.motion.kineticTypography || brief.motion.scrollReveal;
  const threeJS = generateThreeJS(brief);
  const motionJS = generateMotionJS(brief);

  files.push({
    path: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(brief.siteName)}</title>
  <meta name="description" content="${esc(brief.description)}">
  <meta name="theme-color" content="${brief.colors.background}">
  <link rel="stylesheet" href="styles/main.css">
  ${useThree ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>' : ''}
  ${useGSAP ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>' : ''}
  ${useGSAP && brief.motion.kineticTypography ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>' : ''}
</head>
<body data-style="${brief.style}">
  ${heroContent}
  ${featuresContent}
  ${aboutContent}
  ${ctaContent}
  ${footerContent}
  <script src="scripts/main.js"><\/script>
</body>
</html>`,
  });

  files.push({
    path: 'styles/main.css',
    content: css,
  });

  const jsContent = `${threeJS}\n\n${motionJS}`;
  files.push({
    path: 'scripts/main.js',
    content: jsContent || '// Kyron generated site',
  });

  if (brief.hasBlog) {
    files.push({
      path: 'blog/index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog — ${esc(brief.siteName)}</title>
  <meta name="theme-color" content="${brief.colors.background}">
  <link rel="stylesheet" href="../styles/main.css">
  <link rel="stylesheet" href="../styles/blog.css">
</head>
<body data-style="${brief.style}">
  <nav style="padding:1rem 2rem;border-bottom:1px solid var(--muted);display:flex;justify-content:space-between;align-items:center;">
    <a href="../" style="font-weight:600;color:var(--text);text-decoration:none;">${esc(brief.siteName)}</a>
    <span style="font-size:0.875rem;color:var(--muted);">Blog</span>
  </nav>
  <section class="container" style="padding-top:4rem;">
    <h2>Blog</h2>
    <p style="color:var(--muted);margin-top:0.5rem;">Coming soon.</p>
  </section>
</body>
</html>`,
    });
    files.push({
      path: 'styles/blog.css',
      content: `/* Blog styles */\n.blog-post { padding: 2rem 0; border-bottom: 1px solid var(--muted); }\n.blog-post:last-child { border-bottom: none; }`,
    });
  }

  if (brief.needsAuth) {
    files.push({
      path: 'login/index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login — ${esc(brief.siteName)}</title>
  <meta name="theme-color" content="${brief.colors.background}">
  <link rel="stylesheet" href="../styles/main.css">
  <link rel="stylesheet" href="../styles/auth.css">
</head>
<body data-style="${brief.style}">
  <nav style="padding:1rem 2rem;border-bottom:1px solid var(--muted);display:flex;justify-content:space-between;align-items:center;">
    <a href="../" style="font-weight:600;color:var(--text);text-decoration:none;">${esc(brief.siteName)}</a>
  </nav>
  <section class="container" style="padding-top:4rem;max-width:400px;margin:0 auto;">
    <h2 style="text-align:center;">Sign In</h2>
    <form style="display:flex;flex-direction:column;gap:1rem;margin-top:2rem;">
      <input type="email" placeholder="Email" style="padding:0.75rem 1rem;background:var(--surface);border:1px solid var(--muted);color:var(--text);border-radius:4px;">
      <input type="password" placeholder="Password" style="padding:0.75rem 1rem;background:var(--surface);border:1px solid var(--muted);color:var(--text);border-radius:4px;">
      <button type="submit" class="btn btn-primary" style="justify-content:center;">Sign In</button>
    </form>
  </section>
</body>
</html>`,
    });
    files.push({
      path: 'styles/auth.css',
      content: `/* Auth styles */\ninput:focus { outline: none; border-color: var(--primary) !important; }`,
    });
  }

  files.push({
    path: 'package.json',
    content: JSON.stringify({
      name: slug,
      version: '1.0.0',
      description: brief.description,
      private: true,
    }, null, 2),
  });

  files.push({
    path: 'README.md',
    content: `# ${brief.siteName}\n\n${brief.description}\n\n---\n\nBuilt by [Kyron](https://kyron.app) — AI Design Studio.\n`,
  });

  const structure = [
    'index.html',
    'styles/main.css',
    'scripts/main.js',
    ...(brief.hasBlog ? ['blog/index.html', 'styles/blog.css'] : []),
    ...(brief.needsAuth ? ['login/index.html', 'styles/auth.css'] : []),
    'package.json',
    'README.md',
  ].join('\n');

  return files.map(f => ({ ...f, path: `${slug}/${f.path}` }));
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function generateHeroHTML(b: DesignBrief): string {
  const h = (b.sections.find(s => s.type === 'hero')?.content) || { headline: b.tagline, subtitle: b.description, cta: 'Get Started' };
  return `<section class="hero" id="hero">
    ${b.threeD.type !== 'none' ? '<div id="three-container" style="position:absolute;inset:0;z-index:0;"></div>' : ''}
    <div class="hero-content container" style="position:relative;z-index:${b.threeD.type !== 'none' ? 2 : 1};">
      <p class="section-label reveal">${esc(b.siteName)}</p>
      <h1 class="reveal">${esc(h.headline as string)}</h1>
      <p class="reveal reveal-delay-1">${esc(h.subtitle as string)}</p>
      <div class="reveal reveal-delay-2" style="margin-top:2rem;display:flex;gap:1rem;flex-wrap:wrap;">
        <a href="#features" class="btn btn-primary">${esc(h.cta as string)}</a>
        <a href="#about" class="btn btn-secondary">Learn More</a>
      </div>
    </div>
  </section>`;
}

function generateFeaturesHTML(b: DesignBrief): string {
  const items = (b.sections.find(s => s.type === 'features')?.content?.items as string[]) || [];
  const cards = items.map((item, i) => `<div class="feature-card reveal reveal-delay-${Math.min(i, 4)}">
    <h3>${esc(item.split(':')[0] || `Feature ${i+1}`)}</h3>
    <p>${esc(item.split(':')[1] || item)}</p>
  </div>`).join('');
  return `<section id="features" class="container">
    <p class="section-label reveal">Features</p>
    <h2 class="section-title reveal">What We Offer</h2>
    <div class="features-grid">${cards}</div>
  </section>`;
}

function generateAboutHTML(b: DesignBrief): string {
  const p = (b.sections.find(s => s.type === 'about')?.content?.paragraph as string) || '';
  return `<section id="about" class="container about-section">
    <div class="about-text reveal">
      <p class="section-label">About</p>
      <h2 class="section-title">Our Story</h2>
      <p>${esc(p)}</p>
    </div>
    <div class="about-text reveal reveal-delay-1">
      <p style="font-size:0.875rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-bottom:1rem;">For ${esc(b.targetAudience)}</p>
      <p style="color:var(--text);font-size:1.125rem;">${esc(b.industry)}</p>
    </div>
  </section>`;
}

function generateCTAHTML(b: DesignBrief): string {
  const s = b.sections.find(s => s.type === 'cta')?.content;
  return `<section id="cta" class="cta-section">
    <div class="container reveal">
      <h2>${esc((s?.headline as string) || 'Ready to Get Started?')}</h2>
      <p style="margin-bottom:2rem;">Let's build something amazing together.</p>
      <a href="mailto:hello@${esc(b.siteName.toLowerCase().replace(/\s+/g, ''))}.com" class="btn btn-primary">${esc((s?.buttonText as string) || 'Get in Touch')}</a>
    </div>
  </section>`;
}

function generateFooterHTML(b: DesignBrief): string {
  const t = (b.sections.find(s => s.type === 'footer')?.content?.text as string) || `© ${new Date().getFullYear()} ${b.siteName}`;
  return `<footer><div class="container"><p>${esc(t)}</p></div></footer>`;
}

function generateThreeJS(b: DesignBrief): string {
  if (b.threeD.type === 'none') return '';
  return `
(function(){const s=new THREE.Scene();const c=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);const r=new THREE.WebGLRenderer({alpha:true,antialias:true});const ct=document.getElementById('three-container');if(!ct)return;r.setSize(ct.clientWidth,ct.clientHeight);r.setPixelRatio(Math.min(window.devicePixelRatio,2));ct.appendChild(r.domElement);camera.position.z=5;
const col=${parseInt(b.threeD.color.replace('#',''), 16)};
const geo=new THREE.SphereGeometry(2,24,24);
const mat=new THREE.MeshPhysicalMaterial({color:col,wireframe:true,transparent:true,opacity:0.2,emissive:col,emissiveIntensity:0.1});
const m=new THREE.Mesh(geo,mat);s.add(m);
const pts=new THREE.BufferGeometry();const pos=new Float32Array(600*3);for(let i=0;i<600*3;i+=3){const rad=3+Math.random()*4;const th=Math.random()*Math.PI*2;const ph=Math.acos(2*Math.random()-1);pos[i]=Math.sin(ph)*Math.cos(th)*rad;pos[i+1]=Math.sin(ph)*Math.sin(th)*rad;pos[i+2]=Math.cos(ph)*rad}
pts.setAttribute('position',new THREE.BufferAttribute(pos,3));
const ptMat=new THREE.PointsMaterial({size:0.025,color:col,transparent:true,opacity:0.6,blending:THREE.AdditiveBlending});
const pt=new THREE.Points(pts,ptMat);s.add(pt);
function anim(){requestAnimationFrame(anim);m.rotation.x+=0.003;m.rotation.y+=0.005;pt.rotation.y-=0.001;r.render(s,c)}anim();
window.addEventListener('resize',()=>{const w=ct.clientWidth;const h=ct.clientHeight;c.aspect=w/h;c.updateProjectionMatrix();r.setSize(w,h)})})();`;
}

function generateMotionJS(b: DesignBrief): string {
  let js = '';
  if (b.motion.scrollReveal) {
    js += `
document.addEventListener('DOMContentLoaded',function(){
const r=document.querySelectorAll('.reveal');if(!r.length)return;
const o=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}})},{threshold:0.15});
r.forEach(e=>o.observe(e))});`;
  }
  return js;
}
