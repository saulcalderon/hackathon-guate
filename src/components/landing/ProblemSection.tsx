import { FileText, Clock, TrendingDown } from "lucide-react";

export default function ProblemSection() {
  const problems = [
    {
      icon: <FileText className="w-6 h-6 text-slate-700" />,
      title: "Too Many Invoices",
      description: "Companies receive multiple supplier invoices with different formats, varying descriptions, and complex line items.",
    },
    {
      icon: <Clock className="w-6 h-6 text-slate-700" />,
      title: "Slow Manual Comparison",
      description: "Manually matching items and comparing numbers across spreadsheets wastes valuable team hours every week.",
    },
    {
      icon: <TrendingDown className="w-6 h-6 text-slate-700" />,
      title: "Missed Price Differences",
      description: "Hidden price hikes and subtle discrepancies slip through the cracks, quietly costing your business money.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Manual comparison is broken
          </h2>
          <p className="text-lg text-slate-600">
            Traditional invoice processing is slow, error-prone, and costs you more than just time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-findrai-light/20 group-hover:text-findrai-primary transition-colors">
                {problem.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{problem.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
