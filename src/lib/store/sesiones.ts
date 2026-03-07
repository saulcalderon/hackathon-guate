import type { SesionSolicitud, SesionPatchRequest } from '@/types/solicitudes';

/**
 * In-memory singleton store for sesiones_solicitud.
 * Replaces Supabase for local development / demo mode when DB credentials
 * are not available. Data persists for the lifetime of the Next.js server
 * process — a restart clears all sessions.
 */

const globalStore = globalThis as typeof globalThis & {
  __sesionesStore?: Map<string, SesionSolicitud>;
};

// Reuse across hot-reloads in dev mode
if (!globalStore.__sesionesStore) {
  globalStore.__sesionesStore = new Map<string, SesionSolicitud>();
}

export const sesionesStore: Map<string, SesionSolicitud> = globalStore.__sesionesStore;

export function getAllSesiones(): SesionSolicitud[] {
  return Array.from(sesionesStore.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getSesion(id: string): SesionSolicitud | undefined {
  return sesionesStore.get(id);
}

export function createSesion(
  data: Omit<SesionSolicitud, 'id' | 'estado' | 'mensajes' | 'proveedor_elegido' | 'created_at' | 'updated_at'>
): SesionSolicitud {
  const now = new Date().toISOString();
  const sesion: SesionSolicitud = {
    ...data,
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

export function patchSesion(id: string, patch: SesionPatchRequest): SesionSolicitud | null {
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
