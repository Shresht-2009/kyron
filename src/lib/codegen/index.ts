import type { DesignBrief, GenerationProgress, GeneratedSite } from '@/types';
import { generateHTML, generateSiteFiles } from './html-template';

export type ProgressCallback = (progress: GenerationProgress) => void;

export async function generateSite(
  brief: DesignBrief,
  onProgress?: ProgressCallback
): Promise<GeneratedSite> {
  onProgress?.({ phase: 'design', progress: 10, message: 'Applying design system...' });

  onProgress?.({ phase: 'generating', progress: 30, message: 'Generating layout structure...' });
  const html = generateHTML(brief);

  onProgress?.({ phase: 'styling', progress: 50, message: 'Applying style aesthetics...' });

  onProgress?.({ phase: 'animation', progress: 70, message: 'Adding motion and interactivity...' });

  onProgress?.({ phase: 'finalizing', progress: 90, message: 'Finalizing output...' });

  const files = generateSiteFiles(brief);

  onProgress?.({ phase: 'complete', progress: 100, message: 'Site generated successfully!' });

  return {
    html,
    css: '',
    js: '',
    files,
  };
}
