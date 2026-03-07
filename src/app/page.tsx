"use client";

import { useState, useCallback } from "react";

interface FilteredProduct {
  title: string;
  price: number;
  url: string;
  brand?: string;
  confidence_score: number;
  vendor: string;
  matchScore: number;
  matchReason: string;
}

interface VendorResult {
  vendor: string;
  products: FilteredProduct[];
  searchUrl: string;
  error?: string;
}

interface ExtractedMeta {
  searchTerm: string;
  quantity: number;
  unit: string;
  specs: string;
}

export default function Dashboard() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [results, setResults] = useState<VendorResult[]>([]);
  const [extracted, setExtracted] = useState<ExtractedMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    const trimmed = description.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setExtracted(null);
    setSteps([]);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: trimmed }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? `Request failed: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line) as {
              type: string;
              message?: string;
              searchTerm?: string;
              quantity?: number;
              unit?: string;
              specs?: string;
              results?: VendorResult[];
              error?: string;
            };

            if (event.type === "step" && event.message) {
              setSteps((prev) => [...prev, event.message!]);
            }

            if (event.type === "complete") {
              setResults((event.results ?? []) as VendorResult[]);
              setExtracted({
                searchTerm: event.searchTerm ?? "",
                quantity: event.quantity ?? 1,
                unit: event.unit ?? "unidad",
                specs: event.specs ?? "",
              });
            }

            if (event.type === "error") {
              setError(event.message ?? event.error ?? "Error desconocido");
            }
          } catch {
            // incomplete JSON, skip
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [description]);

  const allProducts = results.flatMap((r) =>
    r.products.map((p) => ({ ...p, vendor: r.vendor })),
  );
  const qty = extracted?.quantity ?? 1;
  const bestPrice =
    allProducts.length > 0
      ? Math.min(...allProducts.map((p) => p.price * qty))
      : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            F
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              Findr.ai
            </h1>
            <p className="text-xs text-muted-foreground">
              Comparador de precios — Guatemala
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: cemento 4060 psi, varilla de cobre, pintura vinilica, tubo pvc"
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="submit"
            disabled={loading || !description.trim()}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>
      </div>

      {extracted && results.length > 0 && (
        <div className="mx-auto w-full max-w-[1200px] px-6 pb-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Buscado: {extracted.searchTerm}
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {extracted.quantity} {extracted.unit}
            </span>
            {extracted.specs && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {extracted.specs}
              </span>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mx-auto w-full max-w-[1200px] px-6 pb-4">
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        </div>
      )}

      {loading && (
        <div className="mx-auto w-full max-w-[1200px] px-6 py-6">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                Procesando búsqueda...
              </p>
              <ul className="mt-3 space-y-1.5">
                {steps.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="mx-auto w-full max-w-[1200px] flex-1 px-6 pb-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {results.map((vr) => (
              <VendorColumn
                key={vr.vendor}
                result={vr}
                bestPrice={bestPrice}
                quantity={qty}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && results.length === 0 && !error && !extracted && (
        <div className="mx-auto w-full max-w-[1200px] px-6 py-20 text-center">
          <p className="text-sm text-muted-foreground">
            Ingresa una descripción de producto para comparar precios entre EPA y
            Cemaco.
          </p>
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
  const { vendor, products, searchUrl, error } = result;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">{vendor}</h2>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-muted-foreground underline hover:text-foreground"
        >
          Ver en sitio
        </a>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {products.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">
          No se encontraron productos que coincidan.
        </p>
      )}

      <div className="space-y-3">
        {[...products]
          .sort((a, b) => a.price * quantity - b.price * quantity)
          .map((product, i) => {
          const total = product.price * quantity;
          const isBest =
            bestPrice !== null && total === bestPrice;
          return (
            <a
              key={i}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
              title={product.matchReason}
            >
              {isBest && (
                <span className="absolute -top-2 right-3 rounded-full bg-green-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Mejor Precio
                </span>
              )}
              <p className="text-sm font-medium text-foreground leading-snug pr-16">
                {product.title}
              </p>
              {product.brand && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {product.brand}
                </p>
              )}
              <p className="mt-2 text-xl font-bold text-foreground">
                Q{product.price.toFixed(2)}
                {quantity > 1 && (
                  <span className="ml-2 text-base font-normal text-muted-foreground">
                    × {quantity} = Q{total.toFixed(2)}
                  </span>
                )}
              </p>
              <span
                className="mt-1 inline-block text-[10px] text-muted-foreground"
                title={product.matchReason}
              >
                Coincidencia: {Math.round(product.matchScore * 100)}%
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
