'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const styles = [
  { name: 'Cyber-Brutalism', tag: 'Neon. Raw. Oversized.', color: '#ff0055' },
  { name: 'Scrollytelling', tag: 'Narrative. Depth. Chapters.', color: '#6c5ce7' },
  { name: 'Kinetic Typography', tag: 'Letters that move.', color: '#ff6b6b' },
  { name: 'Glass + Aurora', tag: 'Frosted. Glowing. Deep.', color: '#7c3aed' },
  { name: 'Neo-Brutalism', tag: 'Shadows. Borders. Guts.', color: '#ffdd00' },
];

const morphWords = [
  'a brutalist landing page',
  'a narrative scrollytelling site',
  'a kinetic typography showcase',
  'a glassmorphic portfolio',
  'a neo-brutalist storefront',
  'a minimalist brand page',
];

export default function Landing() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % morphWords.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div ref={ref} className="bg-[#09090b] text-zinc-100 min-h-screen">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 bg-[#09090b]/80 backdrop-blur-lg border-b border-zinc-800/50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#ff4d00] flex items-center justify-center text-black font-bold text-xs">K</div>
          <span className="font-semibold text-sm tracking-tight">Kyron</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/create" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Builder</Link>
          <a href="#waitlist" className="text-sm px-4 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors">Join waitlist</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center px-6 pt-20 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,#ff4d00_0%,transparent_60%)] opacity-[0.08]" />
        <div className="max-w-4xl mx-auto w-full relative z-10">
          <motion.div style={{ opacity }}>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d00]" />
              AI Design Studio
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-5">
              <span className="text-zinc-100">Type what you need.</span>
              <br />
              <span className="text-zinc-600">Kyron builds it.</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-500 max-w-lg mb-8 leading-relaxed">
              Describe your site. Kyron asks a few questions, designs the aesthetic, 
              generates the code with 3D and motion, and deploys it live.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/create" className="px-6 py-2.5 text-sm font-medium rounded-md bg-white text-black hover:bg-zinc-200 transition-all">
                Try it →
              </Link>
              <a href="#how" className="px-6 py-2.5 text-sm font-medium rounded-md border border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 transition-all">
                How it works
              </a>
            </div>

            {/* Morphing text */}
            <div className="mt-16">
              <p className="text-xs uppercase tracking-[0.15em] text-zinc-700 mb-3">You can build</p>
              <div className="h-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIdx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.25 }}
                    className="text-xl sm:text-2xl text-zinc-400 font-light italic"
                  >
                    {morphWords[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-600 mb-2">How it works</p>
          <h2 className="text-3xl font-bold mb-16">Four steps to a live site.</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-zinc-800 rounded-lg overflow-hidden">
            {[
              { n: '01', title: 'Chat', desc: 'Tell Kyron what you are building. It asks 2-3 questions to nail the brief.' },
              { n: '02', title: 'Choose', desc: 'Pick a style — or let Kyron pick one. Each has its own 3D, motion, and typography.' },
              { n: '03', title: 'Generate', desc: 'Your site is assembled with Three.js scenes, GSAP animations, and responsive CSS.' },
              { n: '04', title: 'Deploy', desc: 'One click to GitHub Pages. A live URL, no configuration needed.' },
            ].map(s => (
              <div key={s.n} className="bg-[#09090b] p-6 hover:bg-zinc-900/50 transition-colors">
                <span className="text-2xl font-bold text-zinc-700">{s.n}</span>
                <h3 className="text-sm font-semibold text-zinc-200 mt-3 mb-1.5">{s.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styles */}
      <section className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-600 mb-2">Styles</p>
          <h2 className="text-3xl font-bold mb-12">Five aesthetics. Infinite blends.</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {styles.map(s => (
              <div key={s.name} className="p-4 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors group">
                <div className="w-full h-0.5 rounded-full mb-4" style={{ background: s.color }} />
                <h3 className="text-sm font-semibold text-zinc-200">{s.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{s.tag}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-600 mb-3">Early access</p>
          <h2 className="text-2xl font-bold mb-3">Kyron is free during beta.</h2>
          <p className="text-sm text-zinc-500 mb-8">No credit card. No limits. Just your vision.</p>
          {submitted ? (
            <div className="p-3 rounded-md bg-zinc-900 border border-zinc-700 text-sm text-zinc-400">
              You are on the list.
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true); }} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-3.5 py-2.5 text-sm rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              <button type="submit" className="px-5 py-2.5 text-sm font-medium rounded-md bg-white text-black hover:bg-zinc-200 transition-colors">
                Join
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-600">
          <span>Kyron — AI Design Studio</span>
          <span>Built with Groq</span>
        </div>
      </footer>
    </div>
  );
}
