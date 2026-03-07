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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col print:shadow-none print:border print:max-h-none print:rounded-none">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-findrai-primary" />
            <span className="font-semibold text-slate-900">Vista previa (como se vería impreso)</span>
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
          {/* Document-style content */}
          <div className="font-serif text-slate-800 space-y-6">
            {isSolicitud && (
              <div className="space-y-6">
                <div className="text-center border-b border-slate-300 pb-4">
                  <h1 className="text-xl font-bold uppercase tracking-wider text-findrai-primary">
                    Solicitud de cotización
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">Findr.ai — RFQ</p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <p><span className="font-semibold text-slate-600">Fecha:</span> {formatDate(solicitud.created_at)}</p>
                  <p><span className="font-semibold text-slate-600">De:</span> Empresa (Comprador)</p>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Materiales solicitados
                    </h2>
                  </div>
                  <div className="p-4">
                  <p className="font-medium text-slate-900 mb-2">{solicitud.descripcion}</p>
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
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-4 py-2">
                      Proveedores consultados ({solicitud.resultados.length})
                    </h2>
                    <ul className="divide-y divide-slate-100 text-sm p-4">
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
                  <div className="text-center border-b border-slate-300 pb-4">
                    <h1 className="text-xl font-bold uppercase tracking-wider text-findrai-primary">
                      Orden de compra
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Findr.ai — Gestión de compra</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    <p><span className="font-semibold text-slate-600">Fecha:</span> {formatDate(orden.created_at)}</p>
                    <p><span className="font-semibold text-slate-600">Estado:</span> <span className="capitalize">{orden.estado}</span></p>
                    <p><span className="font-semibold text-slate-600">De:</span> Empresa (Comprador)</p>
                    <p><span className="font-semibold text-slate-600">Para:</span> {orden.proveedor_display}</p>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2.5">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Detalle del pedido
                      </h2>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="font-semibold text-slate-900">{orden.descripcion_producto}</p>
                        <p className="text-sm text-slate-600 mt-1">Cantidad: {orden.cantidad}</p>
                      </div>
                      <table className="w-full text-sm">
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-2 text-slate-600">Precio unit. estimado</td>
                            <td className="py-2 text-right font-medium">
                              {sym} {orden.precio_estimado.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 text-slate-600">Unit. con gestión ({orden.comision_pct}%)</td>
                            <td className="py-2 text-right font-medium">
                              {sym} {orden.total_con_comision.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                          {qty > 1 && (
                            <tr>
                              <td className="py-2 text-slate-600">Subtotal ({qty} unidades)</td>
                              <td className="py-2 text-right font-medium">
                                {sym} {(orden.total_con_comision * qty).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          )}
                          <tr className="bg-slate-50">
                            <td className="py-3 px-0 font-bold text-slate-900">Total (con gestión)</td>
                            <td className="py-3 text-right font-bold text-lg text-findrai-primary">
                              {sym} {totalLinea.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {orden.notas_cliente && (
                    <div className="border border-slate-200 rounded-xl p-4">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
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

        <div className="px-6 py-3 border-t border-slate-100 flex gap-2 shrink-0 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Imprimir
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 text-sm font-semibold text-white bg-findrai-primary hover:bg-findrai-secondary rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
