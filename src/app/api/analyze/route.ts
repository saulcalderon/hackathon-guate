import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { comparisonSchema, type ProviderInput } from "@/lib/schemas";
import { SYSTEM_PROMPT } from "@/lib/prompts";

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image"; image: URL };

async function extractPdfText(base64: string): Promise<string> {
  try {
    const { PDFParse } = await import("pdf-parse");
    const data = new Uint8Array(Buffer.from(base64, "base64"));
    const parser = new PDFParse({ data });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  } catch {
    return "[PDF text extraction failed]";
  }
}

async function buildContentParts(
  providers: ProviderInput[],
): Promise<ContentPart[]> {
  const parts: ContentPart[] = [
    {
      type: "text",
      text: "Analyze and compare the following procurement quotes from multiple providers.\n\n",
    },
  ];

  for (const provider of providers) {
    parts.push({
      type: "text",
      text: `--- Provider: "${provider.name}" ---\n`,
    });

    for (const file of provider.files) {
      if (file.type.startsWith("image/")) {
        parts.push({
          type: "image",
          image: new URL(`data:${file.type};base64,${file.data}`),
        });
      } else if (file.type === "application/pdf") {
        const text = await extractPdfText(file.data);
        parts.push({
          type: "text",
          text: `[PDF — ${file.name}]:\n${text}\n`,
        });
      }
    }

    if (provider.text.trim()) {
      parts.push({
        type: "text",
        text: `[Quoted Text]:\n${provider.text}\n`,
      });
    }
  }

  return parts;
}

export async function POST(req: Request) {
  const { providers } = (await req.json()) as { providers: ProviderInput[] };

  const contentParts = await buildContentParts(providers);

  const result = streamObject({
    model: openai("gpt-4o"),
    schema: comparisonSchema,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: contentParts },
    ],
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const partial of result.partialObjectStream) {
          controller.enqueue(
            encoder.encode(JSON.stringify(partial) + "\n"),
          );
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            JSON.stringify({ _error: String(err) }) + "\n",
          ),
        );
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
