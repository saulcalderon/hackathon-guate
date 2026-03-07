import { extractMaterialSearchTerms } from "@/lib/extract-search-term";
import { filterResults } from "@/lib/filter-results";
import { scrapeAllVendorsWithCache } from "@/lib/scrape-cache";
import { SUPPORTED_VENDORS } from "@/lib/tools/scrape-vendor";
import type { FilteredProduct } from "@/lib/filter-results";
import type { ExtractedMaterial } from "@/lib/extract-search-term";

export interface MaterialScrapeResult {
  materialName: string;
  searchTerm: string;
  quantity: number;
  unit: string;
  specs: string;
  results: Array<{
    vendor: string;
    products: FilteredProduct[];
    searchUrl: string;
    error?: string;
  }>;
}

export interface ScrapeApiResponse {
  materials: MaterialScrapeResult[];
}

function encode(event: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(event) + "\n");
}

function safeEnqueue(
  controller: ReadableStreamDefaultController<Uint8Array>,
  data: Uint8Array,
): void {
  try {
    controller.enqueue(data);
  } catch (e) {
    const err = e as Error & { code?: string };
    if (
      (e instanceof TypeError && err.message?.includes("closed")) ||
      err.code === "ERR_INVALID_STATE"
    ) {
      return;
    }
    throw e;
  }
}

async function scrapeOneMaterial(
  material: ExtractedMaterial,
  userDescription: string,
): Promise<MaterialScrapeResult> {
  const vendorResults = await scrapeAllVendorsWithCache(material.searchTerm);
  const allProducts = vendorResults.flatMap((r) =>
    r.products.map((p) => ({ ...p, vendor: r.vendor })),
  );
  const filtered = await filterResults(
    `${material.materialName} ${material.specs}`.trim(),
    allProducts,
  );
  const grouped = new Map<string, FilteredProduct[]>();
  for (const p of filtered) {
    const list = grouped.get(p.vendor) ?? [];
    list.push(p);
    grouped.set(p.vendor, list);
  }
  return {
    materialName: material.materialName,
    searchTerm: material.searchTerm,
    quantity: material.quantity,
    unit: material.unit,
    specs: material.specs,
    results: vendorResults.map((r) => ({
      vendor: r.vendor,
      products: grouped.get(r.vendor) ?? [],
      searchUrl: r.searchUrl,
      error: r.error,
    })),
  };
}

export async function POST(req: Request) {
  const { description } = (await req.json()) as { description?: string };

  if (!description?.trim()) {
    return Response.json(
      { error: "Description is required" },
      { status: 400 },
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        safeEnqueue(controller, encode({ type: "step", message: "Extrayendo materiales..." }));

        const materials = await extractMaterialSearchTerms(description.trim());

        safeEnqueue(controller, encode({
          type: "step",
          message: `${materials.length} material${materials.length !== 1 ? "es" : ""} detectado${materials.length !== 1 ? "s" : ""}: ${materials.map((m) => m.materialName).join(", ")}`,
        }));

        safeEnqueue(controller, encode({
          type: "step",
          message: `Buscando en paralelo en ${SUPPORTED_VENDORS.join(" y ")}...`,
        }));

        const materialResults = await Promise.all(
          materials.map((m) => scrapeOneMaterial(m, description.trim())),
        );

        for (const mr of materialResults) {
          const total = mr.results.reduce((s, r) => s + r.products.length, 0);
          safeEnqueue(controller, encode({
            type: "step",
            message: `${mr.materialName}: ${total} producto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`,
          }));
        }

        safeEnqueue(controller, encode({
          type: "complete",
          materials: materialResults,
        }));
      } catch (err) {
        console.error("[/api/scrape] Error:", err);
        safeEnqueue(controller, encode({
          type: "error",
          message: err instanceof Error ? err.message : "Scrape failed",
        }));
      } finally {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
    },
  });
}
