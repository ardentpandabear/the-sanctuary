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
  DailyLetter 
} from './types';

import { getTableData, subscribeToTable, upsertTableItem, deleteTableItem } from './services/db';


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
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('sanctuary_profiles');
    return saved ? JSON.parse(saved) : initialProfiles;
  });

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

  // Save changes to localStorage
  useEffect(() => { localStorage.setItem('sanctuary_profiles', JSON.stringify(profiles)); }, [profiles]);
  useEffect(() => { localStorage.setItem('sanctuary_daily_letters', JSON.stringify(dailyLetters)); }, [dailyLetters]);
  useEffect(() => { localStorage.setItem('sanctuary_chapters', JSON.stringify(chapters)); }, [chapters]);

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
  };

  const handleMarkLetterAsRead = (id: string) => {
    setDailyLetters(dailyLetters.map(l => l.id === id ? { ...l, isRead: true } : l));
  };
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

  // Load from Database & Subscribe to Realtime Updates
  useEffect(() => {
    async function loadDbData() {
      const letters = await getTableData('daily_letters', initialDailyLetters);
      if (letters && letters.length) setDailyLetters(letters);

      const chs = await getTableData('chapters', initialChapters);
      if (chs && chs.length) setChapters(chs);

      const evs = await getTableData('calendar_events', initialCalendarEvents);
      if (evs && evs.length) setCalendarEvents(evs);

      const lts = await getTableData('little_things', initialLittleThings);
      if (lts && lts.length) setLittleThings(lts);

      const sgs = await getTableData('songs', initialSongs);
      if (sgs && sgs.length) setSongs(sgs);

      const albs = await getTableData('photo_albums', initialPhotoAlbums);
      if (albs && albs.length) setPhotoAlbums(albs);

      const bks = await getTableData('bucket_list', initialBucketList);
      if (bks && bks.length) setBucketList(bks);

      const refs = await getTableData('reflections', initialReflections);
      if (refs && refs.length) setReflections(refs);
    }

    loadDbData();

    const unsubLetters = subscribeToTable<DailyLetter>('daily_letters', setDailyLetters);
    const unsubChapters = subscribeToTable<Chapter>('chapters', setChapters);
    const unsubEvents = subscribeToTable<CalendarEvent>('calendar_events', setCalendarEvents);
    const unsubLittleThings = subscribeToTable<LittleThing>('little_things', setLittleThings);
    const unsubSongs = subscribeToTable<Song>('songs', setSongs);
    const unsubAlbums = subscribeToTable<PhotoAlbum>('photo_albums', setPhotoAlbums);
    const unsubBucket = subscribeToTable<BucketListItem>('bucket_list', setBucketList);
    const unsubReflections = subscribeToTable<SharedReflection>('reflections', setReflections);

    return () => {
      unsubLetters();
      unsubChapters();
      unsubEvents();
      unsubLittleThings();
      unsubSongs();
      unsubAlbums();
      unsubBucket();
      unsubReflections();
    };
  }, []);

  // Handler functions
  const handleUpdateMood = (partner: 'sofs' | 'mumu', newMood: string) => {
    setProfiles({
      ...profiles,
      [partner]: { ...profiles[partner], currentMood: newMood }
    });
  };

  const handleAddChapter = (newChapter: Omit<Chapter, 'id'>) => {
    const chapter: Chapter = { ...newChapter, id: `ch-${Date.now()}` };
    setChapters([chapter, ...chapters]);
    upsertTableItem('chapters', chapter);
  };

  const handleUpdateChapter = (id: string, updated: Omit<Chapter, 'id'>) => {
    const chapter = { ...updated, id };
    setChapters(chapters.map(c => c.id === id ? chapter : c));
    upsertTableItem('chapters', chapter);
  };

  const handleDeleteChapter = (id: string) => {
    setChapters(chapters.filter(c => c.id !== id));
    deleteTableItem('chapters', id);
  };

  const handleAddCalendarEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const ev: CalendarEvent = { ...newEvent, id: `ev-${Date.now()}` };
    setCalendarEvents([...calendarEvents, ev]);
    upsertTableItem('calendar_events', ev);
  };

  const handleUpdateCalendarEvent = (id: string, updated: Omit<CalendarEvent, 'id'>) => {
    const ev = { ...updated, id };
    setCalendarEvents(calendarEvents.map(e => e.id === id ? ev : e));
    upsertTableItem('calendar_events', ev);
  };

  const handleDeleteCalendarEvent = (id: string) => {
    setCalendarEvents(calendarEvents.filter(e => e.id !== id));
    deleteTableItem('calendar_events', id);
  };

  const handleToggleEventCompleted = (id: string) => {
    const updated = calendarEvents.map(e => e.id === id ? { ...e, isCompleted: !e.isCompleted } : e);
    setCalendarEvents(updated);
    const target = updated.find(e => e.id === id);
    if (target) upsertTableItem('calendar_events', target);
  };

  const handleAddLittleThing = (newThing: Omit<LittleThing, 'id'>) => {
    const lt: LittleThing = { ...newThing, id: `lt-${Date.now()}` };
    setLittleThings([lt, ...littleThings]);
    upsertTableItem('little_things', lt);
  };

  const handleDeleteLittleThing = (id: string) => {
    setLittleThings(littleThings.filter(l => l.id !== id));
    deleteTableItem('little_things', id);
  };

  const handleAddSong = (newSong: Omit<Song, 'id'>) => {
    const s: Song = { ...newSong, id: `sg-${Date.now()}` };
    setSongs([s, ...songs]);
    upsertTableItem('songs', s);
  };

  const handleDeleteSong = (id: string) => {
    setSongs(songs.filter(s => s.id !== id));
    deleteTableItem('songs', id);
  };


  const handleAddPhotoToAlbum = (albumId: string, newPhoto: Omit<PhotoItem, 'id'>) => {
    const p: PhotoItem = { ...newPhoto, id: `p-${Date.now()}` };
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
  };

  const handleCreateAlbum = (newAlbum: Omit<PhotoAlbum, 'id' | 'photoCount' | 'photos'>) => {
    const alb: PhotoAlbum = {
      ...newAlbum,
      id: `alb-${Date.now()}`,
      photoCount: 0,
      photos: []
    };
    setPhotoAlbums([...photoAlbums, alb]);
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
    upsertTableItem('reflections', ref);
  };

  const handleUpdateReflection = (id: string, updated: Partial<SharedReflection>) => {
    const newList = reflections.map(r => r.id === id ? { ...r, ...updated } : r);
    setReflections(newList);
    const target = newList.find(r => r.id === id);
    if (target) upsertTableItem('reflections', target);
  };

  const handleDeleteReflection = (id: string) => {
    setReflections(reflections.filter(r => r.id !== id));
    deleteTableItem('reflections', id);
  };

  const handleAddReflectionNote = (id: string, partner: 'mumu' | 'sofs', note: string) => {
    const newList = reflections.map(r => {
      if (r.id === id) {
        return partner === 'mumu' ? { ...r, mumuNote: note } : { ...r, sofsNote: note };
      }
      return r;
    });
    setReflections(newList);
    const target = newList.find(r => r.id === id);
    if (target) upsertTableItem('reflections', target);
  };

  const handleAddBucketItem = (newItem: Omit<BucketListItem, 'id'>) => {
    const b: BucketListItem = { ...newItem, id: `bk-${Date.now()}` };
    setBucketList([...bucketList, b]);
    upsertTableItem('bucket_list', b);
  };

  const handleToggleBucketStatus = (id: string) => {
    const newList = bucketList.map(b => {
      if (b.id === id) {
        const nextStatus = b.status === 'Completed' ? 'Planned' : 'Completed';
        return { ...b, status: nextStatus };
      }
      return b;
    });
    setBucketList(newList);
    const target = newList.find(b => b.id === id);
    if (target) upsertTableItem('bucket_list', target);
  };

  const handleDeleteBucketItem = (id: string) => {
    setBucketList(bucketList.filter(b => b.id !== id));
    deleteTableItem('bucket_list', id);
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
              echoes={initialEchoes}
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
