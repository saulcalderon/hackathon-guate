import { z } from "zod";

// --- Ingestion ---

export const materialSchema = z.object({
  name: z.string().describe("Normalized material name in Spanish"),
  quantity: z.number().describe("Requested quantity"),
  unit: z.string().describe("Unit of measure (saco, quintal, metro, unidad, etc.)"),
});

export const materialListSchema = z.object({
  projectName: z.string().describe("Short project name inferred from the materials"),
  materials: z.array(materialSchema).describe("Parsed list of materials"),
});

export type MaterialList = z.infer<typeof materialListSchema>;
export type MaterialItem = z.infer<typeof materialSchema>;

// --- Scraping ---

export const scrapeProductSchema = z.object({
  materialName: z.string().describe("The material this result matches"),
  productName: z.string().describe("Exact product name from the vendor"),
  brand: z.string().optional().describe("Brand if available"),
  unitPrice: z.number().describe("Unit price in GTQ"),
  ivaIncluded: z.boolean().describe("Whether price includes 12% IVA"),
  totalWithIVA: z.number().describe("Price with IVA included"),
  availability: z.string().optional().describe("Stock status"),
  deliveryTime: z.string().optional().describe("Estimated delivery time"),
  url: z.string().optional().describe("Product page URL"),
});

export const scrapeResultSchema = z.object({
  vendor: z.string(),
  products: z.array(scrapeProductSchema),
});

export type ScrapeResult = z.infer<typeof scrapeResultSchema>;
export type ScrapeProduct = z.infer<typeof scrapeProductSchema>;

// --- NDJSON Stream Events ---

export const reasoningEventSchema = z.object({
  type: z.literal("reasoning"),
  text: z.string(),
});

export const toolCallEventSchema = z.object({
  type: z.literal("tool_call"),
  tool: z.string(),
  args: z.record(z.string(), z.unknown()),
});

export const toolResultEventSchema = z.object({
  type: z.literal("tool_result"),
  tool: z.string(),
  result: z.unknown(),
});

export const quoteUpdateEventSchema = z.object({
  type: z.literal("quote_update"),
  quotes: z.array(z.object({
    materialName: z.string(),
    vendorName: z.string(),
    unitPrice: z.number(),
    totalWithIVA: z.number(),
    brand: z.string().optional(),
    deliveryTime: z.string().optional(),
    source: z.enum(["scraped", "email", "manual"]),
    status: z.enum(["live", "pending"]),
  })),
});

export const completeEventSchema = z.object({
  type: z.literal("complete"),
  summary: z.string(),
  totalVendorsScraped: z.number(),
  totalEmailsSent: z.number(),
});

export const errorEventSchema = z.object({
  type: z.literal("error"),
  message: z.string(),
});

export type StreamEvent =
  | z.infer<typeof reasoningEventSchema>
  | z.infer<typeof toolCallEventSchema>
  | z.infer<typeof toolResultEventSchema>
  | z.infer<typeof quoteUpdateEventSchema>
  | z.infer<typeof completeEventSchema>
  | z.infer<typeof errorEventSchema>;

export type QuoteRow = z.infer<typeof quoteUpdateEventSchema>["quotes"][number];

// --- Optimization / Invoices ---

export const invoiceLineSchema = z.object({
  materialName: z.string(),
  quantity: z.number(),
  unit: z.string(),
  unitPrice: z.number(),
  subtotal: z.number(),
});

export const vendorInvoiceSchema = z.object({
  vendorName: z.string(),
  lines: z.array(invoiceLineSchema),
  subtotal: z.number(),
  iva: z.number(),
  total: z.number(),
  deliveryEstimate: z.string().optional(),
  commission: z.number().optional(),
  moneda: z.enum(['GTQ', 'USD', 'SVC']).optional(),
});

export const optimizationResultSchema = z.object({
  invoices: z.array(vendorInvoiceSchema),
  grandTotal: z.number(),
  savingsVsWorst: z.number(),
});

export type InvoiceLine = z.infer<typeof invoiceLineSchema>;
export type VendorInvoice = z.infer<typeof vendorInvoiceSchema>;
export type OptimizationResult = z.infer<typeof optimizationResultSchema>;

// --- Request types ---

export interface IngestRequest {
  text?: string;
  pdfBase64?: string;
}

export interface AnalyzeRequest {
  projectId: string;
  materials: MaterialItem[];
}

export interface OptimizeRequest {
  projectId: string;
  bypassPending?: boolean;
}
