// ────────────────────────────────────────────────────────────
// Domain types for the cotizaciones OCR + analysis module
// ────────────────────────────────────────────────────────────

export type OcrStatus = 'pending' | 'processing' | 'done' | 'error';
export type AnalysisStatus = 'pending' | 'processing' | 'done' | 'error';

/** Row shape returned from the `cotizaciones` Supabase table */
export interface Cotizacion {
  id: string;
  filename: string;
  file_url: string;
  ocr_raw: string | null;
  ocr_status: OcrStatus;
  analysis_status: AnalysisStatus;
  analysis_result: AnalysisResult | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

// ────────────────────────────────────────────────────────────
// Structured analysis result returned by Gemini
// ────────────────────────────────────────────────────────────

export interface Proveedor {
  nombre: string | null;
  ruc_nit_id: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  contacto_nombre: string | null;
}

export interface DatosCotizacion {
  numero: string | null;
  fecha_emision: string | null;
  fecha_validez: string | null;
  moneda: string | null;
  condiciones_pago: string | null;
  tiempo_entrega: string | null;
  notas_generales: string | null;
}

export interface LineaCotizacion {
  numero_linea: number;
  codigo: string | null;
  descripcion: string;
  especificaciones: string | null;
  cantidad: number | null;
  unidad: string | null;
  precio_unitario: number | null;
  descuento_pct: number | null;
  subtotal: number | null;
}

export interface TotalesCotizacion {
  subtotal: number | null;
  descuento: number | null;
  impuestos_pct: number | null;
  impuestos_monto: number | null;
  total: number | null;
}

export interface AnalysisResult {
  proveedor: Proveedor;
  cotizacion: DatosCotizacion;
  lineas: LineaCotizacion[];
  totales: TotalesCotizacion;
  campos_faltantes: string[];
  preguntas_sugeridas: string[];
}

// ────────────────────────────────────────────────────────────
// API request / response shapes
// ────────────────────────────────────────────────────────────

export interface OcrApiResponse {
  cotizacion_id: string;
}

export interface AnalyzeApiRequest {
  cotizacion_id: string;
}

export interface AnalyzeApiResponse {
  analysis: AnalysisResult;
}

export interface ApiError {
  error: string;
}
