'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { getBrowserSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

type AuthContextValue = {
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signOut: () => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      setSession(null);
      return;
    }

    const supabase = getBrowserSupabaseClient();
    let isMounted = true;

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;

      if (error) {
        setSession(null);
        setLoading(false);
        return;
      }

      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  const signOut = useCallback(async () => {
    if (!configured) {
      return { error: 'Supabase is not configured.' };
    }

    const supabase = getBrowserSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    setSession(null);
    return { error: null };
  }, [configured]);

  const value = useMemo(
    () => ({
      session,
      loading,
      isConfigured: configured,
      signOut,
    }),
    [configured, loading, session, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
