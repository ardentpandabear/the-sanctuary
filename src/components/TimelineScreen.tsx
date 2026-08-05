import React, { useState, useRef } from 'react';
import { Clock, Plus, MapPin, Calendar, Heart, Sparkles, Filter, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { TimelineMilestone } from '../types';

interface TimelineScreenProps {
  milestones: TimelineMilestone[];
  onAddMilestone: (milestone: Omit<TimelineMilestone, 'id'>) => void;
  onDeleteMilestone: (id: string) => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({
  milestones,
  onAddMilestone,
  onDeleteMilestone
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<TimelineMilestone['category']>('milestone');
  const [photoUrl, setPhotoUrl] = useState('');
  const [tag, setTag] = useState('');
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = ['All', 'firsts', 'travel', 'milestone', 'celebration', 'life'];

  const filteredMilestones = selectedCategory === 'All'
    ? milestones
    : milestones.filter(m => m.category === selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    onAddMilestone({
      year: year || '',
      date: date || '',
      title,
      description,
      category,
      location: location || '',
      photoUrl: photoUrl || undefined,
      tag: tag || ''
    });

    setTitle('');
    setDate('');
    setDescription('');
    setPhotoUrl('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171924] via-[#12141d] to-[#1c1913] border border-[#d4af37]/20 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs text-[#d4af37] mb-1">
            <Clock className="w-4 h-4" />
            <span className="uppercase tracking-widest font-semibold">The Chronicle</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#fff8e7]">Timeline of Us</h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#c8bfab]">
            Every milestone, first, and grand adventure recorded in sequential memory.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Filter Chips */}
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

      {/* Vertical Timeline Nodes */}
      <div className="relative border-l-2 border-[#d4af37]/30 ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-10">
        {filteredMilestones.map((ms) => (
          <div key={ms.id} className="relative group">
            
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-5 h-5 rounded-full bg-[#12141d] border-2 border-[#d4af37] flex items-center justify-center shadow-[0_0_12px_#d4af37]">
              <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
            </div>

            {/* Content Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition duration-300 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#d4af37]">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-sm text-[#f3e7c4]">{ms.year}</span>
                  <span>•</span>
                  <span>📅 {ms.date}</span>
                  <span>•</span>
                  <span>📍 {ms.location}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#181a24] text-[#d4af37] text-[10px] font-semibold border border-[#d4af37]/20">
                    {ms.tag}
                  </span>
                  <button
                    onClick={() => onDeleteMilestone(ms.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#8c816d] hover:text-rose-400 transition cursor-pointer p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-display font-semibold text-[#fff8e7]">{ms.title}</h3>

              {ms.photoUrl && (
                <img
                  src={ms.photoUrl}
                  alt={ms.title}
                  className="w-full max-h-64 object-cover rounded-2xl border border-[#d4af37]/20"
                />
              )}

              <p className="text-xs sm:text-sm font-serif text-[#c8bfab] leading-relaxed">
                {ms.description}
              </p>
            </div>

          </div>
        ))}
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

            <h3 className="text-xl font-display text-[#fff8e7]">Add Milestone</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Milestone Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Our First Trip to Kyoto"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. October 14, 2024"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kyoto, Japan"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-[#a39780]">Milestone Photo</label>
                  <button
                    type="button"
                    onClick={() => photoFileInputRef.current?.click()}
                    className="text-[11px] text-[#d4af37] hover:underline flex items-center space-x-1 cursor-pointer font-medium"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload from Gallery / Device</span>
                  </button>
                  <input
                    type="file"
                    ref={photoFileInputRef}
                    onChange={handlePhotoFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Paste Image URL or click 'Upload from Gallery'"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
                {photoUrl && photoUrl.startsWith('data:image') && (
                  <p className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3 text-emerald-400" />
                    <span>✓ Photo loaded from gallery</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe why this milestone is so special..."
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
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};