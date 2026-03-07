import { prisma } from '@/lib/db';
import type { SesionSolicitudRow } from '@/lib/db/types';
import type { SesionSolicitud, SesionPatchRequest } from '@/types/solicitudes';

function rowToSesion(row: SesionSolicitudRow): SesionSolicitud {
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
    proveedor_elegido: row.proveedorElegido,
    estado: row.estado as SesionSolicitud['estado'],
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

export async function dbGetAllSesiones(): Promise<SesionSolicitud[]> {
  const rows = await prisma.sesionSolicitud.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(rowToSesion);
}

export async function dbGetSesion(id: string): Promise<SesionSolicitud | undefined> {
  const row = await prisma.sesionSolicitud.findUnique({ where: { id } });
  return row ? rowToSesion(row) : undefined;
}

export async function dbCreateSesion(
  data: Omit<SesionSolicitud, 'id' | 'estado' | 'mensajes' | 'proveedor_elegido' | 'created_at' | 'updated_at'>
): Promise<SesionSolicitud> {
  const row = await prisma.sesionSolicitud.create({
    data: {
      descripcion: data.descripcion,
      categorias: data.categorias,
      modo: data.modo,
      urgencia: data.urgencia,
      prioridades: data.prioridades,
      presupuesto: data.presupuesto ?? null,
      cantidad: data.cantidad ?? null,
      unidad: data.unidad ?? null,
      resultados: data.resultados as object,
      mensajes: [],
      estado: 'activa',
    },
  });
  return rowToSesion(row);
}

export async function dbPatchSesion(
  id: string,
  patch: SesionPatchRequest
): Promise<SesionSolicitud | null> {
  const update: { mensajes?: object; estado?: string; proveedorElegido?: string | null } = {};
  if (patch.mensajes !== undefined) update.mensajes = patch.mensajes as object;
  if (patch.estado !== undefined) update.estado = patch.estado;
  if ('proveedor_elegido' in patch) update.proveedorElegido = patch.proveedor_elegido ?? null;

  if (Object.keys(update).length === 0) {
    const existing = await dbGetSesion(id);
    return existing ?? null;
  }

  const row = await prisma.sesionSolicitud.update({
    where: { id },
    data: update,
  });
  return rowToSesion(row);
}
