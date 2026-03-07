import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FeaturesSection() {
  const t = useTranslations("Pricing");
  return (
    <section id="pricing" className="py-12 lg:py-16 bg-slate-50 min-h-[80vh] relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background glow for light mode */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-findrai-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-findrai-medium/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 text-findrai-primary border border-slate-300/50 text-xs font-semibold mb-4 shadow-sm">
            {t("title")}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
            {t("heading1")} <span className="text-findrai-primary">{t("heading2")}</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Pricing Card */}
          <div className="bg-slate-800/90 backdrop-blur-md border border-findrai-medium/30 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
            {/* Inner Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-findrai-primary/40 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-700">
              
              {/* Tier 1: Pay Per Query */}
              <div className="pb-8 md:pb-0 md:pr-8 flex flex-col">
                <div className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">{t("selfService")}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{t("payPerQuery")}</h3>
                <p className="text-slate-400 text-sm mb-6 min-h-[40px]">
                  {t("ppqDesc")}
                </p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black text-white tracking-tighter">Q2</span>
                  <span className="text-slate-400 text-sm">{t("perSearch")}</span>
                </div>
                
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-slate-400" />
                  {t("whatYouGet")}
                </h4>
                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    t("ppqFeature1"),
                    t("ppqFeature2"),
                    t("ppqFeature3"),
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                  {t("startSearching")}
                </button>
              </div>

              {/* Tier 2: 1.5% Commission */}
              <div className="pt-8 md:pt-0 md:pl-8 flex flex-col relative">
                <div className="absolute -top-4 md:top-0 right-0 bg-findrai-primary/20 text-findrai-light border border-findrai-primary/50 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm">
                  {t("recommended")}
                </div>
                
                <div className="text-findrai-medium font-bold uppercase tracking-wider text-xs mb-2">{t("fullService")}</div>
                <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                  {t("managedProcurement")}
                </h3>
                <p className="text-slate-300 text-sm mb-6 min-h-[40px]">
                  {t("mpDesc")}
                </p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-6xl font-black text-white tracking-tighter">1.5</span>
                  <span className="text-2xl font-bold text-slate-300">%</span>
                  <span className="text-slate-400 text-sm ml-2">{t("successFee")}</span>
                </div>

                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-findrai-light" />
                  {t("findraiAdvantage")}
                </h4>
                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    t("mpFeature1"),
                    t("mpFeature2"),
                    t("mpFeature3"),
                    t("mpFeature4"),
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-findrai-light shrink-0 mt-0.5" />
                      <span className="text-white font-medium text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-white/10">
                  {t("automatePurchasing")}
                </button>
              </div>

            </div>

            {/* Bottom Note */}
            <div className="mt-8 pt-5 border-t border-slate-700/50 flex items-start gap-3 relative z-10">
               <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
               <p className="text-xs text-slate-400 leading-relaxed">
                 <strong className="text-slate-300">{t("riskFree")}</strong> {t("riskFreeDesc")}
               </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
