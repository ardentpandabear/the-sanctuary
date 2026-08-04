import { 
  PartnerProfile, 
  Chapter, 
  CalendarEvent, 
  CountdownItem, 
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
  EchoItem,
  DailyLetter
} from '../types';

export const initialProfiles: { sofs: PartnerProfile; mumu: PartnerProfile } = {
  sofs: {
    id: 'sofs',
    name: 'Sofs',
    nickname: 'My Star',
    avatar: 'https://images.unsplash.com/photo-1615583452853-a4e45d4f68b1?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: 'London, UK',
    timezone: 'GMT+0',
    currentMood: 'Sipping warm chai & thinking of you',
    favoriteQuote: 'In all the world, there is no heart for me like yours.',
  },
  mumu: {
    id: 'mumu',
    name: 'Mumu',
    nickname: 'My Everything',
    avatar: 'https://images.unsplash.com/photo-1602734846297-9299fc2d4703?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: 'Allahabad, India',
    timezone: 'IST-5.5',
    currentMood: 'Counting down the days till next month',
    favoriteQuote: 'You are my home and my adventure all at once.',
  }
};

export const initialChapters: Chapter[] = [
  {
    id: 'ch-1',
    chapterNumber: 1,
    title: 'Happiness is with you, even in the rain',
    date: 'October 14, 2021',
    location: 'London',
    description: 'You came into my life like a sudden downpour on a sunny day, unexpected yet refreshing. Our first meeting was filled with laughter, shared stories, and the warmth of two hearts finding each other amidst the autumn rain.',
    tags: ['First Meet', 'London', 'Autumn Rain'],
    coverImage: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1000',
    audioTrackName: 'Serenade in Autumn',
    audioTrackArtist: 'Yiruma',
    audioTrackUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    author: 'mumu'
  },
  {
    id: 'ch-2',
    chapterNumber: 2,
    title: 'Midnight Whispers Across Oceans',
    date: 'January 2, 2022',
    location: 'London <-> New York',
    description: 'Navigating 3,500 miles and a 5-hour time zone difference. We created our late-night tea ritual on Insta, reading poetry aloud and syncing movie timestamps so we could laugh together at the exact same frame.',
    tags: ['Long Distance', 'Late Night', 'FaceTime'],
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1000',
    audioTrackName: 'Electric Love Call',
    audioTrackArtist: 'Lofi Chill',
    audioTrackUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a221f7.mp3',
    author: 'sofs'
  },
  {
    id: 'ch-3',
    chapterNumber: 3,
    title: 'Reunion in the Golden City',
    date: 'June 18, 2022',
    location: 'Istanbul, Turkey',
    description: 'Happiness is a state of well-being and contentment marked by joy, satisfaction, and positive emotions. It means feeling good about life, having peace of mind, and finding personal fulfillment.Key Types of HappinessHedonic Happiness: Pleasure and enjoyment from the present moment.Eudaimonic Happiness: A deeper sense of meaning, value, and purpose in life',
    tags: ['Reunion', 'Istanbul', 'Bosphorus', 'Magic'],
    coverImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=1000',
    audioTrackName: 'Bosphorus Sunset',
    audioTrackArtist: 'Mercan Dede',
    audioTrackUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f7a932.mp3',
    author: 'both'
  },
  {
    id: 'ch-4',
    chapterNumber: 4,
    title: 'The Promise under the Olive Trees',
    date: 'August 12, 2023',
    location: 'Cappadocia, Turkey',
    description: 'Happiness is a state of well-being and contentment marked by joy, satisfaction, and positive emotions. It means feeling good about life, having peace of mind, and finding personal fulfillment.Key Types of HappinessHedonic Happiness: Pleasure and enjoyment from the present moment.Eudaimonic Happiness: A deeper sense of meaning, value, and purpose in life’ hand. Surrounded by soft morning light and quiet prayers, we said yes to forever.',
    tags: ['Proposal', 'Cappadocia', 'Forever', 'Engagement'],
    coverImage: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=1000',
    audioTrackName: 'A Thousand Years (Acoustic)',
    audioTrackArtist: 'Piano Tribute',
    audioTrackUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_d0a13f69d2.mp3',
    author: 'both'
  }
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'FaceTime Candlelight Dinner Date',
    date: '2026-08-15',
    time: '8:00 PM',
    category: 'date-night',
    notes: 'We both order Italian food and light jasmine candles.',
    isCompleted: false
  },
  {
    id: 'ev-2',
    title: 'Sofs & Mumu Reunion Flight',
    date: '2026-08-28',
    time: '02:30 PM',
    category: 'travel',
    notes: 'LHR to JFK flight arriving in New York for 2 weeks together!',
    isCompleted: false
  },
  {
    id: 'ev-3',
    title: 'Mumu’s Birthday Surprise',
    date: '2026-09-24',
    time: '12:00 AM',
    category: 'special',
    notes: 'Special care package with handwritten letters arriving in NY.',
    isCompleted: false
  },
  {
    id: 'ev-4',
    title: 'Our 3rd Anniversary Trip to Kyoto',
    date: '2026-10-14',
    time: '10:00 AM',
    category: 'anniversary',
    notes: 'Flight booked to Kyoto! Looking forward to autumn leaves.',
    isCompleted: false
  },
  {
    id: 'ev-5',
    title: 'First Day of Ramadan',
    date: '2027-03-09',
    category: 'faith',
    hijriDate: '1 Ramadan 1448',
    notes: 'Shared Suhoor video call & daily Juz reading schedule.',
    isCompleted: false
  }
];

export const initialCountdowns: CountdownItem[] = [
  {
    id: 'cd-1',
    title: 'Next Flight to See Each Other',
    targetDate: '2025-08-28',
    category: 'Reunion',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  {
    id: 'cd-2',
    title: 'Our Nikkah & Wedding Day',
    targetDate: '2026-06-12',
    category: 'Big Milestone',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  {
    id: 'cd-3',
    title: 'Kyoto Autumn Leaves Journey',
    targetDate: '2025-10-14',
    category: 'Travel',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
  }
];

export const initialLittleThings: LittleThing[] = [
  {
    id: 'lt-1',
    category: 'Favorites',
    title: 'Peonies & Eucalyptus',
    subtitle: 'Sofs’ Favorite Bloom',
    details: 'Fresh white peonies paired with sweet silver eucalyptus. Mumu always makes sure a fresh bouquet waits on the kitchen table whenever Sofs visits NY.',
    addedBy: 'mumu',
    iconName: 'Flower2',
    bgColor: 'from-rose-950/40 to-rose-900/10'
  },
  {
    id: 'lt-2',
    category: 'Quirks',
    title: 'The Coffee Routine',
    subtitle: 'Exactly 2 Sugars & Oat Milk',
    details: 'Mumu insists on stirring Sofs’ coffee clockwise exactly 7 times for good luck, while Sofs always blows on the foam twice before taking the first sip.',
    addedBy: 'sofs',
    iconName: 'Coffee',
    bgColor: 'from-amber-950/40 to-amber-900/10'
  },
  {
    id: 'lt-3',
    category: 'Scents',
    title: 'Petrichor & Oud Wood',
    subtitle: 'The Smell of Comfort',
    details: 'The combination of damp London rain on pavement outside and the warm, woody aroma of Tom Ford Oud Wood on Mumu’s collar.',
    addedBy: 'sofs',
    iconName: 'Sparkles',
    bgColor: 'from-indigo-950/40 to-indigo-900/10'
  },
  {
    id: 'lt-4',
    category: 'Snacks',
    title: 'Midnight Salted Caramel Toast',
    subtitle: 'Our 1 AM Craving',
    details: 'Thick sourdough toast buttered hot, drizzled with artisan salted caramel spread and sea salt flakes during late night studying.',
    addedBy: 'mumu',
    iconName: 'Utensils',
    bgColor: 'from-orange-950/40 to-orange-900/10'
  },
  {
    id: 'lt-5',
    category: 'Quotes',
    title: 'The Nose Scrunch',
    subtitle: 'A Quiet Observation',
    details: '“The subtle way you scrunch your nose when you’re trying not to laugh at my silly jokes... that’s the moment I fall for you all over again.”',
    addedBy: 'mumu',
    iconName: 'Quote',
    bgColor: 'from-emerald-950/40 to-emerald-900/10'
  },
  {
    id: 'lt-6',
    category: 'Rituals',
    title: 'Goodnight Voice Notes',
    subtitle: 'Never Ending a Day Without',
    details: 'No matter how tired or busy we are, a 2-minute voice note recapping the smallest detail of our day is sent before sleeping.',
    addedBy: 'sofs',
    iconName: 'Mic',
    bgColor: 'from-purple-950/40 to-purple-900/10'
  }
];

export const initialSongs: Song[] = [
  {
    id: 'sg-1',
    title: 'Lover (First Dance Mix)',
    artist: 'Taylor Swift',
    album: 'Lover',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400',
    addedBy: 'sofs',
    moodTags: ['Wedding Vibes', 'Romantic', 'Acoustic'],
    duration: '3:41',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    storyNote: 'The track playing in the taxi as we drove across Tower Bridge with the windows down and warm summer wind in our hair.',
    addedDate: '2023-07-15'
  },
  {
    id: 'sg-2',
    title: 'Until I Found You',
    artist: 'Stephen Sanchez',
    album: 'Angel Face',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400',
    addedBy: 'mumu',
    moodTags: ['Golden Hour', 'Nostalgic', 'Cozy'],
    duration: '2:57',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a221f7.mp3',
    storyNote: 'Mumu sent this to Sofs at 3 AM with the message: "This song was written for you, my star."',
    addedDate: '2022-11-20'
  },
  {
    id: 'sg-3',
    title: 'Mystery of Love',
    artist: 'Sufjan Stevens',
    album: 'Call Me By Your Name',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=400',
    addedBy: 'sofs',
    moodTags: ['Roadtrip', 'Indie', 'Dreamy'],
    duration: '4:08',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f7a932.mp3',
    storyNote: 'Playing on loop during our coastal drive along the Turkish Riviera under starry skies.',
    addedDate: '2023-06-05'
  },
  {
    id: 'sg-4',
    title: 'At Last',
    artist: 'Etta James',
    album: 'At Last!',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400',
    addedBy: 'mumu',
    moodTags: ['Classic', 'Soul', 'Slow Dance'],
    duration: '3:00',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_d0a13f69d2.mp3',
    storyNote: 'Our slow dance in the living room with fairy lights twinkling in the background.',
    addedDate: '2024-01-01'
  }
];

export const initialPhotoAlbums: PhotoAlbum[] = [
  {
    id: 'alb-1',
    title: 'Us & Forever',
    category: 'Portraits',
    coverUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600',
    photoCount: 42,
    photos: [
      {
        id: 'p-1',
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=1000',
        caption: 'Sunset stroll hand in hand along the Serpentine',
        date: 'October 2022',
        location: 'London',
        tags: ['Sunset', 'Couples', 'London'],
        addedBy: 'mumu'
      },
      {
        id: 'p-2',
        url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1000',
        caption: 'Spontaneous photo booth session in Soho',
        date: 'December 2022',
        location: 'Soho, London',
        tags: ['Photobooth', 'Silly', 'Smiles'],
        addedBy: 'sofs'
      },
      {
        id: 'p-3',
        url: 'https://images.unsplash.com/photo-1529619768328-e37af76c6fe5?auto=format&fit=crop&q=80&w=1000',
        caption: 'Coffee date in Brooklyn on a crisp morning',
        date: 'March 2023',
        location: 'DUMBO, New York',
        tags: ['Coffee', 'NY', 'Cozy'],
        addedBy: 'mumu'
      }
    ]
  },
  {
    id: 'alb-2',
    title: 'Flowers & Sunshine',
    category: 'Nature',
    coverUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=600',
    photoCount: 28,
    photos: [
      {
        id: 'p-4',
        url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=1000',
        caption: 'Surprise birthday peonies delivered to Sofs’ doorstep',
        date: 'May 2023',
        location: 'London',
        tags: ['Flowers', 'Surprise', 'Peonies'],
        addedBy: 'mumu'
      },
      {
        id: 'p-5',
        url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1000',
        caption: 'Blooming cherry blossoms at Kew Gardens',
        date: 'April 2023',
        location: 'Kew Gardens',
        tags: ['Spring', 'Blossoms'],
        addedBy: 'sofs'
      }
    ]
  },
  {
    id: 'alb-3',
    title: 'Travels & Voyages',
    category: 'Adventures',
    coverUrl: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=600',
    photoCount: 64,
    photos: [
      {
        id: 'p-6',
        url: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=1000',
        caption: 'Hot air balloon sunrise over Cappadocia fairy chimneys',
        date: 'August 2023',
        location: 'Cappadocia, Turkey',
        tags: ['Travel', 'Turkey', 'Sunrise'],
        addedBy: 'both'
      }
    ]
  },
  {
    id: 'alb-4',
    title: 'Culinary Delights',
    category: 'Food',
    coverUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
    photoCount: 19,
    photos: [
      {
        id: 'p-7',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000',
        caption: 'Candlelight dinner at our favorite Italian trattoria',
        date: 'February 2024',
        location: 'Manhattan, NY',
        tags: ['Dinner', 'Pasta', 'Romance'],
        addedBy: 'mumu'
      }
    ]
  }
];

export const initialFamilyFriends: FamilyFriendContact[] = [
  {
    id: 'ff-1',
    name: 'Eleanor (Mom)',
    relation: 'Mother of Sofs',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    phone: '+91 98390 12345',
    location: 'Allahabad, India',
    birthday: 'November 18',
    favoriteThings: ['Cardamom Chai', 'Gardening', 'Classic Ghazals', 'Homemade Sweets'],
    notes: 'A pillar of grace and warmth in Prayagraj. Always prepares homemade snacks whenever Mumu visits.',
    type: 'family',
    belongsTo: 'sofs',
    sharedMemoriesCount: 14
  },
  {
    id: 'ff-2',
    name: 'Uncle Khalid',
    relation: 'Sofs’ Uncle & Mentor',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    phone: '+91 98390 54321',
    location: 'Allahabad, India',
    birthday: 'October 05',
    favoriteThings: ['History Books', 'Old Architecture', 'Kabab Rolls'],
    notes: 'Loves telling stories about historical monuments along the Sangam river.',
    type: 'family',
    belongsTo: 'sofs',
    sharedMemoriesCount: 8
  },
  {
    id: 'ff-3',
    name: 'Sarah (Best Friend)',
    relation: 'Sofs’ Allahabad & College Confidante',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    phone: '+91 98390 99887',
    location: 'Delhi / Allahabad',
    birthday: 'July 22',
    favoriteThings: ['Matcha Lattes', 'Museum Visits', 'Ghazals'],
    notes: 'Knew Sofs was in love before Sofs even admitted it out loud!',
    type: 'friend',
    belongsTo: 'sofs',
    sharedMemoriesCount: 22
  },
  {
    id: 'ff-4',
    name: 'Auntie Farida',
    relation: 'Mumu’s Mother',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    phone: '+44 7700 900088',
    location: 'Birmingham, UK',
    birthday: 'March 14',
    favoriteThings: ['English Breakfast Tea', 'Baking Scones', 'Knitting'],
    notes: 'Makes the most comforting tea and warm apple crumbles in Birmingham.',
    type: 'family',
    belongsTo: 'mumu',
    sharedMemoriesCount: 16
  },
  {
    id: 'ff-5',
    name: 'Thomas (Brother)',
    relation: 'Brother of Mumu',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    phone: '+44 7700 900192',
    location: 'Birmingham, UK',
    birthday: 'March 04',
    favoriteThings: ['Vinyl Records', 'Espresso', 'Photography'],
    notes: 'The ultimate wingman who helped Mumu organize the engagement surprise in Turkey!',
    type: 'family',
    belongsTo: 'mumu',
    sharedMemoriesCount: 12
  },
  {
    id: 'ff-6',
    name: 'Hassan (Mumu’s Best Mate)',
    relation: 'Mumu’s Uni & Birmingham Friend',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    phone: '+44 7700 900333',
    location: 'Birmingham, UK',
    birthday: 'September 28',
    favoriteThings: ['Football Matches', 'Coffee Roasting', 'Roadtrips'],
    notes: 'Mumu’s partner-in-crime for weekend drives around Cotswolds.',
    type: 'friend',
    belongsTo: 'mumu',
    sharedMemoriesCount: 15
  },
  {
    id: 'ff-7',
    name: 'Zayd & Layla',
    relation: 'Our Shared Couple Besties',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    phone: '+1 646 555 0188',
    location: 'London & NY',
    birthday: 'Anniversary: May 10',
    favoriteThings: ['Board Game Nights', 'Taco Tuesdays', 'Hiking Trips'],
    notes: 'Hosts of our legendary double-date game nights whenever we are together.',
    type: 'friend',
    belongsTo: 'both',
    sharedMemoriesCount: 18
  }
];

export const initialTimelineMilestones: TimelineMilestone[] = [
  {
    id: 'tm-1',
    year: '2021',
    date: 'October 14, 2021',
    title: 'The Spark in London',
    description: 'Our very first meetup under Serpentine rain. What was supposed to be a 30-minute coffee turned into a 5-hour walks around Hyde Park.',
    category: 'firsts',
    photoUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800',
    location: 'London, UK',
    tag: 'Chapter 1'
  },
  {
    id: 'tm-2',
    year: '2022',
    date: 'February 14, 2022',
    title: 'Official Couple & LDR Vows',
    description: 'Mumu sent 100 red roses across the Atlantic Ocean with a custom leather journal inscribed with "Our Story Begins".',
    category: 'milestone',
    photoUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800',
    location: 'London / NY',
    tag: 'Official'
  },
  {
    id: 'tm-3',
    year: '2022',
    date: 'June 18, 2022',
    title: 'Bosphorus Reunion & Istanbul Trip',
    description: 'Our first international vacation together. Exploring Spice Bazaar, eating fresh baklava, and taking sunset cruises.',
    category: 'travel',
    photoUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800',
    location: 'Istanbul, Turkey',
    tag: 'Vacation'
  },
  {
    id: 'tm-4',
    year: '2023',
    date: 'August 12, 2023',
    title: 'The Engagement in Cappadocia',
    description: 'Under the sunrise sky filled with floating hot air balloons, Mumu got down on one knee and asked the big question.',
    category: 'celebration',
    photoUrl: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=800',
    location: 'Cappadocia, Turkey',
    tag: 'Engaged'
  }
];

export const initialQuranVerses: QuranVerse[] = [
  {
    id: 'qv-1',
    arabicText: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    englishTranslation: 'And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.',
    reference: 'Surah Ar-Rum 30:21',
    personalNote: 'Our anchor verse recited during our engagement prayer.'
  },
  {
    id: 'qv-2',
    arabicText: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    englishTranslation: 'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.',
    reference: 'Surah Al-Furqan 25:74',
    personalNote: 'Our daily Dua recited after every prayer together.'
  },
  {
    id: 'qv-3',
    arabicText: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    englishTranslation: 'Sufficient for us is Allah, and [He is] the best Disposer of affairs.',
    reference: 'Surah Ali Imran 3:173',
    personalNote: 'The reminder that kept us calm and peaceful during our long distance months.'
  }
];

export const initialReflections: SharedReflection[] = [
  {
    id: 'ref-1',
    date: 'Yesterday at 9:30 PM',
    prompt: 'What was a moment this past week where you felt deeply loved?',
    mumuNote: 'When you sent me a warm coffee via delivery right in the middle of my stressful quarterly presentation. It showed how thoughtfully you pay attention to my day.',
    sofsNote: 'When we were on FaceTime and you paused your gaming session just to listen to me vent about my work project for 40 minutes without interrupting.'
  },
  {
    id: 'ref-2',
    date: '3 days ago',
    prompt: 'What is a small prayer or blessing you wish for our future home?',
    mumuNote: 'That our living room is always filled with the warmth of natural light, hot tea, loud laughter, and an open door for family and friends.',
    sofsNote: 'A peaceful nook with overflowing bookshelves, cozy wool blankets, and a window where we can watch rain fall together.'
  }
];

export const initialBucketList: BucketListItem[] = [
  {
    id: 'bk-1',
    category: 'Travel',
    title: 'Stay in a Traditional Ryokan in Kyoto',
    description: 'Soak in private hot spring onsen, enjoy Kaiseki dining, and walk through bamboo groves in autumn.',
    targetDate: 'October 2025',
    status: 'In Progress'
  },
  {
    id: 'bk-2',
    category: 'Life Goals',
    title: 'Build Our Custom Library Room',
    description: 'Floor-to-ceiling dark mahogany shelves, rolling ladder, plush velvet armchairs, and warm brass reading lamps.',
    targetDate: '2027',
    status: 'Planned'
  },
  {
    id: 'bk-3',
    category: 'Experiences',
    title: 'Hot Air Balloon Ride over Cappadocia',
    description: 'Drift across fairy chimneys at sunrise together.',
    status: 'Completed',
    completedDate: 'August 12, 2023',
    photoUrl: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'bk-4',
    category: 'Cozy',
    title: 'Bake Sourdough Bread Together from Scratch',
    description: 'Spend a lazy rainy Sunday baking artisanal sourdough bread with garlic herb butter.',
    status: 'Planned'
  }
];

export const initialQuizCards: QuizCard[] = [
  {
    id: 'qz-1',
    category: 'Who Said It?',
    question: 'Who said "I knew I was going to marry you on our second phone call" first?',
    answer: 'Mumu!',
    memoryDetail: 'Mumu confessed this while we were walking on the Brooklyn Promenade during Sofs’ first trip to NY in March 2022.',
    askedBy: 'sofs',
    options: ['Mumu', 'Sofs', 'Both at the exact same time', 'Sarah (Sofs’ bestie)']
  }
];

export const initialQuizSets: QuizSet[] = [
  {
    id: 'qs-1',
    title: 'Sofs’ Favorite Secrets & Allahabad Trivia',
    category: 'Favorites',
    createdBy: 'sofs',
    targetFor: 'mumu',
    completedByPartner: false,
    score: 0,
    questions: [
      {
        id: 'q1-1',
        question: 'What is Sofs’ absolute favorite order when we go for dim sum?',
        options: [
          'Steamed Shrimp Dumplings (Har Gow) & Warm Egg Tarts',
          'BBQ Pork Buns & Sticky Rice in Lotus Leaf',
          'Sesame Balls & Mango Pudding',
          'Crispy Spring Rolls & Turnip Cake'
        ],
        correctOptionIndex: 0,
        memoryDetail: 'Sofs will always order double Har Gow and eat the egg tart while it is piping hot!'
      },
      {
        id: 'q1-2',
        question: 'Who said "I knew I was going to marry you" first?',
        options: [
          'Mumu (on our 2nd phone call)',
          'Sofs (during the Hyde Park walk)',
          'Both at the exact same moment',
          'Sarah (Sofs’ best friend)'
        ],
        correctOptionIndex: 0,
        memoryDetail: 'Mumu confessed this while walking on the Brooklyn Promenade in March 2022.'
      },
      {
        id: 'q1-3',
        question: 'What exact date did Mumu propose in Cappadocia?',
        options: [
          'August 10, 2023',
          'August 12, 2023',
          'August 15, 2023',
          'September 1, 2023'
        ],
        correctOptionIndex: 1,
        memoryDetail: 'At 6:15 AM as sunrise hot air balloons flooded the sky!'
      },
      {
        id: 'q1-4',
        question: 'What hot drink does Sofs insist on having every rainy afternoon in Allahabad?',
        options: [
          'Strong Ginger & Cardamom Masala Chai',
          'Iced Caramel Macchiato',
          'Matcha Green Tea',
          'Hot Chocolate with extra marshmallows'
        ],
        correctOptionIndex: 0,
        memoryDetail: 'Simmered with fresh ginger and cardamom pods served in clay kulhad cups.'
      }
    ]
  },
  {
    id: 'qs-2',
    title: 'Mumu’s Birmingham & Music Quiz',
    category: 'Who Said It?',
    createdBy: 'mumu',
    targetFor: 'sofs',
    completedByPartner: true,
    score: 4,
    questions: [
      {
        id: 'q2-1',
        question: 'What song did Mumu secretly learn to play on piano for Sofs?',
        options: [
          'Until I Found You by Stephen Sanchez',
          'Lover by Taylor Swift',
          'Fly Me To The Moon by Frank Sinatra',
          'A Thousand Years by Christina Perri'
        ],
        correctOptionIndex: 0,
        memoryDetail: 'Mumu secretly practiced at a piano studio in NY for 3 months before playing it live on video call!'
      },
      {
        id: 'q2-2',
        question: 'What is Mumu’s go-to comfort spot in Birmingham, UK?',
        options: [
          'Canal Basin bench with hot espresso',
          'Bullring Shopping Centre rooftop',
          'Sutton Park ancient woods walk',
          'Jewellery Quarter antique bookshop'
        ],
        correctOptionIndex: 0,
        memoryDetail: 'Sitting by the canal watching narrowboats drift by while sipping dark roast espresso.'
      },
      {
        id: 'q2-3',
        question: 'Where did we take our very first photo together?',
        options: [
          'Under the red phone booth near Hyde Park',
          'On the Bosphorus ferry in Istanbul',
          'At the Brooklyn Bridge viewpoint',
          'Inside Heathrow Airport Terminal 5'
        ],
        correctOptionIndex: 0,
        memoryDetail: 'We were laughing under an umbrella during autumn rain in London!'
      },
      {
        id: 'q2-4',
        question: 'What is the 1 thing Mumu ALWAYS forgets when packing for a flight?',
        options: [
          'Universal power adapter',
          'Sunglasses',
          'Sleep eye mask',
          'Headphones case'
        ],
        correctOptionIndex: 0,
        memoryDetail: 'Sofs now carries 2 universal adapters in her bag specifically for Mumu!'
      }
    ]
  }
];

export const initialEchoes: EchoItem[] = [
  {
    id: 'echo-1',
    type: 'chapter',
    title: 'Added a new Chapter to Our Story',
    subtitle: '"The Promise under the Olive Trees" in Cappadocia',
    timestamp: '2 hours ago',
    author: 'mumu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    imageUrl: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'echo-2',
    type: 'song',
    title: 'Added a new track to The Soundtrack',
    subtitle: 'Taylor Swift - Lover (First Dance Mix)',
    timestamp: 'Yesterday at 8:15 PM',
    author: 'sofs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'echo-3',
    type: 'quote',
    title: 'Shared a sweet observation in Little Things',
    subtitle: '"The nose scrunch when you try not to laugh at my jokes..."',
    timestamp: '3 days ago',
    author: 'mumu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  }
];

export const initialDailyLetters: DailyLetter[] = [
  {
    id: 'letter-today-mumu',
    date: new Date().toISOString().split('T')[0],
    from: 'mumu',
    to: 'sofs',
    title: 'My Dearest Sofs, Good Morning',
    content: `My Love,\n\nAs the sun rises today, my first thought was your laugh from our call last night. No matter how many miles separate London and New York, every day with you feels like a blessing I never want to take for granted.\n\nThank you for being my constant anchor, my quiet joy, and my favorite person in every room. I am counting down every single minute until I hold your hand again.\n\nAlways and forever yours,\nMumu ❤️`,
    createdAt: new Date().toISOString(),
    isRead: false,
    waxSealColor: '#d4af37',
    paperStyle: 'parchment',
    fontStyle: 'serif'
  },
  {
    id: 'letter-today-sofs',
    date: new Date().toISOString().split('T')[0],
    from: 'sofs',
    to: 'mumu',
    title: 'To My Mumu, My Favorite Heart',
    content: `My Dearest Mumu,\n\nI was listening to our playlist while sipping morning tea today and couldn't stop smiling thinking about you. Thank you for making distance feel so small with your endless warmth and sweet notes.\n\nDon't forget to eat a good lunch today! Sending you the warmest hug all the way across the Atlantic.\n\nWith all my love,\nSofs 🌸`,
    createdAt: new Date().toISOString(),
    isRead: true,
    waxSealColor: '#b91c1c',
    paperStyle: 'rose',
    fontStyle: 'script'
  },
  {
    id: 'letter-yesterday-mumu',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    from: 'mumu',
    to: 'sofs',
    title: 'Thoughts Before Sleeping',
    content: `My dearest Sofs,\n\nJust wanted to leave you this note so you wake up to a smile. I looked at our pictures from Richmond Park today and realized how lucky I am. Sleep peacefully my love.\n\nYour Mumu`,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    waxSealColor: '#d4af37',
    paperStyle: 'midnight',
    fontStyle: 'serif'
  }
];
