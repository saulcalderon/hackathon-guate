import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AnalysisResult } from '@/types/cotizaciones';

const MODEL = 'gemini-1.5-flash-latest';

const SYSTEM_PROMPT = `Eres un asistente especializado en análisis de cotizaciones comerciales.
Tu tarea es extraer información estructurada del texto OCR de una cotización y devolverla ÚNICAMENTE como JSON válido, sin texto adicional, sin markdown, sin bloques de código.

El JSON debe seguir exactamente este esquema:
{
  "proveedor": {
    "nombre": string|null,
    "ruc_nit_id": string|null,
    "telefono": string|null,
    "email": string|null,
    "direccion": string|null,
    "contacto_nombre": string|null
  },
  "cotizacion": {
    "numero": string|null,
    "fecha_emision": string|null,
    "fecha_validez": string|null,
    "moneda": string|null,
    "condiciones_pago": string|null,
    "tiempo_entrega": string|null,
    "notas_generales": string|null
  },
  "lineas": [
    {
      "numero_linea": number,
      "codigo": string|null,
      "descripcion": string,
      "especificaciones": string|null,
      "cantidad": number|null,
      "unidad": string|null,
      "precio_unitario": number|null,
      "descuento_pct": number|null,
      "subtotal": number|null
    }
  ],
  "totales": {
    "subtotal": number|null,
    "descuento": number|null,
    "impuestos_pct": number|null,
    "impuestos_monto": number|null,
    "total": number|null
  },
  "campos_faltantes": [string],
  "preguntas_sugeridas": [string]
}

Reglas:
- "campos_faltantes": lista los campos de negocio relevantes que NO aparecen en el documento (ej: "fecha_validez", "condiciones_pago").
- "preguntas_sugeridas": genera preguntas concretas para hacerle al proveedor sobre información incompleta o ambigua.
- Si un valor numérico no está presente, usa null (no 0).
- Devuelve SOLO el JSON. Nada más.`;

/**
 * Sends OCR text to Gemini and returns a structured AnalysisResult.
 * Includes a fallback that retries once if the initial response is not valid JSON.
 */
export async function analyzeOcrText(ocrRaw: string): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY environment variable');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL });

  const prompt = `${SYSTEM_PROMPT}\n\n---\nTEXTO OCR DE LA COTIZACIÓN:\n${ocrRaw}`;

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  return parseGeminiResponse(rawText);
}

/**
 * Strips markdown code fences and attempts to parse JSON.
 * Throws a descriptive error if the response cannot be parsed.
 */
function parseGeminiResponse(rawText: string): AnalysisResult {
  // Remove ```json ... ``` fences if Gemini ignores the instructions
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Gemini returned invalid JSON. Raw response: ${cleaned.slice(0, 300)}`
    );
  }

  return normalizeAnalysisResult(parsed);
}

/**
 * Ensures the parsed object conforms to AnalysisResult.
 * Fills in missing top-level keys with safe defaults to avoid crashes in the UI.
 */
function normalizeAnalysisResult(raw: unknown): AnalysisResult {
  const obj = (raw ?? {}) as Record<string, unknown>;

  return {
    proveedor: normalizeProveedor(obj.proveedor),
    cotizacion: normalizeCotizacion(obj.cotizacion),
    lineas: normalizeLineas(obj.lineas),
    totales: normalizeTotales(obj.totales),
    campos_faltantes: Array.isArray(obj.campos_faltantes)
      ? (obj.campos_faltantes as string[])
      : [],
    preguntas_sugeridas: Array.isArray(obj.preguntas_sugeridas)
      ? (obj.preguntas_sugeridas as string[])
      : [],
  };
}

function normalizeProveedor(raw: unknown) {
  const p = (raw ?? {}) as Record<string, unknown>;
  return {
    nombre: (p.nombre as string) ?? null,
    ruc_nit_id: (p.ruc_nit_id as string) ?? null,
    telefono: (p.telefono as string) ?? null,
    email: (p.email as string) ?? null,
    direccion: (p.direccion as string) ?? null,
    contacto_nombre: (p.contacto_nombre as string) ?? null,
  };
}

function normalizeCotizacion(raw: unknown) {
  const c = (raw ?? {}) as Record<string, unknown>;
  return {
    numero: (c.numero as string) ?? null,
    fecha_emision: (c.fecha_emision as string) ?? null,
    fecha_validez: (c.fecha_validez as string) ?? null,
    moneda: (c.moneda as string) ?? null,
    condiciones_pago: (c.condiciones_pago as string) ?? null,
    tiempo_entrega: (c.tiempo_entrega as string) ?? null,
    notas_generales: (c.notas_generales as string) ?? null,
  };
}

function normalizeLineas(raw: unknown) {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, idx) => {
    const l = (item ?? {}) as Record<string, unknown>;
    return {
      numero_linea: (l.numero_linea as number) ?? idx + 1,
      codigo: (l.codigo as string) ?? null,
      descripcion: (l.descripcion as string) ?? '',
      especificaciones: (l.especificaciones as string) ?? null,
      cantidad: (l.cantidad as number) ?? null,
      unidad: (l.unidad as string) ?? null,
      precio_unitario: (l.precio_unitario as number) ?? null,
      descuento_pct: (l.descuento_pct as number) ?? null,
      subtotal: (l.subtotal as number) ?? null,
    };
  });
}

function normalizeTotales(raw: unknown) {
  const t = (raw ?? {}) as Record<string, unknown>;
  return {
    subtotal: (t.subtotal as number) ?? null,
    descuento: (t.descuento as number) ?? null,
    impuestos_pct: (t.impuestos_pct as number) ?? null,
    impuestos_monto: (t.impuestos_monto as number) ?? null,
    total: (t.total as number) ?? null,
  };
}
