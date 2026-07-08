'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import StyleCard from '@/components/StyleCard';
import Chat from '@/components/Chat';
import PreviewFrame from '@/components/PreviewFrame';
import type { DesignBrief, KyronStyle } from '@/types';

const styleList: { id: KyronStyle; name: string; description: string; colors: string[] }[] = [
  { id: 'cyber-brutalism', name: 'Cyber-Brutalism', description: 'Neon glitch, raw grids, oversized. Dark and aggressive.', colors: ['#ff0055', '#00f0ff', '#ffdd00', '#0a0a0a'] },
  { id: 'scrollytelling', name: 'Scrollytelling', description: 'Narrative scroll, parallax depth, chapter-based story.', colors: ['#6c5ce7', '#a29bfe', '#fd79a8', '#0d0d1a'] },
  { id: 'kinetic-typography', name: 'Kinetic Typography', description: 'Animated text, morphing headlines, scroll reactions.', colors: ['#ffffff', '#ff6b6b', '#ffd93d', '#000000'] },
  { id: 'glass-aurora', name: 'Glass + Aurora', description: 'Frosted glass, gradient orbs, smooth blur depth.', colors: ['#7c3aed', '#06b6d4', '#f472b6', '#050510'] },
  { id: 'neo-brutalism', name: 'Neo-Brutalism', description: 'Heavy shadows, bold borders, high contrast.', colors: ['#ffdd00', '#ff3366', '#00ccff', '#ffffff'] },
];

export default function CreatePage() {
  const [step, setStep] = useState<'chat' | 'styling' | 'preview'>('chat');
  const [brief, setBrief] = useState<DesignBrief | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<{ url?: string; error?: string } | null>(null);

  const handleBriefReady = useCallback((newBrief: DesignBrief) => {
    setBrief(newBrief);
    setStep('styling');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!brief) return;
    setGenerating(true);
    setStep('preview');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
      });
      const data = await res.json();

      if (data.html) {
        setGeneratedHtml(data.html);
        setGeneratedFiles(data.files || { 'index.html': data.html });
      }
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setGenerating(false);
    }
  }, [brief]);

  const handleDeploy = useCallback(async () => {
    if (!brief || !Object.keys(generatedFiles).length) return;
    setDeploying(true);
    setDeployResult(null);

    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName: brief.siteName,
          files: generatedFiles,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setDeployResult({ url: data.pagesUrl || data.repoUrl });
      } else {
        setDeployResult({ error: data.message || 'Deploy failed' });
      }
    } catch (err: any) {
      setDeployResult({ error: err.message || 'Failed to deploy' });
    } finally {
      setDeploying(false);
    }
  }, [brief, generatedFiles]);

  function regenerateWithStyle(style: KyronStyle) {
    if (!brief) return;
    setBrief({ ...brief, style, secondaryStyle: null, blendRatio: 0 });
    setGeneratedHtml('');
    setGeneratedFiles({});
    setDeployResult(null);
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="flex items-center justify-between px-4 h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs">
            K
          </div>
          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Kyron</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className={`w-1.5 h-1.5 rounded-full ${step === 'chat' ? 'bg-violet-500' : 'bg-zinc-300 dark:bg-zinc-600'}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${step === 'styling' ? 'bg-violet-500' : 'bg-zinc-300 dark:bg-zinc-600'}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${step === 'preview' ? 'bg-violet-500' : 'bg-zinc-300 dark:bg-zinc-600'}`} />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {step === 'chat' && (
          <div className="flex-1 max-w-2xl mx-auto w-full">
            <Chat onBriefReady={handleBriefReady} />
          </div>
        )}

        {step === 'styling' && brief && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">Design Brief</p>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{brief.siteName}</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">{brief.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50">
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">Industry</p>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{brief.industry}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">Audience</p>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{brief.targetAudience}</p>
                </div>
                {brief.brandPersonality?.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider">Personality</p>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {brief.brandPersonality.map((t: string) => (
                        <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-4">Choose Your Style</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {styleList.map((s) => (
                  <StyleCard
                    key={s.id}
                    id={s.id}
                    name={s.name}
                    description={s.description}
                    colors={s.colors}
                    selected={brief.style === s.id}
                    onClick={() => regenerateWithStyle(s.id)}
                  />
                ))}
              </div>

              <button
                onClick={handleGenerate}
                className="w-full py-3.5 text-base font-semibold rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-all"
              >
                Generate Site →
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex-shrink-0">
              <button
                onClick={() => setStep('styling')}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                ← Back to styles
              </button>
              <span className="text-xs text-zinc-300 dark:text-zinc-600">|</span>
              <span className="text-xs text-zinc-500">{brief?.siteName}</span>
              {brief && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 ml-auto">
                  {styleList.find(s => s.id === brief.style)?.name}
                </span>
              )}
            </div>
            <div className="flex-1">
              <PreviewFrame
                html={generatedHtml}
                loading={generating}
                files={generatedFiles}
                onDeploy={handleDeploy}
                deploying={deploying}
                deployResult={deployResult}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
