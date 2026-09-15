import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  // Use service role key if available, otherwise publishable key
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  if (!supabaseAdmin) {
    supabaseAdmin = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseAdmin;
}

// Configurable credit economy
export const CREDIT_ECONOMY = {
  WELCOME_BONUS: Number(process.env.CREDIT_WELCOME_BONUS) || 15,
  PROJECT_CREATION_COST: Number(process.env.CREDIT_PROJECT_CREATION_COST) || 5,
  TEMPLATE_CLONE_COST: Number(process.env.CREDIT_TEMPLATE_CLONE_COST) || 5,
  AI_COMMAND_COST: Number(process.env.CREDIT_AI_COMMAND_COST) || 1,
};
