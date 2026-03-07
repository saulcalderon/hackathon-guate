import { prisma } from "@/lib/db";
import {
  scrapeVendor,
  SUPPORTED_VENDORS,
} from "@/lib/tools/scrape-vendor";
import type { ScrapedProduct, VendorScrapeResult } from "@/lib/tools/scrape-vendor";

const CACHE_KEY_NORMALIZE = (term: string) => term.trim().toLowerCase();

export async function getCachedScrape(
  searchTerm: string,
  vendor: string,
): Promise<VendorScrapeResult | null> {
  const key = CACHE_KEY_NORMALIZE(searchTerm);
  const row = await prisma.scrapeCache.findUnique({
    where: {
      searchTerm_vendor: { searchTerm: key, vendor },
    },
  });
  if (!row) return null;

  const products = row.products as unknown as ScrapedProduct[];
  return {
    vendor: row.vendor,
    products,
    searchUrl: row.searchUrl,
  };
}

export async function saveScrapeCache(
  searchTerm: string,
  result: VendorScrapeResult,
): Promise<void> {
  const key = CACHE_KEY_NORMALIZE(searchTerm);
  await prisma.scrapeCache.upsert({
    where: {
      searchTerm_vendor: { searchTerm: key, vendor: result.vendor },
    },
    create: {
      searchTerm: key,
      vendor: result.vendor,
      searchUrl: result.searchUrl,
      products: result.products as object[],
    },
    update: {
      searchUrl: result.searchUrl,
      products: result.products as object[],
    },
  });
}

export async function scrapeAllVendorsWithCache(
  searchTerm: string,
): Promise<VendorScrapeResult[]> {
  const results: VendorScrapeResult[] = [];

  for (const vendor of SUPPORTED_VENDORS) {
    const cached = await getCachedScrape(searchTerm, vendor);
    if (cached && cached.products.length > 0) {
      console.log(`[scrape] ${vendor} | cache hit for "${searchTerm}"`);
      results.push(cached);
    } else {
      const scraped = await scrapeVendor(vendor, searchTerm);
      results.push(scraped);
      if (!scraped.error && scraped.products.length > 0) {
        await saveScrapeCache(searchTerm, scraped);
      }
    }
  }

  return results;
}
