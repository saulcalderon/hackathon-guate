import { FileText, Calendar, Clock, CreditCard, Truck } from 'lucide-react';
import type { DatosCotizacion } from '@/types/cotizaciones';

interface CotizacionCardProps {
  cotizacion: DatosCotizacion;
}

export default function CotizacionCard({ cotizacion }: CotizacionCardProps) {
  const rows = [
    { icon: <FileText className="w-4 h-4" />, label: 'Number', value: cotizacion.numero },
    { icon: <Calendar className="w-4 h-4" />, label: 'Issue date', value: cotizacion.fecha_emision },
    { icon: <Clock className="w-4 h-4" />, label: 'Valid until', value: cotizacion.fecha_validez },
    { icon: <CreditCard className="w-4 h-4" />, label: 'Currency', value: cotizacion.moneda },
    { icon: <CreditCard className="w-4 h-4" />, label: 'Payment', value: cotizacion.condiciones_pago },
    { icon: <Truck className="w-4 h-4" />, label: 'Delivery', value: cotizacion.tiempo_entrega },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-findrai-primary" />
        Quote Details
      </h3>
      <dl className="space-y-2">
        {rows.map(({ icon, label, value }) =>
          value ? (
            <div key={label} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 text-slate-400 shrink-0">{icon}</span>
              <span className="text-slate-500 shrink-0 w-20">{label}</span>
              <span className="text-slate-700 font-medium">{value}</span>
            </div>
          ) : null
        )}
      </dl>
      {cotizacion.notas_generales && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Notes</p>
          <p className="text-sm text-slate-600 leading-relaxed">{cotizacion.notas_generales}</p>
        </div>
      )}
    </div>
  );
}
