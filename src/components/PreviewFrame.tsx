'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface PreviewFrameProps {
  html: string;
  loading: boolean;
  files: Record<string, string>;
  onDeploy: () => void;
  deploying: boolean;
  deployResult: { url?: string; error?: string } | null;
}

function splitPath(p: string): string[] {
  return p.replace(/^\/+/, '').split('/');
}

interface TreeNode {
  name: string;
  path: string;
  children: Map<string, TreeNode>;
  isFile: boolean;
}

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = { name: '', path: '', children: new Map(), isFile: false };
  for (const p of paths) {
    const parts = splitPath(p);
    let cur = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      if (!cur.children.has(part)) {
        cur.children.set(part, {
          name: part,
          path: parts.slice(0, i + 1).join('/'),
          children: new Map(),
          isFile: isLast,
        });
      }
      cur = cur.children.get(part)!;
    }
  }
  return root;
}

function FileTree({ node, depth = 0, selected, onSelect }: {
  node: TreeNode;
  depth?: number;
  selected: string;
  onSelect: (path: string) => void;
}) {
  const entries = Array.from(node.children.entries()).sort(([a, aa], [b, bb]) => {
    if (aa.isFile !== bb.isFile) return aa.isFile ? 1 : -1;
    return a.localeCompare(b);
  });

  return (
    <div>
      {entries.map(([name, child]) => (
        <div key={child.path}>
          {child.isFile ? (
            <button
              onClick={() => onSelect(child.path)}
              className={`w-full text-left px-3 py-1 text-[12px] font-mono truncate transition-colors ${
                selected === child.path
                  ? 'bg-zinc-700/50 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
              style={{ paddingLeft: `${12 + depth * 14}px` }}
            >
              {name}
            </button>
          ) : (
            <div>
              <div
                className="text-[11px] font-medium text-zinc-500 px-3 py-1 select-none"
                style={{ paddingLeft: `${12 + depth * 14}px` }}
              >
                {name}
              </div>
              <FileTree node={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function highlightCode(code: string, lang: string): string {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (lang === 'html') {
    return escaped.replace(/(&lt;\/?[\w-]+(?:\s+[\w-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s*\/?&gt;)/g, '<span style="color:#569cd6;">$1</span>')
      .replace(/&lt;!--[\s\S]*?--&gt;/g, '<span style="color:#6a9955;">$&</span>')
      .replace(/(["'])(?:(?!\1|\\).|\\.)*\1/g, '<span style="color:#ce9178;">$&</span>');
  }

  if (lang === 'css') {
    return escaped
      .replace(/([\w-]+)\s*(?=:)/g, '<span style="color:#9cdcfe;">$1</span>')
      .replace(/:\s*(.+?);/g, ': <span style="color:#ce9178;">$1</span>;')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#6a9955;">$1</span>')
      .replace(/(\.?[\w-]+)(?=\{)/g, '<span style="color:#d7ba7d;">$1</span>');
  }

  return escaped
    .replace(/(\/\/.*)/g, '<span style="color:#6a9955;">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#6a9955;">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span style="color:#ce9178;">$1</span>')
    .replace(/\b(var|let|const|function|return|if|else|for|while|class|import|export|from|new|this|true|false|null|undefined)\b/g, '<span style="color:#569cd6;">$1</span>');
}

function detectLang(path: string): string {
  if (path.endsWith('.html')) return 'html';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.js')) return 'js';
  return 'text';
}

export default function PreviewFrame({ html, loading, files, onDeploy, deploying, deployResult }: PreviewFrameProps) {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [selectedFile, setSelectedFile] = useState<string>('index.html');

  const filePaths = useMemo(() => Object.keys(files), [files]);
  const tree = useMemo(() => buildTree(filePaths), [filePaths]);

  const currentContent = files[selectedFile] || '';
  const currentLang = detectLang(selectedFile);

  const renderedHtml = selectedFile.endsWith('.html') ? currentContent : html;

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

      <div className="flex-1 flex min-h-0">
        {/* File Tree Sidebar */}
        {filePaths.length > 1 && (
          <div className="w-48 flex-shrink-0 border-r border-zinc-800 overflow-y-auto bg-black/20">
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold px-3 py-2 border-b border-zinc-800">
              Files
            </div>
            <FileTree node={tree} selected={selectedFile} onSelect={setSelectedFile} />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 relative min-w-0">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#09090b]/90 z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-[#ff4d00] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-zinc-500">Generating...</span>
              </div>
            </div>
          )}

          {view === 'preview' ? (
            renderedHtml ? (
              <iframe
                srcDoc={renderedHtml}
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
              <code
                className="block"
                dangerouslySetInnerHTML={{
                  __html: currentContent
                    ? highlightCode(currentContent, currentLang)
                    : '// select a file to view its code',
                }}
              />
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
    </div>
  );
}
