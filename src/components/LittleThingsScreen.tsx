import React, { useState } from 'react';
import { Sparkles, Flower2, Coffee, Utensils, Quote, Mic, Plus, Heart, Filter, Trash2 } from 'lucide-react';
import { LittleThing } from '../types';

interface LittleThingsScreenProps {
  littleThings: LittleThing[];
  onAddLittleThing: (thing: Omit<LittleThing, 'id'>) => void;
  onDeleteLittleThing: (id: string) => void;
}

export const LittleThingsScreen: React.FC<LittleThingsScreenProps> = ({
  littleThings,
  onAddLittleThing,
  onDeleteLittleThing
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState<LittleThing['category']>('Favorites');
  const [addedBy, setAddedBy] = useState<'sofs' | 'mumu'>('sofs');

  const categories = ['All', 'Favorites', 'Quirks', 'Scents', 'Snacks', 'Quotes', 'Rituals'];

  const filteredItems = selectedCategory === 'All'
    ? littleThings
    : littleThings.filter(item => item.category === selectedCategory);

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Favorites': return Flower2;
      case 'Quirks': return Coffee;
      case 'Scents': return Sparkles;
      case 'Snacks': return Utensils;
      case 'Quotes': return Quote;
      case 'Rituals': return Mic;
      default: return Heart;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !details) return;

    onAddLittleThing({
      category,
      title,
      subtitle: subtitle || '',
      details,
      addedBy,
      iconName: category,
    });

    setTitle('');
    setSubtitle('');
    setDetails('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171924] via-[#12141d] to-[#1c1913] border border-[#d4af37]/20 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs text-[#d4af37] mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="uppercase tracking-widest font-semibold">Small Joys</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#fff8e7]">Little Things</h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#c8bfab]">
            The delicate details, quirks, and quiet favorites that make us who we are.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Little Detail</span>
        </button>
      </div>

      {/* Filter Categories */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
        <Filter className="w-4 h-4 text-[#d4af37] shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition shrink-0 cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-[#d4af37] text-[#0c0d12] border-[#d4af37] font-semibold'
                : 'bg-[#141620] text-[#a39780] border-[#d4af37]/15 hover:text-[#f3e7c4]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const IconComponent = getIcon(item.category);
          return (
            <div
              key={item.id}
              className="glass-panel p-6 rounded-3xl border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition duration-300 relative group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#1e1b15] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#181a24] text-[#d4af37] text-[10px] font-semibold border border-[#d4af37]/20">
                      {item.category}
                    </span>
                    <button
                      onClick={() => onDeleteLittleThing(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-[#8c816d] hover:text-rose-400 transition cursor-pointer p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-display font-semibold text-[#fff8e7]">{item.title}</h3>
                  <p className="text-xs text-[#a39780] font-sans mt-0.5">{item.subtitle}</p>
                </div>

                <p className="text-xs font-serif text-[#c8bfab] leading-relaxed italic">
                  "{item.details}"
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#d4af37]/10 flex items-center justify-between text-[11px] text-[#8c816d]">
                <span>Noted by <strong className="text-[#d4af37] capitalize">{item.addedBy}</strong></span>
                <Heart className="w-3.5 h-3.5 text-[#d4af37]/40 fill-[#d4af37]/20" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <h3 className="text-xl font-display text-[#fff8e7]">Add Little Detail</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lavender & Chamomile Tea"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Favorites">Favorites</option>
                    <option value="Quirks">Quirks</option>
                    <option value="Scents">Scents</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Quotes">Quotes</option>
                    <option value="Rituals">Rituals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Added By</label>
                  <select
                    value={addedBy}
                    onChange={(e) => setAddedBy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="sofs">Sofs</option>
                    <option value="mumu">Mumu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Sofs’ evening drink"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Details &amp; Observations *</label>
                <textarea
                  required
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Why is this detail special to us?"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37] font-serif"
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
                  className="px-5 py-2 rounded-xl bg-[#d4af37] text-[#0c0d12] text-xs font-semibold hover:brightness-110 cursor-pointer"
                >
                  Save Detail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
