"use client";

import { cn, formatCurrency } from "@/lib/utils";
import type { ComparisonItem, ComparisonSummary } from "@/lib/schemas";

interface ComparisonTableProps {
  items: Partial<ComparisonItem>[];
  summary: Partial<ComparisonSummary> | undefined;
}

function IvaBadge({ included }: { included: boolean }) {
  return (
    <span
      className={cn(
        "ml-1.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
        included
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      )}
    >
      {included ? "IVA inc." : "+IVA"}
    </span>
  );
}

function getProviderNames(items: Partial<ComparisonItem>[]): string[] {
  const names = new Set<string>();
  for (const item of items) {
    if (item.providers) {
      for (const p of item.providers) {
        if (p.name) names.add(p.name);
      }
    }
  }
  return Array.from(names);
}

export function ComparisonTable({ items, summary }: ComparisonTableProps) {
  const isEmpty = items.length === 0;
  const providerNames = getProviderNames(items);

  if (isEmpty) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <svg
          className="mb-3 h-10 w-10 text-muted-foreground/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125"
          />
        </svg>
        <p className="text-sm text-muted-foreground">
          La matriz de comparación aparecerá aquí
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
                  Producto
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Cantidad
                </th>
                {providerNames.map((name, i) => (
                  <th
                    key={name}
                    className={cn(
                      "px-4 py-3 text-right font-semibold",
                      i === providerNames.length - 1 && "rounded-tr-xl",
                    )}
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item, idx) => (
                <tr key={idx} className="transition-colors hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">
                    {item.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.normalizedQty != null
                      ? `${item.normalizedQty} ${item.normalizedUnit ?? item.originalUnit ?? ""}`
                      : "—"}
                  </td>
                  {providerNames.map((pName) => {
                    const provider = item.providers?.find(
                      (p) => p.name === pName,
                    );
                    if (!provider) {
                      return (
                        <td key={pName} className="px-4 py-3 text-right text-muted-foreground">
                          —
                        </td>
                      );
                    }
                    return (
                      <td
                        key={pName}
                        className={cn(
                          "px-4 py-3 text-right",
                          provider.isCheapest &&
                            "bg-accent/20 font-bold text-accent-foreground",
                        )}
                      >
                        {provider.totalWithIVA != null
                          ? formatCurrency(provider.totalWithIVA)
                          : "—"}
                        {provider.ivaIncluded != null && (
                          <IvaBadge included={provider.ivaIncluded} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {summary && summary.winnerName && (
        <div className="animate-fade-in rounded-xl border-2 border-accent bg-accent/10 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0012.75 7.5h-1.5A3.375 3.375 0 007.875 10.5v4.5m8.625 3.75a3 3 0 01-3 3h-3a3 3 0 01-3-3"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Ganador: {summary.winnerName}
              </h3>
              {summary.reasoning && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {summary.reasoning}
                </p>
              )}
              {summary.estimatedSavings != null && summary.estimatedSavings > 0 && (
                <p className="mt-2 text-sm font-semibold text-primary">
                  Ahorro estimado: {formatCurrency(summary.estimatedSavings)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
