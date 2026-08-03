import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  Plus, 
  MapPin, 
  Calendar, 
  Music, 
  Sparkles, 
  Filter, 
  Trash2, 
  Edit2, 
  Upload, 
  Image as ImageIcon,
  Wand2,
  Loader2,
  Check,
  Link as LinkIcon
} from 'lucide-react';
import { Chapter } from '../types';

interface OurStoryScreenProps {
  chapters: Chapter[];
  onAddChapter: (chapter: Omit<Chapter, 'id'>) => void;
  onUpdateChapter: (id: string, chapter: Omit<Chapter, 'id'>) => void;
  onDeleteChapter: (id: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

// Helpers for Spotify Embed parsing & metadata
const parseSpotifyEmbed = (url: string): string => {
  if (!url) return '';
  let trackId = '';
  if (url.includes('spotify.com/track/')) {
    trackId = url.split('spotify.com/track/')[1]?.split('?')[0] || '';
  } else if (url.includes('spotify:track:')) {
    trackId = url.split('spotify:track:')[1] || '';
  } else if (url.includes('spotify.com/embed/track/')) {
    return url;
  }
  return trackId ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0` : url;
};

const fetchSpotifyMetadata = async (url: string) => {
  const cleanUrl = url.trim();
  if (!cleanUrl) return null;
  const isSpotify = cleanUrl.includes('spotify.com') || cleanUrl.includes('spotify:track:');
  
  let trackId = '';
  const match = cleanUrl.match(/track[\/:]([a-zA-Z0-9]+)/);
  if (match) trackId = match[1];

  if (isSpotify) {
    try {
      const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(cleanUrl)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        return {
          title: data.title || '',
          artist: data.author_name || 'Spotify Artist',
          embedUrl: trackId ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0` : cleanUrl
        };
      }
    } catch (e) {
      console.warn("Spotify oEmbed error:", e);
    }
  }

  return {
    title: trackId ? `Spotify Track (${trackId.slice(0, 6)})` : 'Spotify Memory Song',
    artist: 'Spotify',
    embedUrl: trackId ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0` : cleanUrl
  };
};

export const OurStoryScreen: React.FC<OurStoryScreenProps> = ({
  chapters,
  onAddChapter,
  onUpdateChapter,
  onDeleteChapter,
  isAddModalOpen,
  setIsAddModalOpen
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Form & Editing State
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [author, setAuthor] = useState<'sofs' | 'mumu' | 'both'>('both');

  // Spotify Music State
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [audioTrackName, setAudioTrackName] = useState('');
  const [audioTrackArtist, setAudioTrackArtist] = useState('');
  const [isFetchingSpotify, setIsFetchingSpotify] = useState(false);
  const [spotifyFetchMsg, setSpotifyFetchMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setEditingChapterId(null);
    setChapterNumber(chapters.length + 1);
    setTitle('');
    setLocation('');
    setDate('');
    setDescription('');
    setCoverImage('');
    setTagInput('');
    setAuthor('both');
    setSpotifyUrl('');
    setAudioTrackName('');
    setAudioTrackArtist('');
    setSpotifyFetchMsg(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setChapterNumber(chapter.chapterNumber);
    setTitle(chapter.title);
    setLocation(chapter.location);
    setDate(chapter.date);
    setDescription(chapter.description);
    setCoverImage(chapter.coverImage);
    setTagInput(chapter.tags.join(', '));
    setAuthor(chapter.author);
    setSpotifyUrl(chapter.audioTrackUrl || chapter.spotifyEmbedUrl || '');
    setAudioTrackName(chapter.audioTrackName || '');
    setAudioTrackArtist(chapter.audioTrackArtist || '');
    setSpotifyFetchMsg(null);
    setIsAddModalOpen(true);
  };

  const handleFetchSpotifyInfo = async (urlToFetch?: string) => {
    const target = urlToFetch || spotifyUrl;
    if (!target.trim()) return;

    setIsFetchingSpotify(true);
    setSpotifyFetchMsg(null);

    try {
      const meta = await fetchSpotifyMetadata(target);
      if (meta) {
        if (meta.title) setAudioTrackName(meta.title);
        if (meta.artist) setAudioTrackArtist(meta.artist);
        setSpotifyFetchMsg(`✨ Auto-detected "${meta.title}" by ${meta.artist}!`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingSpotify(false);
    }
  };

  // Extract unique tags
  const allTags = ['All', ...Array.from(new Set(chapters.flatMap(c => c.tags)))];

  const filteredChapters = selectedTag === 'All'
    ? chapters
    : chapters.filter(c => c.tags.includes(selectedTag));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const embedUrl = spotifyUrl ? parseSpotifyEmbed(spotifyUrl) : undefined;

    const chapterData: Omit<Chapter, 'id'> = {
      chapterNumber: chapterNumber || chapters.length + 1,
      title,
      location: location || 'London & NY',
      date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      description,
      tags: tagInput ? tagInput.split(',').map(t => t.trim()).filter(Boolean) : ['Memory'],
      coverImage: coverImage || 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1000',
      audioTrackName: audioTrackName || undefined,
      audioTrackArtist: audioTrackArtist || undefined,
      audioTrackUrl: spotifyUrl || undefined,
      spotifyEmbedUrl: embedUrl || undefined,
      author
    };

    if (editingChapterId) {
      onUpdateChapter(editingChapterId, chapterData);
    } else {
      onAddChapter(chapterData);
    }

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
          onClick={handleOpenAddModal}
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
        {filteredChapters.map((chapter) => {
          const spotifyEmbed = chapter.spotifyEmbedUrl || (chapter.audioTrackUrl && chapter.audioTrackUrl.includes('spotify') ? parseSpotifyEmbed(chapter.audioTrackUrl) : null);

          return (
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

                    {/* Action Buttons: Edit & Delete */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(chapter)}
                        className="text-[#a39780] hover:text-[#d4af37] transition cursor-pointer p-1"
                        title="Modify / Edit Chapter"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteChapter(chapter.id)}
                        className="text-[#a39780] hover:text-rose-400 transition cursor-pointer p-1"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-display font-semibold text-[#fff8e7]">
                    {chapter.title}
                  </h3>

                  <p className="text-sm font-serif text-[#c8bfab] leading-relaxed">
                    {chapter.description}
                  </p>

                  {/* Spotify Embedded Music Player or Audio Badge */}
                  {spotifyEmbed ? (
                    <div className="space-y-1.5 mt-2">
                      <div className="flex items-center justify-between text-xs text-[#d4af37]">
                        <span className="flex items-center space-x-1.5 font-semibold text-[11px] uppercase tracking-wider">
                          <Music className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          <span>Chapter Soundtrack</span>
                        </span>
                        {chapter.audioTrackName && (
                          <span className="text-[11px] text-[#c8bfab] font-medium">{chapter.audioTrackName} {chapter.audioTrackArtist ? `— ${chapter.audioTrackArtist}` : ''}</span>
                        )}
                      </div>
                      <iframe
                        src={spotifyEmbed}
                        width="100%"
                        height="80"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-2xl border border-[#d4af37]/30 shadow-md bg-[#080a0f]"
                      />
                    </div>
                  ) : chapter.audioTrackName ? (
                    <div className="p-3 rounded-xl bg-[#141620] border border-[#d4af37]/20 flex items-center space-x-3 text-xs text-[#d4af37]">
                      <Music className="w-4 h-4 text-[#d4af37] animate-pulse shrink-0" />
                      <div>
                        <span className="font-semibold text-[#f3e7c4] block">{chapter.audioTrackName}</span>
                        <span className="text-[10px] text-[#a39780]">{chapter.audioTrackArtist || 'Soundtrack'}</span>
                      </div>
                    </div>
                  ) : null}

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
          );
        })}
      </div>

      {/* Add / Edit Chapter Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-display text-[#fff8e7] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>{editingChapterId ? 'Modify Chapter' : 'Record New Chapter'}</span>
              </h3>
              <p className="text-xs text-[#a39780]">
                {editingChapterId ? "Update this memory in Sofs & Mumu's chronicle." : "Immortalize a new memory in Sofs & Mumu's chronicle."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Ch. No. *</label>
                  <input
                    type="number"
                    required
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="col-span-2">
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

              {/* Cover Image with Direct Gallery Upload */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-[#a39780]">Cover Image</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-[#d4af37] hover:underline flex items-center space-x-1 cursor-pointer font-medium"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload from Gallery / Device</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleGalleryFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Paste Image URL or click 'Upload from Gallery'"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
                {coverImage && coverImage.startsWith('data:image') && (
                  <p className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3 text-emerald-400" />
                    <span>✓ Image loaded from device gallery</span>
                  </p>
                )}
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

              {/* Spotify Music Integration */}
              <div className="p-4 rounded-2xl bg-[#0d1f18]/60 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-emerald-300 flex items-center space-x-1.5">
                    <Music className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Spotify Track Soundtrack (Optional)</span>
                  </label>
                  {spotifyUrl && (
                    <button
                      type="button"
                      onClick={() => handleFetchSpotifyInfo()}
                      disabled={isFetchingSpotify}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center space-x-1 font-semibold cursor-pointer disabled:opacity-50"
                    >
                      {isFetchingSpotify ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Auto-Fetching...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3 h-3 text-emerald-400" />
                          <span>Auto-Detect Track</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-400/60 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={spotifyUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSpotifyUrl(val);
                      if (val.includes('spotify.com/track')) {
                        handleFetchSpotifyInfo(val);
                      }
                    }}
                    placeholder="Paste Spotify track URL (e.g. https://open.spotify.com/track/...)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#080a0f] border border-emerald-500/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-emerald-400 placeholder-[#615a4b]"
                  />
                </div>

                {spotifyFetchMsg && (
                  <p className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{spotifyFetchMsg}</span>
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={audioTrackName}
                    onChange={(e) => setAudioTrackName(e.target.value)}
                    placeholder="Song Name (e.g. Autumn Leaves)"
                    className="w-full px-3 py-2 rounded-xl bg-[#080a0f] border border-emerald-500/20 text-xs text-[#f3e7c4] focus:outline-none focus:border-emerald-400"
                  />
                  <input
                    type="text"
                    value={audioTrackArtist}
                    onChange={(e) => setAudioTrackArtist(e.target.value)}
                    placeholder="Artist Name (e.g. Yiruma)"
                    className="w-full px-3 py-2 rounded-xl bg-[#080a0f] border border-emerald-500/20 text-xs text-[#f3e7c4] focus:outline-none focus:border-emerald-400"
                  />
                </div>
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

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Author / Writer</label>
                <select
                  value={author}
                  onChange={(e) => setAuthor(e.target.value as 'sofs' | 'mumu' | 'both')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="both">Both (Sofs & Mumu)</option>
                  <option value="sofs">Sofs</option>
                  <option value="mumu">Mumu</option>
                </select>
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
                  {editingChapterId ? 'Update Chapter' : 'Save Chapter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
