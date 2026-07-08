import type { DesignBrief } from '@/types';

export function generateMotionJS(brief: DesignBrief): string {
  const { motion, style } = brief;
  const parts: string[] = [];

  if (motion.scrollReveal) {
    parts.push(generateScrollReveal());
  }

  if (motion.kineticTypography && style === 'kinetic-typography') {
    parts.push(generateKineticTypography(brief));
  }

  if (motion.parallax) {
    parts.push(generateParallax());
  }

  if (style === 'scrollytelling') {
    parts.push(generateScrollytellingFeatures(brief));
  }

  return parts.join('\n\n');
}

function generateScrollReveal(): string {
  return `
// Scroll Reveal
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  
  reveals.forEach(el => observer.observe(el));
}

// Run after everything loads
if (document.readyState === 'complete') {
  initReveal();
} else {
  window.addEventListener('load', initReveal);
}`;
}

function generateKineticTypography(brief: DesignBrief): string {
  return `
// Kinetic Typography - GSAP Split Text
function initKineticText() {
  if (typeof gsap === 'undefined') return;

  const heroTitle = document.querySelector('.hero h1');
  const heroSubtitle = document.querySelector('.hero p');
  
  if (heroTitle) {
    const chars = heroTitle.textContent?.split('').map(c => 
      c === ' ' ? ' ' : '<span class="char" style="display:inline-block">' + c + '</span>'
    ).join('');
    heroTitle.innerHTML = chars;
    
    gsap.fromTo('.hero h1 .char', 
      { opacity: 0, y: 50, rotateX: -90 },
      { 
        opacity: 1, y: 0, rotateX: 0, 
        duration: 0.8, 
        stagger: 0.03,
        ease: 'power4.out',
        delay: 0.2
      }
    );
  }

  if (heroSubtitle) {
    const words = heroSubtitle.textContent?.split(' ').map(w => 
      '<span class="word" style="display:inline-block">' + w + '</span>'
    ).join(' ');
    heroSubtitle.innerHTML = words;

    gsap.fromTo('.hero p .word',
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 1.2
      }
    );
  }

  // Section titles on scroll
  gsap.utils.toArray('.section-title').forEach(title => {
    const chars = title.textContent?.split('').map(c =>
      c === ' ' ? ' ' : '<span style="display:inline-block">' + c + '</span>'
    ).join('');
    title.innerHTML = chars;
    
    gsap.fromTo(title.querySelectorAll('span'),
      { opacity: 0, y: 40, rotateX: -45 },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.6,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

if (document.readyState === 'complete') {
  initKineticText();
} else {
  window.addEventListener('load', initKineticText);
}`;
}

function generateParallax(): string {
  return `
// Parallax on Scroll
function initParallax() {
  const layers = document.querySelectorAll('.parallax-layer');
  if (!layers.length) return;
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    layers.forEach(layer => {
      const speed = layer.dataset.speed || 0.3;
      layer.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
    });
  }, { passive: true });
}

initParallax();`;
}

function generateScrollytellingFeatures(brief: DesignBrief): string {
  return `
// Scrollytelling
function initScrollytelling() {
  const cards = document.querySelectorAll('.feature-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  // Stagger
  cards.forEach((card, i) => {
    card.style.transitionDelay = (i * 0.15) + 's';
    observer.observe(card);
  });

  // Progress bar tracking
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
  }
}

if (document.readyState === 'complete') {
  initScrollytelling();
} else {
  window.addEventListener('load', initScrollytelling);
}`;
}
