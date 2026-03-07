// ────────────────────────────────────────────────────────────
// Domain types for the supplier search / RFQ module
// ────────────────────────────────────────────────────────────

export type ModoBusqueda = 'inmediato' | 'cotizacion_formal';
export type Urgencia = 'normal' | 'urgente' | 'critico';

export const CATEGORIAS = [
  'Construcción y ferretería',
  'Tecnología y equipos',
  'Suministros de oficina',
  'Alimentos y bebidas',
  'Transporte y logística',
  'Maquinaria y equipo industrial',
  'Servicios profesionales',
  'Otro',
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export type PrioridadClave = 'precio' | 'entrega' | 'garantia' | 'especificaciones';

export interface SolicitudInput {
  descripcion: string;
  categorias: Categoria[];
  modo: ModoBusqueda;
  urgencia: Urgencia;
  prioridades: PrioridadClave[];
  presupuesto_referencial?: string;
}

// ────────────────────────────────────────────────────────────
// Supplier result returned (from scraping or mock)
// ────────────────────────────────────────────────────────────

export interface ResultadoProveedor {
  id: string;
  nombre: string;
  descripcion_producto: string;
  precio: number;
  moneda: 'GTQ' | 'USD' | 'SVC';
  tiempo_entrega: string;
  condiciones_pago: string;
  garantia: string | null;
  pros: string[];
  contras: string[];
  url_referencia: string | null;
  disponibilidad: 'disponible' | 'bajo_stock' | 'sin_stock';
  calificacion: number | null;
}

// ────────────────────────────────────────────────────────────
// Chat
// ────────────────────────────────────────────────────────────

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

// ────────────────────────────────────────────────────────────
// API shapes
// ────────────────────────────────────────────────────────────

export interface ChatApiRequest {
  messages: ChatMessage[];
  contexto: string;
}

export interface ChatApiResponse {
  reply: string;
}
