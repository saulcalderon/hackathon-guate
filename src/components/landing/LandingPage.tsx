'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/components/landing/Hero';
import ProblemSection from '@/components/landing/ProblemSection';
import SolutionSection from '@/components/landing/SolutionSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import ProductPreview from '@/components/landing/ProductPreview';
import CtaSection from '@/components/landing/CtaSection';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LandingPage() {
  const { session, loading, isConfigured, signOut } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [nextPath, setNextPath] = useState('/dashboard');
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    setNextPath(next?.startsWith('/') ? next : '/dashboard');

    if (params.get('login') === '1') {
      setIsLoginOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!loading && session && isLoginOpen) {
      setIsLoginOpen(false);
    }
  }, [isLoginOpen, loading, session]);

  const handlePrimaryAction = () => {
    if (session) {
      router.push(nextPath);
      return;
    }

    setIsLoginOpen(true);
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      setLogoutError(error);
      return;
    }

    setLogoutError('');
  };

  return (
    <>
      <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-findrai-primary/20">
        <Hero
          isAuthenticated={Boolean(session)}
          isLoadingSession={loading}
          userEmail={session?.user.email ?? null}
          onPrimaryAction={handlePrimaryAction}
          onLogout={handleLogout}
        />
        {logoutError ? (
          <div className="mx-auto mt-4 max-w-3xl px-4 md:px-6">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {logoutError}
            </div>
          </div>
        ) : null}
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <ProductPreview />
        <CtaSection
          isAuthenticated={Boolean(session)}
          isLoadingSession={loading}
          onPrimaryAction={handlePrimaryAction}
        />
      </main>

      <AuthModal
        isOpen={isLoginOpen}
        isConfigured={isConfigured}
        onClose={() => setIsLoginOpen(false)}
        redirectPath={nextPath}
      />
    </>
  );
}
