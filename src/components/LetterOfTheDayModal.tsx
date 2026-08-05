import React, { useState } from 'react';
import { 
  Mail, 
  X, 
  Heart, 
  Send, 
  Sparkles, 
  Calendar, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Feather, 
  RotateCcw,
  BookOpen,
  User,
  Edit3,
  Trash2
} from 'lucide-react';
import { DailyLetter, PartnerProfile } from '../types';

interface LetterOfTheDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  letters: DailyLetter[];
  onSaveLetter: (letter: Omit<DailyLetter, 'id' | 'createdAt'>) => void;
  onMarkAsRead?: (letterId: string) => void;
  onDeleteLetter?: (letterId: string) => void;
  profiles: { sofs: PartnerProfile; mumu: PartnerProfile };
}

export const LetterOfTheDayModal: React.FC<LetterOfTheDayModalProps> = ({
  isOpen,
  onClose,
  letters,
  onSaveLetter,
  onMarkAsRead,
  onDeleteLetter,
  profiles
}) => {
  if (!isOpen) return null;

  // Active Perspective: who is using the app right now?
  const [activeUser, setActiveUser] = useState<'sofs' | 'mumu'>('sofs');
  const partnerUser = activeUser === 'sofs' ? 'mumu' : 'sofs';

  // Active View Tab: 'today' or 'archive'
  const [activeTab, setActiveTab] = useState<'today' | 'archive'>('today');

  // Unseal animation state for today's letter
  const [isUnsealed, setIsUnsealed] = useState(false);

  // Editor mode state
  const [isEditingMine, setIsEditingMine] = useState(false);

  // Form states for writing/editing letter
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Find today's letters
  const todayLetterFromPartner = letters.find(
    (l) => l.date === todayStr && l.from === partnerUser && l.to === activeUser
  );

  const todayLetterFromMe = letters.find(
    (l) => l.date === todayStr && l.from === activeUser && l.to === partnerUser
  );

  // Form fields
  const [letterTitle, setLetterTitle] = useState(todayLetterFromMe?.title || '');
  const [letterContent, setLetterContent] = useState(todayLetterFromMe?.content || '');
  const [paperStyle, setPaperStyle] = useState<'parchment' | 'midnight' | 'rose' | 'classic'>(
    todayLetterFromMe?.paperStyle || 'parchment'
  );
  const [waxSealColor, setWaxSealColor] = useState(
    todayLetterFromMe?.waxSealColor || (activeUser === 'sofs' ? '#b91c1c' : '#d4af37')
  );

  // Selected archive letter for modal view
  const [selectedArchiveLetter, setSelectedArchiveLetter] = useState<DailyLetter | null>(null);

  // AI Prompt Helper Generator inside Letter Editor
  const [aiIdea, setAiIdea] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAiPrompt = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const prompts = [
        `"My dearest ${profiles[partnerUser].name},\n\nToday, I caught myself remembering the exact way you looked when we first met. I wanted to tell you how grateful I am for every quiet moment we share..."`,
        `"To my favorite person in London & NY,\n\nEven across the distance today, you felt so close to my heart. Here are three little things that made me smile and think of you this morning..."`,
        `"My love,\n\nThank you for being my constant comfort. If I could send you one warm embrace right now across the miles, it would be wrapped in this note..."`
      ];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setLetterContent((prev) => (prev ? `${prev}\n\n${randomPrompt}` : randomPrompt));
      setAiIdea("AI prompt added to your letter! Feel free to edit or add your personal words.");
      setIsGeneratingAi(false);
    }, 600);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterContent.trim()) return;

    onSaveLetter({
      date: todayStr,
      from: activeUser,
      to: partnerUser,
      title: letterTitle.trim() || `Daily Note for ${profiles[partnerUser].name}`,
      content: letterContent.trim(),
      isRead: false,
      paperStyle,
      waxSealColor,
      fontStyle: 'serif'
    });

    setIsEditingMine(false);
  };

  const handleUnsealLetter = () => {
    setIsUnsealed(true);
    if (todayLetterFromPartner && onMarkAsRead && !todayLetterFromPartner.isRead) {
      onMarkAsRead(todayLetterFromPartner.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel max-w-2xl w-full p-5 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto custom-scrollbar my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#a39780] hover:text-[#f3e7c4] text-xl p-1 rounded-lg hover:bg-[#181a24] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#d4af37] uppercase tracking-widest">
            <Mail className="w-4 h-4 text-[#d4af37]" />
            <span>Daily Sealed Love Letter</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#fff8e7]">
                Letter of the Day
              </h2>
              <p className="text-xs text-[#a39780] font-serif italic mt-0.5">
                Every day, write a private note for each other. Unseal and read your daily love letter.
              </p>
            </div>

            {/* Active User Switcher */}
            <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-[#12141c] border border-[#d4af37]/20 shrink-0 self-start sm:self-auto">
              <span className="text-[10px] text-[#8c816d] px-2 font-medium">Viewing as:</span>
              <button
                onClick={() => { setActiveUser('sofs'); setIsUnsealed(false); }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                  activeUser === 'sofs' 
                    ? 'bg-[#d4af37] text-[#0c0d12] shadow-sm' 
                    : 'text-[#a39780] hover:text-[#f3e7c4]'
                }`}
              >
                <img src={profiles.sofs.avatar} alt="Sofs" className="w-4 h-4 rounded-full object-cover" />
                <span>Sofs</span>
              </button>

              <button
                onClick={() => { setActiveUser('mumu'); setIsUnsealed(false); }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                  activeUser === 'mumu' 
                    ? 'bg-[#d4af37] text-[#0c0d12] shadow-sm' 
                    : 'text-[#a39780] hover:text-[#f3e7c4]'
                }`}
              >
                <img src={profiles.mumu.avatar} alt="Mumu" className="w-4 h-4 rounded-full object-cover" />
                <span>Mumu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Today vs Archive) */}
        <div className="flex items-center space-x-2 border-b border-[#d4af37]/15 pb-2">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'today'
                ? 'bg-[#d4af37]/20 text-[#f3e7c4] border border-[#d4af37]/40'
                : 'text-[#8c816d] hover:text-[#f3e7c4]'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Today's Letter Exchange</span>
          </button>

          <button
            onClick={() => setActiveTab('archive')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'archive'
                ? 'bg-[#d4af37]/20 text-[#f3e7c4] border border-[#d4af37]/40'
                : 'text-[#8c816d] hover:text-[#f3e7c4]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Letter Archive &amp; History ({letters.length})</span>
          </button>
        </div>

        {/* Tab 1: Today's Letter Exchange */}
        {activeTab === 'today' && (
          <div className="space-y-6">
            
            {/* 1. Letter FROM Partner to You */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#d4af37] flex items-center space-x-1.5 uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 fill-[#d4af37]/30" />
                  <span>Letter for You Today (From {profiles[partnerUser].name})</span>
                </span>
                <span className="text-[10px] text-[#8c816d] font-mono">{todayStr}</span>
              </div>

              {todayLetterFromPartner ? (
                <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#181a24] to-[#0f1118] border border-[#d4af37]/30 shadow-xl space-y-4 text-center overflow-hidden">
                  
                  {!isUnsealed && !todayLetterFromPartner.isRead ? (
                    /* Sealed State with Wax Seal */
                    <div className="py-8 space-y-5 animate-fade-in">
                      <div className="w-16 h-16 mx-auto rounded-full bg-[#241d13] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-xl shadow-[#d4af37]/10 relative group">
                        <Lock className="w-7 h-7 text-[#d4af37]" />
                        <span 
                          className="absolute inset-0 rounded-full border-2 border-[#d4af37] animate-ping opacity-25"
                          style={{ borderColor: todayLetterFromPartner.waxSealColor || '#d4af37' }}
                        />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-lg font-serif text-[#f3e7c4]">
                          A Sealed Daily Note Waits for You
                        </h4>
                        <p className="text-xs text-[#a39780] max-w-sm mx-auto font-sans">
                          {profiles[partnerUser].name} wrote a personal letter for you today! Click below to break the seal and read.
                        </p>
                      </div>

                      <button
                        onClick={handleUnsealLetter}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 inline-flex items-center space-x-2 cursor-pointer"
                      >
                        <Unlock className="w-4 h-4" />
                        <span>Unseal &amp; Read Letter</span>
                      </button>
                    </div>
                  ) : (
                    /* Unsealed Open Letter View */
                    <div className="text-left space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-3">
                        <div className="flex items-center space-x-2">
                          <img
                            src={profiles[partnerUser].avatar}
                            alt={profiles[partnerUser].name}
                            className="w-8 h-8 rounded-full object-cover border border-[#d4af37]"
                          />
                          <div>
                            <h4 className="text-sm font-display font-semibold text-[#fff8e7]">
                              {todayLetterFromPartner.title || `Letter from ${profiles[partnerUser].name}`}
                            </h4>
                            <span className="text-[10px] text-[#a39780]">
                              Written by {profiles[partnerUser].name} • {profiles[partnerUser].location}
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-300 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Unsealed</span>
                        </span>
                      </div>

                      <div className="p-5 sm:p-6 rounded-2xl bg-[#0e1017]/90 border border-[#d4af37]/20 font-serif text-sm sm:text-base text-[#f3e7c4] leading-relaxed whitespace-pre-line shadow-inner">
                        {todayLetterFromPartner.content}
                      </div>

                      <div className="flex justify-end pt-1">
                        <span className="text-[10px] text-[#8c816d] italic font-serif">
                          — Sealed with love by {profiles[partnerUser].name}
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* Partner hasn't written today's letter yet */
                <div className="p-6 sm:p-8 rounded-3xl bg-[#141620]/80 border border-[#d4af37]/15 text-center space-y-3">
                  <Mail className="w-8 h-8 text-[#d4af37]/40 mx-auto" />
                  <h4 className="text-sm font-display font-semibold text-[#fff8e7]">
                    {profiles[partnerUser].name} hasn't written today's letter yet
                  </h4>
                  <p className="text-xs text-[#a39780] max-w-sm mx-auto">
                    Check back later today or leave them a message in chat to remind them to write your daily note!
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-[#d4af37]/15" />

            {/* 2. YOUR Letter for Partner */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#d4af37] flex items-center space-x-1.5 uppercase tracking-wider">
                  <Feather className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Your Daily Letter for {profiles[partnerUser].name}</span>
                </span>

                {todayLetterFromMe && !isEditingMine && (
                  <button
                    onClick={() => setIsEditingMine(true)}
                    className="text-xs text-[#d4af37] hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Today's Letter</span>
                  </button>
                )}
              </div>

              {todayLetterFromMe && !isEditingMine ? (
                /* Saved Letter Preview */
                <div className="p-5 sm:p-6 rounded-3xl bg-[#141620] border border-[#d4af37]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-display font-semibold text-[#fff8e7]">
                      {todayLetterFromMe.title}
                    </h4>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      Delivered for {profiles[partnerUser].name}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-serif text-[#c8bfab] italic whitespace-pre-line leading-relaxed">
                    "{todayLetterFromMe.content}"
                  </p>
                </div>
              ) : (
                /* Form Editor to Write or Edit Letter */
                <form onSubmit={handleSaveSubmit} className="p-5 sm:p-6 rounded-3xl bg-[#12141d] border border-[#d4af37]/30 space-y-4">
                  
                  {aiIdea && (
                    <div className="p-3 rounded-2xl bg-[#1d1b13] border border-[#d4af37]/30 text-xs text-[#d4af37] flex items-center justify-between">
                      <span>{aiIdea}</span>
                      <button
                        type="button"
                        onClick={() => setAiIdea(null)}
                        className="text-[#a39780] hover:text-[#f3e7c4]"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#a39780] mb-1">
                      Letter Title / Salutation
                    </label>
                    <input
                      type="text"
                      value={letterTitle}
                      onChange={(e) => setLetterTitle(e.target.value)}
                      placeholder={`e.g. My Dearest ${profiles[partnerUser].name}, Good Morning`}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090a0f] border border-[#d4af37]/25 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-[#a39780]">
                        Letter Message *
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateAiPrompt}
                        disabled={isGeneratingAi}
                        className="text-[11px] text-[#d4af37] hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#d4af37] animate-pulse" />
                        <span>{isGeneratingAi ? 'Thinking...' : 'AI Love Assistant Ideas'}</span>
                      </button>
                    </div>
                    <textarea
                      required
                      rows={5}
                      value={letterContent}
                      onChange={(e) => setLetterContent(e.target.value)}
                      placeholder={`Write what is on your heart today for ${profiles[partnerUser].name}...`}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090a0f] border border-[#d4af37]/25 text-xs sm:text-sm text-[#f3e7c4] focus:outline-none focus:border-[#d4af37] font-serif leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    {/* Seal Color Selector */}
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-[#a39780]">Wax Seal Color:</span>
                      <div className="flex items-center space-x-1.5">
                        {[
                          { color: '#d4af37', label: 'Gold' },
                          { color: '#b91c1c', label: 'Ruby' },
                          { color: '#4338ca', label: 'Sapphire' },
                          { color: '#059669', label: 'Emerald' }
                        ].map((s) => (
                          <button
                            key={s.color}
                            type="button"
                            onClick={() => setWaxSealColor(s.color)}
                            className={`w-5 h-5 rounded-full border border-[#fff]/30 transition transform hover:scale-110 cursor-pointer ${
                              waxSealColor === s.color ? 'ring-2 ring-offset-2 ring-[#d4af37] ring-offset-[#0c0d12]' : ''
                            }`}
                            style={{ backgroundColor: s.color }}
                            title={s.label}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isEditingMine && todayLetterFromMe && (
                        <button
                          type="button"
                          onClick={() => setIsEditingMine(false)}
                          className="px-3.5 py-2 rounded-xl text-xs text-[#a39780] hover:text-[#f3e7c4]"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 flex items-center space-x-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{todayLetterFromMe ? 'Update Letter' : 'Seal & Deliver Letter'}</span>
                      </button>
                    </div>
                  </div>

                </form>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Letter Vault & History */}
        {activeTab === 'archive' && (
          <div className="space-y-4">
            <p className="text-xs text-[#a39780]">
              Browse through every daily note and letter exchanged between Sofs &amp; Mumu over time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {letters.map((letter) => {
                const isFromPartner = letter.from === partnerUser;
                return (
                  <div
                    key={letter.id}
                    onClick={() => setSelectedArchiveLetter(letter)}
                    className="p-5 rounded-2xl bg-[#12141d] border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition cursor-pointer space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#d4af37]">
                      <span className="font-mono font-semibold">{letter.date}</span>
                      <span className="text-[10px] uppercase text-[#8c816d] font-semibold">
                        From {profiles[letter.from].name}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-display font-semibold text-[#fff8e7] line-clamp-1">
                      {letter.title || 'Daily Letter'}
                    </h4>

                    <p className="text-xs font-serif text-[#c8bfab] line-clamp-2 italic">
                      "{letter.content}"
                    </p>

                    <div className="flex justify-between items-center text-[10px] text-[#8c816d] pt-2 border-t border-[#d4af37]/10">
                      <span>Click to read full letter</span>
                      <Mail className="w-3 h-3 text-[#d4af37] group-hover:scale-110 transition" />
                    </div>
                    {onDeleteLetter && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteLetter(letter.id); }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg text-[#8c816d] hover:text-rose-400 hover:bg-rose-950/40 transition opacity-0 group-hover:opacity-100"
                        title="Delete this letter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}

              {letters.length === 0 && (
                <div className="col-span-full text-center p-8 bg-[#12141d] rounded-2xl text-xs text-[#8c816d]">
                  No historical letters archived yet. Start by writing today's letter above!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Archive Letter Overlay */}
        {selectedArchiveLetter && (
          <div className="fixed inset-0 bg-[#000000]/85 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/40 shadow-2xl space-y-4 relative">
              <button
                onClick={() => setSelectedArchiveLetter(null)}
                className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
              >
                &times;
              </button>

              <div className="flex items-center space-x-3 border-b border-[#d4af37]/20 pb-3">
                <img
                  src={profiles[selectedArchiveLetter.from].avatar}
                  alt={profiles[selectedArchiveLetter.from].name}
                  className="w-10 h-10 rounded-full object-cover border border-[#d4af37]"
                />
                <div>
                  <h3 className="text-base font-display font-semibold text-[#fff8e7]">
                    {selectedArchiveLetter.title || 'Daily Love Letter'}
                  </h3>
                  <p className="text-xs text-[#d4af37]">
                    From {profiles[selectedArchiveLetter.from].name} to {profiles[selectedArchiveLetter.to].name} • {selectedArchiveLetter.date}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#090a0f] border border-[#d4af37]/20 font-serif text-sm sm:text-base text-[#f3e7c4] leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto custom-scrollbar">
                {selectedArchiveLetter.content}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {onDeleteLetter && (
                  <button
                    onClick={() => { onDeleteLetter(selectedArchiveLetter.id); setSelectedArchiveLetter(null); }}
                    className="px-4 py-2 rounded-xl bg-rose-900/40 border border-rose-500/30 text-rose-300 font-semibold text-xs hover:bg-rose-900/70 cursor-pointer flex items-center space-x-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Letter</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedArchiveLetter(null)}
                  className="px-4 py-2 rounded-xl bg-[#d4af37] text-[#0c0d12] font-semibold text-xs hover:brightness-110 cursor-pointer"
                >
                  Close Letter
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
