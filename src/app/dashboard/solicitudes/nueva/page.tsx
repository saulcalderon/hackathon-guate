'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import SolicitudForm from '@/components/dashboard/SolicitudForm';
import { getMockResultados } from '@/lib/mock/resultados';
import type { SolicitudInput } from '@/types/solicitudes';

export default function NuevaSolicitudPage() {
  const router = useRouter();
  const [searching, setSearching] = useState(false);

  const handleSubmit = async (input: SolicitudInput) => {
    setSearching(true);

    await new Promise((r) => setTimeout(r, 800));

    const resultados = getMockResultados(input.categorias);

    try {
      const res = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcion: input.descripcion,
          categorias: input.categorias,
          modo: input.modo,
          urgencia: input.urgencia,
          prioridades: input.prioridades,
          presupuesto: input.presupuesto_referencial ?? null,
          resultados,
        }),
      });

      const data = (await res.json()) as { id: string } | { error: string };

      if (!res.ok || 'error' in data) {
        console.error('Error creating session:', 'error' in data ? data.error : 'Unknown');
        setSearching(false);
        return;
      }

      router.push(`/dashboard/solicitudes/${data.id}`);
    } catch (err) {
      console.error('Network error:', err);
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <div className="flex flex-col gap-1 mt-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Search className="w-6 h-6 text-findrai-primary" />
          Nueva solicitud
        </h1>
        <p className="text-slate-500 text-sm">
          Describe lo que necesitas y la IA busca y compara proveedores por ti.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <SolicitudForm onSubmit={handleSubmit} loading={searching} />
      </div>
    </div>
  );
}
