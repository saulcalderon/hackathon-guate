"use client";

import { useState } from "react";
import { X, FileText, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { OptimizationResult } from "@/lib/schemas";
import { COMISION_FINDRAI_PCT } from "@/lib/constants/planes";

interface InvoicePanelProps {
  result: OptimizationResult;
  onClose: () => void;
  showCommission?: boolean;
  sesionId?: string;
  onConfirmOrders?: () => void | Promise<void>;
  confirmLoading?: boolean;
}

export function InvoicePanel({
  result,
  onClose,
  showCommission = false,
  sesionId,
  onConfirmOrders,
  confirmLoading = false,
}: InvoicePanelProps) {
  const [done, setDone] = useState(false);

  const primaryMoneda = result.invoices[0]?.moneda ?? "GTQ";

  const handleConfirmOrders = async () => {
    if (!onConfirmOrders) return;
    try {
      await onConfirmOrders();
      setDone(true);
    } catch {
      // Error handled by parent
    }
  };

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">
                ¡Órdenes creadas!
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Se crearon {result.invoices.reduce((s, i) => s + i.lines.length, 0)} orden(es). Nuestro equipo se pondrá en contacto para confirmar los detalles.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-findrai-primary" />
            <div>
              <h2 className="font-bold text-slate-900">Cotización optimizada</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Orden dividida entre {result.invoices.length} proveedor(es)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {result.savingsVsWorst > 0 && (
            <div className="rounded-xl border border-findrai-primary/30 bg-findrai-primary/5 px-5 py-4">
              <p className="text-xs font-semibold text-findrai-primary uppercase tracking-wider">
                Ahorro total
              </p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {formatCurrency(result.savingsVsWorst, primaryMoneda)} vs. peor opción
              </p>
            </div>
          )}

          {result.invoices.map((invoice) => (
            <div
              key={invoice.vendorName}
              className="rounded-xl border border-slate-200 overflow-hidden"
            >
              <div className="bg-findrai-primary/10 border-b border-slate-100 px-5 py-3">
                <h3 className="font-bold text-slate-900">{invoice.vendorName}</h3>
                {invoice.deliveryEstimate && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    Entrega: {invoice.deliveryEstimate}
                  </p>
                )}
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-5 py-2 text-left font-semibold text-slate-700">
                      Material
                    </th>
                    <th className="px-5 py-2 text-right font-semibold text-slate-700">
                      Cantidad
                    </th>
                    <th className="px-5 py-2 text-right font-semibold text-slate-700">
                      Precio unit.
                    </th>
                    <th className="px-5 py-2 text-right font-semibold text-slate-700">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.lines.map((line) => (
                    <tr key={line.materialName}>
                      <td className="px-5 py-2.5 font-medium text-slate-900">
                        {line.materialName}
                      </td>
                      <td className="px-5 py-2.5 text-right text-slate-600">
                        {line.quantity} {line.unit}
                      </td>
                      <td className="px-5 py-2.5 text-right text-slate-700">
                        {formatCurrency(line.unitPrice, invoice.moneda ?? "GTQ")}
                      </td>
                      <td className="px-5 py-2.5 text-right font-medium text-slate-900">
                        {formatCurrency(line.subtotal, invoice.moneda ?? "GTQ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200">
                    <td colSpan={3} className="px-5 py-2 text-right text-slate-600">
                      Subtotal
                    </td>
                    <td className="px-5 py-2 text-right font-medium text-slate-900">
                      {formatCurrency(invoice.subtotal, invoice.moneda ?? "GTQ")}
                    </td>
                  </tr>
                  {showCommission && invoice.commission != null ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-2 text-right text-slate-600">
                        Gestión Findr.ai ({COMISION_FINDRAI_PCT}%)
                      </td>
                      <td className="px-5 py-2 text-right text-slate-700">
                        {formatCurrency(invoice.commission, invoice.moneda ?? "GTQ")}
                      </td>
                    </tr>
                  ) : (
                    invoice.iva > 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-2 text-right text-slate-600">
                          IVA (12%)
                        </td>
                        <td className="px-5 py-2 text-right text-slate-700">
                          {formatCurrency(invoice.iva, invoice.moneda ?? "GTQ")}
                        </td>
                      </tr>
                    )
                  )}
                  <tr className="bg-slate-50">
                    <td colSpan={3} className="px-5 py-3 text-right font-bold text-slate-900">
                      Total
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-lg text-findrai-primary">
                      {formatCurrency(invoice.total, invoice.moneda ?? "GTQ")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Gran total</p>
                {result.savingsVsWorst > 0 && (
                  <p className="mt-1 text-xs text-slate-600">
                    Ahorro vs. peor opción: {formatCurrency(result.savingsVsWorst, primaryMoneda)}
                  </p>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(result.grandTotal, primaryMoneda)}
              </p>
            </div>
          </div>

          {sesionId && onConfirmOrders && (
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={confirmLoading}
                className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmOrders}
                disabled={confirmLoading}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-findrai-primary hover:bg-findrai-secondary rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
              >
                {confirmLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creando órdenes…
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    {result.invoices.reduce((s, i) => s + i.lines.length, 0) > 1
                      ? `Confirmar y crear ${result.invoices.reduce((s, i) => s + i.lines.length, 0)} órdenes`
                      : "Confirmar y crear orden"}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
