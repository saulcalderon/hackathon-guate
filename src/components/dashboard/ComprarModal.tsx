'use client';

import { useState } from 'react';
import { X, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { COMISION_FINDRAI_PCT } from '@/lib/constants/planes';
import type { ResultadoProveedor } from '@/types/solicitudes';

interface ComprarModalProps {
  proveedor: ResultadoProveedor;
  proveedorDisplay: string;
  sesionId: string;
  onClose: () => void;
  cantidadInicial?: number | null;
  unidadInicial?: string | null;
}

const MONEDA_SYMBOL: Record<string, string> = { GTQ: 'Q', USD: '$', SVC: '₡' };

function parseCantidadFromInput(input: string): number {
  const match = input.trim().match(/^\d+/);
  return match ? Math.max(1, parseInt(match[0], 10)) : 1;
}

export default function ComprarModal({
  proveedor,
  proveedorDisplay,
  sesionId,
  onClose,
  cantidadInicial,
  unidadInicial,
}: ComprarModalProps) {
  const defaultCantidad =
    cantidadInicial != null && cantidadInicial > 0
      ? unidadInicial
        ? `${cantidadInicial} ${unidadInicial}`
        : String(cantidadInicial)
      : '1';
  const [cantidad, setCantidad] = useState(defaultCantidad);
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const sym = MONEDA_SYMBOL[proveedor.moneda] ?? '';
  const precioBase = proveedor.precio;
  const comisionMonto = parseFloat((precioBase * (COMISION_FINDRAI_PCT / 100)).toFixed(2));
  const totalPorUnidad = parseFloat((precioBase + comisionMonto).toFixed(2));
  const qty = parseCantidadFromInput(cantidad);
  const totalGeneral = parseFloat((totalPorUnidad * qty).toFixed(2));

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sesion_id: sesionId,
          proveedor_nombre: proveedor.nombre,
          proveedor_display: proveedorDisplay,
          descripcion_producto: proveedor.descripcion_producto,
          cantidad: cantidad.trim() || defaultCantidad,
          precio_estimado: precioBase,
          moneda: proveedor.moneda,
          notas_cliente: notas.trim() || undefined,
        }),
      });
      setDone(true);
    } catch {
      // fail silently for demo
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            <h2 className="font-bold text-slate-900">Crear cotización</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {done ? (
          /* Success state */
          <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">¡Cotización creada!</p>
              <p className="text-slate-500 text-sm mt-1">
                Nuestro equipo se pondrá en contacto contigo en las próximas horas para confirmar los detalles.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
            >
              Entendido
            </button>
          </div>
        ) : (
          /* Form */
          <div className="px-6 py-5 space-y-5">
            {/* Proveedor info */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Proveedor</p>
              <p className="font-bold text-slate-800">{proveedorDisplay}</p>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {proveedor.descripcion_producto}
              </p>
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Cantidad / Descripción del pedido
              </label>
              <input
                type="text"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder="Ej: 200 sacos, 5 unidades, 1 pallet…"
                className="w-full px-4 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-findrai-primary/30 focus:border-findrai-primary placeholder-slate-400 bg-white transition-colors"
              />
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Notas adicionales <span className="font-normal text-slate-400">(opcional)</span>
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Dirección de entrega, fecha requerida, especificaciones especiales…"
                rows={3}
                className="w-full px-4 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-findrai-primary/30 focus:border-findrai-primary placeholder-slate-400 resize-none bg-white transition-colors"
              />
            </div>

            {/* Price breakdown */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Desglose estimado (por unidad)
              </p>
              <div className="flex justify-between text-sm text-slate-700">
                <span>Precio proveedor</span>
                <span className="font-semibold">{sym} {precioBase.toLocaleString('es-GT', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Gestión Findr.ai ({COMISION_FINDRAI_PCT}%)</span>
                <span>+ {sym} {comisionMonto.toLocaleString('es-GT', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-green-700 border-t border-green-200 pt-2 mt-1">
                <span>Total estimado</span>
                <span>{sym} {totalPorUnidad.toLocaleString('es-GT', { minimumFractionDigits: 2 })}</span>
              </div>
              {qty > 1 && (
                <div className="flex justify-between text-sm font-bold text-green-800 border-t border-green-200 pt-2 mt-1">
                  <span>Total ({qty} {unidadInicial ?? 'unidades'})</span>
                  <span>{sym} {totalGeneral.toLocaleString('es-GT', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <p className="text-xs text-slate-400 mt-1">
                Findr.ai gestiona la compra, logística y entrega. Precio final puede variar según negociación.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                disabled={loading || !cantidad.trim()}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generando…</>
                ) : (
                  <><FileText className="w-4 h-4" /> Generar cotización</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
