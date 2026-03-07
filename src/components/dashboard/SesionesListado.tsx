'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { SesionSolicitud, EstadoSesion } from '@/types/solicitudes';
import SesionCard from './SesionCard';

interface SesionesListadoProps {
  sesiones: SesionSolicitud[];
}

type Filtro = 'todas' | EstadoSesion;

const FILTROS: { key: Filtro; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'activa', label: 'Activas' },
  { key: 'resuelta', label: 'Resueltas' },
  { key: 'cancelada', label: 'Canceladas' },
];

export default function SesionesListado({ sesiones }: SesionesListadoProps) {
  const [query, setQuery] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todas');

  const filtered = sesiones.filter((s) => {
    const matchFiltro = filtro === 'todas' || s.estado === filtro;
    const q = query.toLowerCase().trim();
    const matchQuery =
      !q ||
      s.descripcion.toLowerCase().includes(q) ||
      s.categorias.some((c) => c.toLowerCase().includes(q));
    return matchFiltro && matchQuery;
  });

  return (
    <div className="space-y-5">
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por descripción o categoría…"
            className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-findrai-primary/30 focus:border-findrai-primary placeholder-slate-400 bg-white transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {FILTROS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                filtro === key
                  ? 'bg-findrai-primary text-white border-findrai-primary'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-slate-400 text-sm">
            {sesiones.length === 0
              ? 'Todavía no tienes sesiones. ¡Crea tu primera solicitud!'
              : 'No se encontraron sesiones con ese filtro.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <SesionCard key={s.id} sesion={s} />
          ))}
        </div>
      )}
    </div>
  );
}
