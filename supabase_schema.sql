-- SQL Schema Script for "The Sanctuary" Database in Supabase
-- Copy and paste this script into the SQL Editor in your Supabase Dashboard

-- 1. Daily Letters
CREATE TABLE IF NOT EXISTS daily_letters (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Chapters (Our Story)
CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  date_range TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  tag TEXT NOT NULL,
  favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Calendar Events
CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Little Things
CREATE TABLE IF NOT EXISTS little_things (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  added_by TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Songs
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT NOT NULL,
  duration TEXT NOT NULL,
  spotify_url TEXT,
  lyrics_snippet TEXT,
  added_by TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Photo Albums & Photos
CREATE TABLE IF NOT EXISTS photo_albums (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date_range TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  photo_count INTEGER DEFAULT 0,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS photo_items (
  id TEXT PRIMARY KEY,
  album_id TEXT REFERENCES photo_albums(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT,
  added_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Bucket List
CREATE TABLE IF NOT EXISTS bucket_list (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  target_date TEXT,
  completed_date TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Faith Reflections
CREATE TABLE IF NOT EXISTS reflections (
  id TEXT PRIMARY KEY,
  prompt TEXT NOT NULL,
  mumu_answer TEXT,
  sofs_answer TEXT,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) and allow Public Access for reads/writes
ALTER TABLE daily_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE little_things ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bucket_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON daily_letters FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON daily_letters FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON chapters FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON chapters FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON calendar_events FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON calendar_events FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON little_things FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON little_things FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON songs FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON songs FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON photo_albums FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON photo_albums FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON photo_items FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON photo_items FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON bucket_list FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON bucket_list FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON reflections FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON reflections FOR ALL USING (true);
