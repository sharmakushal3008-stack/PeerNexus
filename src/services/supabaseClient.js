import { createClient } from '@supabase/supabase-js';

// Supabase URL & Anon Key with fallback production credentials for multi-device Vercel deployments
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bgqobfvbgkdyndamptum.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_UDP7e3SW2XMiM8xaWPwRaw_yIhrhezu';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your_supabase_project_url')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
