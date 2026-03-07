'use client';

import Hero from '@/components/landing/Hero';
import ProblemSection from '@/components/landing/ProblemSection';
import SolutionSection from '@/components/landing/SolutionSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import ProductPreview from '@/components/landing/ProductPreview';
import CtaSection from '@/components/landing/CtaSection';
import Navbar from '@/components/landing/Navbar';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-findrai-primary/20">
        <Hero />
        <ProductPreview />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <CtaSection />
      </main>
    </>
  );
}
