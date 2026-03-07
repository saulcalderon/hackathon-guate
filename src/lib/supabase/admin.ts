import { createClient } from '@supabase/supabase-js';

export function isSupabaseAdminConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key);
}

/**
 * Server-only admin client (uses service role / secret key — bypasses RLS).
 * NEVER import this in client components or expose it to the browser.
 *
 * Supports both the new Supabase key format (sb_secret_...) and the legacy
 * service_role JWT key. Falls back gracefully when no admin key is available.
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Support new key name, legacy key name, and publishable key as last resort
  const key =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) in your .env file.'
    );
  }

  if (key.includes('YOUR_SERVICE_ROLE_KEY_HERE')) {
    console.warn('[Supabase] WARNING: You are using a placeholder for SUPABASE_SERVICE_ROLE_KEY. Operations will likely fail.');
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
