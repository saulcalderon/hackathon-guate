import { NextResponse } from 'next/server';
import { getSesion, patchSesion } from '@/lib/store/sesiones';
import type { SesionSolicitud, SesionPatchRequest } from '@/types/solicitudes';
import type { ApiError } from '@/types/cotizaciones';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/solicitudes/[id]
 * Returns a session by ID.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext
): Promise<NextResponse<SesionSolicitud | ApiError>> {
  const { id } = await params;
  const sesion = getSesion(id);

  if (!sesion) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json(sesion, { status: 200 });
}

/**
 * PATCH /api/solicitudes/[id]
 * Updates mensajes, estado, or proveedor_elegido.
 */
export async function PATCH(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse<{ ok: true } | ApiError>> {
  const { id } = await params;

  let body: SesionPatchRequest;
  try {
    body = (await request.json()) as SesionPatchRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const updated = patchSesion(id, body);

  if (!updated) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
