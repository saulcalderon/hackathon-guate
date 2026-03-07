import { createClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client (uses publishable/anon key, respects RLS).
 * Safe to import in Client Components.
 *
 * Supports both the new publishable key format (sb_publishable_...) and
 * the legacy anon JWT key.
 */
export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY in your .env file.'
    );
  }

  return createClient(url, key);
}
