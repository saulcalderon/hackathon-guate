import { createAdminSupabaseClient } from '@/lib/supabase/admin';

const BUCKET = 'cotizaciones-pdf';
/** Signed URL TTL for Mistral to access the PDF (10 minutes) */
const SIGNED_URL_TTL_SECONDS = 600;

/**
 * Uploads a PDF buffer to the private Supabase Storage bucket.
 * Returns the storage path on success.
 */
export async function uploadPdf(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const supabase = createAdminSupabaseClient();
  const timestamp = Date.now();
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${timestamp}_${safeName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  return path;
}

/**
 * Creates a short-lived signed URL for a stored PDF.
 * Used to pass the URL to Mistral OCR (Mistral needs to fetch the file).
 */
export async function getSignedPdfUrl(path: string): Promise<string> {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to create signed URL: ${error?.message}`);
  }

  return data.signedUrl;
}
