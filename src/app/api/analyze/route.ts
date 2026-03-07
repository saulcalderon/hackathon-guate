import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { analyzeOcrText } from '@/lib/gemini/analyze';
import type {
  AnalyzeApiRequest,
  AnalyzeApiResponse,
  ApiError,
  AnalysisResult,
} from '@/types/cotizaciones';

export const maxDuration = 60;

/**
 * POST /api/analyze
 * Body: JSON { cotizacion_id: string }
 *
 * Flow:
 * 1. Validate request body.
 * 2. Fetch the cotizacion row from DB.
 * 3. Idempotency check — if analysis_result already exists, return it directly.
 * 4. Mark analysis_status = 'processing'.
 * 5. Call Gemini with the ocr_raw text.
 * 6. Save analysis_result and mark analysis_status = 'done'.
 * 7. Return { analysis }.
 */
export async function POST(
  request: Request
): Promise<NextResponse<AnalyzeApiResponse | ApiError>> {
  const supabase = createAdminSupabaseClient();

  // ── 1. Parse body ──────────────────────────────────────────────────
  let body: AnalyzeApiRequest;
  try {
    body = (await request.json()) as AnalyzeApiRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { cotizacion_id } = body;
  if (!cotizacion_id) {
    return NextResponse.json(
      { error: 'Missing cotizacion_id' },
      { status: 400 }
    );
  }

  // ── 2. Fetch row ───────────────────────────────────────────────────
  const { data: row, error: fetchError } = await supabase
    .from('cotizaciones')
    .select('id, ocr_raw, ocr_status, analysis_status, analysis_result')
    .eq('id', cotizacion_id)
    .single();

  if (fetchError || !row) {
    return NextResponse.json(
      { error: 'Cotizacion not found' },
      { status: 404 }
    );
  }

  if (row.ocr_status !== 'done' || !row.ocr_raw) {
    return NextResponse.json(
      { error: 'OCR is not complete for this cotizacion' },
      { status: 409 }
    );
  }

  // ── 3. Idempotency ─────────────────────────────────────────────────
  if (row.analysis_status === 'done' && row.analysis_result) {
    return NextResponse.json(
      { analysis: row.analysis_result as AnalysisResult },
      { status: 200 }
    );
  }

  // ── 4. Mark processing ─────────────────────────────────────────────
  await supabase
    .from('cotizaciones')
    .update({ analysis_status: 'processing' })
    .eq('id', cotizacion_id);

  // ── 5 + 6. Run Gemini + save ───────────────────────────────────────
  try {
    const analysis = await analyzeOcrText(row.ocr_raw as string);

    await supabase
      .from('cotizaciones')
      .update({
        analysis_result: analysis,
        analysis_status: 'done',
      })
      .eq('id', cotizacion_id);

    // ── 7. Return ────────────────────────────────────────────────────
    return NextResponse.json({ analysis }, { status: 200 });
  } catch (err) {
    await supabase
      .from('cotizaciones')
      .update({
        analysis_status: 'error',
        error_message: String(err),
      })
      .eq('id', cotizacion_id);

    return NextResponse.json(
      { error: `Analysis failed: ${String(err)}` },
      { status: 500 }
    );
  }
}
