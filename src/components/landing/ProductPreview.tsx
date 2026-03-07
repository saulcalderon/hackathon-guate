import { Sparkles, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProductPreview() {
  const t = useTranslations("Preview");
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Huge background glow for the glassmorphic effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-findrai-medium/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
             {t("title")}
          </h2>
          <p className="text-lg text-slate-600">
             {t("desc")}
          </p>
        </div>

        {/* Glassmorphic Window Wrapper */}
        <div className="relative mx-auto max-w-[1000px] group perspective-1000 hover:scale-[1.01] transition-transform duration-700 ease-out">
          <div className="absolute -inset-1 bg-linear-to-r from-findrai-primary/30 to-findrai-medium/30 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
          
          <div className="relative bg-white/70 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-2xl p-2 md:p-3 overflow-hidden ring-1 ring-slate-900/5">
            
            {/* macOS Style Window Controls */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200/50 bg-white/40">
              <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm border border-red-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm border border-amber-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm border border-emerald-500/20"></div>
              <div className="ml-4 text-xs font-semibold text-slate-400 flex items-center gap-2">
                 <span className="w-4 h-4 rounded bg-slate-200 flex items-center justify-center text-[10px]">F</span>
                 findrai.app/compare
              </div>
            </div>

            {/* Inner App Container */}
            <div className="bg-white rounded-b-xl rounded-t-sm border border-slate-100 overflow-hidden relative">
              
              {/* Header */}
              <div className="bg-slate-50/80 border-b border-slate-100 p-4 md:px-8 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="font-bold text-slate-800 text-lg">{t("compareAnalysis")}</div>
                  <div className="hidden md:flex gap-2">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">{t("marchQ1")}</span>
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">{t("officeSupplies")}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-slate-800 transition-colors">
                  {t("exportReport")}
                </button>
              </div>

              <div className="p-4 md:p-8 grid lg:grid-cols-3 gap-8 bg-slate-50/30">
                
                {/* Left Column: AI Summary Card & Small Stats */}
                <div className="space-y-6">
                  <div className="bg-linear-to-br from-indigo-50 to-blue-50/50 rounded-2xl p-6 border border-indigo-100/60 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles className="w-24 h-24 text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-2 text-indigo-700 font-bold mb-4 relative z-10">
                      <Sparkles className="w-5 h-5" /> {t("summaryTitle")}
                    </div>
                    <p className="text-indigo-900 text-sm leading-relaxed mb-4 relative z-10">
                      {t("summaryText1")}<strong>{t("summaryVendor")}</strong>{t("summaryText2")}<span className="text-emerald-700 font-bold bg-emerald-100 px-1 rounded border border-emerald-200">{t("reduction")}</span>{t("summaryText3")}
                    </p>
                    <div className="mt-4 pt-4 border-t border-indigo-200/50 flex items-center justify-between relative z-10">
                       <span className="text-xs text-indigo-600 font-medium">{t("potentialSavings")}</span>
                       <span className="text-lg font-black text-emerald-600 drop-shadow-sm">$1,240.50</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                       <div className="text-slate-500 text-xs font-semibold mb-1">{t("itemsMatched")}</div>
                       <div className="text-2xl font-bold text-slate-800">142<span className="text-slate-400 text-sm font-normal">/145</span></div>
                     </div>
                     <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                       <div className="text-slate-500 text-xs font-semibold mb-1">{t("avgVariance")}</div>
                       <div className="text-2xl font-bold text-red-500">+2.4%</div>
                     </div>
                  </div>
                </div>

                {/* Right Column: Comparison Table & Vendor Details */}
                <div className="lg:col-span-2 space-y-6">
                   
                   {/* Vendor Comparison Cards */}
                   <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                     {[
                       { name: "TechCorp", price: "$8,450", status: t("bestPrice"), color: "green", bg: "bg-emerald-500", highlight: true },
                       { name: "GlobalSupply", price: "$9,200", status: "+8.8%", color: "red", bg: "bg-slate-700", highlight: false },
                       { name: "OfficeMax", price: "$9,850", status: "+16.5%", color: "red", bg: "bg-slate-700", highlight: false }
                     ].map((vendor, idx) => (
                       <div key={idx} className={`min-w-[200px] flex-1 rounded-xl p-4 border transition-all ${vendor.highlight ? 'border-emerald-300 bg-emerald-50/30 shadow-md relative scale-[1.02]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                         {vendor.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">{t("recommended")}</div>}
                         <div className="flex items-center gap-3 mb-4 mt-1">
                           <div className={`w-8 h-8 rounded-full ${vendor.bg} text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm`}>
                             {vendor.name.charAt(0)}
                           </div>
                           <div className="font-semibold text-slate-800">{vendor.name}</div>
                         </div>
                         <div className="flex items-end justify-between">
                            <div className="text-2xl font-black text-slate-900 tracking-tight">{vendor.price}</div>
                            <div className={`text-xs font-bold px-2 py-1 rounded ${vendor.color === 'green' ? 'text-emerald-700 bg-emerald-100' : 'text-red-600 bg-red-50'}`}>
                              {vendor.status}
                            </div>
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* Line Items Table */}
                   <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                     <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-5">{t("lineItem")}</div>
                        <div className="col-span-2 text-right">{t("qty")}</div>
                        <div className="col-span-2 text-right">TechCorp</div>
                        <div className="col-span-3 text-right">GlobalSupply</div>
                     </div>
                     {[
                       { item: "ThinkPad T14 Gen 3", sku: "SKU-2938", qty: 5, p1: "$1,250", p2: "$1,310", highlight: true },
                       { item: "Dell 27 USB-C Monitor", sku: "SKU-8842", qty: 10, p1: "$220", p2: "$210", highlight: false },
                       { item: "Logitech MX Master 3S", sku: "SKU-1123", qty: 5, p1: "$89", p2: "$99", highlight: true }
                     ].map((row, idx) => (
                       <div key={idx} className="grid grid-cols-12 gap-4 p-4 border-b border-slate-50 items-center text-sm hover:bg-slate-50/50 transition-colors cursor-default">
                          <div className="col-span-5">
                            <div className="font-semibold text-slate-800">{row.item}</div>
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5">{row.sku}</div>
                          </div>
                          <div className="col-span-2 text-right font-medium text-slate-600">{row.qty}</div>
                          <div className="col-span-2 text-right font-bold text-slate-900">
                            {row.p1}
                            {row.highlight && <span className="block text-[10px] text-emerald-600 mt-0.5 flex items-center justify-end gap-1">{t("lowest")}</span>}
                          </div>
                          <div className="col-span-3 text-right font-medium text-slate-500">
                             {row.p2}
                             {!row.highlight && idx === 1 && <span className="block text-[10px] text-emerald-600 font-bold mt-0.5">{t("lowest")}</span>}
                          </div>
                       </div>
                     ))}
                     <div className="p-3 bg-slate-50/50 text-center border-t border-slate-100">
                        <button className="text-slate-600 text-sm font-semibold flex items-center justify-center gap-1 mx-auto hover:text-findrai-primary transition-colors">
                          {t("viewAll")} <ChevronRight className="w-4 h-4" />
                        </button>
                     </div>
                   </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
