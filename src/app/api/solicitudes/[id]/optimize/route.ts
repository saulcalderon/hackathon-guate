import { NextResponse } from 'next/server';
import { getSesion } from '@/lib/store/sesiones';
import { optimizeSesion } from '@/lib/tools/optimize-sesion';
import type { ApiError } from '@/types/cotizaciones';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/solicitudes/[id]/optimize
 * Returns optimized split-invoice set for the session.
 */
export async function POST(
  _request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  const { id } = await params;
  const sesion = await getSesion(id);

  if (!sesion) {
    return NextResponse.json(
      { error: 'Session not found' } satisfies ApiError,
      { status: 404 }
    );
  }

  const result = optimizeSesion(sesion);
  return NextResponse.json(result, { status: 200 });
}
