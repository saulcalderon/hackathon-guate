import { createClient } from '@supabase/supabase-js';

/**
 * Server-only admin client (uses service role key — bypasses RLS).
 * NEVER import this in client components or expose it to the browser.
 * Use exclusively inside API route handlers (src/app/api/**).
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
