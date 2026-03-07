import { 
  Sparkles, 
  ChevronRight, 
  Search, 
  LayoutDashboard, 
  FileText, 
  Users, 
  TrendingUp, 
  Package, 
  Bell,
  CheckCircle2,
  BarChart3,
  ShoppingCart
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProductPreview() {
  const t = useTranslations("Preview");
  
  return (
    <section id="product" className="py-24 bg-slate-50 relative overflow-hidden">
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

        {/* Dashboard Prototype Wrapper */}
        <div className="relative mx-auto max-w-[1100px] group perspective-1000">
          <div className="absolute -inset-1 bg-linear-to-r from-findrai-primary/30 to-findrai-medium/30 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-700"></div>
          
          <div className="relative bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 flex flex-row h-[650px]">
            
            {/* Mock Sidebar */}
            <div className="hidden lg:flex w-56 bg-slate-900 flex-col border-r border-slate-800 shrink-0">
              <div className="p-6 border-b border-slate-800 flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <img 
                    src="/logo/Finrai.svg" 
                    alt="Finrai Logo" 
                    className="w-7 h-7 object-contain brightness-0 invert" 
                  />
                </div>
                <span className="text-white font-bold text-xl tracking-tight">Findrai</span>
              </div>
              <div className="p-4 flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-findrai-primary/20 text-findrai-light rounded-lg">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-sm font-semibold">Overview</span>
                </div>
                {[
                  { name: "Solicitudes", icon: Search },
                  { name: "Mis Compras", icon: ShoppingCart },
                  { name: "Planes", icon: Sparkles },
                  { name: "Invoices", icon: FileText },
                  { name: "Suppliers", icon: Users },
                  { name: "Analytics", icon: TrendingUp },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-not-allowed transition-colors">
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
              
              {/* Mock App Header */}
              <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                <div className="max-w-md w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="block w-full pl-10 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-400">
                    Search invoices...
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Bell className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                  <div className="flex items-center gap-2">
                    <div className="hidden md:block text-right">
                      <p className="text-xs font-bold text-slate-900">demo@findrai.app</p>
                      <p className="text-[10px] text-emerald-600 font-medium">Account active</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">GA</div>
                  </div>
                </div>
              </div>

              {/* Scrollable Dashboard View */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Dashboard Summary Title */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Resumen</h3>
                  <p className="text-sm text-slate-500">Inteligencia procesable basada en tus últimas cargas.</p>
                </div>

                {/* Dashboard Stats Grid (Matching real app) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: t("itemsMatched"), value: "142", icon: Search, color: "blue", bg: "bg-blue-100", text: "text-blue-600" },
                    { label: "Resueltas", value: "3", icon: CheckCircle2, color: "green", bg: "bg-green-100", text: "text-green-600" },
                    { label: "Analizados", value: "14", icon: BarChart3, color: "indigo", bg: "bg-indigo-100", text: "text-indigo-600" },
                    { label: "Órdenes", value: "8", icon: ShoppingCart, color: "orange", bg: "bg-orange-100", text: "text-orange-600" },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className={`w-9 h-9 rounded-lg ${stat.bg} ${stat.text} flex items-center justify-center mb-3`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">{stat.label}</div>
                      <div className="text-xl font-black text-slate-900">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Main Content Card: Comparison Analysis */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                         <TrendingUp className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h4 className="font-bold text-slate-900">{t("compareAnalysis")}</h4>
                    </div>
                    <button className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all">
                      {t("exportReport")}
                    </button>
                  </div>

                  {/* Card Content Table Area */}
                  <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                    
                    {/* Comparison Summary */}
                    <div className="p-6 bg-slate-50/10">
                      <div className="flex items-center gap-2 text-indigo-700 font-bold mb-3">
                        <Sparkles className="w-4 h-4" /> {t("summaryTitle")}
                      </div>
                      <p className="text-slate-600 text-[13px] leading-relaxed mb-4">
                        Basado en tus facturas, <span className="text-slate-900 font-bold italic">GlobalSupply</span> ofrece un ahorro del <span className="text-emerald-600 font-black">12.4%</span> frente a tu proveedor actual.
                      </p>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-800">Ahorro Estimado:</span>
                        <span className="text-lg font-black text-emerald-600">$840.00</span>
                      </div>
                    </div>

                    {/* Simple Table (Mocking detailed view) */}
                    <div className="lg:col-span-2 p-0">
                       <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            <tr>
                              <th className="px-6 py-3">{t("lineItem")}</th>
                              <th className="px-6 py-3 text-right">Cant.</th>
                              <th className="px-6 py-3 text-right">TechCorp</th>
                              <th className="px-6 py-3 text-right">OfficeMax</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                             {[
                               { item: "ThinkPad T14", sku: "SKU-293", qty: 2, p1: "Q12,500", p2: "Q11,200", lower: 2 },
                               { item: "Monitor Dell 27", sku: "SKU-884", qty: 5, p1: "Q2,200", p2: "Q2,100", lower: 2 },
                               { item: "Logitech MX", sku: "SKU-112", qty: 3, p1: "Q890", p2: "Q950", lower: 1 },
                             ].map((row, i) => (
                               <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                 <td className="px-6 py-4">
                                   <div className="font-bold text-slate-800">{row.item}</div>
                                   <div className="text-[9px] text-slate-400 mt-0.5">{row.sku}</div>
                                 </td>
                                 <td className="px-6 py-4 text-right font-medium text-slate-500">{row.qty}</td>
                                 <td className={`px-6 py-4 text-right font-bold ${row.lower === 1 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {row.p1}
                                 </td>
                                 <td className={`px-6 py-4 text-right font-bold ${row.lower === 2 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {row.p2}
                                 </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                       <div className="p-3 text-center border-t border-slate-50">
                          <span className="text-[10px] font-bold text-slate-400 hover:text-findrai-primary flex items-center justify-center gap-1 cursor-pointer">
                            VER TODOS LOS ARTÍCULOS <ChevronRight className="w-3 h-3" />
                          </span>
                       </div>
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

