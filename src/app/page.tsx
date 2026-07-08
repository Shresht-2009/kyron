'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const styleShowcase = [
  { name: 'Cyber-Brutalism', tag: 'Neon. Raw. Oversized.', color: '#ff0055', bg: '#0a0a0a' },
  { name: 'Scrollytelling', tag: 'Narrative. Depth. Motion.', color: '#6c5ce7', bg: '#0d0d1a' },
  { name: 'Kinetic Typography', tag: 'Letters that move.', color: '#ff6b6b', bg: '#000000' },
  { name: 'Glass + Aurora', tag: 'Frosted. Glowing. Deep.', color: '#7c3aed', bg: '#050510' },
  { name: 'Neo-Brutalism', tag: 'Shadows. Borders. Guts.', color: '#ffdd00', bg: '#ffffff' },
];

const styleMorph = [
  'brutalist cyberpunk',
  'narrative scrollytelling',
  'kinetic typography',
  'glass aurora dream',
  'neo-brutalist bold',
  'japanese minimal',
  'editorial magazine',
  'vaporwave retro',
  'dark academia',
  'brutalist glass',
];

export default function Landing() {
  const [email, setEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [morphIdx, setMorphIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMorphIdx(i => (i + 1) % styleMorph.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="bg-[#0b0b0f] text-zinc-100 min-h-screen overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 backdrop-blur-lg bg-[#0b0b0f]/70 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-[#ff4d00] flex items-center justify-center text-black font-bold text-xs">
            K
          </div>
          <span className="font-semibold tracking-tight">Kyron</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/create" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
            Builder
          </Link>
          <a href="#waitlist" className="px-4 py-1.5 text-sm font-medium rounded-md bg-white text-black hover:bg-zinc-200 transition-colors">
            Early Access
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center px-6 pt-24 pb-16 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,_#ff4d00_0%,_transparent_60%)] opacity-15" />
        <div className="max-w-6xl mx-auto w-full relative z-10">

          <motion.div style={{ opacity: heroOpacity }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-medium rounded-full border border-zinc-700 text-zinc-400 bg-zinc-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d00]" />
              AI Design Studio — now in early access
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-6">
              <span className="text-zinc-100">Describe your site.</span>
              <br />
              <span className="text-zinc-500">Kyron builds it.</span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-500 max-w-xl mb-10 leading-relaxed">
              Not another template. Not another page builder. Kyron thinks, designs, 
              generates, and deploys — in minutes. With 3D, motion, and a style that is yours.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <Link
                href="/create"
                className="px-6 py-3 text-sm font-semibold rounded-md bg-white text-black hover:bg-zinc-200 transition-all"
              >
                Build Something →
              </Link>
              <a
                href="#how"
                className="px-6 py-3 text-sm font-medium rounded-md border border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 transition-all"
              >
                How it works
              </a>
            </div>

            {/* Morphing style tag */}
            <div className="mt-16">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-3">Choose a direction</p>
              <AnimatePresence mode="wait">
                <motion.span
                  key={morphIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block text-2xl sm:text-3xl font-light text-zinc-400 italic"
                >
                  {styleMorph[morphIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="px-6 py-32">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-4">Process</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-zinc-800/50">
            {[
              { step: '01', title: 'Clarify', desc: 'Kyron asks what you need. You answer. It asks again until it gets it right.' },
              { step: '02', title: 'Design', desc: 'A complete design system is built — colors, type, 3D, motion. Human-level taste.' },
              { step: '03', title: 'Generate', desc: 'Your site assembles with Three.js scenes, kinetic text, and scroll narratives.' },
              { step: '04', title: 'Deploy', desc: 'One click. GitHub Pages. A live URL. No config, no hosting setup.' },
            ].map((item) => (
              <div key={item.step} className="bg-[#0b0b0f] p-8 group hover:bg-zinc-900/50 transition-colors">
                <span className="text-3xl font-bold text-zinc-700 group-hover:text-[#ff4d00] transition-colors">{item.step}</span>
                <h3 className="text-lg font-semibold mt-4 mb-2 text-zinc-200">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styles Showcase */}
      <section className="px-6 py-32 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-2">Styles</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-zinc-200">
            Five aesthetics. Infinite hybrids.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {styleShowcase.map((s) => (
              <div
                key={s.name}
                className="group p-6 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-all"
              >
                <div
                  className="w-full h-1 mb-5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <h3 className="text-base font-semibold text-zinc-200">{s.name}</h3>
                <p className="text-sm text-zinc-500 mt-1">{s.tag}</p>
              </div>
            ))}
            <div className="p-6 rounded-lg border border-dashed border-zinc-700 flex items-center justify-center text-sm text-zinc-600">
              Blend any two →
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist / Early Access */}
      <section id="waitlist" className="px-6 py-32">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-4">Early Access</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-200 mb-4">
            Kyron is free during beta.
          </h2>
          <p className="text-zinc-500 mb-8 leading-relaxed">
            No credit card. No limits. Just describe your vision and get a live site.
          </p>

          {waitlistSubmitted ? (
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm">
              You are on the list. We will send you a note when your spot is ready.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setWaitlistSubmitted(true);
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 text-sm rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 text-sm font-semibold rounded-md bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                Join Waitlist
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[4px] bg-[#ff4d00] flex items-center justify-center text-black font-bold text-[8px]">
              K
            </div>
            Kyron
          </div>
          <p>Made for Hackonomics 2027. Built with Groq.</p>
        </div>
      </footer>
    </div>
  );
}
