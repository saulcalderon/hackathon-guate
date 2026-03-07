import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatMessage, SolicitudInput } from '@/types/solicitudes';

const MODEL = 'gemini-1.5-flash-latest';

const SYSTEM_INSTRUCTION = `Eres un asistente de compras corporativas para empresas centroamericanas (Guatemala, El Salvador, Honduras).

Tu rol es ayudar al usuario a evaluar opciones de proveedores encontradas para su solicitud de compra.
Cuando respondas:
- Sé concreto y directo. No uses bullet points excesivos.
- Habla en español latinoamericano natural, no formal en exceso.
- Si te preguntan por recomendación, da UNA recomendación clara con justificación breve.
- Si te preguntan de precios, considera el contexto local (quetzales, dólares, condiciones de pago centroamericanas).
- No inventes información que no esté en los datos proporcionados.
- Si no tienes suficiente información para responder, dilo claramente y sugiere qué preguntar al proveedor.`;

const URGENCIA_LABEL: Record<string, string> = {
  normal: 'Normal (5 días hábiles)',
  urgente: 'Urgente (48 horas)',
  critico: 'Crítico (24 horas)',
};

function buildContextPreamble(contexto: string, solicitud?: SolicitudInput): string {
  if (!solicitud) {
    return `Estos son los resultados de la búsqueda de proveedores para esta solicitud:\n\n${contexto}`;
  }

  const prioridadesStr = solicitud.prioridades.length > 0
    ? solicitud.prioridades.join(' > ')
    : 'No especificadas';

  const categoriasStr = solicitud.categorias.join(', ');
  const urgenciaStr = URGENCIA_LABEL[solicitud.urgencia] ?? solicitud.urgencia;

  return `=== SOLICITUD DEL COMPRADOR ===
Descripción: "${solicitud.descripcion}"
Categorías: ${categoriasStr}
Urgencia: ${urgenciaStr}
Prioridades del comprador (en orden): ${prioridadesStr}${solicitud.presupuesto_referencial ? `\nPresupuesto referencial: ${solicitud.presupuesto_referencial}` : ''}

=== PROVEEDORES ENCONTRADOS ===
${contexto}

=== INSTRUCCIÓN ===
Pesa tus recomendaciones según las prioridades del comprador indicadas arriba.
Al final de tu PRIMERA respuesta únicamente, agrega exactamente esta línea (sin texto adicional después):
SUGERENCIAS:["pregunta corta 1","pregunta corta 2","pregunta corta 3"]`;
}

/**
 * Sends a conversation to Gemini with the supplier results as context.
 *
 * The `contexto` string (JSON of ResultadoProveedor[]) is injected once
 * as a system-level prefix — it is NOT repeated on every turn.
 *
 * `messages` is the full conversation history including the latest user message.
 * `solicitud` (optional) enriches the context with buyer priorities and structured sections.
 */
export async function chatWithContext(
  messages: ChatMessage[],
  contexto: string,
  solicitud?: SolicitudInput
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY environment variable');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const contextPreamble = buildContextPreamble(contexto, solicitud);

  const history = [
    {
      role: 'user' as const,
      parts: [{ text: contextPreamble }],
    },
    {
      role: 'model' as const,
      parts: [{ text: 'Entendido. He analizado los resultados y las prioridades del comprador. ¿En qué puedo ayudarte?' }],
    },
    ...messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.content }],
    })),
  ];

  const chat = model.startChat({ history });

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.role !== 'user') {
    throw new Error('Last message must be from the user');
  }

  const result = await chat.sendMessage(lastMessage.content);
  const text = result.response.text();

  if (!text?.trim()) {
    throw new Error('Gemini returned an empty response');
  }

  return text.trim();
}
