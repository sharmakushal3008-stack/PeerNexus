-- PeerNexus Complete PostgreSQL Database Schema for Supabase
-- Run this script in the Supabase SQL Editor to create all required tables & RLS policies

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT DEFAULT 'password123',
  name TEXT NOT NULL,
  roll_no TEXT,
  branch TEXT,
  year TEXT,
  avatar TEXT,
  bio TEXT,
  credits INTEGER DEFAULT 300,
  reputation INTEGER DEFAULT 95,
  skills_offered JSONB DEFAULT '[]'::jsonb,
  skills_wanted JSONB DEFAULT '[]'::jsonb,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SKILL OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_avatar TEXT,
  title TEXT NOT NULL,
  category TEXT,
  credits INTEGER DEFAULT 50,
  description TEXT,
  availability TEXT,
  reputation_req INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  owner TEXT,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  roles_needed JSONB DEFAULT '[]'::jsonb,
  spots_left INTEGER DEFAULT 2,
  tags JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CAMPUS RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  specs TEXT,
  status TEXT DEFAULT 'Available',
  location TEXT,
  price_per_hour INTEGER DEFAULT 30,
  booked_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WORKSHOPS TABLE
CREATE TABLE IF NOT EXISTS public.workshops (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  host TEXT,
  date TEXT,
  time TEXT,
  location TEXT,
  spots INTEGER DEFAULT 30,
  registered_users JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TRADES & ESCROW TABLE
CREATE TABLE IF NOT EXISTS public.trades (
  id TEXT PRIMARY KEY,
  sender_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  skill_title TEXT,
  credits INTEGER DEFAULT 50,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Allow public read/write access for demo API key
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access for users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow public access for skills" ON public.skills FOR ALL USING (true);
CREATE POLICY "Allow public access for projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Allow public access for resources" ON public.resources FOR ALL USING (true);
CREATE POLICY "Allow public access for workshops" ON public.workshops FOR ALL USING (true);
CREATE POLICY "Allow public access for trades" ON public.trades FOR ALL USING (true);
CREATE POLICY "Allow public access for messages" ON public.messages FOR ALL USING (true);
