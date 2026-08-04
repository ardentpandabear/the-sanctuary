import React, { useState, useEffect } from 'react';
import { Gatekeeper } from './components/Gatekeeper';
import { ParticleBackground } from './components/ParticleBackground';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

import { HomeScreen } from './components/HomeScreen';
import { OurStoryScreen } from './components/OurStoryScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { LittleThingsScreen } from './components/LittleThingsScreen';
import { MusicScreen } from './components/MusicScreen';
import { PhotoVaultScreen } from './components/PhotoVaultScreen';
import { FamilyFriendsScreen } from './components/FamilyFriendsScreen';
import { TimelineScreen } from './components/TimelineScreen';
import { FaithScreen } from './components/FaithScreen';
import { BucketListScreen } from './components/BucketListScreen';
import { QuizScreen } from './components/QuizScreen';

import { AIRomanticAssistantModal } from './components/AIRomanticAssistantModal';
import { LetterOfTheDayModal } from './components/LetterOfTheDayModal';
import { SearchModal } from './components/SearchModal';

import { 
  initialProfiles,
  initialChapters,
  initialCalendarEvents,
  initialCountdowns,
  initialLittleThings,
  initialSongs,
  initialPhotoAlbums,
  initialFamilyFriends,
  initialTimelineMilestones,
  initialQuranVerses,
  initialReflections,
  initialBucketList,
  initialQuizCards,
  initialQuizSets,
  initialEchoes,
  initialDailyLetters
} from './data/initialData';

import { 
  ActiveTab, 
  Chapter, 
  CalendarEvent, 
  LittleThing, 
  Song, 
  PhotoAlbum, 
  FamilyFriendContact, 
  TimelineMilestone, 
  QuranVerse, 
  SharedReflection, 
  BucketListItem, 
  QuizCard, 
  QuizSet,
  PhotoItem,
  DailyLetter,
  EchoItem
} from './types';

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isDailyLetterModalOpen, setIsDailyLetterModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState(false);

  // Persistent State
  const [profiles, setProfiles] = useState(initialProfiles);

  const [dailyLetters, setDailyLetters] = useState<DailyLetter[]>(() => {
    const saved = localStorage.getItem('sanctuary_daily_letters');
    return saved ? JSON.parse(saved) : initialDailyLetters;
  });

  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem('sanctuary_chapters');
    return saved ? JSON.parse(saved) : initialChapters;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('sanctuary_events');
    return saved ? JSON.parse(saved) : initialCalendarEvents;
  });

  const [littleThings, setLittleThings] = useState<LittleThing[]>(() => {
    const saved = localStorage.getItem('sanctuary_little_things');
    return saved ? JSON.parse(saved) : initialLittleThings;
  });

  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('sanctuary_songs');
    return saved ? JSON.parse(saved) : initialSongs;
  });

  const [photoAlbums, setPhotoAlbums] = useState<PhotoAlbum[]>(() => {
    const saved = localStorage.getItem('sanctuary_albums');
    return saved ? JSON.parse(saved) : initialPhotoAlbums;
  });

  const [contacts, setContacts] = useState<FamilyFriendContact[]>(() => {
    const saved = localStorage.getItem('sanctuary_contacts');
    return saved ? JSON.parse(saved) : initialFamilyFriends;
  });

  const [milestones, setMilestones] = useState<TimelineMilestone[]>(() => {
    const saved = localStorage.getItem('sanctuary_milestones');
    return saved ? JSON.parse(saved) : initialTimelineMilestones;
  });

  const [verses, setVerses] = useState<QuranVerse[]>(() => {
    const saved = localStorage.getItem('sanctuary_verses');
    return saved ? JSON.parse(saved) : initialQuranVerses;
  });

  const [reflections, setReflections] = useState<SharedReflection[]>(() => {
    const saved = localStorage.getItem('sanctuary_reflections');
    return saved ? JSON.parse(saved) : initialReflections;
  });

  const [bucketList, setBucketList] = useState<BucketListItem[]>(() => {
    const saved = localStorage.getItem('sanctuary_bucket');
    return saved ? JSON.parse(saved) : initialBucketList;
  });

  const [quizCards, setQuizCards] = useState<QuizCard[]>(() => {
    const saved = localStorage.getItem('sanctuary_quiz');
    return saved ? JSON.parse(saved) : initialQuizCards;
  });

  const [quizSets, setQuizSets] = useState<QuizSet[]>(() => {
    const saved = localStorage.getItem('sanctuary_quiz_sets');
    return saved ? JSON.parse(saved) : initialQuizSets;
  });

  const [echoes, setEchoes] = useState<EchoItem[]>(() => {
    const saved = localStorage.getItem('sanctuary_echoes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialEchoes;
  });

  // Save changes to localStorage
  useEffect(() => { localStorage.setItem('sanctuary_profiles', JSON.stringify(profiles)); }, [profiles]);
  useEffect(() => { localStorage.setItem('sanctuary_daily_letters', JSON.stringify(dailyLetters)); }, [dailyLetters]);
  useEffect(() => { localStorage.setItem('sanctuary_chapters', JSON.stringify(chapters)); }, [chapters]);
  useEffect(() => { localStorage.setItem('sanctuary_events', JSON.stringify(calendarEvents)); }, [calendarEvents]);
  useEffect(() => { localStorage.setItem('sanctuary_little_things', JSON.stringify(littleThings)); }, [littleThings]);
  useEffect(() => { localStorage.setItem('sanctuary_songs', JSON.stringify(songs)); }, [songs]);
  useEffect(() => { localStorage.setItem('sanctuary_albums', JSON.stringify(photoAlbums)); }, [photoAlbums]);
  useEffect(() => { localStorage.setItem('sanctuary_contacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('sanctuary_milestones', JSON.stringify(milestones)); }, [milestones]);
  useEffect(() => { localStorage.setItem('sanctuary_verses', JSON.stringify(verses)); }, [verses]);
  useEffect(() => { localStorage.setItem('sanctuary_reflections', JSON.stringify(reflections)); }, [reflections]);
  useEffect(() => { localStorage.setItem('sanctuary_bucket', JSON.stringify(bucketList)); }, [bucketList]);
  useEffect(() => { localStorage.setItem('sanctuary_quiz', JSON.stringify(quizCards)); }, [quizCards]);
  useEffect(() => { localStorage.setItem('sanctuary_quiz_sets', JSON.stringify(quizSets)); }, [quizSets]);
  useEffect(() => { localStorage.setItem('sanctuary_echoes', JSON.stringify(echoes)); }, [echoes]);

  // Helper to append a dynamic Echo entry automatically
  const addEcho = (echo: Omit<EchoItem, 'id' | 'timestamp' | 'avatar' | 'author'> & { author?: 'sofs' | 'mumu' | 'both'; timestamp?: string; avatar?: string }) => {
    const authorKey: 'sofs' | 'mumu' = echo.author === 'mumu' ? 'mumu' : 'sofs';
    const newEcho: EchoItem = {
      id: `echo-${Date.now()}`,
      type: echo.type,
      title: echo.title,
      subtitle: echo.subtitle,
      timestamp: echo.timestamp || 'Just now',
      author: authorKey,
      avatar: echo.avatar || profiles[authorKey]?.avatar || initialProfiles[authorKey]?.avatar,
      imageUrl: echo.imageUrl
    };
    setEchoes(prev => [newEcho, ...prev].slice(0, 30));
  };

  // Handler functions
  const handleSaveDailyLetter = (newLetter: Omit<DailyLetter, 'id' | 'createdAt'>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const existingIndex = dailyLetters.findIndex(
      l => l.date === todayStr && l.from === newLetter.from && l.to === newLetter.to
    );

    if (existingIndex >= 0) {
      const updated = [...dailyLetters];
      updated[existingIndex] = {
        ...updated[existingIndex],
        title: newLetter.title,
        content: newLetter.content,
        paperStyle: newLetter.paperStyle,
        waxSealColor: newLetter.waxSealColor
      };
      setDailyLetters(updated);
    } else {
      const created: DailyLetter = {
        ...newLetter,
        id: `letter-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setDailyLetters([created, ...dailyLetters]);
    }

    addEcho({
      type: 'quote',
      title: `Sent a Sealed Letter: "${newLetter.title || 'Personal Letter'}"`,
      subtitle: `From ${newLetter.from === 'sofs' ? 'Sofs' : 'Mumu'} to ${newLetter.to === 'sofs' ? 'Sofs' : 'Mumu'}`,
      author: newLetter.from
    });
  };

  const handleMarkLetterAsRead = (id: string) => {
    setDailyLetters(dailyLetters.map(l => l.id === id ? { ...l, isRead: true } : l));
  };

  const handleUpdateMood = (partner: 'sofs' | 'mumu', newMood: string) => {
    setProfiles({
      ...profiles,
      [partner]: { ...profiles[partner], currentMood: newMood }
    });
    addEcho({
      type: 'quote',
      title: `${partner === 'sofs' ? 'Sofs' : 'Mumu'} updated current mood`,
      subtitle: `"${newMood}"`,
      author: partner
    });
  };

  const handleAddChapter = (newChapter: Omit<Chapter, 'id'>) => {
    const chapter: Chapter = { ...newChapter, id: `ch-${Date.now()}` };
    setChapters([chapter, ...chapters]);
    const authorKey = newChapter.author === 'both' ? 'mumu' : newChapter.author;
    addEcho({
      type: 'chapter',
      title: `Recorded Chapter ${chapter.chapterNumber}: ${chapter.title}`,
      subtitle: `${chapter.location} • ${chapter.date}`,
      author: authorKey,
      imageUrl: chapter.coverImage
    });
  };

  const handleUpdateChapter = (id: string, updated: Omit<Chapter, 'id'>) => {
    setChapters(chapters.map(c => c.id === id ? { ...updated, id } : c));
    const authorKey = updated.author === 'both' ? 'sofs' : updated.author;
    addEcho({
      type: 'chapter',
      title: `Updated Chapter ${updated.chapterNumber}: ${updated.title}`,
      subtitle: `${updated.location} • ${updated.date}`,
      author: authorKey,
      imageUrl: updated.coverImage
    });
  };

  const handleDeleteChapter = (id: string) => {
    setChapters(chapters.filter(c => c.id !== id));
  };

  const handleAddCalendarEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const ev: CalendarEvent = { ...newEvent, id: `ev-${Date.now()}` };
    setCalendarEvents([...calendarEvents, ev]);
    addEcho({
      type: 'memory',
      title: `Scheduled Event: ${ev.title}`,
      subtitle: `${ev.date} ${ev.time ? 'at ' + ev.time : ''} • ${ev.category}`,
      author: 'mumu'
    });
  };

  const handleUpdateCalendarEvent = (id: string, updated: Omit<CalendarEvent, 'id'>) => {
    setCalendarEvents(calendarEvents.map(e => e.id === id ? { ...updated, id } : e));
  };

  const handleDeleteCalendarEvent = (id: string) => {
    setCalendarEvents(calendarEvents.filter(e => e.id !== id));
  };

  const handleToggleEventCompleted = (id: string) => {
    setCalendarEvents(calendarEvents.map(e => e.id === id ? { ...e, isCompleted: !e.isCompleted } : e));
  };

  const handleAddLittleThing = (newThing: Omit<LittleThing, 'id'>) => {
    const lt: LittleThing = { ...newThing, id: `lt-${Date.now()}` };
    setLittleThings([lt, ...littleThings]);
    addEcho({
      type: 'memory',
      title: `Added Little Detail: "${lt.title}"`,
      subtitle: lt.details ? lt.details.slice(0, 50) + '...' : lt.subtitle || `Category: ${lt.category}`,
      author: lt.addedBy
    });
  };

  const handleDeleteLittleThing = (id: string) => {
    setLittleThings(littleThings.filter(l => l.id !== id));
  };

  const handleAddSong = (newSong: Omit<Song, 'id'>) => {
    const s: Song = { ...newSong, id: `sg-${Date.now()}` };
    setSongs([s, ...songs]);
    addEcho({
      type: 'song',
      title: `Added Track: "${s.title}"`,
      subtitle: `${s.artist} • ${s.moodTags?.[0] || 'Soundtrack'}`,
      author: s.addedBy || 'sofs',
      imageUrl: s.coverUrl
    });
  };

  const handleDeleteSong = (id: string) => {
    setSongs(songs.filter(s => s.id !== id));
  };

  const handleAddPhotoToAlbum = (albumId: string, newPhoto: Omit<PhotoItem, 'id'>) => {
    const p: PhotoItem = { ...newPhoto, id: `p-${Date.now()}` };
    const targetAlbum = photoAlbums.find(a => a.id === albumId);
    setPhotoAlbums(photoAlbums.map(a => {
      if (a.id === albumId) {
        return {
          ...a,
          photoCount: a.photoCount + 1,
          photos: [p, ...a.photos]
        };
      }
      return a;
    }));
    addEcho({
      type: 'photo',
      title: `Uploaded new memory photo`,
      subtitle: p.caption || `Added to "${targetAlbum?.title || 'Photo Vault'}"`,
      author: p.addedBy === 'both' ? 'sofs' : p.addedBy || 'sofs',
      imageUrl: p.url
    });
  };

  const handleCreateAlbum = (newAlbum: Omit<PhotoAlbum, 'id' | 'photoCount' | 'photos'>) => {
    const alb: PhotoAlbum = {
      ...newAlbum,
      id: `alb-${Date.now()}`,
      photoCount: 0,
      photos: []
    };
    setPhotoAlbums([...photoAlbums, alb]);
    addEcho({
      type: 'photo',
      title: `Created Photo Album: "${alb.title}"`,
      subtitle: `${alb.category} • Album created`,
      author: 'both',
      imageUrl: alb.coverUrl
    });
  };

  const handleDeleteAlbum = (albumId: string) => {
    setPhotoAlbums(photoAlbums.filter(a => a.id !== albumId));
  };

  const handleDeletePhotoFromAlbum = (albumId: string, photoId: string) => {
    setPhotoAlbums(photoAlbums.map(a => {
      if (a.id === albumId) {
        const updatedPhotos = a.photos.filter(p => p.id !== photoId);
        return {
          ...a,
          photoCount: updatedPhotos.length,
          photos: updatedPhotos
        };
      }
      return a;
    }));
  };

  const handleAddContact = (newContact: Omit<FamilyFriendContact, 'id'>) => {
    const c: FamilyFriendContact = { ...newContact, id: `ff-${Date.now()}` };
    setContacts([...contacts, c]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleAddMilestone = (newMs: Omit<TimelineMilestone, 'id'>) => {
    const ms: TimelineMilestone = { ...newMs, id: `tm-${Date.now()}` };
    setMilestones([ms, ...milestones]);
    addEcho({
      type: 'memory',
      title: `Recorded Milestone: ${ms.title}`,
      subtitle: `${ms.date} • ${ms.location}`,
      author: 'both',
      imageUrl: ms.photoUrl
    });
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const handleAddVerse = (newVerse: Omit<QuranVerse, 'id'>) => {
    const v: QuranVerse = { ...newVerse, id: `qv-${Date.now()}` };
    setVerses([...verses, v]);
  };

  const handleUpdateVerse = (id: string, updatedVerse: Omit<QuranVerse, 'id'>) => {
    setVerses(verses.map(v => v.id === id ? { ...updatedVerse, id } : v));
  };

  const handleDeleteVerse = (id: string) => {
    setVerses(verses.filter(v => v.id !== id));
  };

  const handleAddReflectionPrompt = (newPrompt: Omit<SharedReflection, 'id'>) => {
    const ref: SharedReflection = { ...newPrompt, id: `ref-${Date.now()}` };
    setReflections([ref, ...reflections]);
  };

  const handleUpdateReflection = (id: string, updated: Partial<SharedReflection>) => {
    setReflections(reflections.map(r => r.id === id ? { ...r, ...updated } : r));
  };

  const handleDeleteReflection = (id: string) => {
    setReflections(reflections.filter(r => r.id !== id));
  };

  const handleAddReflectionNote = (id: string, partner: 'mumu' | 'sofs', note: string) => {
    setReflections(reflections.map(r => {
      if (r.id === id) {
        return partner === 'mumu' ? { ...r, mumuNote: note } : { ...r, sofsNote: note };
      }
      return r;
    }));
    addEcho({
      type: 'quote',
      title: `Added Spiritual Note`,
      subtitle: `"${note.slice(0, 60)}..."`,
      author: partner
    });
  };

  const handleAddBucketItem = (newItem: Omit<BucketListItem, 'id'>) => {
    const b: BucketListItem = { ...newItem, id: `bk-${Date.now()}` };
    setBucketList([...bucketList, b]);
    addEcho({
      type: 'memory',
      title: `Added Dream Goal: "${b.title}"`,
      subtitle: `Category: ${b.category}`,
      author: 'both'
    });
  };

  const handleToggleBucketStatus = (id: string) => {
    setBucketList(bucketList.map(b => {
      if (b.id === id) {
        const nextStatus = b.status === 'Completed' ? 'Planned' : 'Completed';
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  const handleDeleteBucketItem = (id: string) => {
    setBucketList(bucketList.filter(b => b.id !== id));
  };

  const handleAddQuizCard = (newCard: Omit<QuizCard, 'id'>) => {
    const qc: QuizCard = { ...newCard, id: `qz-${Date.now()}` };
    setQuizCards([...quizCards, qc]);
  };

  const handleAddQuizSet = (newSet: Omit<QuizSet, 'id' | 'completedByPartner' | 'score'>) => {
    const qs: QuizSet = {
      ...newSet,
      id: `qs-${Date.now()}`,
      completedByPartner: false,
      score: 0
    };
    setQuizSets([qs, ...quizSets]);
  };

  const handleCompleteQuizSet = (setId: string, score: number) => {
    setQuizSets(quizSets.map(qs => {
      if (qs.id === setId) {
        return {
          ...qs,
          completedByPartner: true,
          score,
          takenDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
      }
      return qs;
    }));
  };

  const handleDeleteQuizSet = (setId: string) => {
    setQuizSets(quizSets.filter(qs => qs.id !== setId));
  };

  // Render Gatekeeper if locked
  if (isLocked) {
    return (
      <main className="min-h-screen w-full relative bg-[#0c0d12]">
        <ParticleBackground />
        <Gatekeeper onUnlock={() => setIsLocked(false)} />
      </main>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0c0d12] text-[#e2e0d8] relative font-sans">
      {/* Background Floating Dust Particles */}
      <ParticleBackground />

      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLock={() => setIsLocked(true)}
        onOpenDailyLetter={() => setIsDailyLetterModalOpen(true)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        hasUnreadLetter={dailyLetters.some(l => l.date === new Date().toISOString().split('T')[0] && !l.isRead)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen relative z-10">
        
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onOpenDailyLetter={() => setIsDailyLetterModalOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          profiles={profiles}
          onUpdateMood={handleUpdateMood}
          hasUnreadLetter={dailyLetters.some(l => l.date === new Date().toISOString().split('T')[0] && !l.isRead)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'home' && (
            <HomeScreen
              setActiveTab={setActiveTab}
              featuredChapter={chapters[0] || initialChapters[0]}
              featuredSong={songs[0] || initialSongs[0]}
              echoes={echoes}
              profiles={profiles}
              onOpenAddChapter={() => { setActiveTab('our-story'); setIsAddChapterModalOpen(true); }}
            />
          )}

          {activeTab === 'our-story' && (
            <OurStoryScreen
              chapters={chapters}
              onAddChapter={handleAddChapter}
              onUpdateChapter={handleUpdateChapter}
              onDeleteChapter={handleDeleteChapter}
              isAddModalOpen={isAddChapterModalOpen}
              setIsAddModalOpen={setIsAddChapterModalOpen}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarScreen
              events={calendarEvents}
              countdowns={initialCountdowns}
              onAddEvent={handleAddCalendarEvent}
              onUpdateEvent={handleUpdateCalendarEvent}
              onDeleteEvent={handleDeleteCalendarEvent}
              onToggleEventCompleted={handleToggleEventCompleted}
            />
          )}

          {activeTab === 'little-things' && (
            <LittleThingsScreen
              littleThings={littleThings}
              onAddLittleThing={handleAddLittleThing}
              onDeleteLittleThing={handleDeleteLittleThing}
            />
          )}

          {activeTab === 'music' && (
            <MusicScreen
              songs={songs}
              onAddSong={handleAddSong}
              onDeleteSong={handleDeleteSong}
            />
          )}

          {activeTab === 'photo-vault' && (
            <PhotoVaultScreen
              albums={photoAlbums}
              onAddPhotoToAlbum={handleAddPhotoToAlbum}
              onCreateAlbum={handleCreateAlbum}
              onDeleteAlbum={handleDeleteAlbum}
              onDeletePhoto={handleDeletePhotoFromAlbum}
            />
          )}

          {activeTab === 'family-friends' && (
            <FamilyFriendsScreen
              contacts={contacts}
              onAddContact={handleAddContact}
              onDeleteContact={handleDeleteContact}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineScreen
              milestones={milestones}
              onAddMilestone={handleAddMilestone}
              onDeleteMilestone={handleDeleteMilestone}
            />
          )}

          {activeTab === 'faith' && (
            <FaithScreen
              verses={verses}
              reflections={reflections}
              onAddVerse={handleAddVerse}
              onUpdateVerse={handleUpdateVerse}
              onDeleteVerse={handleDeleteVerse}
              onAddReflectionPrompt={handleAddReflectionPrompt}
              onUpdateReflection={handleUpdateReflection}
              onDeleteReflection={handleDeleteReflection}
              onAddReflectionNote={handleAddReflectionNote}
            />
          )}

          {activeTab === 'bucket-list' && (
            <BucketListScreen
              items={bucketList}
              onAddBucketItem={handleAddBucketItem}
              onToggleStatus={handleToggleBucketStatus}
              onDeleteBucketItem={handleDeleteBucketItem}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizScreen
              cards={quizCards}
              quizSets={quizSets}
              onAddCard={handleAddQuizCard}
              onAddQuizSet={handleAddQuizSet}
              onCompleteQuizSet={handleCompleteQuizSet}
              onDeleteQuizSet={handleDeleteQuizSet}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <LetterOfTheDayModal
        isOpen={isDailyLetterModalOpen}
        onClose={() => setIsDailyLetterModalOpen(false)}
        letters={dailyLetters}
        onSaveLetter={handleSaveDailyLetter}
        onMarkAsRead={handleMarkLetterAsRead}
        profiles={profiles}
      />

      <AIRomanticAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        chapters={chapters}
        songs={songs}
        littleThings={littleThings}
        events={calendarEvents}
        bucketList={bucketList}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}