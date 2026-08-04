import React, { useState } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  Plus, 
  Heart, 
  Sparkles, 
  Filter, 
  Trash2, 
  Volume2, 
  Youtube, 
  ExternalLink, 
  Radio,
  Wand2,
  Loader2,
  Check,
  Link as LinkIcon,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Song } from '../types';

interface MusicScreenProps {
  songs: Song[];
  onAddSong: (song: Omit<Song, 'id'>) => void;
  onDeleteSong: (id: string) => void;
}

// Helpers to extract embed URLs and metadata for YouTube and Spotify
const parseYouTubeEmbed = (url: string): string => {
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.includes('youtube.com/watch')) {
    try {
      const searchParams = new URLSearchParams(url.split('?')[1]);
      videoId = searchParams.get('v') || '';
    } catch (e) {
      videoId = '';
    }
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
  }
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1` : url;
};

const parseSpotifyEmbed = (url: string): string => {
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

// Auto-fetch song metadata from Spotify or YouTube via public oEmbed endpoints
export const fetchSongMetadata = async (url: string) => {
  const cleanUrl = url.trim();
  if (!cleanUrl) return null;

  const isSpotify = cleanUrl.includes('spotify.com') || cleanUrl.includes('spotify:track:');
  const isYouTube = cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be');

  if (isSpotify) {
    let trackId = '';
    const match = cleanUrl.match(/track[\/:]([a-zA-Z0-9]+)/);
    if (match) {
      trackId = match[1];
    }

    try {
      const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(cleanUrl)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        return {
          title: data.title || '',
          artist: data.author_name || 'Unknown Artist',
          album: 'Spotify Single',
          coverUrl: data.thumbnail_url || 'https://images.unsplash.com/photo-1614680376593-902f749f705b?auto=format&fit=crop&q=80&w=400',
          embedUrl: trackId ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0` : cleanUrl,
          sourceType: 'spotify' as const,
          sourceUrl: cleanUrl,
          moodTags: ['Romantic', 'Spotify Favorite', 'Our Track']
        };
      }
    } catch (e) {
      console.warn("Spotify oEmbed fetch error, falling back:", e);
    }

    // Fallback if oembed fails or blocked
    return {
      title: trackId ? `Track (${trackId.slice(0, 6)})` : 'Spotify Song',
      artist: 'Spotify Artist',
      album: 'Spotify Track',
      coverUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f705b?auto=format&fit=crop&q=80&w=400',
      embedUrl: trackId ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0` : cleanUrl,
      sourceType: 'spotify' as const,
      sourceUrl: cleanUrl,
      moodTags: ['Spotify Favorite', 'Romantic']
    };
  }

  if (isYouTube) {
    let videoId = '';
    if (cleanUrl.includes('youtu.be/')) {
      videoId = cleanUrl.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (cleanUrl.includes('youtube.com/watch')) {
      try {
        const searchParams = new URLSearchParams(cleanUrl.split('?')[1]);
        videoId = searchParams.get('v') || '';
      } catch (e) {
        videoId = '';
      }
    }

    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        return {
          title: data.title || 'YouTube Song',
          artist: data.author_name || 'YouTube Creator',
          album: 'YouTube Release',
          coverUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : data.thumbnail_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400',
          embedUrl: videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1` : cleanUrl,
          sourceType: 'youtube' as const,
          sourceUrl: cleanUrl,
          moodTags: ['YouTube', 'Music Video', 'Romantic']
        };
      }
    } catch (e) {
      console.warn("YouTube oEmbed fetch error, falling back:", e);
    }

    return {
      title: 'YouTube Track',
      artist: 'YouTube Artist',
      album: 'Video Track',
      coverUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400',
      embedUrl: videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1` : cleanUrl,
      sourceType: 'youtube' as const,
      sourceUrl: cleanUrl,
      moodTags: ['YouTube', 'Melody']
    };
  }

  return null;
};

export const MusicScreen: React.FC<MusicScreenProps> = ({
  songs,
  onAddSong,
  onDeleteSong
}) => {
  const [activeSongId, setActiveSongId] = useState<string | null>(songs[0]?.id || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Quick Auto-Import Bar State
  const [quickUrl, setQuickUrl] = useState('');
  const [isQuickFetching, setIsQuickFetching] = useState(false);
  const [quickSuccessMsg, setQuickSuccessMsg] = useState('');

  // Add Song Form State
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [sourceType, setSourceType] = useState<'youtube' | 'spotify' | 'custom'>('spotify');
  const [sourceUrl, setSourceUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [moodTags, setMoodTags] = useState('');
  const [storyNote, setStoryNote] = useState('');
  const [addedBy, setAddedBy] = useState<'sofs' | 'mumu'>('sofs');
  const coverFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [isModalFetching, setIsModalFetching] = useState(false);
  const [modalAutoFilledStatus, setModalAutoFilledStatus] = useState<string | null>(null);

  const allMoods = ['All', ...Array.from(new Set(songs.flatMap(s => s.moodTags)))];

  const filteredSongs = selectedMood === 'All'
    ? songs
    : songs.filter(s => s.moodTags.includes(selectedMood));

  const activeSong = songs.find(s => s.id === activeSongId) || songs[0];

  const handleTogglePlay = (id: string) => {
    if (activeSongId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveSongId(id);
      setIsPlaying(true);
    }
  };

  // Quick Auto-Import handler from top bar
  const handleQuickImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;

    setIsQuickFetching(true);
    setQuickSuccessMsg('');

    try {
      const meta = await fetchSongMetadata(quickUrl);
      if (meta) {
        onAddSong({
          title: meta.title,
          artist: meta.artist,
          album: meta.album,
          coverUrl: meta.coverUrl,
          addedBy: 'sofs',
          moodTags: meta.moodTags,
          duration: '3:30',
          sourceType: meta.sourceType,
          sourceUrl: meta.sourceUrl,
          embedUrl: meta.embedUrl,
          storyNote: 'Added via Spotify auto-import.',
          addedDate: new Date().toISOString().split('T')[0]
        });

        setQuickSuccessMsg(`✨ Successfully added "${meta.title}" by ${meta.artist}!`);
        setQuickUrl('');
        setTimeout(() => setQuickSuccessMsg(''), 4000);
      } else {
        // Fallback manually if unknown URL
        setIsAddModalOpen(true);
        setSourceUrl(quickUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuickFetching(false);
    }
  };

  // Auto-fetch trigger in Modal when user pastes/types a URL
  const handleFetchModalMetadata = async (urlToFetch?: string) => {
    const targetUrl = urlToFetch || sourceUrl;
    if (!targetUrl.trim()) return;

    setIsModalFetching(true);
    setModalAutoFilledStatus(null);

    try {
      const meta = await fetchSongMetadata(targetUrl);
      if (meta) {
        setTitle(meta.title);
        setArtist(meta.artist);
        setAlbum(meta.album);
        setCoverUrl(meta.coverUrl);
        setSourceType(meta.sourceType);
        setMoodTags(meta.moodTags.join(', '));
        setModalAutoFilledStatus(`✨ Auto-fetched details for "${meta.title}" from ${meta.sourceType === 'spotify' ? 'Spotify' : 'YouTube'}!`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsModalFetching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist) return;

    let computedEmbedUrl = '';
    if (sourceType === 'youtube' && sourceUrl) {
      computedEmbedUrl = parseYouTubeEmbed(sourceUrl);
    } else if (sourceType === 'spotify' && sourceUrl) {
      computedEmbedUrl = parseSpotifyEmbed(sourceUrl);
    }

    onAddSong({
      title,
      artist,
      album: album || 'Single',
      coverUrl: coverUrl || (sourceType === 'spotify' 
        ? 'https://images.unsplash.com/photo-1614680376593-902f749f705b?auto=format&fit=crop&q=80&w=400' 
        : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400'),
      addedBy,
      moodTags: moodTags ? moodTags.split(',').map(m => m.trim()) : ['Cozy'],
      duration: '3:30',
      sourceType,
      sourceUrl,
      embedUrl: computedEmbedUrl,
      storyNote: storyNote || 'A special melody for us.',
      addedDate: new Date().toISOString().split('T')[0]
    });

    setTitle('');
    setArtist('');
    setAlbum('');
    setSourceUrl('');
    setCoverUrl('');
    setMoodTags('');
    setStoryNote('');
    setModalAutoFilledStatus(null);
    setIsAddModalOpen(false);
  };

  // Determine active song player embed
  const getActiveEmbed = () => {
    if (!activeSong) return null;

    if (activeSong.embedUrl) {
      return activeSong.embedUrl;
    }
    if (activeSong.sourceUrl) {
      if (activeSong.sourceType === 'youtube' || activeSong.sourceUrl.includes('youtube') || activeSong.sourceUrl.includes('youtu.be')) {
        return parseYouTubeEmbed(activeSong.sourceUrl);
      }
      if (activeSong.sourceType === 'spotify' || activeSong.sourceUrl.includes('spotify')) {
        return parseSpotifyEmbed(activeSong.sourceUrl);
      }
    }
    return null;
  };

  const activeEmbed = getActiveEmbed();
  const isSpotifyEmbed = activeSong?.sourceType === 'spotify' || activeSong?.sourceUrl?.includes('spotify') || activeEmbed?.includes('spotify');
  const isYouTubeEmbed = activeSong?.sourceType === 'youtube' || activeSong?.sourceUrl?.includes('youtube') || activeSong?.sourceUrl?.includes('youtu.be') || activeEmbed?.includes('youtube');

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171924] via-[#12141d] to-[#1c1913] border border-[#d4af37]/20 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs text-[#d4af37] mb-1">
            <Music className="w-4 h-4" />
            <span className="uppercase tracking-widest font-semibold">The Soundtrack</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#fff8e7]">Music Library</h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#c8bfab]">
            Paste any Spotify track URL or YouTube link. Song name, artist, album art, and mood tags are automatically detected and added!
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 flex items-center space-x-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Song Manually</span>
        </button>
      </div>

      {/* Quick Spotify URL Auto-Import Bar */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0d1f18]/90 via-[#121620]/90 to-[#1b1712]/90 border border-emerald-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Quick Spotify Auto-Import
            </h3>
          </div>
          <span className="text-[10px] text-[#8c816d] font-mono">Instant Song Name, Artist &amp; Album Art Extraction</span>
        </div>

        <form onSubmit={handleQuickImport} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full flex-1">
            <LinkIcon className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-3" />
            <input
              type="url"
              required
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="Paste Spotify track link (e.g. https://open.spotify.com/track/...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#080a0f] border border-emerald-500/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-emerald-400 placeholder-[#615a4b]"
            />
          </div>

          <button
            type="submit"
            disabled={isQuickFetching || !quickUrl.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs hover:brightness-110 transition shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isQuickFetching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Auto-Fetching...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-slate-950" />
                <span>Auto-Import Track</span>
              </>
            )}
          </button>
        </form>

        {quickSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center space-x-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{quickSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Featured Now Playing Bar */}
      {activeSong && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 space-y-6 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#181a26]/90 to-[#10121a]/90">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-[#d4af37]/40 shadow-xl">
                <img
                  src={activeSong.coverUrl}
                  alt={activeSong.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleTogglePlay(activeSong.id)}
                  className="absolute inset-0 bg-[#000000]/40 flex items-center justify-center text-[#d4af37] hover:scale-110 transition cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-10 h-10 fill-[#d4af37]" /> : <Play className="w-10 h-10 fill-[#d4af37] ml-1" />}
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-semibold uppercase">
                    Now Playing
                  </span>
                  {isYouTubeEmbed && (
                    <span className="px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-500/30 text-[10px] font-semibold flex items-center space-x-1">
                      <Youtube className="w-3 h-3 text-red-400" />
                      <span>YouTube</span>
                    </span>
                  )}
                  {isSpotifyEmbed && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center space-x-1">
                      <Radio className="w-3 h-3 text-emerald-400" />
                      <span>Spotify</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-semibold text-[#fff8e7]">{activeSong.title}</h3>
                <p className="text-xs sm:text-sm text-[#a39780]">{activeSong.artist} • {activeSong.album}</p>
                <p className="text-xs font-serif italic text-[#c8bfab] pt-1">"{activeSong.storyNote}"</p>
              </div>
            </div>

            {/* Added By & External Link */}
            <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 border-t md:border-t-0 md:border-l border-[#d4af37]/15 pt-3 md:pt-0 md:pl-6">
              <span className="text-xs text-[#d4af37] font-medium">
                Added by {activeSong.addedBy === 'sofs' ? 'Sofs 💖' : 'Mumu 💙'}
              </span>
              {activeSong.sourceUrl && (
                <a
                  href={activeSong.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#a39780] hover:text-[#d4af37] transition flex items-center space-x-1"
                >
                  <span>Open Original Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Embedded Player Frame if YouTube or Spotify embed exists */}
          {activeEmbed && isPlaying && (
            <div className="rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-black/80 p-2 shadow-2xl animate-fade-in">
              {isYouTubeEmbed && (
                <div className="aspect-video w-full rounded-xl overflow-hidden">
                  <iframe
                    src={activeEmbed}
                    title={activeSong.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              )}

              {isSpotifyEmbed && (
                <div className="w-full h-40 rounded-xl overflow-hidden">
                  <iframe
                    src={activeEmbed}
                    title={activeSong.title}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="w-full h-full border-0"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mood Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
        <Filter className="w-4 h-4 text-[#d4af37] shrink-0 mr-1" />
        {allMoods.map((mood) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition shrink-0 cursor-pointer border ${
              selectedMood === mood
                ? 'bg-[#d4af37] text-[#0c0d12] border-[#d4af37] font-semibold'
                : 'bg-[#141620] text-[#a39780] border-[#d4af37]/15 hover:text-[#f3e7c4]'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Songs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSongs.map((song) => {
          const isSelected = activeSongId === song.id;
          const isYoutube = song.sourceType === 'youtube' || song.sourceUrl?.includes('youtube') || song.sourceUrl?.includes('youtu.be');
          const isSpotify = song.sourceType === 'spotify' || song.sourceUrl?.includes('spotify');

          return (
            <div
              key={song.id}
              onClick={() => handleTogglePlay(song.id)}
              className={`glass-panel p-4 rounded-2xl border transition duration-300 relative group flex items-center justify-between gap-4 cursor-pointer ${
                isSelected ? 'border-[#d4af37] bg-[#1e1a12]/70 shadow-lg' : 'border-[#d4af37]/15 hover:border-[#d4af37]/30'
              }`}
            >
              <div className="flex items-center space-x-4 min-w-0">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#d4af37]/30">
                  <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[#d4af37]">
                    {isSelected && isPlaying ? (
                      <Pause className="w-6 h-6 fill-[#d4af37]" />
                    ) : (
                      <Play className="w-6 h-6 fill-[#d4af37] ml-0.5" />
                    )}
                  </div>
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-sm font-semibold text-[#fff8e7] truncate">{song.title}</h4>
                    {isYoutube && <Youtube className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                    {isSpotify && <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-[#a39780] truncate">{song.artist}</p>
                  <div className="flex items-center space-x-1">
                    {song.moodTags.map((tag, idx) => (
                      <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-[#0e1017] text-[#d4af37]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-[10px] text-[#8c816d] capitalize">Added by {song.addedBy}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSong(song.id);
                  }}
                  title="Delete Song"
                  className="p-1.5 rounded-lg text-[#8c816d] hover:text-rose-400 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Song Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <h3 className="text-xl font-display text-[#fff8e7]">Add Song to Soundtrack</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Source Type Switcher */}
              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Song Link Source *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSourceType('youtube')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition flex items-center justify-center space-x-1 ${
                      sourceType === 'youtube'
                        ? 'bg-red-950 text-red-200 border-red-500'
                        : 'bg-[#0e1017] text-[#a39780] border-[#d4af37]/20'
                    }`}
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-400" />
                    <span>YouTube</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSourceType('spotify')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition flex items-center justify-center space-x-1 ${
                      sourceType === 'spotify'
                        ? 'bg-emerald-950 text-emerald-200 border-emerald-500'
                        : 'bg-[#0e1017] text-[#a39780] border-[#d4af37]/20'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Spotify</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSourceType('custom')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition flex items-center justify-center space-x-1 ${
                      sourceType === 'custom'
                        ? 'bg-[#d4af37] text-[#0c0d12] border-[#d4af37]'
                        : 'bg-[#0e1017] text-[#a39780] border-[#d4af37]/20'
                    }`}
                  >
                    <span>Custom</span>
                  </button>
                </div>
              </div>

              {/* Source Link Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-[#a39780]">
                    {sourceType === 'youtube' ? 'YouTube URL or Video Link *' : sourceType === 'spotify' ? 'Spotify Track URL or Embed Link *' : 'Song Link / Audio URL'}
                  </label>
                  {sourceUrl && (
                    <button
                      type="button"
                      onClick={() => handleFetchModalMetadata()}
                      disabled={isModalFetching}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center space-x-1 font-semibold cursor-pointer disabled:opacity-50"
                    >
                      {isModalFetching ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Fetching...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3 h-3 text-emerald-400" />
                          <span>Auto-Fetch Details</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSourceUrl(val);
                      if (val.includes('spotify.com/track') || val.includes('youtube.com/watch') || val.includes('youtu.be')) {
                        handleFetchModalMetadata(val);
                      }
                    }}
                    placeholder={
                      sourceType === 'youtube' 
                        ? 'https://www.youtube.com/watch?v=...' 
                        : sourceType === 'spotify' 
                        ? 'https://open.spotify.com/track/...' 
                        : 'https://...'
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {modalAutoFilledStatus && (
                  <p className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{modalAutoFilledStatus}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Song Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Until I Found You"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Artist *</label>
                <input
                  type="text"
                  required
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="e.g. Stephen Sanchez"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-[#a39780]">Cover Artwork</label>
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    className="text-[11px] text-[#d4af37] hover:underline flex items-center space-x-1 cursor-pointer font-medium"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload from Gallery / Device</span>
                  </button>
                  <input
                    type="file"
                    ref={coverFileInputRef}
                    onChange={handleCoverFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="Paste Image URL or click 'Upload from Gallery'"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
                {coverUrl && coverUrl.startsWith('data:image') && (
                  <p className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3 text-emerald-400" />
                    <span>✓ Artwork loaded from gallery</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Mood Tags (Comma separated)</label>
                <input
                  type="text"
                  value={moodTags}
                  onChange={(e) => setMoodTags(e.target.value)}
                  placeholder="Cozy, Nostalgic, Late Night"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Added By *</label>
                <select
                  value={addedBy}
                  onChange={(e) => setAddedBy(e.target.value as 'sofs' | 'mumu')}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="sofs">Sofs 💖</option>
                  <option value="mumu">Mumu 💙</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Story Note / Special Memory</label>
                <textarea
                  rows={2}
                  value={storyNote}
                  onChange={(e) => setStoryNote(e.target.value)}
                  placeholder="Why is this song special to us?"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
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
                  Save Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};