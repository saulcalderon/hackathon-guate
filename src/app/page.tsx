import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ProductPreview from "@/components/landing/ProductPreview";
import CtaSection from "@/components/landing/CtaSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-findrai-primary/20">
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <ProductPreview />
      <CtaSection />
    </main>
  );
}
