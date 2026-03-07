import Link from 'next/link';
import { Search, Plus } from 'lucide-react';
import { getAllSesiones } from '@/lib/store/sesiones';
import SesionesListado from '@/components/dashboard/SesionesListado';
import type { SesionSolicitud } from '@/types/solicitudes';

function getSesiones(): SesionSolicitud[] {
  try {
    return getAllSesiones();
  } catch {
    return [];
  }
}

export default function SolicitudesPage() {
  const sesiones = getSesiones();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Search className="w-6 h-6 text-findrai-primary" />
            Historial de solicitudes
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {sesiones.length > 0
              ? `${sesiones.length} sesión${sesiones.length !== 1 ? 'es' : ''} registrada${sesiones.length !== 1 ? 's' : ''}`
              : 'Todavía no tienes solicitudes guardadas.'}
          </p>
        </div>
        <Link
          href="/dashboard/solicitudes/nueva"
          className="flex items-center gap-2 px-5 py-2.5 bg-findrai-primary hover:bg-findrai-secondary text-white rounded-xl font-semibold transition-colors shadow-sm w-fit"
        >
          <Plus className="w-4 h-4" />
          Nueva solicitud
        </Link>
      </div>

      <SesionesListado sesiones={sesiones} />
    </div>
  );
}
