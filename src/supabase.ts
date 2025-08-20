import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging to check what values are being loaded
console.log('Environment variables loaded:', {
  url: supabaseUrl,
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'undefined'
});

// Check if Supabase is properly configured (not missing and not placeholder values)
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseUrl !== 'undefined' &&
  supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.Kx8nfBwGSk9dGGGkBxQJwMz6N4Im-VLS5K5TH0T8AuE' &&
  supabaseAnonKey !== 'undefined' &&
  !supabaseAnonKey.includes('placeholder') &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co');

if (!isSupabaseConfigured) {
  console.warn('Supabase is not properly configured. Using mock client for development.');
  console.warn('Current values:', { supabaseUrl, supabaseAnonKey: supabaseAnonKey ? 'present' : 'missing' });
  console.warn('To connect to a real Supabase instance, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  console.warn('You can find these values in your Supabase project settings under API.');
}

// Use placeholder values if environment variables are missing
const finalUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.Kx8nfBwGSk9dGGGkBxQJwMz6N4Im-VLS5K5TH0T8AuE';

// Create the Supabase client or mock client
export const supabase = isSupabaseConfigured ? createClient(finalUrl, finalKey) : {
  auth: {
    signInWithPassword: async () => ({ 
      data: { user: null, session: null }, 
      error: { message: 'Supabase is not configured. Please set up your environment variables.' } 
    }),
    signUp: async () => ({ 
      data: { user: null, session: null }, 
      error: { message: 'Supabase is not configured. Please set up your environment variables.' } 
    }),
    getUser: async () => ({ 
      data: { user: null }, 
      error: null 
    }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ 
      error: { message: 'Supabase is not configured. Please set up your environment variables.' } 
    }),
    updateUser: async () => ({ 
      data: { user: null }, 
      error: { message: 'Supabase is not configured. Please set up your environment variables.' } 
    }),
    setSession: async () => ({ 
      data: { user: null, session: null }, 
      error: { message: 'Supabase is not configured. Please set up your environment variables.' } 
    })
  },
  from: () => ({
    insert: () => ({ 
      select: () => ({ 
        single: async () => ({ 
          data: null, 
          error: { message: 'Supabase is not configured. Please set up your environment variables.' } 
        }) 
      }) 
    }),
    select: () => ({ 
      eq: () => ({ 
        maybeSingle: async () => ({ 
          data: null, 
          error: { message: 'Supabase is not configured. Please set up your environment variables.' } 
        }),
        order: () => async () => ({ 
          data: [], 
          error: { message: 'Supabase is not configured. Please set up your environment variables.' } 
        })
      }) 
    }),
    update: () => ({ 
      eq: () => ({ 
        select: () => ({ 
          single: async () => ({ 
            data: null, 
            error: { message: 'Supabase is not configured. Please set up your environment variables.' } 
          }) 
        }) 
      }) 
    }),
    delete: () => ({ 
      eq: async () => ({ 
        error: { message: 'Supabase is not configured. Please set up your environment variables.' } 
      }) 
    })
  })
};
export { isSupabaseConfigured };

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