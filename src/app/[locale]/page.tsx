import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ProductPreview from "@/components/landing/ProductPreview";
import CtaSection from "@/components/landing/CtaSection";

import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-findrai-primary/20">
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <ProductPreview />
      <CtaSection />
    </main>
  );
}
