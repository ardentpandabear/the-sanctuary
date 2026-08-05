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
  EchoItem,
  PartnerProfile
} from './types';

import { getTableData, saveTableItem, deleteTableItem, subscribeToTable } from './services/db';

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isDailyLetterModalOpen, setIsDailyLetterModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState(false);

  // Helper function to read synchronous local cache
  const getLocalCache = <T,>(key: string, fallback: T): T => {
    const saved = localStorage.getItem(`sanctuary_${key}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(`Failed to parse local cache for ${key}:`, e);
      }
    }
    return fallback;
  };

  // Persistent State
  const [profiles, setProfiles] = useState<{ sofs: PartnerProfile; mumu: PartnerProfile }>(() => 
    getLocalCache('profiles', initialProfiles)
  );

  const [dailyLetters, setDailyLetters] = useState<DailyLetter[]>(() => 
    getLocalCache('daily_letters', [])
  );

  const [chapters, setChapters] = useState<Chapter[]>(() => 
    getLocalCache('chapters', [])
  );

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => 
    getLocalCache('calendar_events', [])
  );

  const [littleThings, setLittleThings] = useState<LittleThing[]>(() => 
    getLocalCache('little_things', [])
  );

  const [songs, setSongs] = useState<Song[]>(() => 
    getLocalCache('songs', [])
  );

  const [photoAlbums, setPhotoAlbums] = useState<PhotoAlbum[]>(() => 
    getLocalCache('photo_albums', [])
  );

  const [contacts, setContacts] = useState<FamilyFriendContact[]>(() => 
    getLocalCache('contacts', [])
  );

  const [milestones, setMilestones] = useState<TimelineMilestone[]>(() => 
    getLocalCache('milestones', [])
  );

  const [verses, setVerses] = useState<QuranVerse[]>(() => 
    getLocalCache('verses', [])
  );

  const [reflections, setReflections] = useState<SharedReflection[]>(() => 
    getLocalCache('reflections', [])
  );

  const [bucketList, setBucketList] = useState<BucketListItem[]>(() => 
    getLocalCache('bucket_list', [])
  );

  const [quizCards, setQuizCards] = useState<QuizCard[]>(() => 
    getLocalCache('quiz_cards', [])
  );

  const [quizSets, setQuizSets] = useState<QuizSet[]>(() => 
    getLocalCache('quiz_sets', [])
  );

  const [echoes, setEchoes] = useState<EchoItem[]>(() => 
    getLocalCache('echoes', [])
  );

  // Load from Supabase on mount & set up real-time subscribers
  useEffect(() => {
    let isMounted = true;

    async function loadAllData() {
      const [
        fetchedLetters,
        fetchedChapters,
        fetchedEvents,
        fetchedLittleThings,
        fetchedSongs,
        fetchedAlbums,
        fetchedContacts,
        fetchedMilestones,
        fetchedVerses,
        fetchedReflections,
        fetchedBucket,
        fetchedQuizCards,
        fetchedQuizSets,
        fetchedEchoes,
        fetchedProfilesData
      ] = await Promise.all([
        getTableData<DailyLetter>('daily_letters', []),
        getTableData<Chapter>('chapters', []),
        getTableData<CalendarEvent>('calendar_events', []),
        getTableData<LittleThing>('little_things', []),
        getTableData<Song>('songs', []),
        getTableData<PhotoAlbum>('photo_albums', []),
        getTableData<FamilyFriendContact>('contacts', []),
        getTableData<TimelineMilestone>('milestones', []),
        getTableData<QuranVerse>('verses', []),
        getTableData<SharedReflection>('reflections', []),
        getTableData<BucketListItem>('bucket_list', []),
        getTableData<QuizCard>('quiz_cards', []),
        getTableData<QuizSet>('quiz_sets', []),
        getTableData<EchoItem>('echoes', []),
        getTableData<PartnerProfile>('profiles', [initialProfiles.sofs, initialProfiles.mumu])
      ]);

      if (!isMounted) return;

      if (fetchedLetters) setDailyLetters(fetchedLetters);
      if (fetchedChapters) setChapters(fetchedChapters);
      if (fetchedEvents) setCalendarEvents(fetchedEvents);
      if (fetchedLittleThings) setLittleThings(fetchedLittleThings);
      if (fetchedSongs) setSongs(fetchedSongs);
      if (fetchedAlbums) setPhotoAlbums(fetchedAlbums);
      if (fetchedContacts) setContacts(fetchedContacts);
      if (fetchedMilestones) setMilestones(fetchedMilestones);
      if (fetchedVerses) setVerses(fetchedVerses);
      if (fetchedReflections) setReflections(fetchedReflections);
      if (fetchedBucket) setBucketList(fetchedBucket);
      if (fetchedQuizCards) setQuizCards(fetchedQuizCards);
      if (fetchedQuizSets) setQuizSets(fetchedQuizSets);
      
      if (fetchedEchoes) {
        // Discard preset echoes or echoes older than 24 hours (24 * 60 * 60 * 1000 ms)
        const activeEchoes = fetchedEchoes.filter(echo => {
          const tsNum = parseInt(echo.id.replace('echo-', ''), 10);
          if (isNaN(tsNum)) {
            // Preset echo like echo-1, remove it
            deleteTableItem('echoes', echo.id);
            return false;
          }
          const isExpired = Date.now() - tsNum > 24 * 60 * 60 * 1000;
          if (isExpired) {
            deleteTableItem('echoes', echo.id);
            return false;
          }
          return true;
        });
        setEchoes(activeEchoes);
      }

      if (fetchedProfilesData && fetchedProfilesData.length > 0) {
        const sofsP = fetchedProfilesData.find(p => p.id === 'sofs') || initialProfiles.sofs;
        const mumuP = fetchedProfilesData.find(p => p.id === 'mumu') || initialProfiles.mumu;
        setProfiles({ sofs: sofsP, mumu: mumuP });
      }
    }

    loadAllData();

    // Set up Realtime Subscriptions for Cross-Device Syncing
    const unsubs = [
      subscribeToTable<DailyLetter>('daily_letters', setDailyLetters),
      subscribeToTable<Chapter>('chapters', setChapters),
      subscribeToTable<CalendarEvent>('calendar_events', setCalendarEvents),
      subscribeToTable<LittleThing>('little_things', setLittleThings),
      subscribeToTable<Song>('songs', setSongs),
      subscribeToTable<PhotoAlbum>('photo_albums', setPhotoAlbums),
      subscribeToTable<FamilyFriendContact>('contacts', setContacts),
      subscribeToTable<TimelineMilestone>('milestones', setMilestones),
      subscribeToTable<QuranVerse>('verses', setVerses),
      subscribeToTable<SharedReflection>('reflections', setReflections),
      subscribeToTable<BucketListItem>('bucket_list', setBucketList),
      subscribeToTable<QuizCard>('quiz_cards', setQuizCards),
      subscribeToTable<QuizSet>('quiz_sets', setQuizSets),
      subscribeToTable<EchoItem>('echoes', (data) => {
        const active = (data || []).filter(echo => {
          const tsNum = parseInt(echo.id.replace('echo-', ''), 10);
          if (isNaN(tsNum)) return false;
          return Date.now() - tsNum <= 24 * 60 * 60 * 1000;
        });
        setEchoes(active);
      }),
      subscribeToTable<PartnerProfile>('profiles', data => {
        if (data && data.length > 0) {
          const sofsP = data.find(p => p.id === 'sofs') || initialProfiles.sofs;
          const mumuP = data.find(p => p.id === 'mumu') || initialProfiles.mumu;
          setProfiles({ sofs: sofsP, mumu: mumuP });
        }
      })
    ];

    return () => {
      isMounted = false;
      unsubs.forEach(unsub => unsub());
    };
  }, []);

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
    saveTableItem('echoes', newEcho);
  };

  // Handler functions
  const handleSaveDailyLetter = (newLetter: Omit<DailyLetter, 'id' | 'createdAt'>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const existingIndex = dailyLetters.findIndex(
      l => l.date === todayStr && l.from === newLetter.from && l.to === newLetter.to
    );

    let savedLetter: DailyLetter;

    if (existingIndex >= 0) {
      savedLetter = {
        ...dailyLetters[existingIndex],
        title: newLetter.title,
        content: newLetter.content,
        paperStyle: newLetter.paperStyle,
        waxSealColor: newLetter.waxSealColor
      };
      const updated = [...dailyLetters];
      updated[existingIndex] = savedLetter;
      setDailyLetters(updated);
    } else {
      savedLetter = {
        ...newLetter,
        id: `letter-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setDailyLetters([savedLetter, ...dailyLetters]);
    }

    saveTableItem('daily_letters', savedLetter);

    addEcho({
      type: 'quote',
      title: `Sent a Sealed Letter: "${newLetter.title || 'Personal Letter'}"`,
      subtitle: `From ${newLetter.from === 'sofs' ? 'Sofs' : 'Mumu'} to ${newLetter.to === 'sofs' ? 'Sofs' : 'Mumu'}`,
      author: newLetter.from
    });
  };

  const handleMarkLetterAsRead = (id: string) => {
    const target = dailyLetters.find(l => l.id === id);
    if (!target) return;
    const updated = { ...target, isRead: true };
    setDailyLetters(dailyLetters.map(l => l.id === id ? updated : l));
    saveTableItem('daily_letters', updated);
  };

  const handleDeleteDailyLetter = (id: string) => {
    setDailyLetters(prev => prev.filter(l => l.id !== id));
    deleteTableItem('daily_letters', id);
  };

  const handleUpdateMood = (partner: 'sofs' | 'mumu', newMood: string) => {
    const updatedPartner = { ...profiles[partner], currentMood: newMood };
    const updatedProfiles = {
      ...profiles,
      [partner]: updatedPartner
    };
    setProfiles(updatedProfiles);
    saveTableItem('profiles', updatedPartner);

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
    saveTableItem('chapters', chapter);

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
    const chapter: Chapter = { ...updated, id };
    setChapters(chapters.map(c => c.id === id ? chapter : c));
    saveTableItem('chapters', chapter);

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
    deleteTableItem('chapters', id);
  };

  const handleAddCalendarEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const ev: CalendarEvent = { ...newEvent, id: `ev-${Date.now()}` };
    setCalendarEvents([...calendarEvents, ev]);
    saveTableItem('calendar_events', ev);

    addEcho({
      type: 'memory',
      title: `Scheduled Event: ${ev.title}`,
      subtitle: `${ev.date} ${ev.time ? 'at ' + ev.time : ''} • ${ev.category}`,
      author: 'mumu'
    });
  };

  const handleUpdateCalendarEvent = (id: string, updated: Omit<CalendarEvent, 'id'>) => {
    const ev: CalendarEvent = { ...updated, id };
    setCalendarEvents(calendarEvents.map(e => e.id === id ? ev : e));
    saveTableItem('calendar_events', ev);
  };

  const handleDeleteCalendarEvent = (id: string) => {
    setCalendarEvents(calendarEvents.filter(e => e.id !== id));
    deleteTableItem('calendar_events', id);
  };

  const handleToggleEventCompleted = (id: string) => {
    const target = calendarEvents.find(e => e.id === id);
    if (!target) return;
    const updated = { ...target, isCompleted: !target.isCompleted };
    setCalendarEvents(calendarEvents.map(e => e.id === id ? updated : e));
    saveTableItem('calendar_events', updated);
  };

  const handleAddLittleThing = (newThing: Omit<LittleThing, 'id'>) => {
    const lt: LittleThing = { ...newThing, id: `lt-${Date.now()}` };
    setLittleThings([lt, ...littleThings]);
    saveTableItem('little_things', lt);

    addEcho({
      type: 'memory',
      title: `Added Little Detail: "${lt.title}"`,
      subtitle: lt.details ? lt.details.slice(0, 50) + '...' : lt.subtitle || `Category: ${lt.category}`,
      author: lt.addedBy
    });
  };

  const handleDeleteLittleThing = (id: string) => {
    setLittleThings(littleThings.filter(l => l.id !== id));
    deleteTableItem('little_things', id);
  };

  const handleAddSong = (newSong: Omit<Song, 'id'>) => {
    const s: Song = { ...newSong, id: `sg-${Date.now()}` };
    setSongs([s, ...songs]);
    saveTableItem('songs', s);

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
    deleteTableItem('songs', id);
  };

  const handleAddPhotoToAlbum = (albumId: string, newPhoto: Omit<PhotoItem, 'id'>) => {
    const p: PhotoItem = { ...newPhoto, id: `p-${Date.now()}` };
    const targetAlbum = photoAlbums.find(a => a.id === albumId);
    let updatedAlbum: PhotoAlbum | null = null;

    setPhotoAlbums(photoAlbums.map(a => {
      if (a.id === albumId) {
        updatedAlbum = {
          ...a,
          photoCount: a.photoCount + 1,
          photos: [p, ...a.photos]
        };
        return updatedAlbum;
      }
      return a;
    }));

    if (updatedAlbum) {
      saveTableItem('photo_albums', updatedAlbum);
    }

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
    saveTableItem('photo_albums', alb);

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
    deleteTableItem('photo_albums', albumId);
  };

  const handleDeletePhotoFromAlbum = (albumId: string, photoId: string) => {
    let updatedAlbum: PhotoAlbum | null = null;
    setPhotoAlbums(photoAlbums.map(a => {
      if (a.id === albumId) {
        const updatedPhotos = a.photos.filter(p => p.id !== photoId);
        updatedAlbum = {
          ...a,
          photoCount: updatedPhotos.length,
          photos: updatedPhotos
        };
        return updatedAlbum;
      }
      return a;
    }));

    if (updatedAlbum) {
      saveTableItem('photo_albums', updatedAlbum);
    }
  };

  const handleAddContact = (newContact: Omit<FamilyFriendContact, 'id'>) => {
    const c: FamilyFriendContact = { ...newContact, id: `ff-${Date.now()}` };
    setContacts([...contacts, c]);
    saveTableItem('contacts', c);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    deleteTableItem('contacts', id);
  };

  const handleAddMilestone = (newMs: Omit<TimelineMilestone, 'id'>) => {
    const ms: TimelineMilestone = { ...newMs, id: `tm-${Date.now()}` };
    setMilestones([ms, ...milestones]);
    saveTableItem('milestones', ms);

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
    deleteTableItem('milestones', id);
  };

  const handleAddVerse = (newVerse: Omit<QuranVerse, 'id'>) => {
    const v: QuranVerse = { ...newVerse, id: `qv-${Date.now()}` };
    setVerses([...verses, v]);
    saveTableItem('verses', v);
  };

  const handleUpdateVerse = (id: string, updatedVerse: Omit<QuranVerse, 'id'>) => {
    const v: QuranVerse = { ...updatedVerse, id };
    setVerses(verses.map(item => item.id === id ? v : item));
    saveTableItem('verses', v);
  };

  const handleDeleteVerse = (id: string) => {
    setVerses(verses.filter(v => v.id !== id));
    deleteTableItem('verses', id);
  };

  const handleAddReflectionPrompt = (newPrompt: Omit<SharedReflection, 'id'>) => {
    const ref: SharedReflection = { ...newPrompt, id: `ref-${Date.now()}` };
    setReflections([ref, ...reflections]);
    saveTableItem('reflections', ref);
  };

  const handleUpdateReflection = (id: string, updated: Partial<SharedReflection>) => {
    const target = reflections.find(r => r.id === id);
    if (!target) return;
    const ref: SharedReflection = { ...target, ...updated };
    setReflections(reflections.map(r => r.id === id ? ref : r));
    saveTableItem('reflections', ref);
  };

  const handleDeleteReflection = (id: string) => {
    setReflections(reflections.filter(r => r.id !== id));
    deleteTableItem('reflections', id);
  };

  const handleAddReflectionNote = (id: string, partner: 'mumu' | 'sofs', note: string) => {
    let updatedRef: SharedReflection | null = null;
    setReflections(reflections.map(r => {
      if (r.id === id) {
        updatedRef = partner === 'mumu' ? { ...r, mumuNote: note } : { ...r, sofsNote: note };
        return updatedRef;
      }
      return r;
    }));

    if (updatedRef) {
      saveTableItem('reflections', updatedRef);
    }

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
    saveTableItem('bucket_list', b);

    addEcho({
      type: 'memory',
      title: `Added Dream Goal: "${b.title}"`,
      subtitle: `Category: ${b.category}`,
      author: 'both'
    });
  };

  const handleToggleBucketStatus = (id: string) => {
    const target = bucketList.find(b => b.id === id);
    if (!target) return;
    const nextStatus = target.status === 'Completed' ? 'Planned' : 'Completed';
    const updated = { ...target, status: nextStatus };
    setBucketList(bucketList.map(b => b.id === id ? updated : b));
    saveTableItem('bucket_list', updated);
  };

  const handleDeleteBucketItem = (id: string) => {
    setBucketList(bucketList.filter(b => b.id !== id));
    deleteTableItem('bucket_list', id);
  };

  const handleAddQuizCard = (newCard: Omit<QuizCard, 'id'>) => {
    const qc: QuizCard = { ...newCard, id: `qz-${Date.now()}` };
    setQuizCards([...quizCards, qc]);
    saveTableItem('quiz_cards', qc);
  };

  const handleAddQuizSet = (newSet: Omit<QuizSet, 'id' | 'completedByPartner' | 'score'>) => {
    const qs: QuizSet = {
      ...newSet,
      id: `qs-${Date.now()}`,
      completedByPartner: false,
      score: 0
    };
    setQuizSets([qs, ...quizSets]);
    saveTableItem('quiz_sets', qs);
  };

  const handleCompleteQuizSet = (setId: string, score: number) => {
    const target = quizSets.find(qs => qs.id === setId);
    if (!target) return;
    const updated: QuizSet = {
      ...target,
      completedByPartner: true,
      score,
      takenDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setQuizSets(quizSets.map(qs => qs.id === setId ? updated : qs));
    saveTableItem('quiz_sets', updated);
  };

  const handleDeleteQuizSet = (setId: string) => {
    setQuizSets(quizSets.filter(qs => qs.id !== setId));
    deleteTableItem('quiz_sets', setId);
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
              featuredChapter={chapters[0]}
              featuredSong={songs[0]}
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
        onDeleteLetter={handleDeleteDailyLetter}
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