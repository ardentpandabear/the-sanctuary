-- SQL Schema Script for "The Sanctuary" Database in Supabase
-- Copy and paste this script into the SQL Editor in your Supabase Dashboard

-- 1. Daily Letters
CREATE TABLE IF NOT EXISTS daily_letters (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Chapters (Our Story)
CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Calendar Events
CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Little Things
CREATE TABLE IF NOT EXISTS little_things (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Songs
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Photo Albums
CREATE TABLE IF NOT EXISTS photo_albums (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Bucket List
CREATE TABLE IF NOT EXISTS bucket_list (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Reflections
CREATE TABLE IF NOT EXISTS reflections (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Profiles (Sofs & Mumu moods & settings)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Family & Friends Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Timeline Milestones
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Quran Verses (Faith)
CREATE TABLE IF NOT EXISTS verses (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Quiz Cards
CREATE TABLE IF NOT EXISTS quiz_cards (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Quiz Sets
CREATE TABLE IF NOT EXISTS quiz_sets (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Echoes (Activity Feed)
CREATE TABLE IF NOT EXISTS echoes (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) and allow Public Access for reads/writes on all tables
ALTER TABLE daily_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE little_things ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE bucket_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE echoes ENABLE ROW LEVEL SECURITY;

DO $$ 
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'daily_letters', 'chapters', 'calendar_events', 'little_things', 
    'songs', 'photo_albums', 'bucket_list', 'reflections', 
    'profiles', 'contacts', 'milestones', 'verses', 
    'quiz_cards', 'quiz_sets', 'echoes'
  ]) LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public Read Access" ON %I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Public Write Access" ON %I;', t);
    EXECUTE format('CREATE POLICY "Public Read Access" ON %I FOR SELECT USING (true);', t);
    EXECUTE format('CREATE POLICY "Public Write Access" ON %I FOR ALL USING (true);', t);
  END LOOP;
END $$;
