import { Building2, Phone, Mail, MapPin, User } from 'lucide-react';
import type { Proveedor } from '@/types/cotizaciones';

interface ProveedorCardProps {
  proveedor: Proveedor;
}

export default function ProveedorCard({ proveedor }: ProveedorCardProps) {
  const rows = [
    { icon: <User className="w-4 h-4" />, label: 'Contact', value: proveedor.contacto_nombre },
    { icon: <Mail className="w-4 h-4" />, label: 'Email', value: proveedor.email },
    { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: proveedor.telefono },
    { icon: <MapPin className="w-4 h-4" />, label: 'Address', value: proveedor.direccion },
    { icon: <Building2 className="w-4 h-4" />, label: 'RUC / NIT', value: proveedor.ruc_nit_id },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-findrai-primary" />
        Supplier
      </h3>
      <p className="text-xl font-bold text-findrai-primary mb-4 truncate">
        {proveedor.nombre ?? '—'}
      </p>
      <dl className="space-y-2">
        {rows.map(({ icon, label, value }) =>
          value ? (
            <div key={label} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 text-slate-400 shrink-0">{icon}</span>
              <span className="text-slate-500 shrink-0 w-16">{label}</span>
              <span className="text-slate-700 font-medium break-all">{value}</span>
            </div>
          ) : null
        )}
      </dl>
    </div>
  );
}
