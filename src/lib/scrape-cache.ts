import { createAdminSupabaseClient } from "@/lib/supabase/admin";
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
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('scrape_cache')
    .select('*')
    .eq('search_term', key)
    .eq('vendor', vendor)
    .single();

  if (error || !data) return null;

  return {
    vendor: data.vendor,
    products: data.products as unknown as ScrapedProduct[],
    searchUrl: data.search_url,
  };
}

export async function saveScrapeCache(
  searchTerm: string,
  result: VendorScrapeResult,
): Promise<void> {
  const key = CACHE_KEY_NORMALIZE(searchTerm);
  const supabase = createAdminSupabaseClient();
  
  const { error } = await supabase
    .from('scrape_cache')
    .upsert({
      search_term: key,
      vendor: result.vendor,
      search_url: result.searchUrl,
      products: result.products,
    }, {
      onConflict: 'search_term,vendor'
    });

  if (error) console.error('Error saving scrape cache:', error);
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
