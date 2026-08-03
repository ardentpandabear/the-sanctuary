export type ActiveTab = 
  | 'home'
  | 'our-story'
  | 'calendar'
  | 'little-things'
  | 'music'
  | 'photo-vault'
  | 'family-friends'
  | 'timeline'
  | 'faith'
  | 'bucket-list'
  | 'quiz';

export interface PartnerProfile {
  id: 'sofs' | 'mumu';
  name: string;
  nickname: string;
  avatar: string;
  location: string;
  timezone: string;
  currentMood?: string;
  favoriteQuote?: string;
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  date: string;
  location: string;
  description: string;
  tags: string[];
  coverImage: string;
  audioTrackName?: string;
  audioTrackArtist?: string;
  audioTrackUrl?: string;
  spotifyEmbedUrl?: string;
  author: 'sofs' | 'mumu' | 'both';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  endTime?: string;
  category: 'anniversary' | 'date-night' | 'travel' | 'faith' | 'reminder' | 'special';
  hijriDate?: string;
  notes?: string;
  isCompleted?: boolean;
}

export interface CountdownItem {
  id: string;
  title: string;
  targetDate: string; // YYYY-MM-DD
  category: string;
  badgeColor?: string;
}

export interface LittleThing {
  id: string;
  category: 'Favorites' | 'Quirks' | 'Scents' | 'Snacks' | 'Quotes' | 'Rituals';
  title: string;
  subtitle: string;
  details: string;
  addedBy: 'sofs' | 'mumu';
  iconName: string;
  bgColor?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  addedBy: 'sofs' | 'mumu';
  moodTags: string[];
  duration: string;
  audioUrl?: string;
  sourceType?: 'youtube' | 'spotify' | 'custom';
  sourceUrl?: string;
  embedUrl?: string;
  storyNote: string;
  addedDate: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  date: string;
  location: string;
  tags: string[];
  addedBy: 'sofs' | 'mumu' | 'both';
}

export interface PhotoAlbum {
  id: string;
  title: string;
  category: string;
  coverUrl: string;
  photoCount: number;
  photos: PhotoItem[];
}

export interface FamilyFriendContact {
  id: string;
  name: string;
  relation: string;
  avatarUrl: string;
  phone?: string;
  location: string;
  birthday: string;
  favoriteThings: string[];
  notes: string;
  type: 'family' | 'friend';
  belongsTo?: 'sofs' | 'mumu' | 'both';
  sharedMemoriesCount: number;
}

export interface TimelineMilestone {
  id: string;
  year: string;
  date: string;
  title: string;
  description: string;
  category: 'firsts' | 'travel' | 'milestone' | 'life' | 'celebration';
  photoUrl?: string;
  location: string;
  tag: string;
}

export interface QuranVerse {
  id: string;
  arabicText: string;
  englishTranslation: string;
  reference: string; // e.g. "Surah Al-Furqan 25:74"
  personalNote?: string;
}

export interface SharedReflection {
  id: string;
  date: string;
  prompt: string;
  mumuNote?: string;
  sofsNote?: string;
}

export interface BucketListItem {
  id: string;
  category: 'Travel' | 'Experiences' | 'Life Goals' | 'Cozy';
  title: string;
  description: string;
  targetDate?: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  completedDate?: string;
  photoUrl?: string;
}

export interface QuizCard {
  id: string;
  category: 'Who Said It?' | 'Dates & Milestones' | 'Favorites' | 'Sweet Secrets';
  question: string;
  answer: string;
  memoryDetail: string;
  askedBy: 'sofs' | 'mumu';
  options?: string[];
  userRemembered?: boolean;
}

export interface QuizMcqQuestion {
  id: string;
  question: string;
  options: string[]; // 4 MCQ choices
  correctOptionIndex: number; // 0..3
  memoryDetail: string;
}

export interface QuizSet {
  id: string;
  title: string;
  category: 'Who Said It?' | 'Dates & Milestones' | 'Favorites' | 'Sweet Secrets' | 'Funny Moments';
  createdBy: 'sofs' | 'mumu';
  targetFor: 'sofs' | 'mumu' | 'both';
  questions: QuizMcqQuestion[]; // Exactly 4 questions
  completedByPartner?: boolean;
  score?: number; // Score out of 4
  takenDate?: string;
}

export interface EchoItem {
  id: string;
  type: 'memory' | 'song' | 'chapter' | 'photo' | 'quote';
  title: string;
  subtitle: string;
  timestamp: string;
  author: 'sofs' | 'mumu';
  avatar: string;
  imageUrl?: string;
}

export interface DailyLetter {
  id: string;
  date: string; // e.g. "2026-08-02" or "August 2, 2026"
  from: 'sofs' | 'mumu';
  to: 'sofs' | 'mumu';
  title?: string;
  content: string;
  createdAt: string;
  isRead?: boolean;
  waxSealColor?: string; // e.g. '#d4af37', '#b91c1c', '#4338ca', '#059669'
  paperStyle?: 'parchment' | 'midnight' | 'rose' | 'classic';
  fontStyle?: 'serif' | 'script' | 'sans';
}
