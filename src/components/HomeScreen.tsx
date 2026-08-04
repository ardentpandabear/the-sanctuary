import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Clock, 
  Sparkles, 
  Play, 
  Pause, 
  Music, 
  MapPin, 
  BookOpen, 
  ArrowRight, 
  Compass, 
  Quote as QuoteIcon,
  Plus,
  Volume2,
  Image as ImageIcon
} from 'lucide-react';
import { Chapter, Song, EchoItem, PartnerProfile, ActiveTab } from '../types';
import { CityTimeWeatherWidget } from './CityTimeWeatherWidget';

interface HomeScreenProps {
  setActiveTab: (tab: ActiveTab) => void;
  featuredChapter: Chapter;
  featuredSong: Song;
  echoes: EchoItem[];
  profiles: { sofs: PartnerProfile; mumu: PartnerProfile };
  onOpenAddChapter: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  setActiveTab,
  featuredChapter,
  featuredSong,
  echoes,
  profiles,
  onOpenAddChapter
}) => {
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);

  // Calculate dynamic days since June 5, 2026
  const firstMetDate = new Date('2026-06-05');
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - firstMetDate.getTime());
  const daysTogether = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Next Anniversary Jun 5
  const nextAnniv = new Date(now.getFullYear(), 5, 5);
  if (now > nextAnniv) nextAnniv.setFullYear(now.getFullYear() + 1);
  const daysToAnniv = Math.ceil((nextAnniv.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate days until next Nov 7
const today = new Date();

let nextBirthday = new Date(today.getFullYear(), 10, 7); // Month is 0-indexed, so 10 = November

// If this year's birthday has already passed, use next year's
if (today > nextBirthday) {
  nextBirthday = new Date(today.getFullYear() + 1, 10, 7);
}

const birthdayDiff = nextBirthday.getTime() - today.getTime();
const daysLeft = Math.ceil(birthdayDiff / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-[#1b1913] via-[#12141d] to-[#0d0e14] border border-[#d4af37]/25 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#7a481c]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#242017]/80 border border-[#d4af37]/30 text-xs font-medium text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Sofs & Mumu • Connected Sanctuary</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#fff8e7] tracking-tight leading-tight">
              Welcome Home, <span className="font-script text-4xl sm:text-6xl text-[#d4af37] font-normal">Sofs & Mumu</span>
            </h2>

            <p className="text-sm sm:text-base font-serif italic text-[#c8bfab] leading-relaxed">
              "You are my favorite place to go when my mind searches for peace."
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenAddChapter}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 flex items-center justify-center space-x-2 cursor-pointer w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Chapter</span>
            </button>

            <button
              onClick={() => setActiveTab('our-story')}
              className="px-5 py-3 rounded-2xl bg-[#181a24] border border-[#d4af37]/30 text-[#f3e7c4] hover:text-[#d4af37] text-xs font-semibold hover:border-[#d4af37] transition flex items-center justify-center space-x-2 cursor-pointer w-full sm:w-auto"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Chapters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Days Together */}
        <div className="glass-panel p-5 rounded-2xl border border-[#d4af37]/20 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1e1b15] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-md">
            <Heart className="w-6 h-6 fill-[#d4af37]/30" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-[#fff8e7]">
              {daysTogether.toLocaleString()} <span className="text-sm font-sans font-normal text-[#d4af37]">Days</span>
            </div>
            <p className="text-xs text-[#a39780] mt-0.5">Since our first chat (Apr 20, 2026)</p>
          </div>
        </div>

        {/* Next Anniversary */}
        <div className="glass-panel p-5 rounded-2xl border border-[#d4af37]/20 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1e1b15] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-md">
            <Calendar className="w-6 h-6 text-[#d4af37]" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-[#fff8e7]">
              {daysToAnniv} <span className="text-sm font-sans font-normal text-[#d4af37]">Days Away</span>
            </div>
            <p className="text-xs text-[#a39780] mt-0.5">Next Anniversary (June 5, 2025)</p>
          </div>
        </div>

{/* Next Birthday */}
<div className="glass-panel p-5 rounded-2xl border border-[#d4af37]/20 flex items-center space-x-4">
  <div className="w-12 h-12 rounded-2xl bg-[#1e1b15] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-md">
    <Compass className="w-6 h-6 text-[#d4af37]" />
  </div>

  <div>
    <div className="text-2xl sm:text-3xl font-display font-bold text-[#fff8e7]">
      {daysLeft}{" "}
      <span className="text-sm font-sans font-normal text-[#d4af37]">
        {daysLeft === 1 ? "Day" : "Days"}
      </span>
    </div>

    <p className="text-xs text-[#a39780] mt-0.5">
      Until Sof's Birthday 🎂
    </p>
  </div>
</div>

      {/* Dual City Time & Temperature Widget (Allahabad & Birmingham) */}
      <CityTimeWeatherWidget />

      {/* Main Grid: Featured Memory Polaroid + Music Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Polaroid Featured Memory Card (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display text-[#f3e7c4] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>Featured Memory</span>
            </h3>
            <button
              onClick={() => setActiveTab('our-story')}
              className="text-xs text-[#d4af37] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View All Chapters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-[#d4af37]/20 relative group hover:border-[#d4af37]/40 transition duration-300">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#141620]">
              <img
                src={featuredChapter.coverImage}
                alt={featuredChapter.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-black/20" />
              
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0c0d12]/80 border border-[#d4af37]/30 text-[11px] font-semibold text-[#d4af37] backdrop-blur-md">
                Chapter {featuredChapter.chapterNumber}
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center space-x-2 text-xs text-[#d4af37] mb-1 font-sans">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{featuredChapter.location}</span>
                  <span>•</span>
                  <span>{featuredChapter.date}</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-display font-semibold text-[#fff8e7]">
                  {featuredChapter.title}
                </h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-serif text-[#c8bfab] leading-relaxed mt-4 line-clamp-3">
              {featuredChapter.description}
            </p>

            <div className="mt-4 pt-4 border-t border-[#d4af37]/10 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {featuredChapter.tags.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full bg-[#1e202c] text-[#a39780] text-[10px] border border-[#d4af37]/15">
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setShowMemoryModal(true)}
                className="text-xs font-semibold text-[#d4af37] hover:text-[#fff8e7] flex items-center space-x-1 cursor-pointer"
              >
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

   {/* Right Column: Music Player & Remember This Spotlight (5 cols) */}
<div className="lg:col-span-5 space-y-6">

  {/* Music Player Card */}
  <div className="space-y-3">
    <h3 className="text-lg font-display text-[#f3e7c4] flex items-center space-x-2">
      <Music className="w-4 h-4 text-[#d4af37]" />
      <span>Our Song Right Now</span>
    </h3>

    <div className="glass-panel p-5 rounded-3xl border border-[#d4af37]/20 relative overflow-hidden">
      <div className="flex items-center space-x-4">

        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-[#d4af37]/30">
          <img
            src={featuredSong.coverUrl}
            alt={featuredSong.title}
            className="w-full h-full object-cover"
          />

          <button
            onClick={() => setActiveTab("music")}
            className="absolute inset-0 bg-[#000000]/40 flex items-center justify-center text-[#d4af37] hover:bg-[#000000]/55 transition cursor-pointer"
          >
            <Play className="w-8 h-8 fill-[#d4af37] ml-1" />
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-hidden">
          <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-[10px] font-semibold">
            {featuredSong.moodTags[0]}
          </span>

          <h4 className="text-base font-display font-semibold text-[#fff8e7] truncate">
            {featuredSong.title}
          </h4>

          <p className="text-xs text-[#a39780]">
            {featuredSong.artist}
          </p>
        </div>

      </div>

      <div className="mt-4 pt-4 border-t border-[#d4af37]/10 flex items-center justify-between">
        <div>
          <p className="text-xs text-[#c8bfab]">
            Tap to listen to the full song
          </p>
          <p className="text-[10px] text-[#8c816d] mt-1">
            Opens the Music section
          </p>
        </div>

        <button
          onClick={() => setActiveTab("music")}
          className="px-4 py-2 rounded-full bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold transition"
        >
          Open Music →
        </button>
      </div>

      <p className="text-xs font-serif italic text-[#c8bfab] mt-4 pt-4 border-t border-[#d4af37]/10 line-clamp-2">
        "{featuredSong.storyNote}"
      </p>
    </div>
  </div>
</div>
          {/* Activity Feed Echoes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display text-[#f3e7c4] flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span>Recent Echoes</span>
              </h3>
              <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Feed</span>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-3xl border border-[#d4af37]/15 space-y-2.5 max-h-88 overflow-y-auto custom-scrollbar">
              {echoes && echoes.length > 0 ? (
                echoes.map((echo) => {
                  const getEchoIcon = (type: EchoItem['type']) => {
                    switch (type) {
                      case 'chapter':
                        return <BookOpen className="w-3 h-3 text-[#d4af37]" />;
                      case 'song':
                        return <Music className="w-3 h-3 text-emerald-400" />;
                      case 'photo':
                        return <ImageIcon className="w-3 h-3 text-amber-400" />;
                      case 'quote':
                        return <QuoteIcon className="w-3 h-3 text-rose-400" />;
                      case 'memory':
                      default:
                        return <Heart className="w-3 h-3 text-[#d4af37]" />;
                    }
                  };

                  return (
                    <div 
                      key={echo.id} 
                      className="flex items-start space-x-3 p-2.5 rounded-2xl bg-[#0e1017]/80 hover:bg-[#181a24] border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition group"
                    >
                      <div className="relative shrink-0 mt-0.5">
                        <img
                          src={echo.avatar}
                          alt={echo.author}
                          className="w-8 h-8 rounded-full object-cover border border-[#d4af37]/40 shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#0c0d12] border border-[#d4af37]/30 shadow">
                          {getEchoIcon(echo.type)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-[#f3e7c4] truncate group-hover:text-[#d4af37] transition">
                            {echo.title}
                          </p>
                          <span className="text-[9px] text-[#8c816d] shrink-0 ml-2 font-mono">{echo.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[#a39780] line-clamp-2 mt-0.5">{echo.subtitle}</p>

                        {echo.imageUrl && (
                          <div className="mt-2 rounded-xl overflow-hidden aspect-[16/8] border border-[#d4af37]/20 max-w-[180px]">
                            <img src={echo.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[9px] text-[#d4af37]/80 uppercase tracking-wider font-mono">
                            By {echo.author === 'sofs' ? 'Sofs' : echo.author === 'mumu' ? 'Mumu' : 'Sofs & Mumu'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-[#a39780] italic">
                  No echoes recorded yet. Actions across your sanctuary will automatically appear here!
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Read Story Modal */}
      {showMemoryModal && (
        <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowMemoryModal(false)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-xs font-semibold">
              Chapter {featuredChapter.chapterNumber}
            </span>

            <h3 className="text-2xl font-display text-[#fff8e7]">{featuredChapter.title}</h3>
            
            <div className="flex items-center space-x-3 text-xs text-[#d4af37]">
              <span>📍 {featuredChapter.location}</span>
              <span>•</span>
              <span>📅 {featuredChapter.date}</span>
            </div>

            <img
              src={featuredChapter.coverImage}
              alt={featuredChapter.title}
              className="w-full h-48 object-cover rounded-2xl border border-[#d4af37]/20"
            />

            <p className="text-sm font-serif text-[#c8bfab] leading-relaxed">
              {featuredChapter.description}
            </p>

            <div className="pt-4 border-t border-[#d4af37]/15 flex justify-end">
              <button
                onClick={() => setShowMemoryModal(false)}
                className="px-5 py-2 rounded-xl bg-[#d4af37] text-[#0c0d12] font-semibold text-xs cursor-pointer hover:brightness-110"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};