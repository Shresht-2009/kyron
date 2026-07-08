'use client';

import { useEffect, useState, useRef } from 'react';

const THOUGHTS = [
  'analyzing user requirements...',
  'evaluating design direction...',
  'selecting typography scale...',
  'configuring color palette...',
  'planning 3D scene layout...',
  'optimizing motion language...',
  'structuring page sections...',
  'generating layout grid...',
  'writing responsive styles...',
  'composing hero section...',
  'building feature components...',
  'injecting Three.js scene...',
  'calibrating scroll animations...',
  'blending secondary style...',
  'polishing typography...',
  'compiling final output...',
];

export default function ReasoningTerminal({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<{ text: string; type: 'thought' | 'action' | 'result' }[]>([]);
  const [phase, setPhase] = useState<'thinking' | 'building' | 'done'>('thinking');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  useEffect(() => {
    let idx = 0;
    let charIdx = 0;
    let currentText = '';
    let running = true;

    const tick = () => {
      if (!running) return;

      if (idx >= THOUGHTS.length) {
        setPhase('building');
        setTimeout(() => {
          setPhase('done');
          setTimeout(onComplete, 600);
        }, 800);
        return;
      }

      const target = THOUGHTS[idx];

      setLines(prev => {
        const newLines = [...prev];
        if (charIdx === 0) {
          newLines.push({ text: '', type: idx % 3 === 0 ? 'thought' : idx % 3 === 1 ? 'action' : 'result' });
        }
        newLines[newLines.length - 1] = {
          ...newLines[newLines.length - 1],
          text: target.slice(0, charIdx + 1),
        };
        return newLines;
      });

      charIdx++;

      if (charIdx >= target.length) {
        idx++;
        charIdx = 0;
        setTimeout(tick, 200 + Math.random() * 300);
      } else {
        setTimeout(tick, 30 + Math.random() * 60);
      }
    };

    setTimeout(tick, 500);

    return () => { running = false; };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-700 bg-black overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border-b border-zinc-700">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-zinc-500 font-mono ml-2">kyron — reasoning engine</span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${phase === 'thinking' ? 'bg-amber-400 animate-pulse' : phase === 'building' ? 'bg-blue-400 animate-pulse' : 'bg-green-400'}`} />
            <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">
              {phase === 'thinking' ? 'Reasoning...' : phase === 'building' ? 'Building...' : 'Complete'}
            </span>
          </div>
        </div>

        {/* Terminal content */}
        <div className="h-80 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
          <div className="text-zinc-600 mb-3">
            <span className="text-zinc-500">$</span> kyron generate --style={'{custom}'}
          </div>

          {lines.map((line, i) => (
            <div key={i} className="mb-0.5">
              <span className={
                line.type === 'thought' ? 'text-zinc-400' :
                line.type === 'action' ? 'text-emerald-400' : 'text-zinc-500'
              }>
                {line.type === 'thought' ? '  • ' : line.type === 'action' ? '  → ' : '  ✓ '}
                {line.text}
                {i === lines.length - 1 && phase !== 'done' && (
                  <span className="inline-block w-1.5 h-3.5 bg-zinc-400 ml-0.5 animate-pulse" />
                )}
              </span>
            </div>
          ))}

          {phase === 'done' && (
            <div className="mt-3 text-green-400">
              <span className="text-green-500 font-semibold">✓ Site generated successfully</span>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-zinc-800">
          <div
            className={`h-full transition-all duration-500 ${
              phase === 'thinking' ? 'bg-amber-500' :
              phase === 'building' ? 'bg-blue-500' : 'bg-green-500'
            }`}
            style={{
              width: phase === 'thinking' ? `${(lines.length / THOUGHTS.length) * 70}%` :
                     phase === 'building' ? '85%' : '100%',
            }}
          />
        </div>
      </div>
    </div>
  );
}
