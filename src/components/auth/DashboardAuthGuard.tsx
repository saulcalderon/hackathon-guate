'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function DashboardAuthGuard({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      const params = new URLSearchParams({ login: '1' });
      if (pathname) {
        params.set('next', pathname);
      }

      router.replace(`/?${params.toString()}`);
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-sm">
          Validando sesión...
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
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
