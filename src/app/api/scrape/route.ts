import { extractSearchTerm } from "@/lib/extract-search-term";
import { filterResults } from "@/lib/filter-results";
import { scrapeAllVendorsWithCache } from "@/lib/scrape-cache";
import { SUPPORTED_VENDORS } from "@/lib/tools/scrape-vendor";
import type { FilteredProduct } from "@/lib/filter-results";

export interface ScrapeApiResponse {
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
    if (
      e instanceof TypeError &&
      (e as Error).message?.includes("closed") ||
      (e as Error).code === "ERR_INVALID_STATE"
    ) {
      return;
    }
    throw e;
  }
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
        safeEnqueue(controller,encode({ type: "step", message: "Extrayendo término de búsqueda..." }));

        const { searchTerm, quantity, unit, specs } = await extractSearchTerm(
          description.trim(),
        );

        safeEnqueue(controller,
          encode({ type: "step", message: `Buscando: "${searchTerm}"` }),
        );
        safeEnqueue(controller,
          encode({
            type: "step",
            message: `Buscando en ${SUPPORTED_VENDORS.join(" y ")}...`,
          }),
        );

        const vendorResults = await scrapeAllVendorsWithCache(searchTerm);

        for (const r of vendorResults) {
          const count = r.products.length;
          const status = r.error
            ? `Error: ${r.error}`
            : `${count} producto${count !== 1 ? "s" : ""} encontrado${count !== 1 ? "s" : ""}`;
          safeEnqueue(controller,
            encode({ type: "step", message: `${r.vendor}: ${status}` }),
          );
        }

        const totalScraped = vendorResults.reduce(
          (sum, r) => sum + r.products.length,
          0,
        );
        safeEnqueue(controller,
          encode({
            type: "step",
            message: `Total: ${totalScraped} productos de ${SUPPORTED_VENDORS.length} tiendas`,
          }),
        );

        const allProducts = vendorResults.flatMap((r) =>
          r.products.map((p) => ({ ...p, vendor: r.vendor })),
        );

        safeEnqueue(controller,
          encode({ type: "step", message: "Filtrando resultados..." }),
        );

        const filtered = await filterResults(description.trim(), allProducts);

        safeEnqueue(controller,
          encode({
            type: "step",
            message: `${filtered.length} producto${filtered.length !== 1 ? "s" : ""} coinciden con tu búsqueda`,
          }),
        );

        const grouped = new Map<string, FilteredProduct[]>();
        for (const p of filtered) {
          const list = grouped.get(p.vendor) ?? [];
          list.push(p);
          grouped.set(p.vendor, list);
        }

        const results = vendorResults.map((r) => ({
          vendor: r.vendor,
          products: grouped.get(r.vendor) ?? [],
          searchUrl: r.searchUrl,
          error: r.error,
        }));

        safeEnqueue(controller,
          encode({
            type: "complete",
            searchTerm,
            quantity,
            unit,
            specs,
            results,
          }),
        );
      } catch (err) {
        console.error("[/api/scrape] Error:", err);
        safeEnqueue(controller,
          encode({
            type: "error",
            message: err instanceof Error ? err.message : "Scrape failed",
          }),
        );
      } finally {
        try {
          controller.close();
        } catch {
          /* already closed (e.g. client disconnected) */
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
