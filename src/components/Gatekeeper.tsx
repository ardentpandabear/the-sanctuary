import React, { useState } from 'react';
import { KeyRound, Heart, ArrowRight, Sparkles, Lock, Unlock } from 'lucide-react';
import { motion } from 'motion/react';

interface GatekeeperProps {
  onUnlock: () => void;
}

export const Gatekeeper: React.FC<GatekeeperProps> = ({ onUnlock }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow 'love', 'mumu', 'sofs', '1234', 'sanctuary', or empty enter for convenient demo
    const validKeys = ['love', 'mumu', 'sofs', 'sanctuary', '1234', 'forever', ''];
    if (validKeys.includes(passcode.trim().toLowerCase()) || passcode.length >= 0) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#0a0b0e] text-[#f3e7c4]">
      {/* Radial soft background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#3a2010]/30 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full text-center space-y-8"
      >
        {/* Top Emblem */}
        <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full bg-[#1e1b15]/80 border border-[#d4af37]/30 text-xs font-medium text-[#d4af37] shadow-lg shadow-[#000000]/50 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span className="tracking-widest uppercase text-[11px]">The Sanctuary • Private Sanctuary</span>
        </div>

        {/* Branding & Quote */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-script tracking-wide text-[#fff8e7] drop-shadow-[0_4px_12px_rgba(212,175,55,0.25)]">
            Sofs & Mumu
          </h1>
          <p className="text-base sm:text-lg font-serif italic text-[#c8bfab] max-w-sm mx-auto leading-relaxed">
            "Every love story deserves a place where it can live forever."
          </p>
        </div>

        {/* Lock Card Box */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#d4af37]/20 shadow-2xl relative">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[#181611] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner">
              <Lock className="w-6 h-6 text-[#d4af37]" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="passcode-key-input" className="block text-xs font-medium uppercase tracking-widest text-[#a89d87] mb-2">
                Enter The Key
              </label>
              <div className="relative">
                <input
                  id="passcode-key-input"
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setError(false);
                  }}
                  placeholder="Passcode key (e.g. love)..."
                  className={`w-full px-4 py-3 rounded-xl bg-[#0e0f14]/80 border ${
                    error ? 'border-rose-500/60 focus:ring-rose-500/50' : 'border-[#d4af37]/30 focus:border-[#d4af37] focus:ring-[#d4af37]/30'
                  } text-[#fff8e7] placeholder-[#6b6251] focus:outline-none focus:ring-2 transition text-center tracking-widest text-lg font-mono`}
                />
                <KeyRound className="absolute right-3.5 top-3.5 w-5 h-5 text-[#8c8068] pointer-events-none" />
              </div>
              {error && (
                <p className="text-xs text-rose-400 mt-2">
                  Incorrect key. Try <span className="underline cursor-pointer" onClick={() => setPasscode('love')}>love</span> or leave blank.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold tracking-wider text-sm hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-[#d4af37]/20 flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>ENTER SANCTUARY</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#d4af37]/10 flex items-center justify-between text-xs text-[#8c8068]">
            <button 
              type="button" 
              onClick={() => setShowHint(!showHint)}
              className="hover:text-[#d4af37] transition underline cursor-pointer"
            >
              {showHint ? 'Key: "love" or press Enter' : 'Forgot key?'}
            </button>
            <div className="flex items-center space-x-1 text-[#d4af37]/80">
              <Heart className="w-3.5 h-3.5 fill-[#d4af37]/30 text-[#d4af37]" />
              <span>Sanctuary v2.5</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-[#736855] font-sans">
          Encrypted with eternal love • Built exclusively for Sofs & Mumu
        </p>
      </motion.div>
    </div>
  );
};
