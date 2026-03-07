'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { ResultadoProveedor } from '@/types/solicitudes';
import type { FilteredProduct } from '@/lib/filter-results';
import type { MaterialScrapeResult } from '@/app/api/scrape/route';

interface VendorResult {
  vendor: string;
  products: FilteredProduct[];
  searchUrl: string;
  error?: string;
}

function mapToResultadoProveedor(
  vendor: string,
  product: FilteredProduct,
  index: number,
  materialName: string,
  quantity: number,
  unit: string
): ResultadoProveedor {
  return {
    id: `scrape-${materialName.replace(/\s+/g, '-')}-${vendor.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    nombre: vendor,
    descripcion_producto: product.title + (product.brand ? ` — ${product.brand}` : ''),
    precio: product.price,
    moneda: 'GTQ',
    tiempo_entrega: 'Consultar en tienda',
    condiciones_pago: 'Contado',
    garantia: null,
    pros: product.matchReason ? [product.matchReason] : [],
    contras: [],
    url_referencia: product.url,
    disponibilidad: 'disponible',
    calificacion: Math.round(product.matchScore * 5 * 10) / 10,
    material_descripcion: materialName,
    cantidad: quantity,
    unidad: unit,
  };
}

function BuscandoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<string[]>([]);
  const [materials, setMaterials] = useState<MaterialScrapeResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creatingSession, setCreatingSession] = useState(false);

  const runScrape = useCallback(async (signal: AbortSignal) => {
    if (!q?.trim()) return;

    setLoading(true);
    setError(null);
    setMaterials([]);
    setSteps([]);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: q.trim() }),
        signal,
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? `Request failed: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (signal.aborted) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (signal.aborted) break;
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line) as {
              type: string;
              message?: string;
              materials?: MaterialScrapeResult[];
              error?: string;
            };

            if (event.type === 'step' && event.message) {
              setSteps((prev) => [...prev, event.message!]);
            }

            if (event.type === 'complete' && event.materials) {
              setMaterials(event.materials);
            }

            if (event.type === 'error') {
              setError(event.message ?? event.error ?? 'Error desconocido');
            }
          } catch {
            // incomplete JSON, skip
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Algo salió mal');
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    if (!q?.trim()) return;
    const controller = new AbortController();
    runScrape(controller.signal);
    return () => controller.abort();
  }, [q, runScrape]);

  const hasResults = materials.some((m) => m.results.some((r) => r.products.length > 0));

  const handleContinuar = useCallback(async () => {
    if (!hasResults || materials.length === 0) return;

    const allResultados: ResultadoProveedor[] = [];
    for (const mat of materials) {
      for (const vr of mat.results) {
        vr.products.forEach((p, i) => {
          allResultados.push(
            mapToResultadoProveedor(vr.vendor, p, i, mat.materialName, mat.quantity, mat.unit)
          );
        });
      }
    }

    const isSingleMaterial = materials.length === 1;
    const first = materials[0];

    setCreatingSession(true);
    try {
      const res = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcion: q?.trim() ?? '',
          categorias: ['Construcción y ferretería'],
          modo: 'inmediato',
          urgencia: 'normal',
          prioridades: ['precio'],
          presupuesto: null,
          cantidad: isSingleMaterial ? first.quantity : null,
          unidad: isSingleMaterial ? first.unit : null,
          resultados: allResultados,
        }),
      });

      const data = (await res.json()) as { id: string } | { error: string };

      if (!res.ok || 'error' in data) {
        setError('error' in data ? data.error : 'Error al crear sesión');
        setCreatingSession(false);
        return;
      }

      router.push(`/dashboard/solicitudes/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de red');
      setCreatingSession(false);
    }
  }, [materials, hasResults, q, router]);

  if (!q?.trim()) {
    router.replace('/dashboard/solicitudes/nueva');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-3 mt-2 mb-6">
        <Link
          href="/dashboard/solicitudes/nueva"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Nueva solicitud
        </Link>
        <span className="text-slate-300">/</span>
        <p className="text-sm font-semibold text-slate-700 truncate max-w-md">
          Buscando: {q}
        </p>
      </div>

      {materials.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {materials.map((m) => (
            <span
              key={m.materialName}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {m.materialName}: {m.quantity} {m.unit}
            </span>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-findrai-primary border-t-transparent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">Procesando búsqueda...</p>
              <ul className="mt-3 space-y-1.5">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {!loading && hasResults && (
        <div className="space-y-8">
          {materials.map((mat) => {
            const allProducts = mat.results.flatMap((r) =>
              r.products.map((p) => ({ ...p, vendor: r.vendor }))
            );
            const bestPrice =
              allProducts.length > 0
                ? Math.min(...allProducts.map((p) => p.price * mat.quantity))
                : null;

            return (
              <div key={mat.materialName}>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {mat.materialName}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  {mat.quantity} {mat.unit}
                  {mat.specs && ` • ${mat.specs}`}
                </p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {mat.results.map((vr) => (
                    <VendorColumn
                      key={vr.vendor}
                      result={vr}
                      bestPrice={bestPrice}
                      quantity={mat.quantity}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex justify-center pt-4">
            <button
              onClick={handleContinuar}
              disabled={creatingSession}
              className="px-6 py-3 bg-findrai-primary hover:bg-findrai-secondary text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingSession ? 'Creando sesión…' : 'Continuar al chat con resultados'}
            </button>
          </div>
        </div>
      )}

      {!loading && !hasResults && !error && materials.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-sm text-slate-500">Iniciando búsqueda…</p>
        </div>
      )}

      {!loading && !hasResults && materials.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-sm text-slate-500">No se encontraron productos para los materiales buscados.</p>
        </div>
      )}
    </div>
  );
}

function VendorColumn({
  result,
  bestPrice,
  quantity,
}: {
  result: VendorResult;
  bestPrice: number | null;
  quantity: number;
}) {
  const { vendor, products, error } = result;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900">{vendor}</h2>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {products.length === 0 && !error && (
        <p className="text-sm text-slate-500">No se encontraron productos que coincidan.</p>
      )}

      <div className="space-y-3">
        {[...products]
          .sort((a, b) => a.price * quantity - b.price * quantity)
          .map((product, i) => {
            const total = product.price * quantity;
            const isBest = bestPrice !== null && total === bestPrice;
            return (
              <div
                key={i}
                className="relative block rounded-xl border border-slate-200 p-4"
                title={product.matchReason}
              >
                {isBest && (
                  <span className="absolute -top-2 right-3 rounded-full bg-findrai-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Mejor Precio
                  </span>
                )}
                <p className="text-sm font-medium text-slate-900 leading-snug pr-16">
                  {product.title}
                </p>
                {product.brand && (
                  <p className="mt-1 text-xs text-slate-500">{product.brand}</p>
                )}
                <p className="mt-2 text-xl font-bold text-slate-900">
                  Q{product.price.toFixed(2)}
                  {quantity > 1 && (
                    <span className="ml-2 text-base font-normal text-slate-500">
                      × {quantity} = Q{total.toFixed(2)}
                    </span>
                  )}
                </p>
                <span
                  className="mt-1 inline-block text-[10px] text-slate-500"
                  title={product.matchReason}
                >
                  Coincidencia: {Math.round(product.matchScore * 100)}%
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default function BuscandoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-findrai-primary border-t-transparent" />
        </div>
      }
    >
      <BuscandoContent />
    </Suspense>
  );
}
