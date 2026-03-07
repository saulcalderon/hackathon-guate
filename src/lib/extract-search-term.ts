import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const extractSearchTermSchema = z.object({
  searchTerm: z
    .string()
    .describe(
      "Search phrase for vendor sites (EPA, Cemaco). Include product name plus key qualifiers that improve results: size (3/8, 1/2), gauge, PSI, material (cobre, galvanizado), type (vinilica, portland). Exclude: quantities, filler words. Be concise but specific.",
    ),
  quantity: z
    .number()
    .describe("Numeric quantity requested, or 1 if not specified"),
  unit: z
    .string()
    .describe(
      "Unit of measure: saco, quintal, metro, unidad, galón, libra, etc. Use 'unidad' if unclear.",
    ),
  specs: z
    .string()
    .describe(
      "Key specs to match: PSI, brand, size, grade. Empty string if none. E.g. '>3000 PSI', '3/8 grado 40'.",
    ),
});

export type ExtractedSearchTerm = z.infer<typeof extractSearchTermSchema>;

const EXTRACT_PROMPT = `You are a procurement assistant for the Guatemalan construction market.

Given a user's product description, extract:
1. searchTerm: A search phrase for vendor sites (EPA, Cemaco). Include the product name plus qualifiers that help narrow results: size (3/8, 1/2), gauge, PSI, material (cobre, galvanizado), type (vinilica, portland). Exclude quantities and filler words. Adapt intelligently: if user gives specs, include them; if vague, keep it simple.
2. quantity: The numeric quantity requested.
3. unit: The unit of measure (saco, quintal, metro, unidad, galón, libra, varilla, etc.).
4. specs: Full specs for filtering results later (PSI, brand, size, grade). Leave empty if none.

Examples:
- "50 sacos de cemento de mas de 3000 psi" -> searchTerm: "cemento 3000 psi", quantity: 50, unit: "saco", specs: ">3000 PSI"
- "20 varillas de hierro 3/8 grado 40" -> searchTerm: "varilla hierro 3/8", quantity: 20, unit: "varilla", specs: "grado 40"
- "varilla de cobre 3/8" -> searchTerm: "varilla cobre 3/8", quantity: 1, unit: "varilla", specs: ""
- "cemento psi 3000" -> searchTerm: "cemento 3000 psi", quantity: 1, unit: "unidad", specs: "3000 PSI"
- "cemento" -> searchTerm: "cemento", quantity: 1, unit: "unidad", specs: ""
- "pintura vinilica blanca" -> searchTerm: "pintura vinilica blanca", quantity: 1, unit: "unidad", specs: "vinilica blanca"`;

export async function extractSearchTerm(
  description: string,
): Promise<ExtractedSearchTerm> {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: extractSearchTermSchema,
    system: EXTRACT_PROMPT,
    prompt: description.trim(),
  });
  return object;
}
