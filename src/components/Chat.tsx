'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClarificationMessage, DesignBrief } from '@/types';

interface ChatProps {
  onBriefReady: (brief: DesignBrief) => void;
}

export default function Chat({ onBriefReady }: ChatProps) {
  const [messages, setMessages] = useState<ClarificationMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: "I'm Kyron. Tell me about your project — what's it called and what do you do?",
      type: 'question',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [generating, setGenerating] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const thinkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function generateBrief(history: { role: string; content: string }[]) {
    setGenerating(true);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Got it. Designing your site now...',
      type: 'result',
    }]);

    try {
      const res = await fetch('/api/clarify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, action: 'generate' }),
      });
      const data = await res.json();

      if (data.brief) {
        await new Promise(r => setTimeout(r, 800));
        onBriefReady(data.brief);
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Something went wrong generating the design. Try again?',
          type: 'question',
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Connection error. Please try again.',
        type: 'question',
      }]);
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  }

  async function sendMessage(content: string) {
    const userMsg: ClarificationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      type: 'answer',
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const nextCount = questionCount + 1;
    setQuestionCount(nextCount);

    const history = [...messages, userMsg].map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    if (nextCount >= 3) {
      await generateBrief(history);
      return;
    }

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    try {
      const res = await fetch('/api/clarify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, action: 'ask', questionCount: nextCount }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error: ${data.error}`,
          type: 'question',
        }]);
        return;
      }

      const isReady = data.ready;
      const assistantMsg: ClarificationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'Tell me more!',
        type: isReady ? 'result' : 'question',
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (isReady && data.brief) {
        await new Promise(r => setTimeout(r, 1000));
        onBriefReady(data.brief);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Connection issue. Try again?',
        type: 'question',
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading || generating) return;
    sendMessage(input.trim());
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-3">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="bg-zinc-800 text-zinc-100 text-sm rounded-lg px-4 py-2.5 max-w-[85%]">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-[4px] bg-[#ff4d00] flex items-center justify-center text-black font-bold text-[10px] flex-shrink-0 mt-0.5">
                    K
                  </div>
                  <div className="text-sm text-zinc-300 leading-relaxed">
                    {msg.content}
                    {msg.type === 'result' && (
                      <span className="inline-flex items-center gap-1.5 ml-2 text-[#ff4d00]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d00] animate-pulse" />
                        building...
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 pl-9"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-zinc-600"
                      style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-zinc-500">
                  {generating ? 'Building your site...' : 'Thinking...'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={endRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-4">
        <div className="max-w-lg mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={generating ? 'Building...' : 'Type your answer...'}
            disabled={loading || generating}
            className="flex-1 px-4 py-2.5 text-sm rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 disabled:opacity-40 transition-all"
          />
          <button
            type="submit"
            disabled={loading || generating || !input.trim()}
            className="px-5 py-2.5 text-sm font-medium rounded-md bg-white text-black hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {generating ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
