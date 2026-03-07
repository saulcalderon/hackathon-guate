import type { OptimizationResult, VendorInvoice, InvoiceLine } from "@/lib/schemas";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const IVA_RATE = 0.12;
const DELIVERY_FEE_PER_VENDOR = 75;
const CONSOLIDATION_DISCOUNT = 0.15;

interface QuoteWithMaterial {
  vendorName: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  status: string;
}

export async function optimizeOrder(
  projectId: string,
  bypassPending = false,
): Promise<OptimizationResult> {
  const supabase = createAdminSupabaseClient();
  const { data: project, error } = await supabase
    .from('projects')
    .select('*, materials(*, vendor_quotes(*))')
    .eq('id', projectId)
    .single();

  if (error || !project) throw new Error("Project not found");

  const allQuotes: QuoteWithMaterial[] = [];

  for (const material of project.materials) {
    for (const quote of material.vendor_quotes) {
      if (bypassPending && quote.status === "pending") continue;
      if (quote.status === "pending") continue;

      allQuotes.push({
        vendorName: quote.vendor_name,
        materialName: material.name,
        quantity: material.quantity,
        unit: material.unit,
        unitPrice: Number(quote.unit_price),
        totalPrice: Number(quote.total_price),
        status: quote.status,
      });
    }
  }

  const materialNames = [...new Set(allQuotes.map((q) => q.materialName))];
  const assignments: Map<string, QuoteWithMaterial> = new Map();

  for (const mat of materialNames) {
    const candidates = allQuotes.filter((q) => q.materialName === mat);
    if (candidates.length === 0) continue;

    candidates.sort((a, b) => a.unitPrice - b.unitPrice);
    assignments.set(mat, candidates[0]);
  }

  const vendorGroups: Map<string, { lines: InvoiceLine[]; quotes: QuoteWithMaterial[] }> = new Map();

  for (const [, assignment] of assignments) {
    const key = assignment.vendorName;
    if (!vendorGroups.has(key)) {
      vendorGroups.set(key, { lines: [], quotes: [] });
    }

    const group = vendorGroups.get(key)!;
    const subtotal = assignment.unitPrice * assignment.quantity;

    group.lines.push({
      materialName: assignment.materialName,
      quantity: assignment.quantity,
      unit: assignment.unit,
      unitPrice: assignment.unitPrice,
      subtotal,
    });
    group.quotes.push(assignment);
  }

  const invoices: VendorInvoice[] = [];
  let grandTotal = 0;

  for (const [vendorName, group] of vendorGroups) {
    const lineSubtotal = group.lines.reduce((sum, l) => sum + l.subtotal, 0);

    let deliveryFee = DELIVERY_FEE_PER_VENDOR;
    if (group.lines.length >= 3) {
      deliveryFee *= (1 - CONSOLIDATION_DISCOUNT);
    }

    const subtotalWithDelivery = lineSubtotal + deliveryFee;
    const iva = subtotalWithDelivery * IVA_RATE;
    const total = subtotalWithDelivery + iva;

    invoices.push({
      vendorName,
      lines: group.lines,
      subtotal: Math.round(subtotalWithDelivery * 100) / 100,
      iva: Math.round(iva * 100) / 100,
      total: Math.round(total * 100) / 100,
      deliveryEstimate: group.lines.length >= 3 ? "Consolidado" : undefined,
    });

    grandTotal += total;
  }

  // Calculate worst-case total (most expensive vendor per material)
  let worstTotal = 0;
  for (const mat of materialNames) {
    const candidates = allQuotes.filter((q) => q.materialName === mat);
    if (candidates.length === 0) continue;
    candidates.sort((a, b) => b.unitPrice - a.unitPrice);
    const worst = candidates[0];
    worstTotal += worst.unitPrice * worst.quantity * (1 + IVA_RATE);
  }
  worstTotal += vendorGroups.size * DELIVERY_FEE_PER_VENDOR;

  return {
    invoices,
    grandTotal: Math.round(grandTotal * 100) / 100,
    savingsVsWorst: Math.round((worstTotal - grandTotal) * 100) / 100,
  };
}
