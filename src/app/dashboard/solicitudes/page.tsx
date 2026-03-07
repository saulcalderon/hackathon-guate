'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import SolicitudForm from '@/components/dashboard/SolicitudForm';
import ResultadosChat from '@/components/dashboard/ResultadosChat';
import { getMockResultados } from '@/lib/mock/resultados';
import type { SolicitudInput, ResultadoProveedor } from '@/types/solicitudes';

type PageState =
  | { status: 'form' }
  | { status: 'results'; resultados: ResultadoProveedor[]; contexto: string; solicitud: SolicitudInput };

export default function SolicitudesPage() {
  const [state, setState] = useState<PageState>({ status: 'form' });
  const [searching, setSearching] = useState(false);

  const handleSubmit = async (input: SolicitudInput) => {
    setSearching(true);

    // Simulate a short search delay to feel natural
    await new Promise((r) => setTimeout(r, 800));

    const resultados = getMockResultados(input.categorias);

    // Build a rich context string for Gemini — includes both the request and results
    const contexto = JSON.stringify(
      {
        solicitud: {
          descripcion: input.descripcion,
          categorias: input.categorias,
          modo: input.modo,
          urgencia: input.urgencia,
          prioridades: input.prioridades,
          presupuesto_referencial: input.presupuesto_referencial ?? null,
        },
        resultados,
      },
      null,
      2
    );

    setSearching(false);
    setState({ status: 'results', resultados, contexto, solicitud: input });
  };

  const handleReset = () => {
    setState({ status: 'form' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Search className="w-6 h-6 text-findrai-primary" />
            Solicitudes de cotización
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Describe lo que necesitas y la IA busca y compara proveedores por ti.
          </p>
        </div>
      </div>

      {state.status === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <SolicitudForm onSubmit={handleSubmit} loading={searching} />
        </div>
      )}

      {state.status === 'results' && (
        <>
          {/* Summary of the original request */}
          <div className="bg-findrai-primary/5 border border-findrai-primary/20 rounded-2xl px-6 py-4">
            <p className="text-xs font-semibold text-findrai-primary uppercase tracking-wider mb-1">
              Tu solicitud
            </p>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              {state.solicitud.descripcion}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {state.solicitud.categorias.map((c) => (
                <span
                  key={c}
                  className="px-2 py-0.5 rounded-full bg-findrai-primary/10 text-findrai-primary text-xs font-semibold"
                >
                  {c}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold capitalize">
                {state.solicitud.urgencia === 'normal'
                  ? 'Normal (5 días)'
                  : state.solicitud.urgencia === 'urgente'
                  ? 'Urgente (48h)'
                  : 'Crítico (24h)'}
              </span>
            </div>
          </div>

          <ResultadosChat
            resultados={state.resultados}
            contexto={state.contexto}
            onReset={handleReset}
          />
        </>
      )}
    </div>
  );
}
