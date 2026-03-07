'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import SesionTimeline from '@/components/dashboard/SesionTimeline';
import ResultadosChat from '@/components/dashboard/ResultadosChatV2';
import type { SesionSolicitud } from '@/types/solicitudes';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SesionPage({ params }: PageProps) {
  const router = useRouter();
  const [sesion, setSesion] = useState<SesionSolicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setSessionId(id);
      fetch(`/api/solicitudes/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Session not found');
          return res.json() as Promise<SesionSolicitud>;
        })
        .then((data) => {
          setSesion(data);
          setLoading(false);
        })
        .catch((err: Error) => {
          setError(err.message);
          setLoading(false);
        });
    });
  }, [params]);

  const handleMarcarResuelta = useCallback(async () => {
    if (!sessionId) return;
    await fetch(`/api/solicitudes/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'resuelta' }),
    });
    setSesion((prev) => (prev ? { ...prev, estado: 'resuelta' } : prev));
  }, [sessionId]);

  const handleCancelar = useCallback(async () => {
    if (!sessionId) return;
    await fetch(`/api/solicitudes/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'cancelada' }),
    });
    setSesion((prev) => (prev ? { ...prev, estado: 'cancelada' } : prev));
  }, [sessionId]);

  const handleNuevaSimilar = useCallback(() => {
    router.push('/dashboard/solicitudes/nueva');
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-findrai-primary" />
      </div>
    );
  }

  if (error || !sesion || !sessionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-slate-500 text-sm">{error ?? 'Sesión no encontrada.'}</p>
        <Link
          href="/dashboard/solicitudes"
          className="text-sm font-semibold text-findrai-primary hover:underline"
        >
          Volver al historial
        </Link>
      </div>
    );
  }

  const contexto = JSON.stringify(
    {
      solicitud: {
        descripcion: sesion.descripcion,
        categorias: sesion.categorias,
        modo: sesion.modo,
        urgencia: sesion.urgencia,
        prioridades: sesion.prioridades,
        presupuesto_referencial: sesion.presupuesto ?? undefined,
      },
      resultados: sesion.resultados,
    },
    null,
    2
  );

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mt-2 mb-6">
        <Link
          href="/dashboard/solicitudes"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Historial
        </Link>
        <span className="text-slate-300">/</span>
        <p className="text-sm font-semibold text-slate-700 truncate max-w-md">
          {sesion.descripcion}
        </p>
      </div>

      {/* Two-column layout: timeline 30% + results 70% */}
      <div className="grid lg:grid-cols-[minmax(220px,30%)_1fr] gap-6 items-start">
        {/* Timeline (sticky on desktop) */}
        <div className="lg:sticky lg:top-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
          <SesionTimeline
            sesion={sesion}
            onMarcarResuelta={handleMarcarResuelta}
            onNuevaSimilar={handleNuevaSimilar}
            onCancelar={handleCancelar}
            chatRef={chatRef as React.RefObject<HTMLDivElement>}
          />
        </div>

        {/* Results + Chat */}
        <div ref={chatRef}>
          <ResultadosChat
            resultados={sesion.resultados}
            contexto={contexto}
            onReset={handleNuevaSimilar}
            sessionId={sessionId}
            initialMessages={sesion.mensajes}
            sesionEstado={sesion.estado}
          />
        </div>
      </div>
    </div>
  );
}
