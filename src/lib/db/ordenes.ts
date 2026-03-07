import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import type { OrdenCompraRow } from '@/lib/db/types';
import { COMISION_FINDRAI_PCT } from '@/lib/constants/planes';
import type { OrdenCompra, OrdenCreateRequest, OrdenPatchRequest } from '@/types/ordenes';

function rowToOrden(row: any): OrdenCompra {
  return {
    id: row.id,
    sesion_id: row.sesion_id ?? '',
    proveedor_nombre: row.proveedor_nombre,
    proveedor_display: row.proveedor_display,
    descripcion_producto: row.descripcion_producto,
    cantidad: row.cantidad,
    precio_estimado: Number(row.precio_estimado),
    moneda: row.moneda as OrdenCompra['moneda'],
    comision_pct: Number(row.comision_pct),
    total_con_comision: Number(row.total_con_comision),
    notas_cliente: row.notas_cliente,
    estado: row.estado as OrdenCompra['estado'],
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function dbGetAllOrdenes(): Promise<OrdenCompra[]> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('ordenes_compra')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(rowToOrden);
}

export async function dbGetOrden(id: string): Promise<OrdenCompra | undefined> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('ordenes_compra')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return undefined;
  return data ? rowToOrden(data) : undefined;
}

export async function dbCreateOrden(data: OrdenCreateRequest): Promise<OrdenCompra> {
  const comision = COMISION_FINDRAI_PCT;
  const total = parseFloat(
    (data.precio_estimado * (1 + comision / 100)).toFixed(2)
  );

  const supabase = createAdminSupabaseClient();
  const { data: row, error } = await supabase
    .from('ordenes_compra')
    .insert({
      sesion_id: data.sesion_id || null,
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
    })
    .select()
    .single();

  if (error) throw error;
  return rowToOrden(row);
}

export async function dbPatchOrden(
  id: string,
  patch: OrdenPatchRequest
): Promise<OrdenCompra | null> {
  const update: any = {};
  if (patch.estado !== undefined) update.estado = patch.estado;
  if (patch.notas_cliente !== undefined) update.notas_cliente = patch.notas_cliente;

  if (Object.keys(update).length === 0) {
    const existing = await dbGetOrden(id);
    return existing ?? null;
  }

  const supabase = createAdminSupabaseClient();
  const { data: row, error } = await supabase
    .from('ordenes_compra')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return rowToOrden(row);
}
