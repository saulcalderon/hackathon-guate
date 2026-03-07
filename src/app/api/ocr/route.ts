import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { uploadPdf, getSignedPdfUrl } from '@/lib/supabase/storage';
import { extractTextFromPdfUrl } from '@/lib/mistral/ocr';
import type { OcrApiResponse, ApiError } from '@/types/cotizaciones';

export const maxDuration = 60; // seconds — OCR can take a while

/**
 * POST /api/ocr
 * Body: multipart/form-data with a "file" field (PDF)
 *
 * Flow:
 * 1. Validate the uploaded file is a PDF and within size limits.
 * 2. Upload the PDF to Supabase Storage (private bucket).
 * 3. Insert a row in `cotizaciones` with ocr_status = 'processing'.
 * 4. Get a signed URL for the stored PDF.
 * 5. Call Mistral OCR and save the extracted text.
 * 6. Update ocr_status = 'done'.
 * 7. Return { cotizacion_id }.
 */
export async function POST(
  request: Request
): Promise<NextResponse<OcrApiResponse | ApiError>> {
  const supabase = createAdminSupabaseClient();

  // ── 1. Parse and validate the file ───────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Invalid form data' },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Missing "file" field in form data' },
      { status: 400 }
    );
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json(
      { error: 'Only PDF files are accepted' },
      { status: 400 }
    );
  }

  const MAX_SIZE_MB = 20;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json(
      { error: `File exceeds the ${MAX_SIZE_MB} MB limit` },
      { status: 400 }
    );
  }

  // ── 2. Upload PDF to Storage ──────────────────────────────────────
  let storagePath: string;
  let fileUrl: string;

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    storagePath = await uploadPdf(buffer, file.name);
    fileUrl = storagePath; // we store the path; signed URLs are generated on demand
  } catch (err) {
    return NextResponse.json(
      { error: `Storage upload failed: ${String(err)}` },
      { status: 500 }
    );
  }

  // ── 3. Insert cotizacion row ──────────────────────────────────────
  const { data: row, error: insertError } = await supabase
    .from('cotizaciones')
    .insert({
      filename: file.name,
      file_url: fileUrl,
      ocr_status: 'processing',
      analysis_status: 'pending',
    })
    .select('id')
    .single();

  if (insertError || !row) {
    return NextResponse.json(
      { error: `DB insert failed: ${insertError?.message}` },
      { status: 500 }
    );
  }

  const cotizacionId: string = row.id;

  // ── 4 + 5. Get signed URL → run Mistral OCR ───────────────────────
  try {
    const signedUrl = await getSignedPdfUrl(storagePath);
    const ocrRaw = await extractTextFromPdfUrl(signedUrl);

    // ── 6. Save OCR result ──────────────────────────────────────────
    await supabase
      .from('cotizaciones')
      .update({ ocr_raw: ocrRaw, ocr_status: 'done' })
      .eq('id', cotizacionId);
  } catch (err) {
    await supabase
      .from('cotizaciones')
      .update({
        ocr_status: 'error',
        error_message: String(err),
      })
      .eq('id', cotizacionId);

    return NextResponse.json(
      { error: `OCR failed: ${String(err)}` },
      { status: 500 }
    );
  }

  // ── 7. Return ─────────────────────────────────────────────────────
  return NextResponse.json({ cotizacion_id: cotizacionId }, { status: 200 });
}
