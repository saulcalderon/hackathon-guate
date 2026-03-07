import type { LineaCotizacion, TotalesCotizacion } from '@/types/cotizaciones';

interface LineasTableProps {
  lineas: LineaCotizacion[];
  totales: TotalesCotizacion;
  moneda?: string | null;
}

function fmt(value: number | null, moneda?: string | null) {
  if (value === null) return '—';
  const currency = moneda ?? '';
  return `${currency} ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`.trim();
}

export default function LineasTable({ lineas, totales, moneda }: LineasTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Line Items</h3>
        <p className="text-sm text-slate-500 mt-0.5">{lineas.length} item{lineas.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4">#</th>
              <th className="p-4">Code</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Qty</th>
              <th className="p-4">Unit</th>
              <th className="p-4 text-right">Unit Price</th>
              <th className="p-4 text-right">Disc. %</th>
              <th className="p-4 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lineas.map((linea) => (
              <tr key={linea.numero_linea} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-slate-400">{linea.numero_linea}</td>
                <td className="p-4 text-slate-500 font-mono text-xs">{linea.codigo ?? '—'}</td>
                <td className="p-4 text-slate-800 font-medium max-w-xs">
                  <div>{linea.descripcion}</div>
                  {linea.especificaciones && (
                    <div className="text-xs text-slate-400 mt-0.5 font-normal">{linea.especificaciones}</div>
                  )}
                </td>
                <td className="p-4 text-right text-slate-700">{linea.cantidad ?? '—'}</td>
                <td className="p-4 text-slate-500">{linea.unidad ?? '—'}</td>
                <td className="p-4 text-right text-slate-700">{fmt(linea.precio_unitario, moneda)}</td>
                <td className="p-4 text-right text-slate-500">
                  {linea.descuento_pct !== null ? `${linea.descuento_pct}%` : '—'}
                </td>
                <td className="p-4 text-right font-bold text-slate-900">{fmt(linea.subtotal, moneda)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals footer */}
      <div className="p-6 border-t border-slate-100 flex flex-col items-end gap-1.5">
        {totales.subtotal !== null && (
          <div className="flex gap-4 text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium">{fmt(totales.subtotal, moneda)}</span>
          </div>
        )}
        {totales.descuento !== null && (
          <div className="flex gap-4 text-sm text-slate-600">
            <span>Discount</span>
            <span className="font-medium text-amber-600">−{fmt(totales.descuento, moneda)}</span>
          </div>
        )}
        {totales.impuestos_monto !== null && (
          <div className="flex gap-4 text-sm text-slate-600">
            <span>Tax {totales.impuestos_pct !== null ? `(${totales.impuestos_pct}%)` : ''}</span>
            <span className="font-medium">{fmt(totales.impuestos_monto, moneda)}</span>
          </div>
        )}
        {totales.total !== null && (
          <div className="flex gap-4 text-lg font-bold text-slate-900 pt-2 border-t border-slate-200 mt-1">
            <span>Total</span>
            <span className="text-findrai-primary">{fmt(totales.total, moneda)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
