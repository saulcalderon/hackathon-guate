"use client";

import { formatCurrency } from "@/lib/utils";
import type { OptimizationResult } from "@/lib/schemas";

interface InvoicePanelProps {
  result: OptimizationResult;
  onClose: () => void;
}

export function InvoicePanel({ result, onClose }: InvoicePanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-4 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Facturas Optimizadas
            </h2>
            <p className="text-xs text-muted-foreground">
              Orden dividida entre {result.invoices.length} vendedor(es)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 p-6">
          {result.invoices.map((invoice) => (
            <div
              key={invoice.vendorName}
              className="rounded-xl border border-border overflow-hidden"
            >
              <div className="bg-primary px-5 py-3">
                <h3 className="font-bold text-primary-foreground">
                  {invoice.vendorName}
                </h3>
                {invoice.deliveryEstimate && (
                  <p className="text-xs text-primary-foreground/70">
                    Entrega: {invoice.deliveryEstimate}
                  </p>
                )}
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-2 text-left font-medium text-muted-foreground">
                      Material
                    </th>
                    <th className="px-5 py-2 text-right font-medium text-muted-foreground">
                      Cantidad
                    </th>
                    <th className="px-5 py-2 text-right font-medium text-muted-foreground">
                      Precio Unit.
                    </th>
                    <th className="px-5 py-2 text-right font-medium text-muted-foreground">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoice.lines.map((line) => (
                    <tr key={line.materialName}>
                      <td className="px-5 py-2.5 font-medium">
                        {line.materialName}
                      </td>
                      <td className="px-5 py-2.5 text-right text-muted-foreground">
                        {line.quantity} {line.unit}
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        {formatCurrency(line.unitPrice)}
                      </td>
                      <td className="px-5 py-2.5 text-right font-medium">
                        {formatCurrency(line.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={3} className="px-5 py-2 text-right text-muted-foreground">
                      Subtotal
                    </td>
                    <td className="px-5 py-2 text-right font-medium">
                      {formatCurrency(invoice.subtotal)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-5 py-2 text-right text-muted-foreground">
                      IVA (12%)
                    </td>
                    <td className="px-5 py-2 text-right">
                      {formatCurrency(invoice.iva)}
                    </td>
                  </tr>
                  <tr className="bg-accent/10">
                    <td colSpan={3} className="px-5 py-3 text-right font-bold">
                      Total
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-lg">
                      {formatCurrency(invoice.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}

          <div className="rounded-xl border-2 border-accent bg-accent/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">Gran Total Optimizado</p>
                {result.savingsVsWorst > 0 && (
                  <p className="mt-1 text-xs text-primary font-semibold">
                    Ahorro estimado vs. peor opción: {formatCurrency(result.savingsVsWorst)}
                  </p>
                )}
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(result.grandTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
