import type { OrdenCompra, OrdenCreateRequest, OrdenPatchRequest } from '@/types/ordenes';
import { COMISION_FINDRAI_PCT } from '@/lib/constants/planes';

/**
 * In-memory singleton store for ordenes_compra.
 * Same pattern as lib/store/sesiones.ts — persists while the server process runs.
 */

const globalStore = globalThis as typeof globalThis & {
  __ordenesStore?: Map<string, OrdenCompra>;
};

if (!globalStore.__ordenesStore) {
  globalStore.__ordenesStore = new Map<string, OrdenCompra>();
}

export const ordenesStore: Map<string, OrdenCompra> = globalStore.__ordenesStore;

export function getAllOrdenes(): OrdenCompra[] {
  return Array.from(ordenesStore.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getOrden(id: string): OrdenCompra | undefined {
  return ordenesStore.get(id);
}

export function createOrden(data: OrdenCreateRequest): OrdenCompra {
  const now = new Date().toISOString();
  const comision = COMISION_FINDRAI_PCT;
  const total = parseFloat(
    (data.precio_estimado * (1 + comision / 100)).toFixed(2)
  );

  const orden: OrdenCompra = {
    id: crypto.randomUUID(),
    sesion_id: data.sesion_id,
    proveedor_nombre: data.proveedor_nombre,
    proveedor_display: data.proveedor_display,
    descripcion_producto: data.descripcion_producto,
    cantidad: data.cantidad,
    precio_estimado: data.precio_estimado,
    moneda: data.moneda,
    comision_pct: comision,
    total_con_comision: total,
    notas_cliente: data.notas_cliente ?? null,
    estado: 'pendiente',
    created_at: now,
    updated_at: now,
  };

  ordenesStore.set(orden.id, orden);
  return orden;
}

export function patchOrden(id: string, patch: OrdenPatchRequest): OrdenCompra | null {
  const orden = ordenesStore.get(id);
  if (!orden) return null;

  const updated: OrdenCompra = {
    ...orden,
    ...(patch.estado !== undefined && { estado: patch.estado }),
    ...(patch.notas_cliente !== undefined && { notas_cliente: patch.notas_cliente }),
    updated_at: new Date().toISOString(),
  };

  ordenesStore.set(id, updated);
  return updated;
}
