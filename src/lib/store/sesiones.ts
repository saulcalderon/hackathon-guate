import * as sesionesDb from '@/lib/db/sesiones';
import type { SesionSolicitud, SesionPatchRequest } from '@/types/solicitudes';

const globalStore = globalThis as typeof globalThis & {
  __sesionesStore?: Map<string, SesionSolicitud>;
};

if (!globalStore.__sesionesStore) {
  globalStore.__sesionesStore = new Map<string, SesionSolicitud>();
}

export const sesionesStore: Map<string, SesionSolicitud> = globalStore.__sesionesStore;

function getAllSesionesMemory(): SesionSolicitud[] {
  return Array.from(sesionesStore.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

function getSesionMemory(id: string): SesionSolicitud | undefined {
  return sesionesStore.get(id);
}

function createSesionMemory(
  data: Omit<SesionSolicitud, 'id' | 'estado' | 'mensajes' | 'proveedor_elegido' | 'created_at' | 'updated_at'>
): SesionSolicitud {
  const now = new Date().toISOString();
  const sesion: SesionSolicitud = {
    ...data,
    cantidad: data.cantidad ?? null,
    unidad: data.unidad ?? null,
    id: crypto.randomUUID(),
    estado: 'activa',
    mensajes: [],
    proveedor_elegido: null,
    created_at: now,
    updated_at: now,
  };
  sesionesStore.set(sesion.id, sesion);
  return sesion;
}

function patchSesionMemory(id: string, patch: SesionPatchRequest): SesionSolicitud | null {
  const sesion = sesionesStore.get(id);
  if (!sesion) return null;
  const updated: SesionSolicitud = {
    ...sesion,
    ...(patch.mensajes !== undefined && { mensajes: patch.mensajes }),
    ...(patch.estado !== undefined && { estado: patch.estado }),
    ...('proveedor_elegido' in patch && { proveedor_elegido: patch.proveedor_elegido ?? null }),
    updated_at: new Date().toISOString(),
  };
  sesionesStore.set(id, updated);
  return updated;
}

function isPrismaConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export async function getAllSesiones(): Promise<SesionSolicitud[]> {
  if (isPrismaConfigured()) {
    try {
      return await sesionesDb.dbGetAllSesiones();
    } catch {
      return getAllSesionesMemory();
    }
  }
  return getAllSesionesMemory();
}

export async function getSesion(id: string): Promise<SesionSolicitud | undefined> {
  if (isPrismaConfigured()) {
    try {
      return await sesionesDb.dbGetSesion(id);
    } catch {
      return getSesionMemory(id);
    }
  }
  return getSesionMemory(id);
}

export async function createSesion(
  data: Omit<SesionSolicitud, 'id' | 'estado' | 'mensajes' | 'proveedor_elegido' | 'created_at' | 'updated_at'>
): Promise<SesionSolicitud> {
  if (isPrismaConfigured()) {
    try {
      return await sesionesDb.dbCreateSesion(data);
    } catch {
      return createSesionMemory(data);
    }
  }
  return createSesionMemory(data);
}

export async function patchSesion(id: string, patch: SesionPatchRequest): Promise<SesionSolicitud | null> {
  if (isPrismaConfigured()) {
    try {
      return await sesionesDb.dbPatchSesion(id, patch);
    } catch {
      return patchSesionMemory(id, patch);
    }
  }
  return patchSesionMemory(id, patch);
}
