'use client';

import { X, Eye } from 'lucide-react';
import type { SesionSolicitud } from '@/types/solicitudes';
import type { OrdenCompra } from '@/types/ordenes';

const MONEDA_SYMBOL: Record<string, string> = { GTQ: 'Q', USD: '$', SVC: '₡' };

function parseCantidad(cantidadStr: string): number {
  const match = cantidadStr.trim().match(/^\d+/);
  return match ? Math.max(1, parseInt(match[0], 10)) : 1;
}

interface RequestPreviewModalProps {
  onClose: () => void;
  variant: 'solicitud' | 'orden';
  solicitud?: SesionSolicitud;
  orden?: OrdenCompra;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-GT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function RequestPreviewModal({
  onClose,
  variant,
  solicitud,
  orden,
}: RequestPreviewModalProps) {
  const isSolicitud = variant === 'solicitud' && solicitud;
  const isOrden = variant === 'orden' && orden;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm print:bg-white print:backdrop-blur-none print:p-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col print:shadow-none print:max-h-none print:rounded-none">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-slate-500" />
            <span className="font-medium text-slate-700">Vista previa (como se vería impreso)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 print:p-8">
          <div className="space-y-6">
            {isSolicitud && (
              <div className="space-y-6">
                <div className="text-center border-b border-slate-200 pb-4">
                  <h1 className="text-xl font-bold uppercase tracking-wider text-findrai-primary">
                    Solicitud de cotización
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">Findr.ai — RFQ</p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <p><span className="font-medium text-slate-500">Fecha:</span> <span className="font-semibold text-slate-800">{formatDate(solicitud.created_at)}</span></p>
                  <p><span className="font-medium text-slate-500">De:</span> <span className="font-semibold text-slate-800">Empresa (Comprador)</span></p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-200">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Materiales solicitados
                    </h2>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-slate-900 mb-2">{solicitud.descripcion}</p>
                    {(solicitud.cantidad != null || solicitud.unidad) && (
                      <p className="text-sm text-slate-600">
                        Cantidad: {solicitud.cantidad ?? '—'} {solicitud.unidad ?? ''}
                      </p>
                    )}
                    {solicitud.categorias.length > 0 && (
                      <p className="text-sm text-slate-600 mt-1">
                        Categorías: {solicitud.categorias.join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-slate-600 mt-1">
                      Urgencia: {solicitud.urgencia}
                    </p>
                  </div>
                </div>

                {solicitud.resultados.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-200">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Proveedores consultados ({solicitud.resultados.length})
                      </h2>
                    </div>
                    <ul className="divide-y divide-slate-200 text-sm p-4">
                      {solicitud.resultados
                        .filter((r, i, arr) => arr.findIndex((x) => x.nombre === r.nombre) === i)
                        .slice(0, 5)
                        .map((r) => (
                          <li key={r.id} className="py-1">
                            {r.nombre}
                            {r.material_descripcion && (
                              <span className="text-slate-500 ml-1">— {r.material_descripcion}</span>
                            )}
                          </li>
                        ))}
                      {solicitud.resultados.length > 5 && (
                        <li className="text-slate-500 py-1">+{solicitud.resultados.length - 5} más</li>
                      )}
                    </ul>
                  </div>
                )}

                {solicitud.proveedor_elegido && (
                  <p className="text-sm font-semibold text-green-700 border border-green-200 rounded-lg p-3 bg-green-50">
                    Proveedor elegido: {solicitud.proveedor_elegido}
                  </p>
                )}
              </div>
            )}

            {isOrden && (() => {
              const sym = MONEDA_SYMBOL[orden.moneda] ?? '';
              const qty = parseCantidad(orden.cantidad);
              const totalLinea = parseFloat((orden.total_con_comision * qty).toFixed(2));
              return (
                <div className="space-y-6">
                  <div className="text-center border-b border-slate-200 pb-4">
                    <h1 className="text-xl font-bold uppercase tracking-wider text-findrai-primary">
                      Orden de compra
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Findr.ai — Gestión de compra</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <p><span className="font-medium text-slate-500">Fecha:</span> <span className="font-semibold text-slate-800">{formatDate(orden.created_at)}</span></p>
                    <p><span className="font-medium text-slate-500">Estado:</span> <span className="font-semibold text-slate-800 capitalize">{orden.estado}</span></p>
                    <p><span className="font-medium text-slate-500">De:</span> <span className="font-semibold text-slate-800">Empresa (Comprador)</span></p>
                    <p><span className="font-medium text-slate-500">Para:</span> <span className="font-semibold text-slate-800">{orden.proveedor_display}</span></p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-200">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Detalle del pedido
                      </h2>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="font-semibold text-slate-900">{orden.descripcion_producto}</p>
                        <p className="text-sm text-slate-600 mt-1">Cantidad: {orden.cantidad}</p>
                      </div>
                      <div className="border-t border-slate-200 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Precio unit. estimado</span>
                          <span className="font-medium text-slate-800">
                            {sym} {orden.precio_estimado.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Unit. con gestión ({orden.comision_pct}%)</span>
                          <span className="font-medium text-slate-800">
                            {sym} {orden.total_con_comision.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        {qty > 1 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Subtotal ({qty} unidades)</span>
                            <span className="font-medium text-slate-800">
                              {sym} {(orden.total_con_comision * qty).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm pt-2 border-t border-slate-200 mt-2">
                          <span className="font-bold text-slate-900">Total (con gestión)</span>
                          <span className="font-bold text-findrai-primary">
                            {sym} {totalLinea.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {orden.notas_cliente && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Notas
                      </h2>
                      <p className="text-sm text-slate-700">{orden.notas_cliente}</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Imprimir
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-findrai-primary hover:bg-findrai-secondary rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
