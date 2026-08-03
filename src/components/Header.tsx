import React, { useState, useEffect } from 'react';
import { Menu, Search, Sparkles, Heart, Clock, Globe, Bell, Volume2, Mail, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { ActiveTab, PartnerProfile } from '../types';

const DEFAULT_PRESETS = [
  '☕ Cozy & Drinking Tea',
  '❤️ Missing You',
  '✨ Peaceful & Happy',
  '📚 Deep in Focus',
  '🌙 Restful Evening',
  '✈️ Dreaming of Kyoto'
];

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

  // Quick Preset Moods State with localStorage persistence
  const [moodPresets, setMoodPresets] = useState<string[]>(() => {
    const saved = localStorage.getItem('sanctuary_mood_presets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PRESETS;
  });

  const [newPresetText, setNewPresetText] = useState('');
  const [isAddingPreset, setIsAddingPreset] = useState(false);
  const [editingPresetIdx, setEditingPresetIdx] = useState<number | null>(null);
  const [editingPresetVal, setEditingPresetVal] = useState('');

  useEffect(() => {
    localStorage.setItem('sanctuary_mood_presets', JSON.stringify(moodPresets));
  }, [moodPresets]);

  const handleAddPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetText.trim()) return;
    setMoodPresets(prev => [...prev, newPresetText.trim()]);
    setNewPresetText('');
    setIsAddingPreset(false);
  };

  const handleDeletePreset = (idxToDelete: number) => {
    setMoodPresets(prev => prev.filter((_, idx) => idx !== idxToDelete));
  };

  const handleStartEditPreset = (idx: number, val: string) => {
    setEditingPresetIdx(idx);
    setEditingPresetVal(val);
  };

  const handleSaveEditPreset = (idxToSave: number) => {
    if (!editingPresetVal.trim()) {
      handleDeletePreset(idxToSave);
    } else {
      setMoodPresets(prev => prev.map((p, idx) => idx === idxToSave ? editingPresetVal.trim() : p));
    }
    setEditingPresetIdx(null);
    setEditingPresetVal('');
  };

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

          {/* Partner Avatars & Mood Tooltips */}
          <div className="flex items-center space-x-3">
            {/* Sofs Avatar with Hover Mood Tooltip */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => { setEditingMoodFor('sofs'); setMoodInput(profiles.sofs.currentMood || ''); }}
                className="relative block focus:outline-none cursor-pointer"
                aria-label="Set Sofs's Mood"
              >
                <img
                  src={profiles.sofs.avatar}
                  alt={profiles.sofs.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#d4af37]/60 shadow-md group-hover:border-[#d4af37] group-hover:scale-105 transition duration-200"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0c0d12]" title={`Location: ${profiles.sofs.location}`} />
              </button>

              {/* Hover Mood Card Tooltip */}
              <div className="absolute right-0 top-12 mt-1 hidden group-hover:flex flex-col w-56 p-3 rounded-2xl bg-[#0f1118]/95 border border-[#d4af37]/40 shadow-2xl backdrop-blur-md z-50 animate-fade-in pointer-events-none">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#d4af37]/15 mb-2">
                  <span className="text-xs font-display font-semibold text-[#f3e7c4]">{profiles.sofs.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#d4af37]/10 text-[#d4af37] font-mono border border-[#d4af37]/20">
                    {profiles.sofs.location}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-semibold text-[#d4af37] tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    <span>Current Mood</span>
                  </div>
                  <p className="text-xs text-[#f3e7c4] font-serif italic line-clamp-2">
                    "{profiles.sofs.currentMood || 'Feeling blissful and loved'}"
                  </p>
                </div>
                <div className="mt-2 pt-1.5 border-t border-[#d4af37]/10 text-[9px] text-[#a39780] text-center font-mono">
                  Click avatar to set mood ✎
                </div>
              </div>
            </div>

            <span className="text-[#d4af37]/50 font-serif italic text-sm">&amp;</span>

            {/* Mumu Avatar with Hover Mood Tooltip */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => { setEditingMoodFor('mumu'); setMoodInput(profiles.mumu.currentMood || ''); }}
                className="relative block focus:outline-none cursor-pointer"
                aria-label="Set Mumu's Mood"
              >
                <img
                  src={profiles.mumu.avatar}
                  alt={profiles.mumu.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#d4af37]/60 shadow-md group-hover:border-[#d4af37] group-hover:scale-105 transition duration-200"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0c0d12]" title={`Location: ${profiles.mumu.location}`} />
              </button>

              {/* Hover Mood Card Tooltip */}
              <div className="absolute right-0 top-12 mt-1 hidden group-hover:flex flex-col w-56 p-3 rounded-2xl bg-[#0f1118]/95 border border-[#d4af37]/40 shadow-2xl backdrop-blur-md z-50 animate-fade-in pointer-events-none">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#d4af37]/15 mb-2">
                  <span className="text-xs font-display font-semibold text-[#f3e7c4]">{profiles.mumu.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#d4af37]/10 text-[#d4af37] font-mono border border-[#d4af37]/20">
                    {profiles.mumu.location}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-semibold text-[#d4af37] tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    <span>Current Mood</span>
                  </div>
                  <p className="text-xs text-[#f3e7c4] font-serif italic line-clamp-2">
                    "{profiles.mumu.currentMood || 'Thinking of Sofs'}"
                  </p>
                </div>
                <div className="mt-2 pt-1.5 border-t border-[#d4af37]/10 text-[9px] text-[#a39780] text-center font-mono">
                  Click avatar to set mood ✎
                </div>
              </div>
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
        <div className="fixed inset-0 bg-[#000000]/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full border border-[#d4af37]/40 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-display font-semibold text-[#f3e7c4] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>Update {editingMoodFor === 'sofs' ? 'Sofs' : 'Mumu'}'s Mood</span>
              </h3>
              <p className="text-xs text-[#a39780] mt-0.5">What's on your mind or heart right now?</p>
            </div>

            <input
              type="text"
              value={moodInput}
              onChange={(e) => setMoodInput(e.target.value)}
              placeholder="e.g. Cozy & drinking tea..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
              autoFocus
            />

            {/* Quick Preset Pills with Add/Edit/Delete Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8c816d] uppercase font-mono tracking-wider">
                  Quick Preset Moods
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingPreset(!isAddingPreset)}
                  className="text-[10px] text-[#d4af37] hover:underline flex items-center space-x-0.5 cursor-pointer font-medium"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Preset</span>
                </button>
              </div>

              {/* Add New Preset Form */}
              {isAddingPreset && (
                <form onSubmit={handleAddPreset} className="flex items-center space-x-1.5 animate-fade-in">
                  <input
                    type="text"
                    value={newPresetText}
                    onChange={(e) => setNewPresetText(e.target.value)}
                    placeholder="e.g. 🌸 Relaxing in Garden"
                    className="flex-1 px-2.5 py-1.5 rounded-xl bg-[#080a0f] border border-[#d4af37]/40 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1.5 rounded-xl bg-[#d4af37] text-[#0c0d12] hover:brightness-110 cursor-pointer"
                    title="Add Preset"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsAddingPreset(false); setNewPresetText(''); }}
                    className="p-1.5 rounded-xl bg-[#1a1c28] text-[#a39780] hover:text-[#f3e7c4] cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* Preset List Pills */}
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar p-0.5">
                {moodPresets.map((preset, idx) => {
                  const isEditingThis = editingPresetIdx === idx;

                  if (isEditingThis) {
                    return (
                      <div key={idx} className="flex items-center space-x-1 bg-[#141620] p-1 rounded-xl border border-[#d4af37]/50 w-full">
                        <input
                          type="text"
                          value={editingPresetVal}
                          onChange={(e) => setEditingPresetVal(e.target.value)}
                          className="flex-1 bg-transparent text-xs text-[#f3e7c4] focus:outline-none px-1"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEditPreset(idx)}
                          className="p-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPresetIdx(null)}
                          className="p-1 text-[#a39780] hover:text-[#f3e7c4] cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="group/preset inline-flex items-center rounded-xl bg-[#141620] border border-[#d4af37]/20 text-[11px] text-[#c8bfab] hover:border-[#d4af37] hover:text-[#f3e7c4] transition"
                    >
                      <button
                        type="button"
                        onClick={() => setMoodInput(preset)}
                        className="px-2.5 py-1 text-left cursor-pointer hover:text-[#d4af37]"
                        title="Click to apply mood"
                      >
                        {preset}
                      </button>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center pr-1.5 opacity-0 group-hover/preset:opacity-100 transition space-x-1 border-l border-[#d4af37]/15 pl-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditPreset(idx, preset)}
                          className="p-0.5 text-[#a39780] hover:text-[#d4af37] cursor-pointer"
                          title="Modify preset"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePreset(idx)}
                          className="p-0.5 text-[#a39780] hover:text-rose-400 cursor-pointer"
                          title="Delete preset"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-[#d4af37]/15">
              <button
                type="button"
                onClick={() => setEditingMoodFor(null)}
                className="px-3 py-1.5 rounded-xl text-xs text-[#a39780] hover:text-[#f3e7c4] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveMood(editingMoodFor!)}
                className="px-5 py-1.5 rounded-xl bg-[#d4af37] text-[#0c0d12] text-xs font-semibold hover:brightness-110 cursor-pointer"
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
