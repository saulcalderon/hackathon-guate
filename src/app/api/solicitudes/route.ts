import { NextResponse } from 'next/server';
import { createSesion, getAllSesiones } from '@/lib/store/sesiones';
import type { SesionSolicitud, SolicitudApiResponse } from '@/types/solicitudes';
import type { ApiError } from '@/types/cotizaciones';

/**
 * POST /api/solicitudes
 * Creates a new session and returns its ID.
 */
export async function POST(
  request: Request
): Promise<NextResponse<SolicitudApiResponse | ApiError>> {
  let body: Partial<SesionSolicitud>;
  try {
    body = (await request.json()) as Partial<SesionSolicitud>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { descripcion, categorias, modo, urgencia, prioridades, resultados } = body;

  if (!descripcion || !categorias || !modo || !urgencia || !prioridades || !resultados) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const sesion = await createSesion({
    descripcion,
    categorias,
    modo,
    urgencia,
    prioridades,
    presupuesto: body.presupuesto ?? null,
    cantidad: body.cantidad ?? null,
    unidad: body.unidad ?? null,
    resultados,
  });

  return NextResponse.json({ id: sesion.id }, { status: 201 });
}

/**
 * GET /api/solicitudes
 * Returns all sessions ordered by created_at DESC.
 */
export async function GET(): Promise<NextResponse<SesionSolicitud[] | ApiError>> {
  const sesiones = await getAllSesiones();
  return NextResponse.json(sesiones, { status: 200 });
}
