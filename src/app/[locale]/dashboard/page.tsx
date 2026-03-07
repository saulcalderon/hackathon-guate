import Link from 'next/link';
import {
  Search,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  Package,
  BarChart3,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { getAllSesiones } from '@/lib/store/sesiones';
import { getAllOrdenes } from '@/lib/stores/ordenes';
import type { SesionSolicitud } from '@/types/solicitudes';
import type { OrdenCompra, EstadoOrden } from '@/types/ordenes';

const ESTADO_SESION_CONFIG = {
  activa:    { label: 'Activa',    className: 'bg-blue-100 text-blue-700' },
  resuelta:  { label: 'Resuelta',  className: 'bg-green-100 text-green-700' },
  cancelada: { label: 'Cancelada', className: 'bg-slate-100 text-slate-500' },
};

const ESTADO_ORDEN_CONFIG: Record<EstadoOrden, { label: string; className: string }> = {
  pendiente:  { label: 'Pendiente',  className: 'bg-amber-100 text-amber-700' },
  en_proceso: { label: 'En proceso', className: 'bg-blue-100 text-blue-700' },
  completada: { label: 'Completada', className: 'bg-green-100 text-green-700' },
  cancelada:  { label: 'Cancelada',  className: 'bg-slate-100 text-slate-500' },
};

const MONEDA_SYMBOL: Record<string, string> = { GTQ: 'Q', USD: '$', SVC: '₡' };

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMin < 1) return 'Hace un momento';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `Hace ${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-GT', { day: 'numeric', month: 'short' });
}

function computeStats(sesiones: SesionSolicitud[], ordenes: OrdenCompra[]) {
  const total = sesiones.length;
  const activas = sesiones.filter((s) => s.estado === 'activa').length;
  const resueltas = sesiones.filter((s) => s.estado === 'resuelta').length;
  const proveedoresTotal = sesiones.reduce((acc, s) => acc + s.resultados.length, 0);
  const ordenesActivas = ordenes.filter(
    (o) => o.estado === 'pendiente' || o.estado === 'en_proceso'
  ).length;
  const categoriasCount: Record<string, number> = {};
  sesiones.forEach((s) =>
    s.categorias.forEach((c) => { categoriasCount[c] = (categoriasCount[c] ?? 0) + 1; })
  );
  const topCategoria =
    Object.entries(categoriasCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return { total, activas, resueltas, proveedoresTotal, ordenesActivas, topCategoria };
}

export default async function DashboardPage() {
  let sesiones: SesionSolicitud[] = [];
  let ordenes: OrdenCompra[] = [];
  try {
    [sesiones, ordenes] = await Promise.all([getAllSesiones(), getAllOrdenes()]);
  } catch {
    // fallback to empty when DB/store fails
  }
  const stats = computeStats(sesiones, ordenes);
  const recentSesiones = sesiones.slice(0, 5);
  const recentOrdenes  = ordenes.slice(0, 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resumen</h1>
          <p className="text-slate-500 text-sm mt-1">
            {stats.total === 0
              ? 'Bienvenido. Crea tu primera solicitud para empezar.'
              : `${stats.total} consulta${stats.total !== 1 ? 's' : ''} realizadas · ${stats.activas} activa${stats.activas !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          href="/dashboard/solicitudes/nueva"
          className="flex items-center gap-2 px-5 py-2.5 bg-findrai-primary hover:bg-findrai-secondary text-white rounded-xl font-semibold transition-colors shadow-sm w-fit"
        >
          <Search className="w-5 h-5" />
          <span>Nueva solicitud</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-100">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            {stats.activas > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {stats.activas} activas
              </span>
            )}
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">Consultas totales</div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight">{stats.total}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-green-100">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            {stats.total > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                {Math.round((stats.resueltas / stats.total) * 100)}%
              </span>
            )}
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">Resueltas</div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight">{stats.resueltas}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-indigo-100">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">Proveedores analizados</div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight">{stats.proveedoresTotal}</div>
          {stats.topCategoria && (
            <p className="text-xs text-slate-400 mt-1 truncate">Top: {stats.topCategoria}</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-orange-100">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
            </div>
            {stats.ordenesActivas > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                {stats.ordenesActivas} en curso
              </span>
            )}
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">Órdenes de compra</div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight">{ordenes.length}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent Sessions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Solicitudes recientes</h2>
            <Link
              href="/dashboard/solicitudes"
              className="text-sm font-semibold text-findrai-primary hover:text-findrai-secondary transition-colors flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentSesiones.length === 0 ? (
            <div className="p-12 text-center">
              <Zap className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Aún no hay solicitudes.</p>
              <Link
                href="/dashboard/solicitudes/nueva"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-findrai-primary hover:underline"
              >
                <Search className="w-4 h-4" /> Crear primera solicitud
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                    <th className="p-4 font-semibold">Solicitud</th>
                    <th className="p-4 font-semibold">Proveedores</th>
                    <th className="p-4 font-semibold">Estado</th>
                    <th className="p-4 font-semibold">Fecha</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {recentSesiones.map((s) => {
                    const eConf = ESTADO_SESION_CONFIG[s.estado];
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <p className="font-semibold text-slate-900 text-sm line-clamp-1 max-w-[220px]">
                            {s.descripcion}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {s.categorias.slice(0, 2).map((c) => (
                              <span
                                key={c}
                                className="px-1.5 py-0.5 bg-findrai-primary/10 text-findrai-primary text-xs rounded-full font-semibold"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 text-sm">{s.resultados.length}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${eConf.className}`}>
                            {eConf.label}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 text-xs whitespace-nowrap">
                          {timeAgo(s.created_at)}
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/dashboard/solicitudes/${s.id}`}
                            className="p-2 text-slate-400 hover:text-findrai-primary rounded-lg hover:bg-slate-100 transition-colors inline-flex"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Recent Orders fast-view */}
          {recentOrdenes.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-500" />
                  Mis compras
                </h3>
                <Link
                  href="/dashboard/compras"
                  className="text-xs font-semibold text-findrai-primary hover:underline flex items-center gap-1"
                >
                  Ver todas <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {recentOrdenes.map((o) => {
                  const oConf = ESTADO_ORDEN_CONFIG[o.estado];
                  const sym = MONEDA_SYMBOL[o.moneda] ?? '';
                  return (
                    <div key={o.id} className="p-4 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {o.descripcion_producto}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {o.proveedor_display} · {timeAgo(o.created_at)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-slate-900">
                          {sym} {o.total_con_comision.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                        </p>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${oConf.className}`}>
                          {oConf.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-findrai-primary to-findrai-medium rounded-2xl p-6 shadow-lg text-white flex flex-col justify-between relative overflow-hidden border border-findrai-light/20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div>
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-1">¿Listo para cotizar?</h3>
              <p className="text-blue-100 text-xs leading-relaxed mb-5">
                Describe lo que necesitas y la IA encuentra y compara proveedores por ti.
              </p>
            </div>
            <Link
              href="/dashboard/solicitudes/nueva"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-findrai-primary font-bold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 text-sm"
            >
              <Search className="w-4 h-4" />
              Nueva solicitud <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Credits teaser */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold">Créditos de búsqueda</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Cada búsqueda real usa 1 crédito. Compra un paquete y accede a proveedores con precios actualizados.
            </p>
            <Link
              href="/dashboard/planes"
              className="w-full flex items-center justify-center gap-2 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition-colors text-sm"
            >
              Ver planes y precios
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
