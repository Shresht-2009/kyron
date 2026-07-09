'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import StyleCard from '@/components/StyleCard';
import Chat from '@/components/Chat';
import PreviewFrame from '@/components/PreviewFrame';
import ReasoningTerminal from '@/components/ReasoningTerminal';
import type { DesignBrief, KyronStyle } from '@/types';

const STYLES: { id: KyronStyle; name: string; description: string; colors: string[] }[] = [
  { id: 'cyber-brutalism', name: 'Cyber-Brutalism', description: 'Neon glitch, raw grids, oversized. Dark and aggressive.', colors: ['#ff0055', '#00f0ff', '#ffdd00', '#0a0a0a'] },
  { id: 'scrollytelling', name: 'Scrollytelling', description: 'Narrative scroll, parallax depth, chapter-based story.', colors: ['#6c5ce7', '#a29bfe', '#fd79a8', '#0d0d1a'] },
  { id: 'kinetic-typography', name: 'Kinetic Typography', description: 'Animated text, morphing headlines, scroll reactions.', colors: ['#ffffff', '#ff6b6b', '#ffd93d', '#000000'] },
  { id: 'glass-aurora', name: 'Glass + Aurora', description: 'Frosted glass, gradient orbs, smooth blur depth.', colors: ['#7c3aed', '#06b6d4', '#f472b6', '#050510'] },
  { id: 'neo-brutalism', name: 'Neo-Brutalism', description: 'Heavy shadows, bold borders, high contrast.', colors: ['#ffdd00', '#ff3366', '#00ccff', '#ffffff'] },
];

type Step = 'chat' | 'styling' | 'preview';

interface HistoryItem {
  id: string;
  name: string;
  date: string;
  previewUrl: string;
}

export default function CreatePage() {
  const [step, setStep] = useState<Step>('chat');
  const [brief, setBrief] = useState<DesignBrief | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<KyronStyle[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [siteId, setSiteId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<{ url?: string; error?: string } | null>(null);
  const [askRepo, setAskRepo] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kyron_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const saveToHistory = useCallback((item: HistoryItem) => {
    setHistory(prev => {
      const next = [item, ...prev].slice(0, 50);
      try { localStorage.setItem('kyron_history', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const handleBriefReady = useCallback((newBrief: DesignBrief) => {
    setBrief(newBrief);
    setSelectedStyles([newBrief.style]);
    setStep('styling');
  }, []);

  const toggleStyle = (id: KyronStyle) => {
    setSelectedStyles(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        return prev.filter(s => s !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleGenerate = useCallback(() => {
    if (!brief) return;
    setShowTerminal(true);
  }, [brief]);

  const doGenerate = useCallback(async () => {
    if (!brief) return;
    setShowTerminal(false);
    setGenerating(true);

    const updatedBrief = { ...brief, secondaryStyles: selectedStyles.filter(s => s !== brief.style) };

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief: updatedBrief }),
      });
      const data = await res.json();

      if (data.html) {
        setGeneratedHtml(data.html);
        setGeneratedFiles(data.files || { 'index.html': data.html });
        setSiteId(data.siteId || null);
        setPreviewUrl(data.previewUrl || null);
        setStep('preview');

        if (data.siteId && data.previewUrl) {
          saveToHistory({
            id: data.siteId,
            name: updatedBrief.siteName,
            date: new Date().toISOString(),
            previewUrl: data.previewUrl,
          });
        }
      }
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setGenerating(false);
    }
  }, [brief, selectedStyles, saveToHistory]);

  const handleDeploy = useCallback(() => {
    setAskRepo(true);
  }, []);

  const doDeploy = useCallback(async () => {
    if (!brief || !repoUrl) return;

    const match = repoUrl.match(/github\.com[:\/]([\w-]+)\/([\w-]+?)(?:\.git)?$/);
    if (!match) {
      setDeployResult({ error: 'Invalid GitHub repo URL. Use: https://github.com/username/repo' });
      return;
    }

    setDeploying(true);
    setAskRepo(false);
    setDeployResult(null);

    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName: brief.siteName,
          files: generatedFiles,
          repoUrl,
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
  }, [brief, generatedFiles, repoUrl]);

  const loadHistoryItem = useCallback((item: HistoryItem) => {
    fetch(`/api/preview/${item.id}/`)
      .then(r => r.text())
      .then(html => {
        setGeneratedHtml(html);
        setGeneratedFiles({ 'index.html': html });
        setPreviewUrl(item.previewUrl);
        setSiteId(item.id);
        setStep('preview');
        setShowHistory(false);
      })
      .catch(() => alert('Could not load this site. It may have expired.'));
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#09090b]">
      {showTerminal && <ReasoningTerminal onComplete={doGenerate} />}

      <header className="flex items-center justify-between px-4 h-14 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-xl flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#ff4d00] flex items-center justify-center text-black font-bold text-xs">K</div>
          <span className="font-semibold text-sm text-zinc-100">Kyron</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-2.5 py-1 text-[11px] font-medium rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
          >
            {showHistory ? 'Close History' : `History (${history.length})`}
          </button>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span className={`w-1.5 h-1.5 rounded-full ${step === 'chat' ? 'bg-[#ff4d00]' : 'bg-zinc-700'}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${step === 'styling' ? 'bg-[#ff4d00]' : 'bg-zinc-700'}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${step === 'preview' ? 'bg-[#ff4d00]' : 'bg-zinc-700'}`} />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* History sidebar */}
        {showHistory && (
          <div className="w-64 flex-shrink-0 border-r border-zinc-800 bg-zinc-900/30 overflow-y-auto">
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold px-4 py-3 border-b border-zinc-800">
              Past Sites
            </div>
            {history.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-zinc-700">
                No sites generated yet.
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadHistoryItem(item)}
                  className={`w-full text-left px-4 py-3 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${
                    siteId === item.id ? 'bg-zinc-800/40' : ''
                  }`}
                >
                  <p className="text-sm font-medium text-zinc-200 truncate">{item.name}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">
                    {new Date(item.date).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          {step === 'chat' && (
            <div className="flex-1 max-w-2xl mx-auto w-full">
              <Chat onBriefReady={handleBriefReady} />
            </div>
          )}

          {step === 'styling' && brief && (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Design Brief</p>
                  <h1 className="text-2xl font-bold text-zinc-100">{brief.siteName}</h1>
                  <p className="text-zinc-400 mt-2">{brief.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500">Industry</p>
                    <p className="font-medium text-zinc-200">{brief.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Audience</p>
                    <p className="font-medium text-zinc-200">{brief.targetAudience}</p>
                  </div>
                  {brief.brandPersonality?.length > 0 && (
                    <div className="col-span-2">
                      <p className="text-xs text-zinc-500">Personality</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        {brief.brandPersonality.map((t: string) => (
                          <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-zinc-800 text-zinc-400">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-zinc-500">Accounts</p>
                    <p className="font-medium text-zinc-200">{brief.needsAuth ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Blog</p>
                    <p className="font-medium text-zinc-200">{brief.hasBlog ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                  Pick Styles <span className="text-zinc-600 font-normal normal-case">(1-3, pick multiple to blend)</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {STYLES.map((s) => (
                    <StyleCard
                      key={s.id}
                      id={s.id}
                      name={s.name}
                      description={s.description}
                      colors={s.colors}
                      selected={selectedStyles.includes(s.id)}
                      onClick={() => toggleStyle(s.id)}
                    />
                  ))}
                </div>

                <button
                  onClick={handleGenerate}
                  className="w-full py-3 text-sm font-semibold rounded-md bg-white text-black hover:bg-zinc-200 transition-all"
                >
                  Generate Site →
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
                <button onClick={() => setStep('styling')} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">← Back</button>
                <span className="text-xs text-zinc-700">|</span>
                <span className="text-xs text-zinc-400">{brief?.siteName}</span>
              </div>

              {askRepo && (
                <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/30">
                  <p className="text-xs text-zinc-400 mb-2">Enter your GitHub repo URL to deploy:</p>
                  <form onSubmit={(e) => { e.preventDefault(); doDeploy(); }} className="flex gap-2">
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/yourusername/your-repo"
                      className="flex-1 px-3 py-2 text-sm rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!repoUrl.trim()}
                      className="px-4 py-2 text-sm font-medium rounded-md bg-white text-black hover:bg-zinc-200 disabled:opacity-40 transition-all"
                    >
                      Deploy
                    </button>
                    <button
                      type="button"
                      onClick={() => setAskRepo(false)}
                      className="px-3 py-2 text-sm rounded-md border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}

              <div className="flex-1">
                <PreviewFrame
                  html={generatedHtml}
                  loading={generating}
                  files={generatedFiles}
                  onDeploy={handleDeploy}
                  deploying={deploying}
                  deployResult={deployResult}
                  previewUrl={previewUrl || undefined}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
