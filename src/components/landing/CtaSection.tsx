import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

type CtaSectionProps = {
  isAuthenticated?: boolean;
  isLoadingSession?: boolean;
  onPrimaryAction?: () => void;
};

export default function CtaSection({
  isAuthenticated = false,
  isLoadingSession = false,
  onPrimaryAction,
}: CtaSectionProps = {}) {
  const t = useTranslations("Cta");
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient matching palette */}
      <div className="absolute inset-0 bg-gradient-to-br from-findrai-primary via-findrai-secondary to-findrai-medium z-0"></div>
      
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] border border-white/10 rounded-full z-0 pointer-events-none"></div>
      <div className="absolute top-0 right-0 -translate-y-[40%] translate-x-1/4 w-[600px] h-[600px] border border-white/10 rounded-full z-0 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
          {t("title1")} <br className="hidden sm:block" />
          <span className="text-findrai-accent">{t("title2")}</span>
        </h2>
        
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t("desc")}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-findrai-accent hover:bg-white text-findrai-primary font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {isAuthenticated ? 'Go to dashboard' : isLoadingSession ? 'Validando...' : 'Start using Findr.ai'}{' '}
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-lg transition-all border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2 text-center"
          >
            {t("demoBtn")}
          </button>
        </div>
        
        <p className="text-sm text-blue-200 mt-8">
          {t("footer")}
        </p>
      </div>
    </section>
  );
}
