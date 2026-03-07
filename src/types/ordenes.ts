// ────────────────────────────────────────────────────────────
// Ordenes de compra — gestionadas por Findr.ai
// ────────────────────────────────────────────────────────────

export type EstadoOrden = 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';

export interface OrdenCompra {
  id: string;
  sesion_id: string;
  proveedor_nombre: string;
  proveedor_display: string;
  descripcion_producto: string;
  cantidad: string;
  precio_estimado: number;
  moneda: 'GTQ' | 'USD' | 'SVC';
  comision_pct: number;
  total_con_comision: number;
  notas_cliente: string | null;
  estado: EstadoOrden;
  created_at: string;
  updated_at: string;
}

export interface OrdenCreateRequest {
  sesion_id: string;
  proveedor_nombre: string;
  proveedor_display: string;
  descripcion_producto: string;
  cantidad: string;
  precio_estimado: number;
  moneda: 'GTQ' | 'USD' | 'SVC';
  notas_cliente?: string;
}

export interface OrdenPatchRequest {
  estado?: EstadoOrden;
  notas_cliente?: string;
}
