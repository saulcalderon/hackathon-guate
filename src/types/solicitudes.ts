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
  /** Material this quote belongs to (multi-material sessions) */
  material_descripcion?: string;
  cantidad?: number;
  unidad?: string;
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

// ────────────────────────────────────────────────────────────
// Sesion (session persistence)
// ────────────────────────────────────────────────────────────

export type EstadoSesion = 'activa' | 'resuelta' | 'cancelada';

export interface SesionSolicitud {
  id: string;
  descripcion: string;
  categorias: string[];
  modo: ModoBusqueda;
  urgencia: Urgencia;
  prioridades: PrioridadClave[];
  presupuesto: string | null;
  cantidad?: number | null;
  unidad?: string | null;
  resultados: ResultadoProveedor[];
  mensajes: ChatMessage[];
  proveedor_elegido: string | null;
  estado: EstadoSesion;
  created_at: string;
  updated_at: string;
}

export interface SolicitudApiResponse {
  id: string;
}

export interface SesionPatchRequest {
  mensajes?: ChatMessage[];
  estado?: EstadoSesion;
  proveedor_elegido?: string | null;
}
