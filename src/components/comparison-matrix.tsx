"use client";

import { cn, formatCurrency } from "@/lib/utils";
import type { QuoteRow, MaterialItem } from "@/lib/schemas";

interface ComparisonMatrixProps {
  materials: MaterialItem[];
  quotes: QuoteRow[];
  hasPending: boolean;
  onBypass: () => void;
}

function StatusBadge({ status }: { status: "live" | "pending" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none",
        status === "live"
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      )}
    >
      <span className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        status === "live" ? "bg-green-500" : "bg-amber-500 animate-pulse-dot",
      )} />
      {status === "live" ? "En Vivo" : "Pendiente"}
    </span>
  );
}

function getVendorNames(quotes: QuoteRow[]): string[] {
  return [...new Set(quotes.map((q) => q.vendorName))];
}

function getCheapestPerMaterial(
  materialName: string,
  quotes: QuoteRow[],
): string | null {
  const materialQuotes = quotes.filter(
    (q) => q.materialName === materialName && q.status === "live",
  );
  if (materialQuotes.length === 0) return null;

  materialQuotes.sort((a, b) => a.totalWithIVA - b.totalWithIVA);
  return materialQuotes[0].vendorName;
}

export function ComparisonMatrix({
  materials,
  quotes,
  hasPending,
  onBypass,
}: ComparisonMatrixProps) {
  const isEmpty = quotes.length === 0;
  const vendors = getVendorNames(quotes);

  if (isEmpty) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <svg className="mb-3 h-10 w-10 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125" />
        </svg>
        <p className="text-sm text-muted-foreground">
          La matriz de comparación aparecerá aquí
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          El agente buscará precios en EPA, Cemaco y más
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="rounded-tl-xl px-4 py-3 text-left font-semibold">
                  Material
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Cantidad
                </th>
                {vendors.map((name, i) => (
                  <th
                    key={name}
                    className={cn(
                      "px-4 py-3 text-right font-semibold",
                      i === vendors.length - 1 && "rounded-tr-xl",
                    )}
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {materials.map((mat) => {
                const cheapest = getCheapestPerMaterial(mat.name, quotes);
                return (
                  <tr key={mat.name} className="transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{mat.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {mat.quantity} {mat.unit}
                    </td>
                    {vendors.map((vendor) => {
                      const quote = quotes.find(
                        (q) => q.materialName === mat.name && q.vendorName === vendor,
                      );
                      if (!quote) {
                        return (
                          <td key={vendor} className="px-4 py-3 text-right text-muted-foreground">
                            —
                          </td>
                        );
                      }
                      const isCheapest = cheapest === vendor;
                      return (
                        <td
                          key={vendor}
                          className={cn(
                            "px-4 py-3 text-right",
                            isCheapest && "bg-accent/20 font-bold text-accent-foreground",
                          )}
                        >
                          <div className="flex flex-col items-end gap-1">
                            <span>
                              {quote.totalWithIVA > 0
                                ? formatCurrency(quote.totalWithIVA)
                                : "—"}
                            </span>
                            <StatusBadge status={quote.status} />
                            {quote.brand && (
                              <span className="text-[10px] text-muted-foreground">
                                {quote.brand}
                              </span>
                            )}
                            {quote.deliveryTime && (
                              <span className="text-[10px] text-muted-foreground">
                                {quote.deliveryTime}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {hasPending && (
        <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Esperando respuestas de correo...
          </div>
          <button
            type="button"
            onClick={onBypass}
            className="rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-500/20 cursor-pointer dark:text-amber-400"
          >
            Bypass — Continuar con datos actuales
          </button>
        </div>
      )}
    </div>
  );
}
