import type { DesignBrief } from '@/types';
import { generateCSS } from './styles';
import { generateThreeJS } from './three-d';
import { generateMotionJS } from './motion';
import { generateSections } from './sections';

export function generateHTML(brief: DesignBrief): string {
  const css = generateCSS(brief);
  const sections = generateSections(brief);
  const threeJS = generateThreeJS(brief);
  const motionJS = generateMotionJS(brief);
  const useGSAP = brief.motion.kineticTypography || brief.motion.scrollReveal;
  const useThree = brief.threeD.type !== 'none';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(brief.siteName)}</title>
  <meta name="description" content="${escapeHTML(brief.description)}">
  <meta name="theme-color" content="${brief.colors.background}">
  ${useThree ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>' : ''}
  ${useGSAP ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>' : ''}
  ${useGSAP && brief.motion.kineticTypography ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>' : ''}
  <style>
${css}
  </style>
</head>
<body data-style="${brief.style}">
  ${sections}
  <script>
${threeJS}
${motionJS}
  <\/script>
</body>
</html>`;
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateSiteFiles(brief: DesignBrief): Record<string, string> {
  return {
    'index.html': generateHTML(brief),
  };
}
