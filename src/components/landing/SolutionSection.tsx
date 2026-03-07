import { Upload, Cpu, ArrowRightLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SolutionSection() {
  const t = useTranslations("Solution");
  const steps = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: t("step2Title"),
      description: t("step2Desc"),
    },
    {
      icon: <ArrowRightLeft className="w-6 h-6" />,
      title: t("step3Title"),
      description: t("step3Desc"),
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: t("step4Title"),
      description: t("step4Desc"),
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-findrai-medium/10 text-findrai-secondary text-sm font-semibold mb-6 border border-findrai-medium/20">
            {t("badge")}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-lg text-slate-600">
            {t("desc")}
          </p>
        </div>

        {/* Visual Workflow Diagram */}
        <div className="relative">
          {/* Connector Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-10 left-[10%] w-[80%] h-0.5 bg-gradient-to-r from-findrai-light/30 via-findrai-medium/50 to-findrai-primary/30 z-0 rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center relative group">
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-100 shadow-md flex items-center justify-center mb-6 text-findrai-primary group-hover:bg-findrai-primary group-hover:text-white group-hover:border-findrai-primary group-hover:-translate-y-1 transition-all duration-300 z-10 relative">
                  {step.icon}
                  {idx < steps.length - 1 && (
                     <div className="md:hidden flex justify-center mt-12 absolute -bottom-8 text-slate-300">
                        <ArrowRight className="w-6 h-6 rotate-90" />
                     </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm max-w-[200px] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
