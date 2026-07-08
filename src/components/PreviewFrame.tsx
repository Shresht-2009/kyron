'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PreviewFrameProps {
  html: string;
  loading: boolean;
  files: Record<string, string>;
  onDeploy: () => void;
  deploying: boolean;
  deployResult: { url?: string; error?: string } | null;
}

export default function PreviewFrame({ html, loading, files, onDeploy, deploying, deployResult }: PreviewFrameProps) {
  const [view, setView] = useState<'preview' | 'code'>('preview');

  return (
    <div className="h-full flex flex-col bg-[#09090b] rounded-lg border border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
          </div>
          <span className="text-[11px] text-zinc-600 font-mono">preview</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setView('preview')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              view === 'preview'
                ? 'bg-zinc-800 text-zinc-200'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setView('code')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              view === 'code'
                ? 'bg-zinc-800 text-zinc-200'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Code
          </button>
          <button
            onClick={onDeploy}
            disabled={!html || deploying}
            className="ml-2 px-3 py-1 text-[11px] font-medium rounded bg-white text-black hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {deploying ? 'Deploying...' : 'Deploy →'}
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#09090b]/90 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#ff4d00] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-zinc-500">Generating...</span>
            </div>
          </div>
        )}

        {view === 'preview' ? (
          html ? (
            <iframe
              srcDoc={html}
              className="w-full h-full border-0"
              title="Preview"
              sandbox="allow-scripts"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-zinc-700">Site preview will appear here</p>
              </div>
            </div>
          )
        ) : (
          <pre className="h-full overflow-auto p-4 text-xs font-mono text-zinc-400 bg-black">
            <code>{html || '// code will appear here'}</code>
          </pre>
        )}

        {deployResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute bottom-3 left-3 right-3 p-3 rounded text-sm ${
              deployResult.error
                ? 'bg-red-900/40 border border-red-800 text-red-400'
                : 'bg-green-900/40 border border-green-800 text-green-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{deployResult.error ? '!' : '✓'}</span>
              <span className="flex-1">{deployResult.error || 'Deployed!'}</span>
              {deployResult.url && (
                <a href={deployResult.url} target="_blank" rel="noopener noreferrer" className="font-medium underline">
                  Open
                </a>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
