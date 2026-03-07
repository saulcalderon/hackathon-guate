import Firecrawl from "@mendable/firecrawl-js";

const SEARCH_URLS: Record<string, (query: string) => string> = {
  EPA: (q) =>
    `https://gt.epaenlinea.com/catalogsearch/result/?q=${encodeURIComponent(q)}`,
  Cemaco: (q) =>
    `https://www.cemaco.com/busqueda?q=${encodeURIComponent(q)}`,
};

export const SUPPORTED_VENDORS = Object.keys(SEARCH_URLS);

let firecrawlInstance: Firecrawl | null = null;

function getFirecrawl(): Firecrawl {
  if (!firecrawlInstance) {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not set");
    firecrawlInstance = new Firecrawl({ apiKey });
  }
  return firecrawlInstance;
}

export interface ScrapedProduct {
  title: string;
  price: number;
  url: string;
  brand?: string;
  confidence_score: number;
}

export interface VendorScrapeResult {
  vendor: string;
  products: ScrapedProduct[];
  searchUrl: string;
  error?: string;
}

const PRICE_EXTRACTION_PROMPT = `Extract product prices exactly as shown. In Guatemala, single-unit construction prices (cement bag, paint, etc.) are typically Q50-Q200.
- Use the UNIT price (price per item), not bulk totals.
- Comma is often DECIMAL separator: 73,95 = 73.95, 80,00 = 80.00. NOT thousands.
- Period can be thousands: 1.500 = 1500. Or decimal: 80.50 = 80.50.
- A cement bag (42.5kg) is ~Q70-Q120. If you extract 7395 or 80000, that is likely 73.95 or 80.00 (decimal misplaced).`;

const PRODUCT_EXTRACT_SCHEMA = {
  type: "object",
  properties: {
    products: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Product name as displayed on the page",
          },
          price: {
            type: "number",
            description:
              "Unit price in Quetzales (Q). Single items (cement bag, paint) are Q50-Q200. Comma = decimal (73,95 = 73.95). Extract the per-unit price, not bulk.",
          },
          url: {
            type: "string",
            description: "Absolute URL to the product page",
          },
          brand: {
            type: "string",
            description: "Brand name if visible",
          },
          confidence_score: {
            type: "number",
            description:
              "How well this product matches the search query, from 0 (no match) to 1 (exact match)",
          },
        },
        required: ["title", "price", "url", "confidence_score"],
      },
    },
  },
  required: ["products"],
};

const MIN_REASONABLE_UNIT_PRICE = 10;
const MAX_REASONABLE_UNIT_PRICE = 500;

function normalizePriceOutliers(
  products: ScrapedProduct[],
): ScrapedProduct[] {
  return products.map((p) => {
    if (p.price < 1000) return p;

    const by100 = p.price / 100;
    const by1000 = p.price / 1000;

    if (
      by100 >= MIN_REASONABLE_UNIT_PRICE &&
      by100 <= MAX_REASONABLE_UNIT_PRICE
    ) {
      console.log(
        `[scrape] Price correction (÷100): ${p.title} Q${p.price} -> Q${by100.toFixed(2)}`,
      );
      return { ...p, price: Math.round(by100 * 100) / 100 };
    }
    if (
      by1000 >= MIN_REASONABLE_UNIT_PRICE &&
      by1000 <= MAX_REASONABLE_UNIT_PRICE
    ) {
      console.log(
        `[scrape] Price correction (÷1000): ${p.title} Q${p.price} -> Q${by1000.toFixed(2)}`,
      );
      return { ...p, price: Math.round(by1000 * 100) / 100 };
    }
    return p;
  });
}

export async function scrapeVendor(
  vendor: string,
  query: string,
): Promise<VendorScrapeResult> {
  const buildUrl = SEARCH_URLS[vendor];
  if (!buildUrl) {
    return {
      vendor,
      products: [],
      searchUrl: "",
      error: `Vendor "${vendor}" is not supported`,
    };
  }

  const searchUrl = buildUrl(query);
  const firecrawl = getFirecrawl();

  console.log(`[scrape] ${vendor} | query: "${query}" | url: ${searchUrl}`);

  try {
    const result = await firecrawl.scrape(searchUrl, {
      formats: [
        {
          type: "json",
          schema: PRODUCT_EXTRACT_SCHEMA,
          prompt: PRICE_EXTRACTION_PROMPT,
        },
      ],
      onlyMainContent: true,
      fastMode: true,
    });

    const data = result.json as
      | { products?: ScrapedProduct[] }
      | undefined;
    let products = (data?.products ?? []).map((p) => ({
      ...p,
      price: typeof p.price === "number" ? p.price : parseFloat(String(p.price)) || 0,
    }));

    products = normalizePriceOutliers(products);

    console.log(`[scrape] ${vendor} | ${products.length} product(s) found`);
    return { vendor, products, searchUrl };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[scrape] ERROR ${vendor}: ${msg}`);
    return { vendor, products: [], searchUrl, error: msg };
  }
}

export async function scrapeAllVendors(
  query: string,
): Promise<VendorScrapeResult[]> {
  return Promise.all(
    SUPPORTED_VENDORS.map((vendor) => scrapeVendor(vendor, query)),
  );
}
