'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Package, Clock, CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import type { OrdenCompra, EstadoOrden } from '@/types/ordenes';

const ESTADO_CONFIG: Record<EstadoOrden, { label: string; className: string; icon: React.ReactNode }> = {
  pendiente: {
    label: 'Pendiente',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  en_proceso: {
    label: 'En proceso',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <Loader2 className="w-3.5 h-3.5" />,
  },
  completada: {
    label: 'Completada',
    className: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  cancelada: {
    label: 'Cancelada',
    className: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
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
  return date.toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ComprasPage() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<EstadoOrden | 'todas'>('todas');

  useEffect(() => {
    fetch('/api/ordenes')
      .then((r) => r.json())
      .then((data: OrdenCompra[]) => { setOrdenes(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleCancelar = async (id: string) => {
    await fetch(`/api/ordenes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'cancelada' }),
    });
    setOrdenes((prev) => prev.map((o) => o.id === id ? { ...o, estado: 'cancelada' } : o));
  };

  const filtered = filtro === 'todas' ? ordenes : ordenes.filter((o) => o.estado === filtro);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-findrai-primary" />
            Mis Compras
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Órdenes gestionadas por Findrai — nosotros hacemos la logística.
          </p>
        </div>
        <Link
          href="/dashboard/solicitudes/nueva"
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Nueva solicitud
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['todas', 'pendiente', 'en_proceso', 'completada', 'cancelada'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
              filtro === f
                ? 'bg-findrai-primary text-white border-findrai-primary'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {f === 'todas' ? 'Todas' : ESTADO_CONFIG[f].label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-findrai-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            {ordenes.length === 0
              ? 'Todavía no tienes órdenes. Usa el botón "Comprar con Findrai" en una búsqueda.'
              : 'No hay órdenes con ese filtro.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4 font-semibold">Producto</th>
                  <th className="p-4 font-semibold">Proveedor</th>
                  <th className="p-4 font-semibold">Cantidad</th>
                  <th className="p-4 font-semibold">Total c/ gestión</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold">Fecha</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {filtered.map((o) => {
                  const conf = ESTADO_CONFIG[o.estado];
                  const sym = MONEDA_SYMBOL[o.moneda] ?? '';
                  return (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-slate-900 line-clamp-2 max-w-[200px] text-xs leading-relaxed">
                          {o.descripcion_producto}
                        </p>
                        {o.notas_cliente && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{o.notas_cliente}</p>
                        )}
                      </td>
                      <td className="p-4 text-slate-600 text-xs">{o.proveedor_display}</td>
                      <td className="p-4 text-slate-600 text-xs">{o.cantidad}</td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900 text-sm">
                          {sym} {o.total_con_comision.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-slate-400">
                          Base: {sym} {o.precio_estimado.toLocaleString('es-GT', { minimumFractionDigits: 2 })} + {o.comision_pct}%
                        </p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${conf.className}`}>
                          {conf.icon}
                          {conf.label}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-xs whitespace-nowrap">{timeAgo(o.created_at)}</td>
                      <td className="p-4 text-right">
                        {o.estado === 'pendiente' && (
                          <button
                            onClick={() => handleCancelar(o.id)}
                            className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-3">
        <Package className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">¿Cómo funciona Comprar con Findrai?</p>
          <p className="text-xs text-blue-600 mt-1 leading-relaxed">
            Cuando creas una orden, nuestro equipo se encarga de contactar al proveedor, negociar, gestionar el pago y coordinar la entrega. Cobramos una comisión del {8}% sobre el valor del producto por el servicio completo.
          </p>
        </div>
      </div>
    </div>
  );
}
