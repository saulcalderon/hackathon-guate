import { NextResponse } from 'next/server';
import { getOrden, patchOrden } from '@/lib/stores/ordenes';
import type { OrdenCompra, OrdenPatchRequest } from '@/types/ordenes';
import type { ApiError } from '@/types/cotizaciones';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/ordenes/[id]
 */
export async function GET(
  _request: Request,
  { params }: RouteContext
): Promise<NextResponse<OrdenCompra | ApiError>> {
  const { id } = await params;
  const orden = getOrden(id);

  if (!orden) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json(orden, { status: 200 });
}

/**
 * PATCH /api/ordenes/[id]
 * Updates estado or notas_cliente.
 */
export async function PATCH(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse<{ ok: true } | ApiError>> {
  const { id } = await params;

  let body: OrdenPatchRequest;
  try {
    body = (await request.json()) as OrdenPatchRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const updated = patchOrden(id, body);

  if (!updated) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
