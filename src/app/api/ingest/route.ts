import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { materialListSchema } from "@/lib/schemas";
import { INGEST_PROMPT } from "@/lib/prompts";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { auth } from "@clerk/nextjs/server";

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

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { text, pdfBase64 } = body as { text?: string; pdfBase64?: string };

    let inputText = text ?? "";

    if (pdfBase64) {
      const pdfText = await extractPdfText(pdfBase64);
      inputText += `\n\n--- Contenido del PDF ---\n${pdfText}`;
    }

    if (!inputText.trim()) {
      return Response.json(
        { error: "No input provided" },
        { status: 400 },
      );
    }

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: materialListSchema,
      system: INGEST_PROMPT,
      prompt: inputText,
    });

    const supabase = createAdminSupabaseClient();
    
    // 1. Create project
    const { data: project, error: pError } = await supabase
      .from('projects')
      .insert({
        name: object.projectName,
        status: "draft",
        user_id: userId
      })
      .select()
      .single();

    if (pError) throw pError;

    // 2. Create materials
    const { data: materials, error: mError } = await supabase
      .from('materials')
      .insert(object.materials.map((m) => ({
        name: m.name,
        quantity: m.quantity,
        unit: m.unit,
        project_id: project.id
      })))
      .select();

    if (mError) throw mError;

    return Response.json({
      projectId: project.id,
      projectName: project.name,
      materials: materials.map((m) => ({
        id: m.id,
        name: m.name,
        quantity: m.quantity,
        unit: m.unit,
      })),
    });
  } catch (err) {
    console.error("Ingest error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Ingestion failed" },
      { status: 500 },
    );
  }
}
