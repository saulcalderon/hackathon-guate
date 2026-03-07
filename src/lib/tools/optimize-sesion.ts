import type { SesionSolicitud } from '@/types/solicitudes';
import type { OptimizationResult, VendorInvoice, InvoiceLine } from '@/lib/schemas';
import { COMISION_FINDRAI_PCT } from '@/lib/constants/planes';

type QuoteLike = {
  vendorName: string;
  vendorDisplay: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  moneda: string;
  resultado: SesionSolicitud['resultados'][number];
};

/**
 * Optimizes a session's resultados into split invoices.
 * Phase 1 (single-item): One material, multiple vendor quotes.
 * Phase 2 (multi-item): Best vendor per material, grouped by vendor for invoices.
 */
export function optimizeSesion(sesion: SesionSolicitud): OptimizationResult {
  const cantidad = sesion.cantidad ?? 1;
  const unidad = sesion.unidad ?? 'unidad';
  const descripcion = sesion.descripcion;
  const resultados = sesion.resultados ?? [];

  if (resultados.length === 0) {
    return {
      invoices: [],
      grandTotal: 0,
      savingsVsWorst: 0,
    };
  }

  const isMultiMaterial = resultados.some((r) => r.material_descripcion);

  const quotes: QuoteLike[] = resultados.map((r) => ({
    vendorName: r.nombre,
    vendorDisplay: `${r.nombre} — ${r.descripcion_producto}`,
    materialName: r.material_descripcion ?? descripcion,
    quantity: r.cantidad ?? cantidad,
    unit: r.unidad ?? unidad,
    unitPrice: r.precio,
    totalPrice: r.precio * (r.cantidad ?? cantidad),
    moneda: r.moneda,
    resultado: r,
  }));

  let bestQuotes: QuoteLike[];

  if (isMultiMaterial) {
    const byMaterial = new Map<string, QuoteLike[]>();
    for (const q of quotes) {
      const list = byMaterial.get(q.materialName) ?? [];
      list.push(q);
      byMaterial.set(q.materialName, list);
    }
    bestQuotes = [...byMaterial.values()].map((list) =>
      list.reduce((a, b) => (a.totalPrice <= b.totalPrice ? a : b))
    );
  } else {
    bestQuotes = [quotes.reduce((a, b) => (a.totalPrice <= b.totalPrice ? a : b))];
  }

  const vendorGroups = new Map<
    string,
    { lines: InvoiceLine[]; quotes: QuoteLike[]; display: string }
  >();

  for (const best of bestQuotes) {
    const line: InvoiceLine = {
      materialName: best.materialName,
      quantity: best.quantity,
      unit: best.unit,
      unitPrice: best.unitPrice,
      subtotal: best.totalPrice,
    };
    const existing = vendorGroups.get(best.vendorName);
    if (existing) {
      existing.lines.push(line);
      existing.quotes.push(best);
    } else {
      vendorGroups.set(best.vendorName, {
        lines: [line],
        quotes: [best],
        display: best.vendorDisplay,
      });
    }
  }

  const invoices: VendorInvoice[] = [];
  let grandTotal = 0;

  for (const [vendorName, group] of vendorGroups) {
    const lineSubtotal = group.lines.reduce((sum, l) => sum + l.subtotal, 0);
    const commission = lineSubtotal * (COMISION_FINDRAI_PCT / 100);
    const total = lineSubtotal + commission;

    const firstQuote = group.quotes[0];
    invoices.push({
      vendorName,
      lines: group.lines,
      subtotal: Math.round(lineSubtotal * 100) / 100,
      iva: 0,
      total: Math.round(total * 100) / 100,
      deliveryEstimate: firstQuote?.resultado?.tiempo_entrega,
      commission: Math.round(commission * 100) / 100,
      moneda: firstQuote?.resultado?.moneda ?? 'GTQ',
    });

    grandTotal += total;
  }

  const worstTotal = isMultiMaterial
    ? bestQuotes.reduce((sum, q) => {
        const worstForMaterial = quotes
          .filter((r) => r.materialName === q.materialName)
          .reduce((a, b) => (a.totalPrice >= b.totalPrice ? a : b));
        const commission = worstForMaterial.totalPrice * (COMISION_FINDRAI_PCT / 100);
        return sum + worstForMaterial.totalPrice + commission;
      }, 0)
    : (() => {
        const worst = quotes.reduce((a, b) => (a.totalPrice >= b.totalPrice ? a : b));
        return worst.totalPrice + worst.totalPrice * (COMISION_FINDRAI_PCT / 100);
      })();

  const savingsVsWorst = Math.round((worstTotal - grandTotal) * 100) / 100;

  return {
    invoices,
    grandTotal: Math.round(grandTotal * 100) / 100,
    savingsVsWorst,
  };
}
