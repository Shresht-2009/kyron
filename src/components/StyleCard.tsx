'use client';

import { motion } from 'framer-motion';
import type { KyronStyle } from '@/types';

interface StyleCardProps {
  id: KyronStyle;
  name: string;
  description: string;
  colors: string[];
  selected: boolean;
  onClick: () => void;
}

const stylePreviews: Record<KyronStyle, { gradient: string; icon: string }> = {
  'cyber-brutalism': { gradient: 'from-rose-600 to-cyan-400', icon: '⚡' },
  scrollytelling: { gradient: 'from-indigo-500 to-purple-400', icon: '📜' },
  'kinetic-typography': { gradient: 'from-red-500 to-amber-400', icon: '⌨️' },
  'glass-aurora': { gradient: 'from-violet-500 to-teal-400', icon: '🌀' },
  'neo-brutalism': { gradient: 'from-yellow-400 to-pink-500', icon: '◆' },
};

export default function StyleCard({ id, name, description, colors, selected, onClick }: StyleCardProps) {
  const preview = stylePreviews[id];

  return (
    <motion.button
      onClick={onClick}
      className={`relative text-left w-full p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-zinc-400 bg-zinc-800'
          : 'border-zinc-800 bg-[#0b0b0f] hover:border-zinc-600'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${preview.gradient} flex items-center justify-center text-lg flex-shrink-0`}>
          {preview.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-zinc-200">{name}</h3>
          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{description}</p>
          <div className="flex gap-1 mt-2">
            {colors.slice(0, 4).map((c, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full border border-zinc-600"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        {selected && (
          <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </motion.button>
  );
}
