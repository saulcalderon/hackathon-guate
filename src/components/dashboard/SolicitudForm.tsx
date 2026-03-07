'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import {
  CATEGORIAS,
  type Categoria,
  type ModoBusqueda,
  type Urgencia,
  type PrioridadClave,
  type SolicitudInput,
} from '@/types/solicitudes';

interface SolicitudFormProps {
  onSubmit: (input: SolicitudInput) => void;
  loading: boolean;
}

const URGENCIA_OPTIONS: { value: Urgencia; label: string; badge: string }[] = [
  { value: 'normal', label: 'Normal', badge: '5 días' },
  { value: 'urgente', label: 'Urgente', badge: '48 horas' },
  { value: 'critico', label: 'Crítico', badge: '24 horas' },
];

const PRIORIDADES: { key: PrioridadClave; label: string }[] = [
  { key: 'precio', label: 'Precio' },
  { key: 'entrega', label: 'Tiempo de entrega' },
  { key: 'garantia', label: 'Garantía' },
  { key: 'especificaciones', label: 'Especificaciones técnicas' },
];

export default function SolicitudForm({ onSubmit, loading }: SolicitudFormProps) {
  const [descripcion, setDescripcion] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modo, setModo] = useState<ModoBusqueda>('inmediato');
  const [urgencia, setUrgencia] = useState<Urgencia>('normal');
  const [prioridades, setPrioridades] = useState<PrioridadClave[]>(['precio']);
  const [presupuesto, setPresupuesto] = useState('');

  const toggleCategoria = (cat: Categoria) => {
    setCategorias((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const togglePrioridad = (key: PrioridadClave) => {
    setPrioridades((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim() || categorias.length === 0) return;
    onSubmit({
      descripcion: descripcion.trim(),
      categorias,
      modo,
      urgencia,
      prioridades,
      presupuesto_referencial: presupuesto.trim() || undefined,
    });
  };

  const isValid = descripcion.trim().length > 0 && categorias.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          ¿Qué necesitas cotizar?
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ej: Necesito 200 sacos de cemento Portland tipo 1 para obra en zona 10, entrega en sitio. También 50 quintales de arena de río."
          rows={4}
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-findrai-primary/30 focus:border-findrai-primary resize-none placeholder-slate-400 bg-white transition-colors"
          disabled={loading}
        />
        <p className="text-xs text-slate-400 mt-1">
          Sé específico: incluye cantidades, especificaciones técnicas y lugar de entrega.
        </p>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Categoría(s)
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map((cat) => {
            const active = categorias.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategoria(cat)}
                disabled={loading}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? 'bg-findrai-primary text-white border-findrai-primary shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-findrai-medium hover:text-findrai-primary'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Mode */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Tipo de búsqueda
          </label>
          <div className="flex gap-3">
            {(
              [
                { value: 'inmediato', label: 'Para ya', desc: 'Precios actuales en el mercado' },
                { value: 'cotizacion_formal', label: 'Cotización formal', desc: 'Invitar proveedores a cotizar' },
              ] as { value: ModoBusqueda; label: string; desc: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setModo(opt.value)}
                disabled={loading}
                className={`flex-1 p-3 rounded-xl border text-left transition-all ${
                  modo === opt.value
                    ? 'border-findrai-primary bg-findrai-primary/5 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`text-xs font-bold mb-0.5 ${
                    modo === opt.value ? 'text-findrai-primary' : 'text-slate-700'
                  }`}
                >
                  {opt.label}
                </div>
                <div className="text-xs text-slate-500">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Urgencia
          </label>
          <div className="flex gap-2">
            {URGENCIA_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setUrgencia(opt.value)}
                disabled={loading}
                className={`flex-1 py-2.5 px-2 rounded-xl border text-center transition-all ${
                  urgencia === opt.value
                    ? opt.value === 'critico'
                      ? 'border-red-400 bg-red-50 text-red-700'
                      : opt.value === 'urgente'
                      ? 'border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-findrai-primary bg-findrai-primary/5 text-findrai-primary'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-xs font-bold">{opt.label}</div>
                <div className="text-xs opacity-70">{opt.badge}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Priorities */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          ¿Qué es más importante para ti? (selecciona los que apliquen)
        </label>
        <div className="flex flex-wrap gap-2">
          {PRIORIDADES.map(({ key, label }) => {
            const active = prioridades.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => togglePrioridad(key)}
                disabled={loading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? 'bg-findrai-accent/20 text-findrai-primary border-findrai-accent'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {active && <span className="text-findrai-primary">✓</span>}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget (optional) */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Presupuesto referencial{' '}
          <span className="text-slate-400 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          value={presupuesto}
          onChange={(e) => setPresupuesto(e.target.value)}
          placeholder="Ej: Q 15,000 / $2,000 USD"
          className="w-full max-w-xs px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-findrai-primary/30 focus:border-findrai-primary placeholder-slate-400 bg-white transition-colors"
          disabled={loading}
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!isValid || loading}
          className="flex items-center gap-2 px-6 py-3 bg-findrai-primary hover:bg-findrai-secondary text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Buscando proveedores…
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Buscar proveedores
            </>
          )}
        </button>
        {!isValid && !loading && (
          <p className="text-xs text-slate-400 mt-2">
            Completa la descripción y selecciona al menos una categoría para continuar.
          </p>
        )}
      </div>
    </form>
  );
}
