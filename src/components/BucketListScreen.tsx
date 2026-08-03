import React, { useState } from 'react';
import { Compass, Plus, CheckCircle2, Circle, Clock, Sparkles, Filter, Trash2 } from 'lucide-react';
import { BucketListItem } from '../types';

interface BucketListScreenProps {
  items: BucketListItem[];
  onAddBucketItem: (item: Omit<BucketListItem, 'id'>) => void;
  onToggleStatus: (id: string) => void;
  onDeleteBucketItem: (id: string) => void;
}

export const BucketListScreen: React.FC<BucketListScreenProps> = ({
  items,
  onAddBucketItem,
  onToggleStatus,
  onDeleteBucketItem
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BucketListItem['category']>('Travel');
  const [targetDate, setTargetDate] = useState('');

  const categories = ['All', 'Travel', 'Experiences', 'Life Goals', 'Cozy'];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(i => i.category === selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onAddBucketItem({
      category,
      title,
      description,
      targetDate: targetDate || 'Someday soon',
      status: 'Planned'
    });

    setTitle('');
    setDescription('');
    setTargetDate('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171924] via-[#12141d] to-[#1c1913] border border-[#d4af37]/20 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs text-[#d4af37] mb-1">
            <Compass className="w-4 h-4" />
            <span className="uppercase tracking-widest font-semibold">Shared Dreams</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#fff8e7]">Bucket List</h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#c8bfab]">
            Dreams waiting to be realized. Keep track of our shared adventures, big and small.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dream</span>
        </button>
      </div>

      {/* Filter Categories */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
        <Filter className="w-4 h-4 text-[#d4af37] shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition shrink-0 cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-[#d4af37] text-[#0c0d12] border-[#d4af37] font-semibold'
                : 'bg-[#141620] text-[#a39780] border-[#d4af37]/15 hover:text-[#f3e7c4]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bucket List Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => {
          const isDone = item.status === 'Completed';
          return (
            <div
              key={item.id}
              className={`glass-panel p-6 rounded-3xl border transition duration-300 relative group flex flex-col justify-between ${
                isDone ? 'border-emerald-500/30 bg-[#0d1814]/40' : 'border-[#d4af37]/20 hover:border-[#d4af37]/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => onToggleStatus(item.id)}
                      className="mt-0.5 text-[#d4af37] hover:scale-110 transition cursor-pointer"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#8c816d]" />
                      )}
                    </button>

                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#181a24] text-[#d4af37] text-[10px] font-semibold uppercase border border-[#d4af37]/20">
                        {item.category}
                      </span>
                      <h3 className={`text-lg font-display font-semibold mt-1 ${isDone ? 'line-through text-[#8c816d]' : 'text-[#fff8e7]'}`}>
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteBucketItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#8c816d] hover:text-rose-400 transition cursor-pointer p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs font-serif text-[#c8bfab] leading-relaxed pl-8">
                  {item.description}
                </p>

                {item.photoUrl && (
                  <div className="pl-8 pt-2">
                    <img src={item.photoUrl} alt={item.title} className="w-full h-40 object-cover rounded-2xl border border-[#d4af37]/20" />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#d4af37]/10 flex items-center justify-between text-xs text-[#8c816d] pl-8">
                <span>Status: <strong className={isDone ? 'text-emerald-400' : 'text-[#d4af37]'}>{item.status}</strong></span>
                {item.targetDate && <span>📅 {item.targetDate}</span>}
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

            <h3 className="text-xl font-display text-[#fff8e7]">Add Shared Dream</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Dream Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Visit Autumn Gardens in Kyoto"
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
                    <option value="Travel">Travel</option>
                    <option value="Experiences">Experiences</option>
                    <option value="Life Goals">Life Goals</option>
                    <option value="Cozy">Cozy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Target Date</label>
                  <input
                    type="text"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    placeholder="e.g. October 2025"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe why this adventure inspires us..."
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
                  Save Dream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
