import Link from "next/link";
import { Search, FileText, DollarSign, TrendingUp, SearchCheck, ArrowRight, MoreHorizontal } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Savings Built",
      value: "$14,240",
      change: "+12.5%",
      trend: "up",
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      bg: "bg-green-100",
    },
    {
      title: "Invoices Processed",
      value: "156",
      change: "+22",
      trend: "up",
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      title: "Suppliers Analyzed",
      value: "14",
      change: "Stable",
      trend: "neutral",
      icon: <SearchCheck className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-100",
    },
  ];

  const recentComparisons = [
    { id: "REP-2041", date: "Today, 10:23 AM", category: "Hardware", items: 45, saved: "$1,200", status: "Completed" },
    { id: "REP-2040", date: "Yesterday, 3:45 PM", category: "Office Supplies", items: 120, saved: "$340", status: "Completed" },
    { id: "REP-2039", date: "Mar 04, 2026", category: "Software Licenses", items: 12, saved: "$4,500", status: "Action Needed" },
    { id: "REP-2038", date: "Mar 02, 2026", category: "Marketing Services", items: 3, saved: "$0", status: "Completed" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
        </div>
        <Link
          href="/dashboard/solicitudes"
          className="flex items-center gap-2 px-5 py-2.5 bg-findrai-primary hover:bg-findrai-secondary text-white rounded-xl font-semibold transition-colors shadow-sm w-fit"
        >
          <Search className="w-5 h-5" />
          <span>Nueva solicitud</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                {stat.icon}
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${stat.trend === 'up' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                {stat.change}
              </div>
            </div>
            <div className="text-slate-500 text-sm font-medium mb-1">{stat.title}</div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Recent Comparisons Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Comparisons</h2>
            <button className="text-sm font-semibold text-findrai-primary hover:text-findrai-secondary transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4 font-semibold">Report ID</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Items</th>
                  <th className="p-4 font-semibold">Potential Savings</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 rounded-tr-xl"></th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {recentComparisons.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">
                      <div className="font-semibold text-findrai-primary">{item.id}</div>
                      <div className="text-xs text-slate-400 font-normal mt-0.5">{item.date}</div>
                    </td>
                    <td className="p-4 text-slate-600">{item.category}</td>
                    <td className="p-4 text-slate-600">{item.items}</td>
                    <td className="p-4 text-slate-900 font-bold">{item.saved}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Request CTA */}
        <div className="bg-gradient-to-br from-findrai-primary to-findrai-medium rounded-2xl p-8 shadow-lg text-white flex flex-col justify-between relative overflow-hidden border border-findrai-light/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">¿Listo para cotizar?</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-8">
              Describe lo que necesitas y la IA encuentra y compara proveedores por ti — en segundos.
            </p>
          </div>

          <Link
            href="/dashboard/solicitudes"
            className="w-full flex items-center justify-center gap-2 py-3 bg-white text-findrai-primary font-bold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <Search className="w-4 h-4" />
            Nueva solicitud <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
