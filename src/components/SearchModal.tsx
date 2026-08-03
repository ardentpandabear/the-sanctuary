import React, { useState } from 'react';
import { Search, X, BookOpen, Music, Image as ImageIcon, Sparkles, Calendar, Compass, ArrowRight } from 'lucide-react';
import { Chapter, Song, LittleThing, CalendarEvent, BucketListItem, ActiveTab } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  songs: Song[];
  littleThings: LittleThing[];
  events: CalendarEvent[];
  bucketList: BucketListItem[];
  setActiveTab: (tab: ActiveTab) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  chapters,
  songs,
  littleThings,
  events,
  bucketList,
  setActiveTab
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingChapters = q ? chapters.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)) : [];
  const matchingSongs = q ? songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || s.storyNote.toLowerCase().includes(q)) : [];
  const matchingLittleThings = q ? littleThings.filter(l => l.title.toLowerCase().includes(q) || l.details.toLowerCase().includes(q)) : [];
  const matchingEvents = q ? events.filter(e => e.title.toLowerCase().includes(q) || (e.notes && e.notes.toLowerCase().includes(q))) : [];
  const matchingBucket = q ? bucketList.filter(b => b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)) : [];

  const totalResults = matchingChapters.length + matchingSongs.length + matchingLittleThings.length + matchingEvents.length + matchingBucket.length;

  const handleSelectResult = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-start justify-center pt-20 p-4 backdrop-blur-md">
      <div className="glass-panel max-w-xl w-full p-6 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4 relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chapters, songs, memories, dates, bucket list..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#0e1017] border border-[#d4af37]/40 text-sm text-[#f3e7c4] placeholder-[#8c816d] focus:outline-none focus:border-[#d4af37]"
            autoFocus
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#d4af37]" />
          <button
            onClick={onClose}
            className="absolute right-3.5 top-3.5 text-[#a39780] hover:text-[#f3e7c4] text-xs font-bold cursor-pointer"
          >
            ESC
          </button>
        </div>

        {query && (
          <div className="max-h-[60vh] overflow-y-auto space-y-4 custom-scrollbar pt-2">
            <p className="text-xs text-[#a39780]">Found {totalResults} matching results for "{query}"</p>

            {/* Chapters */}
            {matchingChapters.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-semibold text-[#d4af37] flex items-center space-x-1">
                  <BookOpen className="w-3 h-3" />
                  <span>Chapters ({matchingChapters.length})</span>
                </span>
                {matchingChapters.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectResult('our-story')}
                    className="p-3 rounded-xl bg-[#141620] border border-[#d4af37]/15 hover:border-[#d4af37]/40 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-[#fff8e7]">{c.title}</h4>
                      <p className="text-[10px] text-[#a39780]">{c.location} • {c.date}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                  </div>
                ))}
              </div>
            )}

            {/* Songs */}
            {matchingSongs.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-semibold text-[#d4af37] flex items-center space-x-1">
                  <Music className="w-3 h-3" />
                  <span>Songs ({matchingSongs.length})</span>
                </span>
                {matchingSongs.map(s => (
                  <div
                    key={s.id}
                    onClick={() => handleSelectResult('music')}
                    className="p-3 rounded-xl bg-[#141620] border border-[#d4af37]/15 hover:border-[#d4af37]/40 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-[#fff8e7]">{s.title}</h4>
                      <p className="text-[10px] text-[#a39780]">{s.artist}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                  </div>
                ))}
              </div>
            )}

            {/* Little Details */}
            {matchingLittleThings.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-semibold text-[#d4af37] flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Little Details ({matchingLittleThings.length})</span>
                </span>
                {matchingLittleThings.map(l => (
                  <div
                    key={l.id}
                    onClick={() => handleSelectResult('little-things')}
                    className="p-3 rounded-xl bg-[#141620] border border-[#d4af37]/15 hover:border-[#d4af37]/40 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-[#fff8e7]">{l.title}</h4>
                      <p className="text-[10px] text-[#a39780] line-clamp-1">{l.details}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                  </div>
                ))}
              </div>
            )}

            {/* Bucket list */}
            {matchingBucket.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-semibold text-[#d4af37] flex items-center space-x-1">
                  <Compass className="w-3 h-3" />
                  <span>Bucket List ({matchingBucket.length})</span>
                </span>
                {matchingBucket.map(b => (
                  <div
                    key={b.id}
                    onClick={() => handleSelectResult('bucket-list')}
                    className="p-3 rounded-xl bg-[#141620] border border-[#d4af37]/15 hover:border-[#d4af37]/40 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-[#fff8e7]">{b.title}</h4>
                      <p className="text-[10px] text-[#a39780]">{b.status}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};
