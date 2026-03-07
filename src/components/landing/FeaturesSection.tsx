import { BrainCircuit, LineChart, Target, SearchCheck } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: "AI Data Extraction",
      description: "Automatically extract line items, quantities, and prices from complex PDFs with 99% accuracy.",
    },
    {
      icon: <SearchCheck className="w-6 h-6" />,
      title: "Supplier Comparison",
      description: "Match identical or similar items across multiple different supplier catalogs and invoices simultaneously.",
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Price Analysis",
      description: "Track historical price changes and spot subtle hikes before they impact your margins.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Best Vendor Recommendation",
      description: "Our engine instantly highlights the most cost-effective supplier for your current bill of materials.",
    },
  ];

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-findrai-primary/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-findrai-medium/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-findrai-light/10 text-findrai-light border border-findrai-light/20 text-sm font-semibold mb-6">
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              Everything you need to <span className="text-findrai-light">control costs</span>
            </h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl">
              Findrai is built from the ground up to handle the complexity of modern procurement. We replace manual spreadsheets with intelligent automation so you never overpay again.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-findrai-primary/20 text-findrai-light flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-findrai-primary/30 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
