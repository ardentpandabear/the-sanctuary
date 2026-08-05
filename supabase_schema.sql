-- SQL Schema Script for "The Sanctuary" Database in Supabase
-- Copy and paste this script into the SQL Editor in your Supabase Dashboard & click RUN

-- 1. Daily Letters
CREATE TABLE IF NOT EXISTS daily_letters (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE daily_letters ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 2. Chapters (Our Story)
CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 3. Calendar Events
CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 4. Little Things
CREATE TABLE IF NOT EXISTS little_things (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE little_things ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 5. Songs
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE songs ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 6. Photo Albums
CREATE TABLE IF NOT EXISTS photo_albums (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE photo_albums ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 7. Bucket List
CREATE TABLE IF NOT EXISTS bucket_list (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE bucket_list ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 8. Reflections
CREATE TABLE IF NOT EXISTS reflections (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE reflections ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 9. Profiles (Sofs & Mumu moods & settings)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 10. Family & Friends Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 11. Timeline Milestones
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE milestones ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 12. Quran Verses (Faith)
CREATE TABLE IF NOT EXISTS verses (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE verses ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 13. Quiz Cards
CREATE TABLE IF NOT EXISTS quiz_cards (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE quiz_cards ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 14. Quiz Sets
CREATE TABLE IF NOT EXISTS quiz_sets (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE quiz_sets ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 15. Echoes (Activity Feed)
CREATE TABLE IF NOT EXISTS echoes (
  id TEXT PRIMARY KEY,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE echoes ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- Enable Row Level Security (RLS) and allow Public Access for ALL operations (SELECT, INSERT, UPDATE, DELETE)
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
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Public Read Access" ON %I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Public Write Access" ON %I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Public All Access" ON %I;', t);
    EXECUTE format('CREATE POLICY "Public All Access" ON %I FOR ALL USING (true) WITH CHECK (true);', t);
  END LOOP;
END $$;
