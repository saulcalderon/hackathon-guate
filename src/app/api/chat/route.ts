import { NextResponse } from 'next/server';
import { chatWithContext } from '@/lib/gemini/chat';
import type { ChatApiRequest, ChatApiResponse } from '@/types/solicitudes';
import type { ApiError } from '@/types/cotizaciones';

export const maxDuration = 30;

/**
 * POST /api/chat
 * Body: { messages: ChatMessage[], contexto: string }
 *
 * `messages` — full conversation history including the latest user message.
 * `contexto` — JSON string of ResultadoProveedor[] for this search session.
 *
 * Returns: { reply: string }
 */
export async function POST(
  request: Request
): Promise<NextResponse<ChatApiResponse | ApiError>> {
  let body: ChatApiRequest;

  try {
    body = (await request.json()) as ChatApiRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { messages, contexto } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: 'messages must be a non-empty array' },
      { status: 400 }
    );
  }

  if (typeof contexto !== 'string' || !contexto.trim()) {
    return NextResponse.json(
      { error: 'contexto must be a non-empty string' },
      { status: 400 }
    );
  }

  try {
    const reply = await chatWithContext(messages, contexto);
    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: `Chat failed: ${String(err)}` },
      { status: 500 }
    );
  }
}
