import { Sparkles, ChevronRight } from "lucide-react";

export default function ProductPreview() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            See the savings instantly
          </h2>
          <p className="text-lg text-slate-600">
            Our intuitive dashboard transforms messy invoices into clear, actionable financial insights. 
            Identify the best vendors for every line item in seconds.
          </p>
        </div>

        {/* Product Dashboard UI Mockup */}
        <div className="bg-white rounded-2xl md:rounded-[2rem] border border-slate-200/60 shadow-xl overflow-hidden shadow-slate-200/50">
          
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-100 p-4 md:px-8 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="font-bold text-slate-800 text-lg">Compare Analysis</div>
              <div className="hidden md:flex gap-2">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600">March Q1</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600">Office Supplies</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-findrai-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-findrai-secondary transition-colors">
              Export Report
            </button>
          </div>

          <div className="p-4 md:p-8 grid lg:grid-cols-3 gap-8 bg-slate-50/30">
            
            {/* Left Column: AI Summary Card & Small Stats */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-24 h-24 text-indigo-600" />
                </div>
                <div className="flex items-center gap-2 text-indigo-700 font-bold mb-4 relative z-10">
                  <Sparkles className="w-5 h-5" /> AI Executive Summary
                </div>
                <p className="text-indigo-900 text-sm leading-relaxed mb-4 relative z-10">
                  We analyzed 3 vendor invoices for your current BOM. <strong>Vendor TechCorp</strong> offers the best overall value, saving you <span className="text-green-700 font-bold bg-green-100 px-1 rounded">14.2%</span> compared to your historical averages.
                </p>
                <div className="mt-4 pt-4 border-t border-indigo-100/50 flex items-center justify-between relative z-10">
                   <span className="text-xs text-indigo-600 font-medium">Potential Savings:</span>
                   <span className="text-lg font-bold text-green-600">$1,240.50</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                   <div className="text-slate-500 text-xs font-semibold mb-1">Items Matched</div>
                   <div className="text-2xl font-bold text-slate-800">142<span className="text-slate-400 text-sm font-normal">/145</span></div>
                 </div>
                 <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                   <div className="text-slate-500 text-xs font-semibold mb-1">Avg Variance</div>
                   <div className="text-2xl font-bold text-red-500">+2.4%</div>
                 </div>
              </div>
            </div>

            {/* Right Column: Comparison Table & Vendor Details */}
            <div className="lg:col-span-2 space-y-6">
               
               {/* Vendor Comparison Cards */}
               <div className="flex gap-4 overflow-x-auto pb-2">
                 {[
                   { name: "TechCorp", price: "$8,450", status: "Best Price", color: "green", bg: "bg-green-500", highlight: true },
                   { name: "GlobalSupply", price: "$9,200", status: "+8.8%", color: "red", bg: "bg-slate-400", highlight: false },
                   { name: "OfficeMax", price: "$9,850", status: "+16.5%", color: "red", bg: "bg-slate-400", highlight: false }
                 ].map((vendor, idx) => (
                   <div key={idx} className={`min-w-[200px] flex-1 rounded-xl p-4 border ${vendor.highlight ? 'border-findrai-primary/30 bg-findrai-light/5 shadow-sm relative' : 'border-slate-200 bg-white'}`}>
                     {vendor.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-findrai-primary text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full whitespace-nowrap">Recommended</div>}
                     <div className="flex items-center gap-3 mb-3 mt-1">
                       <div className={`w-8 h-8 rounded-full ${vendor.bg} text-white flex items-center justify-center font-bold text-xs`}>
                         {vendor.name.charAt(0)}
                       </div>
                       <div className="font-semibold text-slate-800">{vendor.name}</div>
                     </div>
                     <div className="flex items-end justify-between">
                        <div className="text-xl font-bold text-slate-900">{vendor.price}</div>
                        <div className={`text-xs font-bold ${vendor.color === 'green' ? 'text-green-600' : 'text-red-500'}`}>
                          {vendor.status}
                        </div>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Line Items Table */}
               <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                 <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-5">Line Item</div>
                    <div className="col-span-2 text-right">Qty</div>
                    <div className="col-span-2 text-right">TechCorp</div>
                    <div className="col-span-3 text-right">GlobalSupply</div>
                 </div>
                 {[
                   { item: "ThinkPad T14 Gen 3", sku: "SKU-2938", qty: 5, p1: "$1,250", p2: "$1,310", highlight: true },
                   { item: "Dell 27 USB-C Monitor", sku: "SKU-8842", qty: 10, p1: "$220", p2: "$210", highlight: false },
                   { item: "Logitech MX Master 3S", sku: "SKU-1123", qty: 5, p1: "$89", p2: "$99", highlight: true }
                 ].map((row, idx) => (
                   <div key={idx} className="grid grid-cols-12 gap-4 p-4 border-b border-slate-50 items-center text-sm hover:bg-slate-50 transition-colors">
                      <div className="col-span-5">
                        <div className="font-semibold text-slate-800">{row.item}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{row.sku}</div>
                      </div>
                      <div className="col-span-2 text-right font-medium text-slate-600">{row.qty}</div>
                      <div className="col-span-2 text-right font-bold text-slate-900">
                        {row.p1}
                        {row.highlight && <span className="block text-[10px] text-green-600 mt-0.5">Lowest</span>}
                      </div>
                      <div className="col-span-3 text-right font-medium text-slate-500">
                         {row.p2}
                         {!row.highlight && idx === 1 && <span className="block text-[10px] text-green-600 font-bold mt-0.5">Lowest</span>}
                      </div>
                   </div>
                 ))}
                 <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                    <button className="text-findrai-primary text-sm font-semibold flex items-center justify-center gap-1 mx-auto hover:text-findrai-secondary transition-colors">
                      View all 145 items <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
               </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
