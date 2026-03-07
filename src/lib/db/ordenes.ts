import { prisma } from '@/lib/db';
import type { OrdenCompraRow } from '@/lib/db/types';
import { COMISION_FINDRAI_PCT } from '@/lib/constants/planes';
import type { OrdenCompra, OrdenCreateRequest, OrdenPatchRequest } from '@/types/ordenes';

function rowToOrden(row: OrdenCompraRow): OrdenCompra {
  return {
    id: row.id,
    sesion_id: row.sesionId ?? '',
    proveedor_nombre: row.proveedorNombre,
    proveedor_display: row.proveedorDisplay,
    descripcion_producto: row.descripcionProducto,
    cantidad: row.cantidad,
    precio_estimado: Number(row.precioEstimado),
    moneda: row.moneda as OrdenCompra['moneda'],
    comision_pct: Number(row.comisionPct),
    total_con_comision: Number(row.totalConComision),
    notas_cliente: row.notasCliente,
    estado: row.estado as OrdenCompra['estado'],
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

export async function dbGetAllOrdenes(): Promise<OrdenCompra[]> {
  const rows = await prisma.ordenCompra.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(rowToOrden);
}

export async function dbGetOrden(id: string): Promise<OrdenCompra | undefined> {
  const row = await prisma.ordenCompra.findUnique({ where: { id } });
  return row ? rowToOrden(row) : undefined;
}

export async function dbCreateOrden(data: OrdenCreateRequest): Promise<OrdenCompra> {
  const comision = COMISION_FINDRAI_PCT;
  const total = parseFloat(
    (data.precio_estimado * (1 + comision / 100)).toFixed(2)
  );

  const row = await prisma.ordenCompra.create({
    data: {
      sesionId: data.sesion_id || null,
      proveedorNombre: data.proveedor_nombre,
      proveedorDisplay: data.proveedor_display,
      descripcionProducto: data.descripcion_producto,
      cantidad: data.cantidad,
      precioEstimado: data.precio_estimado,
      moneda: data.moneda,
      comisionPct: comision,
      totalConComision: total,
      notasCliente: data.notas_cliente ?? null,
      estado: 'pendiente',
    },
  });
  return rowToOrden(row);
}

export async function dbPatchOrden(
  id: string,
  patch: OrdenPatchRequest
): Promise<OrdenCompra | null> {
  const update: { estado?: string; notasCliente?: string | null } = {};
  if (patch.estado !== undefined) update.estado = patch.estado;
  if (patch.notas_cliente !== undefined) update.notasCliente = patch.notas_cliente;

  if (Object.keys(update).length === 0) {
    const existing = await dbGetOrden(id);
    return existing ?? null;
  }

  const row = await prisma.ordenCompra.update({
    where: { id },
    data: update,
  });
  return rowToOrden(row);
}
