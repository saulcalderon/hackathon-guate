import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatMessage } from '@/types/solicitudes';

const MODEL = 'gemini-1.5-flash';

const SYSTEM_INSTRUCTION = `Eres un asistente de compras corporativas para empresas centroamericanas (Guatemala, El Salvador, Honduras).

Tu rol es ayudar al usuario a evaluar opciones de proveedores encontradas para su solicitud de compra.
Cuando respondas:
- Sé concreto y directo. No uses bullet points excesivos.
- Habla en español latinoamericano natural, no formal en exceso.
- Si te preguntan por recomendación, da UNA recomendación clara con justificación breve.
- Si te preguntan de precios, considera el contexto local (quetzales, dólares, condiciones de pago centroamericanas).
- No inventes información que no esté en los datos proporcionados.
- Si no tienes suficiente información para responder, dilo claramente y sugiere qué preguntar al proveedor.`;

/**
 * Sends a conversation to Gemini with the supplier results as context.
 *
 * The `contexto` string (JSON of ResultadoProveedor[]) is injected once
 * as a system-level prefix — it is NOT repeated on every turn.
 *
 * `messages` is the full conversation history including the latest user message.
 */
export async function chatWithContext(
  messages: ChatMessage[],
  contexto: string
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

  // Build a chat history for the Gemini multi-turn API.
  // The context is prepended as the first user→model exchange so Gemini
  // "knows" the data without it being repeated in every user turn.
  const contextPreamble = `Estos son los resultados de la búsqueda de proveedores para esta solicitud:\n\n${contexto}`;

  // All messages except the last one form the history; the last is the current prompt.
  const history = [
    // Inject context as a synthetic first turn
    {
      role: 'user' as const,
      parts: [{ text: contextPreamble }],
    },
    {
      role: 'model' as const,
      parts: [{ text: 'Entendido. He analizado los resultados. ¿En qué puedo ayudarte?' }],
    },
    // Real conversation turns (all except the final user message)
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
