import Link from 'next/link';
import Header from '@/components/Header';

const styles = [
  { name: 'Cyber-Brutalism', desc: 'Neon glitch, raw grids, oversized', gradient: 'from-rose-600 to-cyan-400' },
  { name: 'Scrollytelling', desc: 'Narrative scroll, parallax chapters', gradient: 'from-indigo-500 to-purple-400' },
  { name: 'Kinetic Typography', desc: 'Animated text, morphing headlines', gradient: 'from-red-500 to-amber-400' },
  { name: 'Glass + Aurora', desc: 'Frosted glass, gradient orbs, blur', gradient: 'from-violet-500 to-teal-400' },
  { name: 'Neo-Brutalism', desc: 'Heavy shadows, bold borders', gradient: 'from-yellow-400 to-pink-500' },
];

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent dark:from-violet-500/5" />

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              AI Design Studio
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                Describe it.
              </span>
              <br />
              <span className="text-zinc-900 dark:text-zinc-100">Kyron builds it.</span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The first AI design studio that thinks before it builds. 
              Kyron clarifies your vision, designs a unique aesthetic, 
              generates a stunning site with 3D + motion, and deploys it live.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/create"
                className="px-8 py-3.5 text-base font-semibold rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-all shadow-lg shadow-zinc-900/20 dark:shadow-white/10"
              >
                Start Building Free
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-3.5 text-base font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                How it Works
              </a>
            </div>
          </div>
        </section>

        <section id="styles" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3">Design Styles</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                Five bold aesthetics. Infinite blends.
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-3">
                Each style has its own typography, color theory, 3D strategy, and motion language.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {styles.map((s) => (
                <div
                  key={s.name}
                  className="group relative p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{s.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{s.desc}</p>
                </div>
              ))}
              <div className="p-6 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-sm text-zinc-400 dark:text-zinc-500">
                AI blends any two styles →
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 px-4 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3">How It Works</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                Design-first AI. Not code-first.
              </h2>
            </div>

            <div className="space-y-8">
              {[
                { step: '01', title: 'Clarify', desc: 'Kyron asks smart questions to understand your brand, audience, and vision.' },
                { step: '02', title: 'Design', desc: 'AI generates a complete design brief — colors, typography, 3D strategy, and style.' },
                { step: '03', title: 'Generate', desc: 'Your site is assembled with 3D scenes, kinetic typography, and scroll animations.' },
                { step: '04', title: 'Deploy', desc: 'One click deploys to GitHub Pages. You get a live URL instantly.' },
                { step: '05', title: 'Evolve', desc: '"Make it more brutalist." Kyron regenerates the design while keeping your content.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-500 dark:text-zinc-400 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300 flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="pt-2.5">
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">{item.title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Ready to build something stunning?
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">
              No account needed. No templates. Just your vision, brought to life.
            </p>
            <Link
              href="/create"
              className="inline-flex px-8 py-3.5 text-base font-semibold rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-all"
            >
              Start Building Free
            </Link>
          </div>
        </section>

        <footer className="py-8 px-4 text-center text-sm text-zinc-400 dark:text-zinc-600 border-t border-zinc-200 dark:border-zinc-800">
          Kyron — AI Design Studio. Built for Hackonomics 2027.
        </footer>
      </main>
    </>
  );
}
