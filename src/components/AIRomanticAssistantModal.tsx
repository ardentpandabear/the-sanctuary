import React, { useState } from 'react';
import { Bot, Sparkles, Heart, RefreshCw, Copy, Check, Send, BookOpen, Coffee, Flame } from 'lucide-react';

interface AIRomanticAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIRomanticAssistantModal: React.FC<AIRomanticAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [topic, setTopic] = useState<'date' | 'poem' | 'ldr' | 'reflection'>('date');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sampleIdeas = {
    date: [
      "✨ **Virtual Candlelight Dinner**: Sync an Italian pasta recipe, cook together on video call, light jasmine scented candles, and play a jazz vinyl soundtrack.",
      "✨ **Star Mapping Night**: Find a clear night in both London & NY, use a stargazing app, and trace the constellations visible to both of you.",
      "✨ **Custom Memory Quiz Date**: Take turns asking 10 detailed questions about your early messaging history and reward each correct answer with a sweet surprise."
    ],
    poem: [
      "Across three thousand miles of sea,\nYour laughter echoes back to me.\nFrom London rain to NYC night,\nIn every darkness, you're my light.\n\nHand in hand beneath the stars,\nNo distance separates what's ours.",
      "A quiet cup of morning tea,\nA memory beneath the tree.\nWith every breath, with every prayer,\nI find your gentle spirit there."
    ],
    ldr: [
      "💌 **Letter-by-Mail Exchange**: Write handwritten wax-sealed letters on parchment paper and mail them across the Atlantic to open on FaceTime.",
      "🎧 **Shared Midnight Playlist**: Add 5 songs that match your mood today and listen simultaneously using the Music Library player.",
      "📖 **Book Club for Two**: Pick a short novella or poetry book and read one chapter together each Sunday."
    ],
    reflection: [
      "🌿 **Reflection Prompt**: What was the exact moment you realized you wanted to spend the rest of your life together?",
      "🌿 **Reflection Prompt**: What is one small, everyday ritual you are most excited to build in your future home?"
    ]
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedText(null);

    try {
      // Call server proxy if available or generate sweet custom response
      const res = await fetch('/api/ai/romantic-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, customInput: prompt }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedText(data.result);
      } else {
        throw new Error('Fallback to local presets');
      }
    } catch {
      // High quality romantic fallback
      setTimeout(() => {
        const presets = sampleIdeas[topic];
        const randomItem = presets[Math.floor(Math.random() * presets.length)];
        setGeneratedText(randomItem);
        setIsLoading(false);
      }, 700);
      return;
    }

    setIsLoading(false);
  };

  const handleCopy = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-2xl border border-[#d4af37]/30 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e1a12] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner">
              <Bot className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-lg font-display text-[#f3e7c4] flex items-center space-x-2">
                <span>AI Romantic Spark</span>
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
              </h2>
              <p className="text-xs text-[#a39780]">Generates date night ideas, poems & LDR connection rituals for Sofs & Mumu.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Topic Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'date', label: 'Date Ideas', icon: Coffee },
            { id: 'poem', label: 'Love Poem', icon: Heart },
            { id: 'ldr', label: 'LDR Connection', icon: Flame },
            { id: 'reflection', label: 'Reflections', icon: BookOpen }
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = topic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { setTopic(t.id as any); setGeneratedText(null); }}
                className={`flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-medium transition cursor-pointer border ${
                  isSelected
                    ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f3e7c4]'
                    : 'bg-[#141620] border-[#d4af37]/10 text-[#8c816d] hover:text-[#f3e7c4]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Prompt Optional Input */}
        <div>
          <label className="block text-xs font-medium text-[#a39780] mb-1.5">
            Add a specific detail or vibe (Optional):
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Rainy autumn London mood, or coffee lovers..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1017] border border-[#d4af37]/20 text-xs text-[#f3e7c4] placeholder-[#635a4b] focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] text-xs font-semibold tracking-wider hover:brightness-110 active:scale-[0.98] transition shadow-md shadow-[#d4af37]/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#0c0d12]" />
              <span>Weaving Magic...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#0c0d12]" />
              <span>Generate Inspiration</span>
            </>
          )}
        </button>

        {/* Output Display Box */}
        {generatedText && (
          <div className="p-4 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold flex items-center space-x-1">
                <Heart className="w-3 h-3 fill-[#d4af37]" />
                <span>Sanctuary Inspiration</span>
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-[#a39780] hover:text-[#f3e7c4] flex items-center space-x-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-[#e2e0d8] whitespace-pre-line leading-relaxed font-serif text-sm">
              {generatedText}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
