'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function DashboardAuthGuard({ children }: { children: ReactNode }) {
  const { session, loading, isConfigured } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isConfigured) return;

    if (!session) {
      const params = new URLSearchParams({ login: '1' });
      if (pathname) {
        params.set('next', pathname);
      }

      router.replace(`/?${params.toString()}`);
    }
  }, [isConfigured, loading, pathname, router, session]);

  if (!isConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-900 shadow-sm">
          <h1 className="text-xl font-semibold">Falta configurar Supabase</h1>
          <p className="mt-2 text-sm text-amber-800">
            Define `NEXT_PUBLIC_SUPABASE_URL` y
            `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` para habilitar el acceso al
            dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-sm">
          Validando sesión...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Necesitas iniciar sesión</h1>
          <p className="mt-2 text-sm text-slate-600">
            Redirigiendo a la pantalla principal para autenticarte.
          </p>
          <Link
            href="/?login=1"
            className="mt-4 inline-flex rounded-xl bg-findrai-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-findrai-secondary"
          >
            Ir al login
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
