import { FileText, Clock, TrendingDown, ArrowRight, AlertCircle, FileSpreadsheet } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProblemSection() {
  const t = useTranslations("Problem");
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background glow to match Hero */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-red-50/50 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-findrai-light/10 blur-[100px] rounded-full pointer-events-none translate-y-1/4 -translate-x-1/4"></div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        


        {/* Clean Light-Mode Bento Grid */}
        <div className="grid lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
          
          {/* Card 1: Unstructured Data (Spans 8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/50 p-8 md:p-12 relative overflow-hidden group hover:border-slate-300 transition-colors">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-4xl -z-0"></div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10 h-full">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 text-red-500 flex items-center justify-center mb-6 shadow-sm">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{t("title1")}</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {t("desc1")}
                </p>
              </div>
              
              {/* Visual Mockup: Messy Files */}
              <div className="relative h-64 w-full flex items-center justify-center">
                 {/* File 1: PDF */}
                 <div className="absolute w-40 h-48 bg-white rounded-xl border border-slate-200 shadow-lg -rotate-12 -translate-x-12 translate-y-4 flex flex-col p-4 group-hover:-rotate-15 group-hover:-translate-x-14 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded bg-red-100 text-red-600 flex items-center justify-center"><FileText className="w-3 h-3" /></div>
                      <div className="w-16 h-2 bg-slate-200 rounded"></div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded mb-2"></div>
                    <div className="w-5/6 h-1.5 bg-slate-100 rounded mb-2"></div>
                    <div className="w-full h-1.5 bg-slate-100 rounded mb-4"></div>
                    <div className="mt-auto w-full h-12 bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400 font-mono">Table Data</div>
                 </div>
                 
                 {/* File 2: Excel */}
                 <div className="absolute w-40 h-48 bg-white rounded-xl border border-slate-200 shadow-lg rotate-12 translate-x-12 translate-y-2 flex flex-col p-4 group-hover:rotate-15 group-hover:translate-x-14 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded bg-green-100 text-green-600 flex items-center justify-center"><FileSpreadsheet className="w-3 h-3" /></div>
                      <div className="w-16 h-2 bg-slate-200 rounded"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 mb-1">
                       <div className="h-2 bg-slate-100 rounded"></div><div className="h-2 bg-slate-100 rounded"></div><div className="h-2 bg-slate-100 rounded"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 mb-1">
                       <div className="h-2 bg-slate-100 rounded"></div><div className="h-2 bg-slate-100 rounded"></div><div className="h-2 bg-slate-100 rounded"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                       <div className="h-2 bg-slate-100 rounded"></div><div className="h-2 bg-slate-100 rounded"></div><div className="h-2 bg-slate-100 rounded"></div>
                    </div>
                 </div>

                 {/* Focus File: Error Indicator */}
                 <div className="absolute w-44 h-52 bg-white rounded-xl border-2 border-red-200 shadow-xl z-10 flex flex-col p-5 group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-20 h-3 bg-slate-200 rounded"></div>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="w-full h-6 bg-red-50 border border-red-100 rounded flex items-center px-2">
                        <div className="w-1/2 h-2 bg-red-200 rounded"></div>
                      </div>
                      <div className="w-full h-6 bg-slate-50 border border-slate-100 rounded"></div>
                      <div className="w-full h-6 bg-red-50 border border-red-100 rounded flex items-center px-2">
                        <div className="w-3/4 h-2 bg-red-200 rounded"></div>
                      </div>
                    </div>
                    <div className="mt-auto self-center bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                      {t("mismatch")}
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Card 2: Hours Wasted (Spans 4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-4xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-8 relative overflow-hidden group hover:border-slate-300 transition-colors flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 text-orange-500 flex items-center justify-center mb-6 shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{t("title2")}</h3>
            <p className="text-slate-600 leading-relaxed mb-8 flex-1">
              {t("desc2")}
            </p>
            
            {/* Visual Mockup: Loading/Time */}
            <div className="mt-auto bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-orange-400 animate-spin shrink-0"></div>
               <div>
                  <div className="text-xs font-bold text-slate-800 mb-1">{t("processing")}</div>
                  <div className="text-[10px] items-center text-slate-500">{t("reviewing")}</div>
               </div>
            </div>
          </div>

          {/* Card 3: Hidden Cost Leakage (Spans 12 cols, wide bottom) */}
          <div className="lg:col-span-12 bg-slate-900 rounded-4xl border border-slate-800 shadow-xl p-8 md:p-12 relative overflow-hidden group flex flex-col md:flex-row items-center gap-12">
            {/* Deep intense glow inside dark card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-500/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="flex-1 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 text-red-400 flex items-center justify-center mb-6 shadow-sm">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t("title3")}</h3>
              <p className="text-slate-400 leading-relaxed max-w-xl text-lg">
                {t("desc3")}
              </p>
            </div>

            {/* Visual Mockup: Profit Leakage Chart */}
             <div className="w-full md:w-96 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-6 relative z-10 shadow-2xl">
               <div className="flex justify-between items-end mb-6 border-b border-slate-700 pb-4">
                 <div>
                   <div className="text-xs text-slate-400 mb-1">{t("variance")}</div>
                   <div className="text-2xl font-mono text-red-400 font-bold">+12.4%</div>
                 </div>
                 <div className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 rounded">
                   {t("marginLoss")}
                 </div>
               </div>
               
               {/* Mock Bar Chart */}
               <div className="flex items-end gap-3 h-24 mt-4">
                 <div className="flex-1 bg-slate-700/50 rounded-t-sm h-[40%] group-hover:h-[45%] transition-all duration-500 relative"><div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono">$12</div></div>
                 <div className="flex-1 bg-slate-700/50 rounded-t-sm h-[50%] group-hover:h-[55%] transition-all duration-500 relative"><div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono">$14</div></div>
                 <div className="flex-1 bg-slate-700/50 rounded-t-sm h-[65%] group-hover:h-[70%] transition-all duration-500 relative"><div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono">$18</div></div>
                 <div className="flex-1 bg-red-500/80 rounded-t-sm h-[90%] group-hover:h-[95%] transition-all duration-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] relative"><div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold font-mono">$24</div></div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
