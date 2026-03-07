import { NextResponse } from 'next/server';
import { createOrden, getAllOrdenes } from '@/lib/stores/ordenes';
import type { OrdenCompra, OrdenCreateRequest } from '@/types/ordenes';
import type { ApiError } from '@/types/cotizaciones';

/**
 * POST /api/ordenes
 * Creates a new purchase order managed by Findrai.
 */
export async function POST(
  request: Request
): Promise<NextResponse<{ id: string } | ApiError>> {
  let body: OrdenCreateRequest;
  try {
    body = (await request.json()) as OrdenCreateRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { sesion_id, proveedor_nombre, descripcion_producto, cantidad, precio_estimado, moneda } = body;

  if (!sesion_id || !proveedor_nombre || !descripcion_producto || !cantidad || precio_estimado == null || !moneda) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const orden = createOrden(body);
  return NextResponse.json({ id: orden.id }, { status: 201 });
}

/**
 * GET /api/ordenes
 * Returns all orders ordered by created_at DESC.
 */
export async function GET(): Promise<NextResponse<OrdenCompra[] | ApiError>> {
  const ordenes = getAllOrdenes();
  return NextResponse.json(ordenes, { status: 200 });
}
