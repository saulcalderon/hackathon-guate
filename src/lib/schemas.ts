import { z } from "zod";

export const traceStepSchema = z.object({
  step: z.string().describe("Action name, e.g. 'Unit Normalization'"),
  detail: z
    .string()
    .describe("What the agent did, e.g. 'Converted 1 quintal to 45.36 kg'"),
});

export const providerResultSchema = z.object({
  name: z.string(),
  unitPrice: z.number().describe("Normalized unit price in GTQ"),
  ivaIncluded: z.boolean().describe("Whether the original price included 12% IVA"),
  totalWithIVA: z.number().describe("Final price including 12% IVA"),
  isCheapest: z.boolean(),
});

export const itemSchema = z.object({
  name: z.string().describe("Normalized product name"),
  originalUnit: z.string().describe("Original unit as stated in the quote"),
  normalizedQty: z.number().describe("Quantity converted to standard metric (kg, L, unit)"),
  normalizedUnit: z.string().describe("Standard metric unit after normalization"),
  providers: z.array(providerResultSchema),
});

export const summarySchema = z.object({
  winnerName: z.string(),
  reasoning: z
    .string()
    .describe("Brief explanation of why this provider is the best value"),
  estimatedSavings: z.number().describe("Savings in GTQ vs the most expensive option"),
});

export const comparisonSchema = z.object({
  analysisId: z.string().describe("Unique short analysis ID"),
  trace: z
    .array(traceStepSchema)
    .describe("Step-by-step reasoning trace — populate FIRST"),
  items: z.array(itemSchema).describe("Normalized comparison items"),
  summary: summarySchema,
});

export type ComparisonResult = z.infer<typeof comparisonSchema>;
export type TraceStep = z.infer<typeof traceStepSchema>;
export type ComparisonItem = z.infer<typeof itemSchema>;
export type ProviderResult = z.infer<typeof providerResultSchema>;
export type ComparisonSummary = z.infer<typeof summarySchema>;

export interface FileInput {
  name: string;
  type: string;
  data: string;
}

export interface ProviderInput {
  name: string;
  files: FileInput[];
  text: string;
}

export interface AnalyzeRequest {
  providers: ProviderInput[];
}
