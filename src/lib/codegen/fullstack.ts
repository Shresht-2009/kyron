import type { DesignBrief, ProjectFile } from '@/types';
import { generateCSS } from './styles';

export function generateFullStackProject(brief: DesignBrief): ProjectFile[] {
  const files: ProjectFile[] = [];
  const useThree = brief.threeD.type !== 'none';
  const useGSAP = brief.motion.kineticTypography || brief.motion.scrollReveal;

  const css = generateCSS(brief);
  const threeJS = generateThreeJS(brief);
  const siteJS = generateSiteJS(brief);

  files.push({
    path: 'index.html',
    content: HTML(brief, css, threeJS, siteJS, useThree, useGSAP),
  });

  files.push({ path: 'styles/main.css', content: css });

  const jsContent = [threeJS, siteJS].filter(Boolean).join('\n\n');
  files.push({
    path: 'scripts/main.js',
    content: jsContent || '// Kyron — AI Design Studio\n',
  });

  if (brief.hasBlog) {
    files.push({
      path: 'blog/index.html',
      content: blogHTML(brief),
    });
    files.push({
      path: 'styles/blog.css',
      content: '.blog-post{padding:2rem 0;border-bottom:1px solid var(--muted);}\n.blog-post:last-child{border-bottom:none;}\n',
    });
  }

  if (brief.needsAuth) {
    files.push({
      path: 'login/index.html',
      content: loginHTML(brief),
    });
    files.push({
      path: 'styles/auth.css',
      content: 'input:focus{outline:none;border-color:var(--primary)!important;}\n.auth-form{display:flex;flex-direction:column;gap:1rem;}\n.auth-form input{width:100%;}\n',
    });
  }

  const slug = brief.siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '') || 'project';
  files.push({
    path: 'package.json',
    content: JSON.stringify({ name: slug, version: '1.0.0', description: brief.description, private: true }, null, 2) + '\n',
  });
  files.push({
    path: 'README.md',
    content: `# ${brief.siteName}\n\n${brief.description}\n\n## Tech Stack\n\n- HTML / CSS / JavaScript\n- Three.js (3D graphics)\n- GSAP (animations)\n\n---\n\nBuilt by [Kyron AI](https://kyron.app)\n`,
  });
  files.push({
    path: '.gitignore',
    content: 'node_modules/\n.env\n.env.local\n.DS_Store\n',
  });

  return files;
}

function HTML(b: DesignBrief, css: string, three: string, sitejs: string, useThree: boolean, useGSAP: boolean): string {
  const jsBundle = [three, sitejs].filter(Boolean).join('\n\n');
  return ko`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(b.siteName)}</title>
  <meta name="description" content="${esc(b.description)}">
  <meta name="theme-color" content="${b.colors.background}">
  <style>${css}</style>
  ${useThree ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>' : ''}
  ${useGSAP ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>' : ''}
  ${useGSAP && b.motion.kineticTypography ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>' : ''}
</head>
<body data-style="${b.style}">
  ${navSection(b)}
  ${heroSection(b)}
  ${featuresSection(b)}
  ${aboutSection(b)}
  ${ctaSection(b)}
  ${footerSection(b)}
  <script>${jsBundle}<\/script>
</body>
</html>`;
}

function navSection(b: DesignBrief): string {
  return `<nav style="position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;align-items:center;justify-content:space-between;padding:0.75rem 2rem;background:color-mix(in srgb,var(--bg) 85%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid color-mix(in srgb,var(--text) 10%,transparent);">
  <a href="#" style="font-weight:700;color:var(--text);text-decoration:none;font-size:1.1rem;">${esc(b.siteName)}</a>
  <div style="display:flex;gap:1.5rem;align-items:center;">
    <a href="#features" style="font-size:0.875rem;color:var(--muted);text-decoration:none;">Features</a>
    <a href="#about" style="font-size:0.875rem;color:var(--muted);text-decoration:none;">About</a>
    <a href="#cta" style="font-size:0.875rem;color:var(--muted);text-decoration:none;">Contact</a>
    ${b.needsAuth ? '<a href="login/" class="btn btn-primary" style="padding:0.4rem 1.25rem;font-size:0.8125rem;" id="kyron-auth-btn">Sign In</a>' : ''}
  </div>
</nav>`;
}

function heroSection(b: DesignBrief): string {
  const h = b.sections.find(s => s.type === 'hero')?.content || {};
  const hd = (h.headline as string) || b.tagline || 'Welcome';
  const sub = (h.subtitle as string) || b.description || '';
  const cta = (h.cta as string) || 'Get Started';
  const three = b.threeD.type !== 'none';
  return `<section class="hero" id="hero" style="padding-top:5rem;">
${three ? '<div id="three-container" style="position:absolute;inset:0;z-index:0;"></div>' : ''}
<div class="hero-content container" style="position:relative;z-index:${three ? 2 : 1};padding-top:4rem;padding-bottom:4rem;">
  <p class="section-label reveal">${esc(b.siteName)}</p>
  <h1 class="reveal">${esc(hd)}</h1>
  <p class="reveal reveal-delay-1">${esc(sub)}</p>
  <div class="reveal reveal-delay-2" style="margin-top:2rem;display:flex;gap:1rem;flex-wrap:wrap;">
    <a href="#cta" class="btn btn-primary">${esc(cta)}</a>
    <a href="#features" class="btn btn-secondary">Explore</a>
  </div>
</div>
</section>`;
}

function featuresSection(b: DesignBrief): string {
  const items = (b.sections.find(s => s.type === 'features')?.content?.items as string[]) || [];
  if (!items.length) return '';
  return `<section id="features" class="container">
  <p class="section-label reveal">Features</p>
  <h2 class="section-title reveal">What We Offer</h2>
  <div class="features-grid">
${items.map((item, i) => `    <div class="feature-card reveal reveal-delay-${Math.min(i, 4)}" tabindex="0" role="button">
      <h3>${esc(item.split(':')[0] || `Feature ${i + 1}`)}</h3>
      <p>${esc(item.split(':')[1] || item)}</p>
    </div>`).join('\n')}
  </div>
</section>`;
}

function aboutSection(b: DesignBrief): string {
  const p = (b.sections.find(s => s.type === 'about')?.content?.paragraph as string) || '';
  if (!p) return '';
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

function ctaSection(b: DesignBrief): string {
  const s = b.sections.find(s => s.type === 'cta')?.content || {};
  const hd = (s.headline as string) || 'Ready to Start?';
  const btn = (s.buttonText as string) || 'Get in Touch';
  return `<section id="cta" class="cta-section">
  <div class="container reveal">
    <h2>${esc(hd)}</h2>
    <p style="margin-bottom:2rem;">Let's build something amazing together.</p>
    <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;max-width:500px;margin:0 auto;">
      <input type="email" placeholder="Your email" id="cta-email" style="flex:1;min-width:200px;padding:0.875rem 1rem;background:var(--surface);border:1px solid var(--muted);color:var(--text);border-radius:4px;font-family:inherit;font-size:1rem;">
      <button class="btn btn-primary" id="cta-btn">${esc(btn)}</button>
    </div>
    <p id="cta-message" style="margin-top:1rem;font-size:0.875rem;color:var(--primary);display:none;"></p>
  </div>
</section>`;
}

function footerSection(b: DesignBrief): string {
  const t = (b.sections.find(s => s.type === 'footer')?.content?.text as string) || `© ${new Date().getFullYear()} ${b.siteName}`;
  return `<footer><div class="container" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;"><p>${esc(t)}</p></div></footer>`;
}

function blogHTML(b: DesignBrief): string {
  return ko`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Blog — ${esc(b.siteName)}</title>
  <style>${generateCSS(b)}</style>
  <link rel="stylesheet" href="../styles/blog.css">
</head>
<body data-style="${b.style}">
  <nav style="padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--muted);">
    <a href="../" style="font-weight:600;color:var(--text);text-decoration:none;">${esc(b.siteName)}</a>
    <span style="font-size:0.875rem;color:var(--muted);">Blog</span>
  </nav>
  <section class="container" style="padding-top:4rem;">
    <h1>Blog</h1>
    <p style="color:var(--muted);margin-top:0.5rem;" id="blog-posts">Loading...</p>
  </section>
  <script>
(function(){
var posts=JSON.parse(localStorage.getItem('kyron_blog_${esc(b.siteName.replace(/\s/g,''))}')||'[]');
var el=document.getElementById('blog-posts');
if(!posts.length){el.textContent='No posts yet. Check back soon.';return;}
el.innerHTML='';
posts.forEach(function(p){
var d=document.createElement('div');d.className='blog-post';
d.innerHTML='<h3 style="margin-bottom:0.5rem;">'+p.title+'</h3><p style="font-size:0.875rem;color:var(--muted);">'+p.content+'</p>';
el.appendChild(d);
});
})();
<\/script>
</body>
</html>`;
}

function loginHTML(b: DesignBrief): string {
  return ko`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Login — ${esc(b.siteName)}</title>
  <style>${generateCSS(b)}</style>
  <link rel="stylesheet" href="../styles/auth.css">
</head>
<body data-style="${b.style}">
  <nav style="padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--muted);">
    <a href="../" style="font-weight:600;color:var(--text);text-decoration:none;">${esc(b.siteName)}</a>
  </nav>
  <section class="container" style="padding-top:6rem;max-width:420px;margin:0 auto;">
    <h1 class="auth-title" style="text-align:center;font-size:2rem;">Sign In</h1>
    <p class="auth-toggle" style="text-align:center;margin-top:0.5rem;font-size:0.875rem;color:var(--muted);">Don't have an account? <a href="#" style="color:var(--primary);text-decoration:none;font-weight:600;">Sign Up</a></p>
    <form class="auth-form" style="margin-top:2rem;display:flex;flex-direction:column;gap:1rem;">
      <input type="email" placeholder="Email" required style="padding:0.75rem 1rem;background:var(--surface);border:1px solid var(--muted);color:var(--text);border-radius:4px;font-family:inherit;font-size:1rem;">
      <input type="password" placeholder="Password" required style="padding:0.75rem 1rem;background:var(--surface);border:1px solid var(--muted);color:var(--text);border-radius:4px;font-family:inherit;font-size:1rem;">
      <button type="submit" class="btn btn-primary" style="justify-content:center;font-size:1rem;">Sign In</button>
    </form>
    <p id="auth-error" style="text-align:center;margin-top:1rem;font-size:0.875rem;color:#ff4444;display:none;"></p>
  </section>
  <script>
(function(){
var form=document.querySelector('.auth-form');
var title=document.querySelector('.auth-title');
var toggle=document.querySelector('.auth-toggle');
var err=document.getElementById('auth-error');
var submitBtn=form.querySelector('button[type="submit"]');
var mode='login';
toggle.addEventListener('click',function(e){
if(e.target.tagName!=='A')return;
e.preventDefault();
mode=mode==='login'?'signup':'login';
title.textContent=mode==='login'?'Sign In':'Create Account';
submitBtn.textContent=mode==='login'?'Sign In':'Create Account';
toggle.innerHTML=mode==='login'?'Don\'t have an account? <a href="#" style="color:var(--primary);text-decoration:none;font-weight:600;">Sign Up</a>':'Already have an account? <a href="#" style="color:var(--primary);text-decoration:none;font-weight:600;">Sign In</a>';
err.style.display='none';
});
form.addEventListener('submit',function(e){
e.preventDefault();err.style.display='none';
var email=form.querySelector('input[type="email"]').value.trim();
var pass=form.querySelector('input[type="password"]').value.trim();
if(!email||!pass){err.textContent='Please fill in all fields.';err.style.display='block';return;}
var users=JSON.parse(localStorage.getItem('kyron_users')||'{}');
if(mode==='login'){
if(users[email]&&users[email]===pass){localStorage.setItem('kyron_session',email);window.location.href='../';}
else{err.textContent='Invalid email or password.';err.style.display='block';}
}else{
if(users[email]){err.textContent='An account with this email already exists.';err.style.display='block';return;}
users[email]=pass;localStorage.setItem('kyron_users',JSON.stringify(users));localStorage.setItem('kyron_session',email);window.location.href='../';
}
});
})();
<\/script>
</body>
</html>`;
}

function generateThreeJS(b: DesignBrief): string {
  if (b.threeD.type === 'none') return '';
  const hex = parseInt(b.threeD.color.replace('#', ''), 16);
  return `
try{
(function(){
var scene=new THREE.Scene();
var cam=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
var ren=new THREE.WebGLRenderer({alpha:true,antialias:true});
var ct=document.getElementById('three-container');
if(!ct)return;
ren.setSize(ct.clientWidth,ct.clientHeight);
ren.setPixelRatio(Math.min(window.devicePixelRatio,2));
ct.appendChild(ren.domElement);
cam.position.z=5;
var geo=new THREE.SphereGeometry(2,24,24);
var mat=new THREE.MeshPhysicalMaterial({color:${hex},wireframe:true,transparent:true,opacity:0.2,emissive:${hex},emissiveIntensity:0.1});
var mesh=new THREE.Mesh(geo,mat);
scene.add(mesh);
var bg=new THREE.BufferGeometry();
var pos=new Float32Array(600*3);
for(var i=0;i<600*3;i+=3){
var rad=3+Math.random()*4,th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1);
pos[i]=Math.sin(ph)*Math.cos(th)*rad;
pos[i+1]=Math.sin(ph)*Math.sin(th)*rad;
pos[i+2]=Math.cos(ph)*rad;
}
bg.setAttribute('position',new THREE.BufferAttribute(pos,3));
var pm=new THREE.PointsMaterial({size:0.03,color:${hex},transparent:true,opacity:0.5,blending:THREE.AdditiveBlending});
var pts=new THREE.Points(bg,pm);
scene.add(pts);
(function anim(){
requestAnimationFrame(anim);
mesh.rotation.x+=0.003;mesh.rotation.y+=0.005;
pts.rotation.y-=0.001;
ren.render(scene,cam);
})();
window.addEventListener('resize',function(){
var w=ct.clientWidth,h=ct.clientHeight;
cam.aspect=w/h;cam.updateProjectionMatrix();
ren.setSize(w,h);
});
})();
}catch(e){console.error('3D:',e)}`;
}

function generateSiteJS(b: DesignBrief): string {
  const auth = b.needsAuth ? `
var kyronBtn=document.getElementById('kyron-auth-btn');
if(kyronBtn){
var ses=localStorage.getItem('kyron_session');
if(ses){
kyronBtn.textContent='Dashboard';
kyronBtn.href='#';
kyronBtn.onclick=function(e){
e.preventDefault();
var m=document.createElement('div');
m.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);';
m.innerHTML='<div style="background:var(--surface);border:1px solid var(--muted);border-radius:16px;padding:2.5rem;max-width:400px;width:90%;text-align:center;"><h2 style="margin-bottom:0.5rem;">Welcome back</h2><p style="color:var(--muted);margin-bottom:1.5rem;">'+ses+'</p><button onclick="localStorage.removeItem(\'kyron_session\');location.reload();" style="padding:0.75rem 2rem;background:var(--primary);color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;">Sign Out</button><br><button onclick="this.closest(\'div\').closest(\'div\').remove();" style="margin-top:1rem;padding:0.5rem 1.5rem;background:transparent;color:var(--muted);border:1px solid var(--muted);border-radius:8px;font-size:0.875rem;cursor:pointer;">Close</button></div>';
document.body.appendChild(m);
};
}
}
` : '';

  return `
(function(){
// Smooth scroll
var links=document.querySelectorAll('a[href^="#"]');
for(var i=0;i<links.length;i++){
links[i].addEventListener('click',function(e){
e.preventDefault();
var t=document.querySelector(this.getAttribute('href'));
if(t)t.scrollIntoView({behavior:'smooth'});
});
}
})();

(function(){
// Scroll reveal
var els=document.querySelectorAll('.reveal');
if(els.length){
var obs=new IntersectionObserver(function(entries){
entries.forEach(function(e){
if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}
});
},{threshold:0.15});
els.forEach(function(el){obs.observe(el);});
}
})();

(function(){
// CTA form handler
var ctaBtn=document.getElementById('cta-btn');
var ctaEmail=document.getElementById('cta-email');
var ctaMsg=document.getElementById('cta-message');
if(ctaBtn&&ctaEmail){
ctaBtn.addEventListener('click',function(){
var email=ctaEmail.value.trim();
if(!email){ctaMsg.textContent='Please enter your email.';ctaMsg.style.display='block';return;}
var leads=JSON.parse(localStorage.getItem('kyron_leads')||'[]');
leads.push({email:email,site:'${esc(b.siteName)}',date:new Date().toISOString()});
localStorage.setItem('kyron_leads',JSON.stringify(leads));
ctaMsg.textContent='Thanks! We\\'ll be in touch.';
ctaMsg.style.display='block';
ctaEmail.value='';
});
}
})();

(function(){
// Feature card interaction
var cards=document.querySelectorAll('.feature-card');
for(var i=0;i<cards.length;i++){
cards[i].addEventListener('click',function(){
this.classList.toggle('expanded');
var p=this.querySelector('p');
if(p&&this.classList.contains('expanded')){
var more=this.getAttribute('data-more');
if(more){p.textContent=more;}
}
});
}
})();
${auth}`;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function ko(strings: TemplateStringsArray, ...vals: any[]): string {
  let r = '';
  for (let i = 0; i < strings.length; i++) {
    r += strings[i] + (vals[i] || '');
  }
  return r.replace(/^\s*\n/gm, '').trim();
}
