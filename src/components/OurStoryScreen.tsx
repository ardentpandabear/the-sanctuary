import React, { useState } from 'react';
import { BookOpen, Plus, MapPin, Calendar, Tag, Music, Sparkles, Heart, Filter, Trash2 } from 'lucide-react';
import { Chapter } from '../types';

interface OurStoryScreenProps {
  chapters: Chapter[];
  onAddChapter: (chapter: Omit<Chapter, 'id'>) => void;
  onDeleteChapter: (id: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const OurStoryScreen: React.FC<OurStoryScreenProps> = ({
  chapters,
  onAddChapter,
  onDeleteChapter,
  isAddModalOpen,
  setIsAddModalOpen
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [audioTrackName, setAudioTrackName] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [author, setAuthor] = useState<'sofs' | 'mumu' | 'both'>('both');

  // Extract unique tags
  const allTags = ['All', ...Array.from(new Set(chapters.flatMap(c => c.tags)))];

  const filteredChapters = selectedTag === 'All'
    ? chapters
    : chapters.filter(c => c.tags.includes(selectedTag));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    onAddChapter({
      chapterNumber: chapters.length + 1,
      title,
      location: location || 'London & NY',
      date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      description,
      tags: tagInput ? tagInput.split(',').map(t => t.trim()) : ['Memory'],
      coverImage: coverImage || 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1000',
      audioTrackName: audioTrackName || undefined,
      author
    });

    // Reset form
    setTitle('');
    setLocation('');
    setDate('');
    setDescription('');
    setCoverImage('');
    setAudioTrackName('');
    setTagInput('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171924] via-[#12141d] to-[#1c1913] border border-[#d4af37]/20 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs text-[#d4af37]">
            <BookOpen className="w-4 h-4" />
            <span className="uppercase tracking-widest font-semibold">The Chronicle</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#fff8e7]">Our Story</h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#c8bfab]">
            The chapters we've written together, and the ones yet to come.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Chapter</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
        <Filter className="w-4 h-4 text-[#d4af37] shrink-0 mr-1" />
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition shrink-0 cursor-pointer border ${
              selectedTag === tag
                ? 'bg-[#d4af37] text-[#0c0d12] border-[#d4af37] font-semibold'
                : 'bg-[#141620] text-[#a39780] border-[#d4af37]/15 hover:text-[#f3e7c4]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Chapters Cards Timeline */}
      <div className="space-y-8">
        {filteredChapters.map((chapter) => (
          <div 
            key={chapter.id}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition duration-300 relative group overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Cover Image (5 cols) */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#12141d] border border-[#d4af37]/20 shadow-lg">
                <img
                  src={chapter.coverImage}
                  alt={chapter.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0c0d12]/80 backdrop-blur-md border border-[#d4af37]/30 text-xs font-bold text-[#d4af37]">
                  Chapter {chapter.chapterNumber}
                </div>
              </div>

              {/* Story Content (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs text-[#d4af37]">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{chapter.location}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{chapter.date}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteChapter(chapter.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#a39780] hover:text-rose-400 transition cursor-pointer p-1"
                    title="Delete Chapter"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-2xl font-display font-semibold text-[#fff8e7]">
                  {chapter.title}
                </h3>

                <p className="text-sm font-serif text-[#c8bfab] leading-relaxed">
                  {chapter.description}
                </p>

                {chapter.audioTrackName && (
                  <div className="p-3 rounded-xl bg-[#141620] border border-[#d4af37]/20 flex items-center space-x-3 text-xs text-[#d4af37]">
                    <Music className="w-4 h-4 text-[#d4af37] animate-pulse shrink-0" />
                    <div>
                      <span className="font-semibold text-[#f3e7c4] block">{chapter.audioTrackName}</span>
                      <span className="text-[10px] text-[#a39780]">{chapter.audioTrackArtist || 'Soundtrack'}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#d4af37]/10">
                  <div className="flex flex-wrap gap-1.5">
                    {chapter.tags.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-full bg-[#181a24] text-[#a39780] text-[10px] border border-[#d4af37]/15">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <span className="text-[11px] text-[#8c816d] italic">
                    Authored by <span className="text-[#d4af37] capitalize">{chapter.author}</span>
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Add Chapter Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-display text-[#fff8e7]">Record New Chapter</h3>
              <p className="text-xs text-[#a39780]">Immortalize a new memory in Sofs & Mumu’s chronicle.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Chapter Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Our Autumn Walk in Hyde Park"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. London, UK"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. October 14, 2024"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Description / Memory Notes *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the moment, feelings, weather, laughter..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37] font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="London, First Meet, Sunset"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#d4af37]/15">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a39780] hover:text-[#f3e7c4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#0c0d12] text-xs font-semibold hover:brightness-110 cursor-pointer"
                >
                  Save Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
