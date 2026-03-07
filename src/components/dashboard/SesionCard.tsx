'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, MessageSquare, Users, ExternalLink, Eye } from 'lucide-react';
import type { SesionSolicitud, EstadoSesion } from '@/types/solicitudes';
import { RequestPreviewModal } from './RequestPreviewModal';

interface SesionCardProps {
  sesion: SesionSolicitud;
}

const ESTADO_CONFIG: Record<EstadoSesion, { label: string; className: string }> = {
  activa: { label: 'Activa', className: 'bg-blue-100 text-blue-700' },
  resuelta: { label: 'Resuelta', className: 'bg-green-100 text-green-700' },
  cancelada: { label: 'Cancelada', className: 'bg-slate-100 text-slate-500' },
};

const URGENCIA_LABEL: Record<string, string> = {
  normal: 'Normal',
  urgente: 'Urgente',
  critico: 'Crítico',
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Hace un momento';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `Hace ${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-GT', { day: 'numeric', month: 'short' });
}

export default function SesionCard({ sesion }: SesionCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const estado = ESTADO_CONFIG[sesion.estado];
  const userMessages = sesion.mensajes.filter((m) => m.role === 'user').length;

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-5 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 flex-1">
            {sesion.descripcion}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="p-1.5 text-slate-400 hover:text-findrai-primary rounded-lg hover:bg-slate-100 transition-colors"
              title="Vista previa (como impreso)"
            >
              <Eye className="w-4 h-4" />
            </button>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${estado.className}`}
            >
              {estado.label}
            </span>
          </div>
        </div>

      {/* Categories + urgency chips */}
      <div className="flex flex-wrap gap-1.5">
        {sesion.categorias.slice(0, 3).map((cat) => (
          <span
            key={cat}
            className="px-2 py-0.5 rounded-full bg-findrai-primary/10 text-findrai-primary text-xs font-semibold"
          >
            {cat}
          </span>
        ))}
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
          {URGENCIA_LABEL[sesion.urgencia] ?? sesion.urgencia}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {sesion.resultados.length} proveedor{sesion.resultados.length !== 1 ? 'es' : ''}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5" />
          {userMessages} mensaje{userMessages !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <Clock className="w-3.5 h-3.5" />
          {timeAgo(sesion.created_at)}
        </span>
      </div>

      {/* Footer */}
      <div className="pt-1 border-t border-slate-100">
        {sesion.proveedor_elegido && (
          <p className="text-xs text-green-700 font-semibold mb-2">
            ✓ Elegido: {sesion.proveedor_elegido}
          </p>
        )}
        <Link
          href={`/dashboard/solicitudes/${sesion.id}`}
          className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-findrai-primary bg-findrai-primary/5 hover:bg-findrai-primary/10 rounded-xl transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Abrir sesión
        </Link>
      </div>
    </div>

      {showPreview && (
        <RequestPreviewModal
          variant="solicitud"
          solicitud={sesion}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
