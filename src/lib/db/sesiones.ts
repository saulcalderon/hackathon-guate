import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import type { SesionSolicitudRow } from '@/lib/db/types';
import type { SesionSolicitud, SesionPatchRequest } from '@/types/solicitudes';
import { auth } from '@clerk/nextjs/server';

function rowToSesion(row: any): SesionSolicitud {
  return {
    id: row.id,
    descripcion: row.descripcion,
    categorias: row.categorias,
    modo: row.modo as SesionSolicitud['modo'],
    urgencia: row.urgencia as SesionSolicitud['urgencia'],
    prioridades: row.prioridades as SesionSolicitud['prioridades'],
    presupuesto: row.presupuesto,
    cantidad: row.cantidad != null ? Number(row.cantidad) : null,
    unidad: row.unidad,
    resultados: row.resultados as unknown as SesionSolicitud['resultados'],
    mensajes: (row.mensajes as unknown as SesionSolicitud['mensajes']) ?? [],
    proveedor_elegido: row.proveedor_elegido,
    estado: row.estado as SesionSolicitud['estado'],
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function dbGetAllSesiones(): Promise<SesionSolicitud[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('sesiones_solicitud')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Error in dbGetAllSesiones:', error);
    throw error;
  }
  return (data || []).map(rowToSesion);
}

export async function dbGetSesion(id: string): Promise<SesionSolicitud | undefined> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('sesiones_solicitud')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // No corregir si es simplemente "no encontrado"
      console.error(`[Supabase] Error in dbGetSesion(${id}):`, error);
    }
    return undefined;
  }
  return data ? rowToSesion(data) : undefined;
}

export async function dbCreateSesion(
  data: Omit<SesionSolicitud, 'id' | 'estado' | 'mensajes' | 'proveedor_elegido' | 'created_at' | 'updated_at'>
): Promise<SesionSolicitud> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createAdminSupabaseClient();
  const { data: row, error } = await supabase
    .from('sesiones_solicitud')
    .insert({
      descripcion: data.descripcion,
      categorias: data.categorias,
      modo: data.modo,
      urgencia: data.urgencia,
      prioridades: data.prioridades,
      presupuesto: data.presupuesto ?? null,
      cantidad: data.cantidad ?? null,
      unidad: data.unidad ?? null,
      resultados: data.resultados,
      mensajes: [],
      estado: 'activa',
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return rowToSesion(row);
}

export async function dbPatchSesion(
  id: string,
  patch: SesionPatchRequest
): Promise<SesionSolicitud | null> {
  const update: any = {};
  if (patch.mensajes !== undefined) update.mensajes = patch.mensajes;
  if (patch.estado !== undefined) update.estado = patch.estado;
  if ('proveedor_elegido' in patch) update.proveedor_elegido = patch.proveedor_elegido ?? null;

  if (Object.keys(update).length === 0) {
    const existing = await dbGetSesion(id);
    return existing ?? null;
  }

  const supabase = createAdminSupabaseClient();
  const { data: row, error } = await supabase
    .from('sesiones_solicitud')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return rowToSesion(row);
}
