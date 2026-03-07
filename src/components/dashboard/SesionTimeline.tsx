'use client';

import { useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Users,
  Brain,
  MessageSquare,
  Award,
  Circle,
  CheckCheck,
  XCircle,
} from 'lucide-react';
import type { SesionSolicitud } from '@/types/solicitudes';

interface SesionTimelineProps {
  sesion: SesionSolicitud;
  onMarcarResuelta: () => void;
  onNuevaSimilar: () => void;
  onCancelar: () => void;
  chatRef: React.RefObject<HTMLDivElement>;
}

type Etapa = {
  key: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  messageIndex?: number;
};

function buildEtapas(sesion: SesionSolicitud): Etapa[] {
  const tieneProveedores = sesion.resultados.length > 0;
  const tieneAnalisis = sesion.mensajes.some((m) => m.role === 'assistant');
  const mensajesUsuario = sesion.mensajes
    .map((m, i) => ({ ...m, index: i }))
    .filter((m) => m.role === 'user');
  const tieneDecision = sesion.estado === 'resuelta';

  const etapas: Etapa[] = [
    {
      key: 'creada',
      label: 'Solicitud creada',
      icon: <CheckCircle2 className="w-4 h-4" />,
      active: true,
    },
    {
      key: 'proveedores',
      label: `${sesion.resultados.length} proveedor${sesion.resultados.length !== 1 ? 'es' : ''} encontrado${sesion.resultados.length !== 1 ? 's' : ''}`,
      icon: <Users className="w-4 h-4" />,
      active: tieneProveedores,
    },
    {
      key: 'analisis',
      label: 'Análisis IA',
      icon: <Brain className="w-4 h-4" />,
      active: tieneAnalisis,
      messageIndex: sesion.mensajes.findIndex((m) => m.role === 'assistant'),
    },
  ];

  mensajesUsuario.forEach((m, i) => {
    if (i === 0) return; // skip the automated first user message
    etapas.push({
      key: `msg-${m.index}`,
      label: m.content.length > 40 ? m.content.slice(0, 40) + '…' : m.content,
      icon: <MessageSquare className="w-4 h-4" />,
      active: true,
      messageIndex: m.index,
    });
  });

  if (sesion.proveedor_elegido) {
    etapas.push({
      key: 'elegido',
      label: `Elegido: ${sesion.proveedor_elegido}`,
      icon: <Award className="w-4 h-4" />,
      active: true,
    });
  } else if (tieneDecision) {
    etapas.push({
      key: 'decision',
      label: 'Decisión tomada',
      icon: <Award className="w-4 h-4" />,
      active: true,
    });
  }

  return etapas;
}

export default function SesionTimeline({
  sesion,
  onMarcarResuelta,
  onNuevaSimilar,
  onCancelar,
  chatRef,
}: SesionTimelineProps) {
  const etapas = buildEtapas(sesion);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, etapas.length);
  }, [etapas.length]);

  const handleClick = (etapa: Etapa) => {
    if (etapa.messageIndex == null || !chatRef.current) return;
    const msgEls = chatRef.current.querySelectorAll<HTMLElement>('[data-msg-index]');
    const target = Array.from(msgEls).find(
      (el) => el.dataset.msgIndex === String(etapa.messageIndex)
    );
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const canResolve = sesion.estado === 'activa';
  const canCancel = sesion.estado === 'activa';

  return (
    <div className="flex flex-col h-full">
      {/* Timeline header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Timeline</h3>
      </div>

      {/* Etapas */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <ol className="relative border-l border-slate-200 space-y-6 ml-2">
          {etapas.map((etapa, idx) => (
            <li key={etapa.key} className="ml-4">
              <button
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                onClick={() => handleClick(etapa)}
                disabled={etapa.messageIndex == null}
                className={`flex items-start gap-3 text-left w-full group ${
                  etapa.messageIndex != null ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <span
                  className={`absolute -left-[18px] flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                    etapa.active
                      ? 'bg-findrai-primary border-findrai-primary text-white'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  } ${etapa.messageIndex != null ? 'group-hover:bg-findrai-secondary group-hover:border-findrai-secondary' : ''}`}
                >
                  {etapa.active ? etapa.icon : <Circle className="w-4 h-4" />}
                </span>
                <span
                  className={`text-xs leading-relaxed pt-1.5 ${
                    etapa.active ? 'text-slate-700 font-medium' : 'text-slate-400'
                  } ${etapa.messageIndex != null ? 'group-hover:text-findrai-primary' : ''}`}
                >
                  {etapa.label}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="px-4 py-4 border-t border-slate-100 space-y-2">
        {canResolve && (
          <button
            onClick={onMarcarResuelta}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar resuelta
          </button>
        )}
        <button
          onClick={onNuevaSimilar}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-findrai-primary bg-findrai-primary/5 hover:bg-findrai-primary/10 border border-findrai-primary/20 rounded-xl transition-colors"
        >
          Nueva solicitud similar
        </button>
        {canCancel && (
          <button
            onClick={onCancelar}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Cancelar solicitud
          </button>
        )}
      </div>
    </div>
  );
}
