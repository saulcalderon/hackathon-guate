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

const materialExtractSchema = z.object({
  materialName: z.string().describe("Short display name for the material (e.g. 'Cemento 3000 PSI', 'Varilla hierro 3/8')"),
  searchTerm: z.string().describe("Search phrase for vendor sites. Short, generic. Exclude quantities."),
  quantity: z.number().describe("Numeric quantity requested, or 1 if not specified"),
  unit: z.string().describe("Unit: saco, quintal, metro, varilla, unidad, etc."),
  specs: z.string().describe("Key specs for filtering. Empty if none."),
});

const extractMaterialsSchema = z.object({
  materials: z.array(materialExtractSchema).min(1).max(10).describe("Parsed materials from the user input"),
});

export type ExtractedMaterial = z.infer<typeof materialExtractSchema>;

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

const EXTRACT_MATERIALS_PROMPT = `You are a procurement assistant for the Guatemalan construction market.

Parse the user's input into a list of materials. The input may be:
- A single item: "50 sacos cemento 3000 psi"
- Multiple items separated by comma, "y", "and", or newlines: "cemento, varilla 3/8, pintura vinilica"
- A bullet list or numbered list

For EACH material, extract:
- materialName: Short display name (e.g. "Cemento 3000 PSI", "Varilla hierro 3/8")
- searchTerm: Search phrase for EPA/Cemaco. Short, generic. Examples: "cemento 3000 psi", "varilla hierro 3/8", "pintura vinilica"
- quantity: Numeric quantity (1 if not specified)
- unit: saco, quintal, metro, varilla, galón, unidad, etc.
- specs: PSI, brand, size, grade. Empty if none.

Return 1-10 materials. If input is a single item, return array of 1.`;

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

export async function extractMaterialSearchTerms(
  description: string,
): Promise<ExtractedMaterial[]> {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: extractMaterialsSchema,
    system: EXTRACT_MATERIALS_PROMPT,
    prompt: description.trim(),
  });
  return object.materials;
}
