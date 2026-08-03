import React, { useState } from 'react';
import { Moon, Sparkles, BookOpen, Plus, Heart, Send, Check, Edit2, Trash2, X, MessageSquare, PenSquare } from 'lucide-react';
import { QuranVerse, SharedReflection } from '../types';

interface FaithScreenProps {
  verses: QuranVerse[];
  reflections: SharedReflection[];
  onAddVerse: (verse: Omit<QuranVerse, 'id'>) => void;
  onUpdateVerse?: (id: string, verse: Omit<QuranVerse, 'id'>) => void;
  onDeleteVerse?: (id: string) => void;
  onAddReflectionPrompt?: (prompt: Omit<SharedReflection, 'id'>) => void;
  onUpdateReflection?: (id: string, updated: Partial<SharedReflection>) => void;
  onDeleteReflection?: (id: string) => void;
  onAddReflectionNote: (id: string, partner: 'mumu' | 'sofs', note: string) => void;
}

export const FaithScreen: React.FC<FaithScreenProps> = ({
  verses,
  reflections,
  onAddVerse,
  onUpdateVerse,
  onDeleteVerse,
  onAddReflectionPrompt,
  onUpdateReflection,
  onDeleteReflection,
  onAddReflectionNote
}) => {
  // Verse Modal State
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const [editingVerseId, setEditingVerseId] = useState<string | null>(null);
  const [arabicText, setArabicText] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [reference, setReference] = useState('');
  const [personalNote, setPersonalNote] = useState('');

  // Reflection / Journal Prompt Modal State
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [promptDate, setPromptDate] = useState('Today');
  const [promptText, setPromptText] = useState('');
  const [mumuAnswer, setMumuAnswer] = useState('');
  const [sofsAnswer, setSofsAnswer] = useState('');

  // Inline Reflection Input
  const [activeReflectionInput, setActiveReflectionInput] = useState<{ [key: string]: string }>({});

  // Verse Handlers
  const handleOpenAddVerse = () => {
    setEditingVerseId(null);
    setArabicText('');
    setEnglishTranslation('');
    setReference('');
    setPersonalNote('');
    setIsVerseModalOpen(true);
  };

  const handleOpenEditVerse = (verse: QuranVerse) => {
    setEditingVerseId(verse.id);
    setArabicText(verse.arabicText);
    setEnglishTranslation(verse.englishTranslation);
    setReference(verse.reference);
    setPersonalNote(verse.personalNote || '');
    setIsVerseModalOpen(true);
  };

  const handleVerseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arabicText || !englishTranslation) return;

    if (editingVerseId && onUpdateVerse) {
      onUpdateVerse(editingVerseId, {
        arabicText,
        englishTranslation,
        reference: reference || 'Quran Verse',
        personalNote
      });
    } else {
      onAddVerse({
        arabicText,
        englishTranslation,
        reference: reference || 'Quran Verse',
        personalNote
      });
    }

    setEditingVerseId(null);
    setArabicText('');
    setEnglishTranslation('');
    setReference('');
    setPersonalNote('');
    setIsVerseModalOpen(false);
  };

  // Reflection Handlers
  const handleOpenAddPrompt = () => {
    setEditingPromptId(null);
    setPromptDate('Today');
    setPromptText('');
    setMumuAnswer('');
    setSofsAnswer('');
    setIsPromptModalOpen(true);
  };

  const handleOpenEditPrompt = (ref: SharedReflection) => {
    setEditingPromptId(ref.id);
    setPromptDate(ref.date || 'Recent');
    setPromptText(ref.prompt);
    setMumuAnswer(ref.mumuNote || '');
    setSofsAnswer(ref.sofsNote || '');
    setIsPromptModalOpen(true);
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText) return;

    if (editingPromptId && onUpdateReflection) {
      onUpdateReflection(editingPromptId, {
        prompt: promptText,
        date: promptDate,
        mumuNote: mumuAnswer,
        sofsNote: sofsAnswer
      });
    } else if (onAddReflectionPrompt) {
      onAddReflectionPrompt({
        prompt: promptText,
        date: promptDate || 'Recent',
        mumuNote: mumuAnswer,
        sofsNote: sofsAnswer
      });
    }

    setEditingPromptId(null);
    setPromptDate('Today');
    setPromptText('');
    setMumuAnswer('');
    setSofsAnswer('');
    setIsPromptModalOpen(false);
  };

  const handleSaveInlineReflection = (refId: string, partner: 'mumu' | 'sofs') => {
    const text = activeReflectionInput[refId];
    if (text?.trim()) {
      onAddReflectionNote(refId, partner, text.trim());
      setActiveReflectionInput({ ...activeReflectionInput, [refId]: '' });
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171924] via-[#12141d] to-[#1c1913] border border-[#d4af37]/20 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs text-[#d4af37] mb-1">
            <Moon className="w-4 h-4" />
            <span className="uppercase tracking-widest font-semibold">Spiritual Sanctuary</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#fff8e7]">Faith &amp; Reflections</h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#c8bfab]">
            A quiet space for prayers, cherished Quran verses, and our shared reflections and notes.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleOpenAddPrompt}
            className="px-4 py-2.5 rounded-2xl bg-[#1c1926] border border-[#d4af37]/30 text-[#f3e7c4] hover:border-[#d4af37] transition text-xs font-semibold flex items-center space-x-2 cursor-pointer"
          >
            <PenSquare className="w-4 h-4 text-[#d4af37]" />
            <span>Add Journal Prompt</span>
          </button>

          <button
            onClick={handleOpenAddVerse}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Verse</span>
          </button>
        </div>
      </div>

      {/* Featured Prayer / Daily Dua Hero Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-[#d4af37]/30 text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-[#181a24] to-[#0e1017]">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#211a12] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-lg">
          <Sparkles className="w-6 h-6 text-[#d4af37]" />
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#d4af37]">
            Our Daily Couple Dua
          </span>

          <p className="text-2xl sm:text-3xl font-serif text-[#f3e7c4] leading-loose text-right sm:text-center dir-rtl">
            رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا
          </p>

          <p className="text-sm sm:text-base font-serif italic text-[#c8bfab] leading-relaxed">
            "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous."
          </p>

          <span className="inline-block text-xs text-[#d4af37] font-mono">
            — Surah Al-Furqan (25:74)
          </span>
        </div>
      </div>

      {/* Main Grid: Verses List (7 cols) & Shared Reflections (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Verses Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-semibold text-[#fff8e7] flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              <span>Verses That Anchor Us</span>
            </h3>

            <button
              onClick={handleOpenAddVerse}
              className="text-xs text-[#d4af37] hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Verse</span>
            </button>
          </div>

          <div className="space-y-4">
            {verses.map((verse) => (
              <div key={verse.id} className="glass-panel p-6 rounded-3xl border border-[#d4af37]/20 space-y-4 relative group">
                
                {/* Action Buttons: Edit / Delete */}
                <div className="absolute top-4 left-4 flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleOpenEditVerse(verse)}
                    title="Edit Verse"
                    className="p-1.5 rounded-lg text-[#a39780] hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {onDeleteVerse && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete this verse from anchors?`)) {
                          onDeleteVerse(verse.id);
                        }
                      }}
                      title="Delete Verse"
                      className="p-1.5 rounded-lg text-[#a39780] hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-lg sm:text-xl font-serif text-[#f3e7c4] text-right leading-relaxed dir-rtl pt-2">
                  {verse.arabicText}
                </p>

                <p className="text-xs sm:text-sm font-serif text-[#c8bfab] italic leading-relaxed">
                  "{verse.englishTranslation}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#d4af37]/10 text-xs text-[#d4af37]">
                  <span className="font-mono font-semibold">{verse.reference}</span>
                  {verse.personalNote && (
                    <span className="text-[11px] text-[#8c816d] italic">{verse.personalNote}</span>
                  )}
                </div>
              </div>
            ))}

            {verses.length === 0 && (
              <div className="p-8 text-center glass-panel rounded-3xl border border-[#d4af37]/20 space-y-3">
                <BookOpen className="w-8 h-8 text-[#d4af37]/40 mx-auto" />
                <p className="text-xs text-[#a39780]">No verses added yet. Click above to add verses that anchor your hearts.</p>
              </div>
            )}
          </div>
        </div>

        {/* Reflections Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-semibold text-[#fff8e7] flex items-center space-x-2">
              <Heart className="w-4 h-4 text-[#d4af37]" />
              <span>Shared Journal Prompts</span>
            </h3>

            <button
              onClick={handleOpenAddPrompt}
              className="text-xs text-[#d4af37] hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Prompt</span>
            </button>
          </div>

          <div className="space-y-4">
            {reflections.map((ref) => (
              <div key={ref.id} className="glass-panel p-6 rounded-3xl border border-[#d4af37]/20 space-y-4 relative group">
                
                {/* Header info & Edit/Delete actions */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#d4af37] uppercase tracking-wider block">{ref.date}</span>
                    <h4 className="text-sm font-display font-semibold text-[#fff8e7] mt-0.5">{ref.prompt}</h4>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleOpenEditPrompt(ref)}
                      title="Edit Prompt & Responses"
                      className="p-1.5 rounded-lg text-[#a39780] hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {onDeleteReflection && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete this journal prompt?`)) {
                            onDeleteReflection(ref.id);
                          }
                        }}
                        title="Delete Prompt"
                        className="p-1.5 rounded-lg text-[#a39780] hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {ref.mumuNote && (
                  <div className="p-3 rounded-2xl bg-[#181a24] border border-[#d4af37]/15 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#d4af37] font-semibold">Mumu's Answer:</span>
                      <button
                        onClick={() => handleOpenEditPrompt(ref)}
                        className="text-[9px] text-[#a39780] hover:text-[#d4af37]"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-xs text-[#c8bfab] font-serif italic">"{ref.mumuNote}"</p>
                  </div>
                )}

                {ref.sofsNote && (
                  <div className="p-3 rounded-2xl bg-[#181a24] border border-[#d4af37]/15 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#d4af37] font-semibold">Sofs' Answer:</span>
                      <button
                        onClick={() => handleOpenEditPrompt(ref)}
                        className="text-[9px] text-[#a39780] hover:text-[#d4af37]"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-xs text-[#c8bfab] font-serif italic">"{ref.sofsNote}"</p>
                  </div>
                )}

                {(!ref.mumuNote || !ref.sofsNote) && (
                  <div className="space-y-2 pt-2 border-t border-[#d4af37]/10">
                    <input
                      type="text"
                      placeholder="Write your reflection note..."
                      value={activeReflectionInput[ref.id] || ''}
                      onChange={(e) => setActiveReflectionInput({ ...activeReflectionInput, [ref.id]: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/20 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                    />
                    <div className="flex justify-end space-x-2">
                      {!ref.mumuNote && (
                        <button
                          onClick={() => handleSaveInlineReflection(ref.id, 'mumu')}
                          className="px-3 py-1 rounded-lg bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-semibold hover:bg-[#d4af37] hover:text-[#0c0d12] cursor-pointer"
                        >
                          Save as Mumu
                        </button>
                      )}
                      {!ref.sofsNote && (
                        <button
                          onClick={() => handleSaveInlineReflection(ref.id, 'sofs')}
                          className="px-3 py-1 rounded-lg bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-semibold hover:bg-[#d4af37] hover:text-[#0c0d12] cursor-pointer"
                        >
                          Save as Sofs
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {reflections.length === 0 && (
              <div className="p-8 text-center glass-panel rounded-3xl border border-[#d4af37]/20 space-y-3">
                <Heart className="w-8 h-8 text-[#d4af37]/40 mx-auto" />
                <p className="text-xs text-[#a39780]">No journal prompts added yet. Create one to share your thoughts.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Add / Edit Verse Modal */}
      {isVerseModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsVerseModalOpen(false)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <h3 className="text-xl font-display text-[#fff8e7]">
              {editingVerseId ? 'Edit Quran Verse' : 'Add Quran Verse'}
            </h3>

            <form onSubmit={handleVerseSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Arabic Text *</label>
                <textarea
                  required
                  rows={2}
                  value={arabicText}
                  onChange={(e) => setArabicText(e.target.value)}
                  placeholder="وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37] text-right font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">English Translation *</label>
                <textarea
                  required
                  rows={3}
                  value={englishTranslation}
                  onChange={(e) => setEnglishTranslation(e.target.value)}
                  placeholder="And among His signs is that He created for you..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37] font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Surah Reference</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. Surah Ar-Rum 30:21"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Personal Note</label>
                <input
                  type="text"
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="e.g. Recited during our engagement"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#d4af37]/15">
                <button
                  type="button"
                  onClick={() => setIsVerseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a39780] hover:text-[#f3e7c4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] text-[#0c0d12] text-xs font-semibold hover:brightness-110 cursor-pointer"
                >
                  {editingVerseId ? 'Save Changes' : 'Save Verse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Journal Prompt Modal */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsPromptModalOpen(false)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <h3 className="text-xl font-display text-[#fff8e7]">
              {editingPromptId ? 'Edit Journal Prompt' : 'Add Journal Prompt'}
            </h3>

            <form onSubmit={handlePromptSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Prompt Question *</label>
                <textarea
                  required
                  rows={2}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="e.g. What is a prayer you recite for our happiness?"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Date Tag / Header</label>
                <input
                  type="text"
                  value={promptDate}
                  onChange={(e) => setPromptDate(e.target.value)}
                  placeholder="e.g. Today, Yesterday, or Ramadan 2024"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Mumu's Answer (Optional)</label>
                <textarea
                  rows={2}
                  value={mumuAnswer}
                  onChange={(e) => setMumuAnswer(e.target.value)}
                  placeholder="Mumu's response..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Sofs' Answer (Optional)</label>
                <textarea
                  rows={2}
                  value={sofsAnswer}
                  onChange={(e) => setSofsAnswer(e.target.value)}
                  placeholder="Sofs' response..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#d4af37]/15">
                <button
                  type="button"
                  onClick={() => setIsPromptModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a39780] hover:text-[#f3e7c4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] text-[#0c0d12] text-xs font-semibold hover:brightness-110 cursor-pointer"
                >
                  {editingPromptId ? 'Save Prompt Changes' : 'Create Prompt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
