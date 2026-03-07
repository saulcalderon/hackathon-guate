import { streamText, tool, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { AGENT_PROMPT } from "@/lib/prompts";
import { scrapeVendor, SUPPORTED_VENDORS } from "@/lib/tools/scrape-vendor";
import { emailVendor } from "@/lib/tools/email-vendor";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { StreamEvent } from "@/lib/schemas";

function encode(event: StreamEvent): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(event) + "\n");
}

export async function POST(req: Request) {
  const { projectId, materials } = await req.json();

  const materialSummary = materials
    .map((m: { name: string; quantity: number; unit: string }) =>
      `- ${m.quantity} ${m.unit} de ${m.name}`,
    )
    .join("\n");

  const userMessage = `Necesito cotizar los siguientes materiales para un proyecto de construcción en Guatemala:

${materialSummary}

Vendedores públicos disponibles: ${SUPPORTED_VENDORS.join(", ")}.

Busca precios en cada vendedor público. Si un material no se encuentra en línea, envía un correo RFQ.`;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encode({
          type: "reasoning",
          text: "Iniciando búsqueda de precios en vendedores públicos...",
        }));

        console.log("[analyze] Starting streamText with tools...");
        const result = streamText({
          model: openai.chat("gpt-4o"),
          system: AGENT_PROMPT,
          messages: [{ role: "user", content: userMessage }],
          stopWhen: stepCountIs(10),
          tools: {
            scrapeVendor: tool({
              description: "Searches a public vendor website for construction material prices using structured extraction. Pass a single short search term (e.g. 'cemento', 'pintura').",
              inputSchema: z.object({
                vendor: z.string().describe("Vendor name: EPA or Cemaco"),
                query: z.string().describe("Short generic search term in Spanish (e.g. 'cemento', 'hierro', 'pintura')"),
              }),
              execute: async (params) => {
                controller.enqueue(encode({
                  type: "tool_call",
                  tool: "scrapeVendor",
                  args: { ...params },
                }));

                const result = await scrapeVendor(params.vendor, params.query);

                controller.enqueue(encode({
                  type: "tool_result",
                  tool: "scrapeVendor",
                  result: {
                    vendor: result.vendor,
                    itemCount: result.products.length,
                    items: result.products.map((p) => p.title),
                    error: result.error,
                  },
                }));

                return {
                  vendor: result.vendor,
                  products: result.products,
                  error: result.error,
                };
              },
            }),

            emailVendor: tool({
              description: "Sends an RFQ email to a private vendor for materials not found online.",
              inputSchema: z.object({
                vendorName: z.string().describe("Name of the vendor"),
                vendorEmail: z.string().describe("Vendor's email address"),
                projectName: z.string().describe("Project name"),
                materialList: z.array(z.string()).describe("List of materials with quantities"),
              }),
              execute: async (params) => {
                controller.enqueue(encode({
                  type: "tool_call",
                  tool: "emailVendor",
                  args: { vendorName: params.vendorName, vendorEmail: params.vendorEmail },
                }));

                const result = await emailVendor(params);

                controller.enqueue(encode({
                  type: "tool_result",
                  tool: "emailVendor",
                  result: {
                    vendorName: params.vendorName,
                    success: result.success,
                    error: result.error,
                  },
                }));

                return result;
              },
            }),

            reportFindings: tool({
              description: "Report extracted pricing data from scraped content. Call this after analyzing scrape results to update the comparison matrix.",
              inputSchema: z.object({
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
              }),
              execute: async (params) => {
                controller.enqueue(encode({
                  type: "quote_update",
                  quotes: params.quotes,
                }));

                if (projectId) {
                  const supabase = createAdminSupabaseClient();
                  for (const quote of params.quotes) {
                    const { data: materials, error: mError } = await supabase
                      .from('materials')
                      .select('id')
                      .eq('project_id', projectId)
                      .ilike('name', `%${quote.materialName}%`);

                    if (mError) {
                      console.error('Error finding material:', mError);
                      continue;
                    }

                    if (materials && materials.length > 0) {
                      const materialId = materials[0].id;
                      const { error: qError } = await supabase
                        .from('vendor_quotes')
                        .insert({
                          vendor_name: quote.vendorName,
                          material_id: materialId,
                          unit_price: quote.unitPrice,
                          total_price: quote.totalWithIVA,
                          source: quote.source,
                          status: quote.status,
                          brand: quote.brand,
                          delivery_time: quote.deliveryTime,
                        });
                      
                      if (qError) console.error('Error saving quote:', qError);
                    }
                  }
                }

                return { saved: params.quotes.length };
              },
            }),
          },
        });

        let fullText = "";
        let chunkCount = 0;
        for await (const chunk of result.textStream) {
          chunkCount++;
          fullText += chunk;
          controller.enqueue(encode({
            type: "reasoning",
            text: chunk,
          }));
        }
        console.log(`[analyze] Stream done. ${chunkCount} text chunks, ${fullText.length} total chars`);

        if (projectId) {
          const supabase = createAdminSupabaseClient();
          await supabase
            .from('projects')
            .update({ status: "analyzed" })
            .eq('id', projectId);
        }

        controller.enqueue(encode({
          type: "complete",
          summary: fullText.slice(-500),
          totalVendorsScraped: SUPPORTED_VENDORS.length,
          totalEmailsSent: 0,
        }));
      } catch (err) {
        console.error("[analyze] ERROR:", err instanceof Error ? err.message : err);
        controller.enqueue(encode({
          type: "error",
          message: err instanceof Error ? err.message : "Analysis failed",
        }));
      } finally {
        controller.close();
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
