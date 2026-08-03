import React, { useState, useEffect } from 'react';
import { Menu, Search, Sparkles, Heart, Clock, Globe, Bell, Volume2, Mail } from 'lucide-react';
import { ActiveTab, PartnerProfile } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenMobileMenu: () => void;
  onOpenDailyLetter: () => void;
  onOpenSearch: () => void;
  profiles: { sofs: PartnerProfile; mumu: PartnerProfile };
  onUpdateMood: (partner: 'sofs' | 'mumu', newMood: string) => void;
  hasUnreadLetter?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  onOpenDailyLetter,
  onOpenSearch,
  profiles,
  onUpdateMood,
  hasUnreadLetter = false
}) => {
  const [londonTime, setLondonTime] = useState('');
  const [nyTime, setNyTime] = useState('');
  const [editingMoodFor, setEditingMoodFor] = useState<'sofs' | 'mumu' | null>(null);
  const [moodInput, setMoodInput] = useState('');

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setLondonTime(
        now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' })
      );
      setNyTime(
        now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTimes();
    const interval = setInterval(updateTimes, 10000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'home':
        return { title: 'Welcome Home, Sofs & Mumu', desc: 'Our shared digital sanctuary, memories & daily rhythm.' };
      case 'our-story':
        return { title: 'Our Story', desc: 'The chapters we have written together, and the ones yet to come.' };
      case 'calendar':
        return { title: 'Shared Calendar', desc: 'Synchronized dates, milestones, and daily rhythms.' };
      case 'little-things':
        return { title: 'Little Things', desc: 'A collection of delicate details, quirks, and small quiet joys.' };
      case 'music':
        return { title: 'Music Library', desc: 'A curated collection of melodies that frame our favorite memories.' };
      case 'photo-vault':
        return { title: 'Photo Vault', desc: 'Captured moments, precious golden hour laughter & vacations.' };
      case 'family-friends':
        return { title: 'Family & Friends', desc: 'The circle of warmth that surrounds our story.' };
      case 'timeline':
        return { title: 'The Chronicle of Us', desc: 'A chronological timeline of every milestone since our first hello.' };
      case 'faith':
        return { title: 'Faith & Reflections', desc: 'Shared prayers, cherished Quran verses, and spiritual quietude.' };
      case 'bucket-list':
        return { title: 'Bucket List', desc: 'Shared dreams, future travels, and life adventures waiting for us.' };
      case 'quiz':
        return { title: 'Relationship Quiz', icon: Sparkles, desc: 'How well do we know each other? Interactive memory flashcards.' };
      default:
        return { title: 'Sanctuary', desc: 'Our private love journal.' };
    }
  };

  const pageInfo = getPageTitle(activeTab);

  const handleSaveMood = (partner: 'sofs' | 'mumu') => {
    if (moodInput.trim()) {
      onUpdateMood(partner, moodInput.trim());
    }
    setEditingMoodFor(null);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0c0d12]/90 border-b border-[#d4af37]/15 backdrop-blur-md px-4 sm:px-8 py-4 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu & Page Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-[#1a1c26] text-[#d4af37] border border-[#d4af37]/20 hover:bg-[#252838] transition cursor-pointer"
            aria-label="Open Mobile Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-display font-semibold text-[#f3e7c4] tracking-tight">
                {pageInfo.title}
              </h1>
              <Heart className="w-4 h-4 text-[#d4af37] fill-[#d4af37]/20 hidden sm:inline-block" />
            </div>
            <p className="text-xs text-[#a39780] font-sans hidden sm:block mt-0.5">
              {pageInfo.desc}
            </p>
          </div>
        </div>

        {/* Right Side: World Clocks & Partner Avatars */}
        <div className="flex items-center justify-between md:justify-end space-x-3 sm:space-x-4">
          
          {/* Live World Clocks Badge */}
          <div className="hidden xl:flex items-center space-x-3 px-3.5 py-1.5 rounded-full bg-[#141620]/80 border border-[#d4af37]/15 text-xs text-[#c8bfab]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#a39780] font-medium">London:</span>
              <span className="font-mono text-[#f3e7c4] font-semibold">{londonTime || '15:42'}</span>
            </div>
            <span className="text-[#4a4234]">|</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[#a39780] font-medium">NY:</span>
              <span className="font-mono text-[#f3e7c4] font-semibold">{nyTime || '10:42'}</span>
            </div>
          </div>

          {/* Partner Avatars & Mood Pill */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Sofs Avatar */}
            <div className="relative group cursor-pointer" onClick={() => { setEditingMoodFor('sofs'); setMoodInput(profiles.sofs.currentMood || ''); }}>
              <img
                src={profiles.sofs.avatar}
                alt="Sofs"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[#d4af37]/50 shadow-md group-hover:scale-105 transition"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0c0d12]" title="Connected in London" />
            </div>

            <span className="text-[#d4af37]/40 text-xs">&amp;</span>

            {/* Mumu Avatar */}
            <div className="relative group cursor-pointer" onClick={() => { setEditingMoodFor('mumu'); setMoodInput(profiles.mumu.currentMood || ''); }}>
              <img
                src={profiles.mumu.avatar}
                alt="Mumu"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[#d4af37]/50 shadow-md group-hover:scale-105 transition"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0c0d12]" title="Connected in New York" />
            </div>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center space-x-1.5 pl-2 border-l border-[#d4af37]/15">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl bg-[#141620] border border-[#d4af37]/20 text-[#a39780] hover:text-[#d4af37] hover:border-[#d4af37]/40 transition cursor-pointer"
              title="Search Sanctuary"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenDailyLetter}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#211a12] via-[#161824] to-[#1e1712] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold hover:border-[#d4af37] transition shadow-sm flex items-center space-x-1.5 cursor-pointer relative"
              title="Letter of the Day"
            >
              <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline">Letter of the Day</span>
              {hasUnreadLetter && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Mood Edit Modal Dropdown */}
      {editingMoodFor && (
        <div className="fixed inset-0 bg-[#000000]/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="glass-panel p-6 rounded-2xl max-w-sm w-full border border-[#d4af37]/30 shadow-2xl">
            <h3 className="text-base font-display text-[#f3e7c4] mb-1">
              Update Current Mood for {editingMoodFor === 'sofs' ? 'Sofs' : 'Mumu'}
            </h3>
            <p className="text-xs text-[#a39780] mb-4">What's on your mind or heart right now?</p>
            <input
              type="text"
              value={moodInput}
              onChange={(e) => setMoodInput(e.target.value)}
              placeholder="e.g. Drinking tea & reading poetry..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37] mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingMoodFor(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-[#a39780] hover:text-[#f3e7c4]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveMood(editingMoodFor)}
                className="px-4 py-1.5 rounded-lg bg-[#d4af37] text-[#0c0d12] text-xs font-semibold hover:brightness-110"
              >
                Save Mood
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
