import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from client-side env or fallback to runtime/integration values
const envSupabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const envSupabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = envSupabaseUrl || localStorage.getItem('x09_supabase_url') || '';
  const key = envSupabaseAnonKey || localStorage.getItem('x09_supabase_anon_key') || '';
  return !!(url && key && url.includes('supabase.co') && !key.includes('...'));
}

export function getSupabase(): SupabaseClient | null {
  const url = envSupabaseUrl || localStorage.getItem('x09_supabase_url') || '';
  const key = envSupabaseAnonKey || localStorage.getItem('x09_supabase_anon_key') || '';

  if (!url || !key || key.includes('...')) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage,
        },
      });
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
}

export function resetSupabaseClient(): void {
  supabaseInstance = null;
}
