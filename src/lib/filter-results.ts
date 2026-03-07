import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import type { ScrapedProduct } from "@/lib/tools/scrape-vendor";

export interface FilteredProduct extends ScrapedProduct {
  vendor: string;
  matchScore: number;
  matchReason: string;
}

const filterMatchesSchema = z.object({
  matches: z.array(
    z.object({
      index: z.number().describe("0-based index of the product in the input array"),
      matchScore: z
        .number()
        .min(0)
        .max(1)
        .describe("How well this product matches the user's requirements, 0-1"),
      matchReason: z
        .string()
        .describe("Brief explanation of why this product matches or differs from specs"),
    }),
  ),
});

const FILTER_PROMPT = `You are a procurement assistant for the Guatemalan construction market.

Given the user's product description and a list of scraped products from vendor search results, filter to only the products that reasonably match what the user asked for.

- Include products that match the core item (e.g. cement, rebar, paint) AND meet or are close to the specs (PSI, size, brand).
- EXCLUDE: unrelated products (e.g. cement tools when user asked for cement), wrong categories (e.g. mortar when user asked for Portland cement), accessories.
- When specs are vague, be inclusive. When specs are specific (e.g. ">3000 PSI"), prefer products that meet them but include close alternatives with a lower matchScore.
- matchScore: 1 = perfect match, 0.7-0.9 = good match with minor differences, 0.4-0.6 = partial match, <0.4 = exclude.
- matchReason: One short sentence explaining the match (e.g. "Cemento Portland 4000 PSI, meets spec" or "Mortar, not Portland cement - excluded").

Return only the indices of products that match (matchScore >= 0.4), with their matchScore and matchReason.`;

export async function filterResults(
  userDescription: string,
  products: Array<ScrapedProduct & { vendor: string }>,
): Promise<FilteredProduct[]> {
  if (products.length === 0) return [];

  const productList = products.map(
    (p, i) =>
      `[${i}] ${p.vendor}: ${p.title} | Q${p.price}${p.brand ? ` | ${p.brand}` : ""}`,
  );

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: filterMatchesSchema,
    system: FILTER_PROMPT,
    prompt: `User request: "${userDescription}"

Scraped products:
${productList.join("\n")}

Return the indices of products that match, with matchScore and matchReason.`,
  });

  const MIN_MATCH_SCORE = 0.4;

  return object.matches
    .filter(
      (m) =>
        m.index >= 0 &&
        m.index < products.length &&
        m.matchScore >= MIN_MATCH_SCORE,
    )
    .map((m) => {
      const p = products[m.index];
      return {
        ...p,
        matchScore: m.matchScore,
        matchReason: m.matchReason,
      };
    });
}
