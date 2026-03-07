import { ArrowRight, LogOut, Play } from 'lucide-react';

type HeroProps = {
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  userEmail: string | null;
  onPrimaryAction: () => void;
  onLogout: () => void;
};

export default function Hero({
  isAuthenticated,
  isLoadingSession,
  userEmail,
  onPrimaryAction,
  onLogout,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white pt-10 md:pt-16 lg:pt-24 pb-16 md:pb-24">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-findrai-light/20 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-findrai-medium/10 blur-3xl opacity-50 pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        {/* Header/Logo */}
        <div className="mb-16 flex items-center justify-between md:mb-24">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-findrai-primary to-findrai-medium flex items-center justify-center shadow-lg shadow-findrai-primary/20">
              <span className="text-white font-bold text-2xl leading-none">F</span>
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Findrai</span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && userEmail ? (
              <span className="hidden text-sm text-slate-500 md:inline">{userEmail}</span>
            ) : null}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            ) : (
              <button
                type="button"
                onClick={onPrimaryAction}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                {isLoadingSession ? 'Validando...' : 'Entrar'}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-findrai-light/10 text-findrai-primary text-sm font-semibold mb-8 border border-findrai-light/30 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-findrai-secondary animate-pulse"></span>
            The New Standard in Invoice Comparison
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Compare supplier invoices <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-findrai-primary to-findrai-medium">
              with AI precision
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
            Upload your invoices, let our AI extract the data, and automatically find the best
            options. Stop missing key price differences and start saving money today.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={onPrimaryAction}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-findrai-primary hover:bg-findrai-secondary text-white font-semibold text-lg transition-all shadow-[0_8px_20px_rgb(2,72,115,0.2)] hover:shadow-[0_8px_25px_rgb(2,72,115,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {isAuthenticated ? 'Ir al dashboard' : 'Start comparing invoices'}{' '}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-700 hover:text-findrai-primary font-semibold text-lg transition-all border border-slate-200 hover:border-findrai-light hover:bg-slate-50 hover:shadow-sm flex items-center justify-center gap-2 group"
            >
              <Play className="w-5 h-5 text-slate-400 group-hover:text-findrai-primary transition-colors" />{" "}
              See how it works
            </button>
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-16 md:mt-24 relative mx-auto max-w-5xl perspective-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-findrai-primary via-findrai-medium to-findrai-light rounded-2xl md:rounded-[2rem] blur opacity-20"></div>
          <div className="relative rounded-2xl md:rounded-[2rem] bg-white border border-slate-200/50 shadow-2xl overflow-hidden transform transition-transform hover:scale-[1.01] duration-500">
            {/* Browser/app header styling */}
            <div className="flex items-center px-4 py-3 bg-slate-50 border-b border-slate-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              </div>
            </div>
            {/* App content placeholder */}
            <div className="bg-slate-50/50 p-4 md:p-8 flex flex-col gap-4 relative overflow-hidden">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Invoice Comparison</h3>
                  <p className="text-sm text-slate-500">March 2026 Procurement Data</p>
                </div>
                <div className="px-3 py-1.5 bg-green-100 text-green-700 font-medium rounded-lg text-sm border border-green-200">
                  Save 14% with Vendor B
                </div>
              </div>

              {/* Fake Table */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-4 p-4 border-b border-slate-50 bg-slate-50/50 text-sm font-semibold text-slate-500">
                  <div className="col-span-2">Supplier</div>
                  <div>Total Amount</div>
                  <div>AI Recommendation</div>
                </div>
                <div className="grid grid-cols-4 p-4 items-center border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">SA</div>
                    <span className="font-semibold text-slate-700">Supplier A (Legacy)</span>
                  </div>
                  <div className="font-medium text-slate-600">$4,250.00</div>
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded font-medium text-xs bg-slate-100 text-slate-600">
                      Standard
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-4 p-4 items-center hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs">VB</div>
                    <span className="font-bold text-slate-900">Vendor B</span>
                  </div>
                  <div className="font-bold text-slate-900">$3,655.00</div>
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded font-semibold text-xs bg-findrai-primary text-white shadow-sm">
                      Best Value
                    </span>
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
