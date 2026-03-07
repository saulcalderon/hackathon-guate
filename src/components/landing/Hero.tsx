"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Play, Globe, Cpu, SplitSquareHorizontal, CheckCircle, LogOut } from "lucide-react";
import gsap from "gsap";
import { useTranslations } from "next-intl";

type HeroProps = {
  isAuthenticated?: boolean;
  isLoadingSession?: boolean;
  userEmail?: string | null;
  onPrimaryAction?: () => void;
  onLogout?: () => void;
};

export default function Hero({
  isAuthenticated = false,
  isLoadingSession = false,
  userEmail = null,
  onPrimaryAction,
  onLogout,
}: HeroProps = {}) {
  const t = useTranslations("Hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Master Timeline
    const tl = gsap.timeline({ repeat: -1, delay: 1 });

    // Initial setup: hide all steps
    gsap.set([step1Ref.current, step2Ref.current, step3Ref.current, step4Ref.current], {
      opacity: 0,
      y: 20,
      scale: 0.95
    });

    tl.to(step4Ref.current, { opacity: 0, y: -20, duration: 0.4 }, 0)
      .to(step1Ref.current, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }, 0)
      .to(step1Ref.current, { opacity: 0, y: -20, duration: 0.4, delay: 1.5 });

    tl.to(step2Ref.current, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" })
      .fromTo(scanLineRef.current, 
        { top: "0%", opacity: 0 }, 
        { top: "100%", opacity: 1, duration: 1.2, ease: "linear" }
      )
      .to(scanLineRef.current, { opacity: 0, duration: 0.2 })
      .to(step2Ref.current, { opacity: 0, y: -20, duration: 0.4, delay: 0.5 });

    tl.to(step3Ref.current, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" })
      .to(step3Ref.current, { opacity: 0, y: -20, duration: 0.4, delay: 1.5 });

    tl.to(step4Ref.current, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" })
      .to(step4Ref.current!.querySelector('.winner'), { scale: 1.05, boxShadow: "0px 0px 20px rgba(34, 197, 94, 0.4)", duration: 0.4, yoyo: true, repeat: 1 })
      .to({}, { duration: 2 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-white min-h-screen w-full flex flex-col justify-center pt-24 md:pt-28 pb-12">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-findrai-light/20 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-findrai-medium/10 blur-3xl opacity-50 pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-findrai-light/10 text-findrai-primary text-sm font-semibold mb-8 border border-findrai-light/30 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-findrai-secondary animate-pulse"></span>
              {t("pill")}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              {t("title1")}{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-findrai-primary to-findrai-medium">
                {t("title2")}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              {t("description")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto mt-4">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-700 hover:text-findrai-primary font-semibold text-lg transition-all border border-slate-200 hover:border-findrai-light hover:bg-slate-50 hover:shadow-sm flex items-center justify-center gap-2 group">
                <Play className="w-5 h-5 text-slate-400 group-hover:text-findrai-primary transition-colors" />{" "}
                {t("seeHowItWorks")}
              </button>
            </div>
          </div>

          {/* Right Column: GSAP Animation Container */}
          <div className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-xl flex items-center justify-center perspective-1000 mx-auto">
            <div 
              ref={containerRef}
              className="relative w-full h-full max-h-[400px] flex items-center justify-center"
            >
                {/* Step 1: Scrape vendors */}
                <div ref={step1Ref} className="absolute inset-x-8 inset-y-8 flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-slate-300 shadow-sm overflow-hidden">
                  {/* Decorative background files */}
                  <div className="absolute top-4 left-4 w-10 h-14 bg-slate-50 border border-slate-200 rounded flex flex-col items-center pt-2 gap-1 -rotate-12 opacity-60 shadow-sm">
                    <div className="w-6 h-0.5 bg-slate-200 rounded-full"></div>
                    <div className="w-4 h-0.5 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-4 right-4 w-10 h-14 bg-slate-50 border border-slate-200 rounded flex flex-col items-center pt-2 gap-1 rotate-12 opacity-60 shadow-sm">
                    <div className="w-6 h-0.5 bg-slate-200 rounded-full"></div>
                    <div className="w-5 h-0.5 bg-slate-200 rounded-full"></div>
                  </div>

                  <div className="w-16 h-16 rounded-full bg-blue-50 text-findrai-primary flex items-center justify-center mb-4 z-10 shadow-sm group-hover:scale-110 transition-transform">
                    <Globe className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 z-10">{t("step1Title")}</h3>
                  <p className="text-sm text-slate-500 text-center px-4 max-w-xs mb-4 z-10">{t("step1Desc")}</p>
                  <div className="px-5 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg z-10 border border-slate-200">
                    {t("step1Btn")}
                  </div>
                </div>

                {/* Step 2: AI Extraction */}
                <div ref={step2Ref} className="absolute inset-x-8 inset-y-8 flex flex-col items-center justify-center bg-white rounded-2xl border border-indigo-200 shadow-md overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-indigo-50/50 to-transparent flex flex-col p-6 pointer-events-none">
                     <div className="h-4 w-3/4 bg-slate-100 rounded mb-3"></div>
                     <div className="h-4 w-1/2 bg-slate-100 rounded mb-3"></div>
                     <div className="h-4 w-full bg-slate-100 rounded mb-3"></div>
                     <div className="h-4 w-5/6 bg-slate-100 rounded mb-3"></div>
                  </div>
                  <div ref={scanLineRef} className="absolute left-0 right-0 h-1 bg-findrai-primary shadow-[0_0_15px_rgba(2,72,115,0.8)] z-10 w-full"></div>
                  
                  <div className="relative z-20 flex flex-col items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                       <Cpu className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{t("step2Title")}</h3>
                    <div className="mt-2 text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{t("step2Desc")}</div>
                  </div>
                </div>

                {/* Step 3: Compare */}
                <div ref={step3Ref} className="absolute inset-x-8 inset-y-8 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 absolute top-4">{t("step3Title")}</h3>
                  <div className="w-full text-xs font-semibold text-slate-400 text-center mb-3 mt-6">{t("step3Product")}</div>
                  
                  <div className="flex w-full items-stretch justify-between gap-3">
                     {/* Vendor A */}
                     <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center relative">
                        <div className="text-xs font-bold text-slate-500 mb-1">{t("step3VendorA")}</div>
                        <div className="font-mono text-lg font-semibold text-slate-800">$1,450.00</div>
                        <div className="mt-3 w-full space-y-1.5 pt-3 border-t border-slate-200/60">
                           <div className="flex justify-between items-center text-[10px] font-medium text-slate-500">
                              <span>{t("step3UnitPrice")}</span><span>$145.00</span>
                           </div>
                           <div className="flex justify-between items-center text-[10px] font-medium text-slate-500">
                              <span>{t("step3Shipping")}</span><span>$50.00</span>
                           </div>
                        </div>
                     </div>
                     
                     {/* Divider / VS Badge */}
                     <div className="flex shrink-0 items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm relative z-10">
                           <span className="text-xs font-bold">VS</span>
                        </div>
                        <div className="absolute w-px h-16 bg-slate-200 z-0"></div>
                     </div>
                     
                     {/* Vendor B */}
                     <div className="flex-1 bg-green-50/50 p-4 rounded-xl border border-green-200 flex flex-col items-center justify-center relative">
                        <div className="absolute -top-2.5 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">{t("step3BestMatch")}</div>
                        <div className="text-xs font-bold text-green-700 mb-1">{t("step3VendorB")}</div>
                        <div className="font-mono text-lg font-semibold text-slate-800">$1,320.00</div>
                        <div className="mt-3 w-full space-y-1.5 pt-3 border-t border-green-200/60">
                           <div className="flex justify-between items-center text-[10px] font-medium text-green-800/70">
                              <span>{t("step3UnitPrice")}</span><span>$132.00</span>
                           </div>
                           <div className="flex justify-between items-center text-[10px] font-medium text-green-800/70">
                              <span>{t("step3Shipping")}</span><span className="text-green-600 font-bold">{t("step3Free")}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Step 4: Best Choice */}
                <div ref={step4Ref} className="absolute inset-x-8 inset-y-8 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 shadow-xl p-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4 shadow-sm border border-green-200 winner">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{t("step4Title")}</h3>
                  <div className="w-full bg-white rounded-xl p-4 border border-green-200 shadow-sm winner relative overflow-hidden mt-4">
                     <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 blur-2xl opacity-20 -mr-4 -mt-4"></div>
                     <div className="flex justify-between items-center relative z-10">
                        <span className="font-bold text-slate-800">{t("step3VendorB")}</span>
                        <span className="text-sm font-bold text-white bg-green-600 px-2 py-1 rounded">{t("step4Save")}</span>
                     </div>
                     <div className="mt-2 text-xs text-slate-500">{t("step4Product")}</div>
                  </div>
                </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
