import * as ordenesDb from '@/lib/db/ordenes';
import type { OrdenCompra, OrdenCreateRequest, OrdenPatchRequest } from '@/types/ordenes';
import { COMISION_FINDRAI_PCT } from '@/lib/constants/planes';

const globalStore = globalThis as typeof globalThis & {
  __ordenesStore?: Map<string, OrdenCompra>;
};

if (!globalStore.__ordenesStore) {
  globalStore.__ordenesStore = new Map<string, OrdenCompra>();
}

export const ordenesStore: Map<string, OrdenCompra> = globalStore.__ordenesStore;

function getAllOrdenesMemory(): OrdenCompra[] {
  return Array.from(ordenesStore.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

function getOrdenMemory(id: string): OrdenCompra | undefined {
  return ordenesStore.get(id);
}

function createOrdenMemory(data: OrdenCreateRequest): OrdenCompra {
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

function patchOrdenMemory(id: string, patch: OrdenPatchRequest): OrdenCompra | null {
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

function isPrismaConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export async function getAllOrdenes(): Promise<OrdenCompra[]> {
  if (isPrismaConfigured()) {
    try {
      return await ordenesDb.dbGetAllOrdenes();
    } catch {
      return getAllOrdenesMemory();
    }
  }
  return getAllOrdenesMemory();
}

export async function getOrden(id: string): Promise<OrdenCompra | undefined> {
  if (isPrismaConfigured()) {
    try {
      return await ordenesDb.dbGetOrden(id);
    } catch {
      return getOrdenMemory(id);
    }
  }
  return getOrdenMemory(id);
}

export async function createOrden(data: OrdenCreateRequest): Promise<OrdenCompra> {
  if (isPrismaConfigured()) {
    try {
      return await ordenesDb.dbCreateOrden(data);
    } catch {
      return createOrdenMemory(data);
    }
  }
  return createOrdenMemory(data);
}

export async function patchOrden(id: string, patch: OrdenPatchRequest): Promise<OrdenCompra | null> {
  if (isPrismaConfigured()) {
    try {
      return await ordenesDb.dbPatchOrden(id, patch);
    } catch {
      return patchOrdenMemory(id, patch);
    }
  }
  return patchOrdenMemory(id, patch);
}
