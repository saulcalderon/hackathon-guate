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

/**
 * Checks if Supabase is properly configured.
 */
function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getAllSesiones(): Promise<SesionSolicitud[]> {
  if (isSupabaseConfigured()) {
    try {
      return await sesionesDb.dbGetAllSesiones();
    } catch (error) {
      console.error('Error fetching all sesiones from DB:', error);
      return getAllSesionesMemory();
    }
  }
  return getAllSesionesMemory();
}

export async function getSesion(id: string): Promise<SesionSolicitud | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const dbResult = await sesionesDb.dbGetSesion(id);
      if (dbResult) return dbResult;
      // Fallback to memory if not found in DB (could be a residual in-memory session)
      return getSesionMemory(id);
    } catch (error) {
      console.error(`Error fetching sesion ${id} from DB:`, error);
      return getSesionMemory(id);
    }
  }
  return getSesionMemory(id);
}

export async function createSesion(
  data: Omit<SesionSolicitud, 'id' | 'estado' | 'mensajes' | 'proveedor_elegido' | 'created_at' | 'updated_at'>
): Promise<SesionSolicitud> {
  if (isSupabaseConfigured()) {
    try {
      return await sesionesDb.dbCreateSesion(data);
    } catch (error) {
      console.error('Error creating sesion in DB:', error);
      return createSesionMemory(data);
    }
  }
  return createSesionMemory(data);
}

export async function patchSesion(id: string, patch: SesionPatchRequest): Promise<SesionSolicitud | null> {
  if (isSupabaseConfigured()) {
    try {
      const dbResult = await sesionesDb.dbPatchSesion(id, patch);
      if (dbResult) return dbResult;
      return patchSesionMemory(id, patch);
    } catch (error) {
      console.error(`Error patching sesion ${id} in DB:`, error);
      return patchSesionMemory(id, patch);
    }
  }
  return patchSesionMemory(id, patch);
}
