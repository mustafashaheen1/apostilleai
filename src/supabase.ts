import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  console.error('You can find these values in your Supabase project settings under API.');
}

// Create a mock client if environment variables are missing (for development)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

export interface User {
  id: string;
  full_name: string;
  email: string;
  company?: string;
  provider: 'email' | 'google' | 'apple';
  provider_id?: string;
  picture?: string;
  created_at: string;
  updated_at: string;
}