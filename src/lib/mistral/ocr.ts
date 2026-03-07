import { Mistral } from '@mistralai/mistralai';

/**
 * Runs OCR on a PDF accessible via a signed URL.
 * Uses the official Mistral OCR SDK (`client.ocr.process`).
 *
 * Strategy for MVP:
 * - Pass the signed Supabase URL directly as `document_url`.
 *   This avoids base64 encoding large files and keeps the payload small.
 * - `mistral-ocr-latest` is the dedicated OCR model (cheaper + faster than pixtral).
 *
 * Returns the full extracted text with tables preserved as HTML.
 */
export async function extractTextFromPdfUrl(signedUrl: string): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new Error('Missing MISTRAL_API_KEY environment variable');
  }

  const client = new Mistral({ apiKey });

  const response = await client.ocr.process({
    model: 'mistral-ocr-latest',
    document: {
      type: 'document_url',
      documentUrl: signedUrl,
    },
    tableFormat: 'html',
  });

  if (!response?.pages || response.pages.length === 0) {
    throw new Error('Mistral OCR returned no pages');
  }

  // Concatenate markdown text from all pages preserving order
  const fullText = response.pages
    .map((page) => page.markdown ?? '')
    .join('\n\n');

  if (!fullText.trim()) {
    throw new Error('Mistral OCR returned empty text');
  }

  return fullText;
}
