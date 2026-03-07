'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  CreditCard,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  RefreshCw,
  Trophy,
  Ban,
  Check,
  FileText,
  Split,
} from 'lucide-react';
import type { ResultadoProveedor, ChatMessage, EstadoSesion } from '@/types/solicitudes';
import type { ChatApiResponse } from '@/types/solicitudes';
import type { ApiError } from '@/types/cotizaciones';
import type { OptimizationResult } from '@/lib/schemas';
import ComprarModal from '@/components/dashboard/ComprarModal';
import { InvoicePanel } from '@/components/invoice-panel';

interface ResultadosChatProps {
  resultados: ResultadoProveedor[];
  contexto: string;
  onReset: () => void;
  sessionId?: string;
  initialMessages?: ChatMessage[];
  sesionEstado?: EstadoSesion;
  proveedorElegido?: string | null;
  onProveedorElegido?: (proveedorDisplay: string) => void;
  cantidadInicial?: number | null;
  unidadInicial?: string | null;
}

const MONEDA_SYMBOL: Record<string, string> = {
  GTQ: 'Q',
  USD: '$',
  SVC: '₡',
};

const DISPONIBILIDAD_CONFIG = {
  disponible: { label: 'Disponible', className: 'bg-green-100 text-green-700' },
  bajo_stock: { label: 'Stock limitado', className: 'bg-amber-100 text-amber-700' },
  sin_stock: { label: 'Sin stock', className: 'bg-red-100 text-red-700' },
};

function parseSugerencias(text: string): string[] {
  const match = text.match(/SUGERENCIAS:\s*(\[[\s\S]*?\])/);
  if (!match) return [];
  try {
    const arr = JSON.parse(match[1]) as unknown;
    if (Array.isArray(arr)) return arr.filter((x): x is string => typeof x === 'string').slice(0, 3);
  } catch {
    // ignore parse errors
  }
  return [];
}

function stripSugerencias(text: string): string {
  return text.replace(/\n*SUGERENCIAS:\s*\[[\s\S]*?\]/, '').trim();
}

function ProveedorResultCard({
  r,
  rank,
  proveedorDisplay,
  isSelected,
  onSelect,
  isMejorPrecio,
  canSelect,
}: {
  r: ResultadoProveedor;
  rank: number;
  proveedorDisplay: string;
  isSelected: boolean;
  onSelect: () => void;
  isMejorPrecio: boolean;
  canSelect: boolean;
}) {
  const sym = MONEDA_SYMBOL[r.moneda] ?? '';
  const disp = DISPONIBILIDAD_CONFIG[r.disponibilidad];

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-findrai-primary border-findrai-primary' : 'border-slate-200'
      }`}
    >
      <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-findrai-primary/10 text-findrai-primary font-bold text-sm flex items-center justify-center shrink-0">
            {rank}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-slate-900 text-sm leading-tight">{r.nombre}</p>
              {r.material_descripcion && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                  {r.material_descripcion}
                </span>
              )}
              {isMejorPrecio && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  Mejor precio
                </span>
              )}
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${disp.className}`}>
              {disp.label}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold text-findrai-primary">
            {sym} {r.precio.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
            {(r.cantidad ?? 1) > 1 && (
              <span className="ml-1 text-sm font-normal text-slate-500">
                × {r.cantidad} {r.unidad ?? 'unidad'} = {sym}{((r.precio * (r.cantidad ?? 1))).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
              </span>
            )}
          </p>
          <p className="text-xs text-slate-400">{r.moneda}</p>
        </div>
      </div>

      <div className="px-4 pt-3 pb-2">
        <p className="text-xs text-slate-600 leading-relaxed">{r.descripcion_producto}</p>
      </div>

      <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {r.tiempo_entrega}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {r.condiciones_pago}
        </div>
        {r.garantia && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 col-span-2">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {r.garantia}
          </div>
        )}
      </div>

      <div className="px-4 pb-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
        <div>
          <div className="flex items-center gap-1 mb-1.5">
            <ThumbsUp className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-semibold text-green-700">Pros</span>
          </div>
          <ul className="space-y-1">
            {r.pros.map((p, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                <span className="text-green-500 mt-0.5 shrink-0">+</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1.5">
            <ThumbsDown className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-semibold text-red-600">Contras</span>
          </div>
          <ul className="space-y-1">
            {r.contras.map((c, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                <span className="text-red-400 mt-0.5 shrink-0">−</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {canSelect && r.disponibilidad !== 'sin_stock' && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3">
          <button
            onClick={onSelect}
            className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
              isSelected
                ? 'bg-findrai-primary/10 text-findrai-primary border border-findrai-primary/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4" />
                Seleccionado
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Elegir este proveedor
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function getProveedorDisplay(rank: number): string {
  return `Proveedor ${String.fromCharCode(64 + rank)}`;
}

export default function ResultadosChat({
  resultados,
  contexto,
  onReset,
  sessionId,
  initialMessages,
  sesionEstado,
  proveedorElegido,
  onProveedorElegido,
  cantidadInicial,
  unidadInicial,
}: ResultadosChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages ?? []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initDone, setInitDone] = useState(false);
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [sugerenciasUsadas, setSugerenciasUsadas] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [optimizeResult, setOptimizeResult] = useState<OptimizationResult | null>(null);
  const [optimizeLoading, setOptimizeLoading] = useState(false);
  const [confirmingOrders, setConfirmingOrders] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sortedResultados = [...resultados].sort((a, b) => {
    const totalA = a.precio * (a.cantidad ?? 1);
    const totalB = b.precio * (b.cantidad ?? 1);
    return totalA - totalB;
  });
  const cheapestIds = (() => {
    const byMaterial = new Map<string, string>();
    for (const r of sortedResultados) {
      const key = r.material_descripcion ?? '__single__';
      if (!byMaterial.has(key)) byMaterial.set(key, r.id);
    }
    return new Set(byMaterial.values());
  })();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!proveedorElegido || resultados.length === 0) return;
    const sorted = [...resultados].sort((a, b) => a.precio - b.precio);
    const idx = sorted.findIndex((_, i) => getProveedorDisplay(i + 1) === proveedorElegido);
    if (idx >= 0) setSelectedId(sorted[idx].id);
  }, [proveedorElegido, resultados]);
  const selectedResult = sortedResultados.find((r) => r.id === selectedId);
  const selectedDisplay = selectedResult
    ? getProveedorDisplay(sortedResultados.indexOf(selectedResult) + 1)
    : null;

  const isDisabled = sesionEstado === 'resuelta' || sesionEstado === 'cancelada';
  const canSelect = !isDisabled && !!sessionId;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setInitDone(true);
      const firstAssistant = initialMessages.find((m) => m.role === 'assistant');
      if (firstAssistant) {
        const s = parseSugerencias(firstAssistant.content);
        if (s.length > 0) setSugerencias(s);
      }
      return;
    }

    if (initDone) return;
    setInitDone(true);

    const primer: ChatMessage = {
      role: 'user',
      content:
        'Analiza estos resultados de proveedores. Dame un resumen breve de las opciones, destaca la mejor relación precio-calidad y cualquier punto de atención importante.',
    };

    sendMessage([primer]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistMessages = async (msgs: ChatMessage[]) => {
    if (!sessionId) return;
    await fetch(`/api/solicitudes/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensajes: msgs }),
    });
  };

  const sendMessage = async (msgs: ChatMessage[]) => {
    setLoading(true);
    setMessages(msgs);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, contexto }),
      });

      const data = (await res.json()) as ChatApiResponse | ApiError;

      if (!res.ok || 'error' in data) {
        const errMsg = 'error' in data ? data.error : 'Error desconocido';
        const updated: ChatMessage[] = [
          ...msgs,
          { role: 'assistant', content: `Lo siento, ocurrió un error: ${errMsg}` },
        ];
        setMessages(updated);
        return;
      }

      const rawReply = data.reply;
      const s = parseSugerencias(rawReply);
      if (s.length > 0 && !sugerenciasUsadas) setSugerencias(s);

      const cleanReply = stripSugerencias(rawReply);
      const updated: ChatMessage[] = [...msgs, { role: 'assistant', content: cleanReply }];
      setMessages(updated);
      await persistMessages(updated);
    } catch (err) {
      const updated: ChatMessage[] = [
        ...msgs,
        {
          role: 'assistant',
          content: `Error de red al conectar con el asistente: ${String(err)}`,
        },
      ];
      setMessages(updated);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t || loading || isDisabled) return;
    setInput('');
    if (text) {
      setSugerenciasUsadas(true);
      setSugerencias([]);
    }

    const userMsg: ChatMessage = { role: 'user', content: t };
    const updated = [...messages, userMsg];
    sendMessage(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {resultados.length} proveedor{resultados.length !== 1 ? 'es' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Resultados de demostración — el motor de búsqueda real se integra próximamente.
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Nueva búsqueda
        </button>
      </div>

      {canSelect && resultados.length > 0 && (
        <div className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-800">
            Cotización optimizada
          </p>
          <p className="text-xs text-slate-600">
            Findr.ai asigna cada ítem al proveedor con mejor precio. Revisa el desglose y crea órdenes por proveedor.
          </p>
          <button
            onClick={async () => {
              if (!sessionId || optimizeLoading) return;
              setOptimizeLoading(true);
              try {
                const res = await fetch(`/api/solicitudes/${sessionId}/optimize`, {
                  method: 'POST',
                });
                if (res.ok) {
                  const data = (await res.json()) as OptimizationResult;
                  setOptimizeResult(data);
                }
              } finally {
                setOptimizeLoading(false);
              }
            }}
            disabled={optimizeLoading || !sessionId}
            className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-findrai-primary hover:bg-findrai-secondary rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
          >
            {optimizeLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Split className="w-4 h-4" />
            )}
            Ver cotización optimizada
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {sortedResultados.map((r, idx) => (
          <ProveedorResultCard
            key={r.id}
            r={r}
            rank={idx + 1}
            proveedorDisplay={getProveedorDisplay(idx + 1)}
            isSelected={selectedId === r.id}
            onSelect={() => setSelectedId(selectedId === r.id ? null : r.id)}
            isMejorPrecio={cheapestIds.has(r.id)}
            canSelect={canSelect}
          />
        ))}
      </div>

      {canSelect && selectedResult && selectedDisplay && (
        <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">{selectedDisplay}</span> seleccionado. Procede a crear la cotización para tu empresa.
          </p>
          <button
            onClick={() => {
              onProveedorElegido?.(selectedDisplay);
              setShowModal(true);
            }}
            className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Proceder con cotización
          </button>
        </div>
      )}

      {showModal && sessionId && selectedResult && selectedDisplay && (
        <ComprarModal
          proveedor={selectedResult}
          proveedorDisplay={selectedDisplay}
          sesionId={sessionId}
          onClose={() => setShowModal(false)}
          cantidadInicial={selectedResult.cantidad ?? cantidadInicial}
          unidadInicial={selectedResult.unidad ?? unidadInicial}
        />
      )}

      {optimizeResult && sessionId && (
        <InvoicePanel
          result={optimizeResult}
          onClose={() => setOptimizeResult(null)}
          showCommission
          sesionId={sessionId}
          confirmLoading={confirmingOrders}
          onConfirmOrders={async () => {
            setConfirmingOrders(true);
            try {
              for (const inv of optimizeResult.invoices) {
                for (const line of inv.lines) {
                  const res = await fetch('/api/ordenes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      sesion_id: sessionId,
                      proveedor_nombre: inv.vendorName,
                      proveedor_display: inv.vendorName,
                      descripcion_producto: line.materialName,
                      cantidad: `${line.quantity} ${line.unit}`,
                      precio_estimado: line.unitPrice,
                      moneda: inv.moneda ?? 'GTQ',
                    }),
                  });
                  if (!res.ok) throw new Error('Error al crear orden');
                }
              }
            } finally {
              setConfirmingOrders(false);
            }
          }}
        />
      )}

      {sesionEstado === 'resuelta' && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <Trophy className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-sm text-green-800 font-semibold">
            Sesión resuelta. El chat está deshabilitado.
          </p>
        </div>
      )}
      {sesionEstado === 'cancelada' && (
        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <Ban className="w-5 h-5 text-slate-500 shrink-0" />
          <p className="text-sm text-slate-600 font-semibold">
            Esta solicitud fue cancelada.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Bot className="w-5 h-5 text-findrai-primary" />
          <h3 className="font-bold text-slate-900">Asistente de compras</h3>
          <span className="ml-auto text-xs text-slate-400">Pregunta sobre estos resultados</span>
        </div>

        <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
          {messages.length === 0 && loading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-findrai-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-findrai-primary" />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analizando resultados…
              </div>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            if (idx === 0 && isUser) return null;
            return (
              <div key={idx} data-msg-index={idx} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-findrai-primary' : 'bg-findrai-primary/10'}`}>
                  {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-findrai-primary" />}
                </div>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'bg-findrai-primary text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            );
          })}

          {loading && messages.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-findrai-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-findrai-primary" />
              </div>
              <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-100 rounded-2xl rounded-tl-sm">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {sugerencias.length > 0 && !sugerenciasUsadas && !loading && !isDisabled && (
          <div className="px-6 pb-3 flex flex-wrap gap-2">
            {sugerencias.map((s, i) => (
              <button key={i} onClick={() => handleSend(s)} className="px-3 py-1.5 text-xs font-semibold text-findrai-primary bg-findrai-primary/5 hover:bg-findrai-primary/10 border border-findrai-primary/20 rounded-full transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="px-6 pb-4 pt-2 border-t border-slate-100">
          {messages.some((m) => m.role === 'assistant') && !isDisabled && (
            <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              Puedes seguir preguntando — el asistente recuerda el contexto de esta búsqueda.
            </p>
          )}
          {!isDisabled && (
            <div className="flex gap-3 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ej: ¿Cuál recomiendas si necesito entrega hoy? ¿El precio incluye IVA?"
                rows={2}
                disabled={loading}
                className="flex-1 px-4 py-3 text-sm text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-findrai-primary/30 focus:border-findrai-primary resize-none placeholder-slate-400 bg-white transition-colors"
              />
              <button onClick={() => handleSend()} disabled={!input.trim() || loading} className="p-3 bg-findrai-primary hover:bg-findrai-secondary text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0" aria-label="Enviar mensaje">
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
          {!isDisabled && <p className="text-xs text-slate-400 mt-1.5">Enter para enviar · Shift+Enter para nueva línea</p>}
        </div>
      </div>
    </div>
  );
}
