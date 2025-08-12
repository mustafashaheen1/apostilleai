import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set up your Supabase connection.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  full_name: string;
  email: string;
  provider: 'email' | 'google' | 'apple';
  provider_id?: string;
  picture?: string;
  created_at: string;
  updated_at: string;
}