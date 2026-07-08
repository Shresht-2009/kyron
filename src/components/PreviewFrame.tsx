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
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">Preview</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('preview')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              view === 'preview'
                ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setView('code')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              view === 'code'
                ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            Code
          </button>
          <button
            onClick={onDeploy}
            disabled={!html || deploying}
            className="ml-2 px-4 py-1 text-xs font-semibold rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {deploying ? 'Deploying...' : 'Deploy →'}
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-900/80 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-zinc-500">Generating your site...</span>
            </div>
          </div>
        )}

        {view === 'preview' ? (
          html ? (
            <iframe
              srcDoc={html}
              className="w-full h-full border-0"
              title="Site Preview"
              sandbox="allow-scripts"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600">
              <div className="text-center">
                <div className="text-4xl mb-3">✦</div>
                <p className="text-sm">Your site will appear here after generation</p>
              </div>
            </div>
          )
        ) : (
          <pre className="h-full overflow-auto p-4 text-xs font-mono text-zinc-300 dark:text-zinc-400 bg-zinc-900 dark:bg-black">
            <code>{html || '// No code generated yet'}</code>
          </pre>
        )}

        {deployResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute bottom-4 left-4 right-4 p-3 rounded-lg text-sm ${
              deployResult.error
                ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{deployResult.error ? '⚠' : '✓'}</span>
              <span className="flex-1">{deployResult.error || 'Deployed successfully!'}</span>
              {deployResult.url && (
                <a
                  href={deployResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline hover:no-underline"
                >
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
