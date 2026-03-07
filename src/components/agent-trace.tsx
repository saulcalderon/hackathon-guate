"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { StreamEvent } from "@/lib/schemas";

interface AgentTraceProps {
  events: StreamEvent[];
  isStreaming: boolean;
}

function ToolIcon({ tool }: { tool: string }) {
  if (tool === "scrapeVendor") {
    return (
      <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    );
  }
  if (tool === "emailVendor") {
    return (
      <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    );
  }
  if (tool === "reportFindings") {
    return (
      <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    );
  }
  return null;
}

function EventEntry({ event }: { event: StreamEvent }) {
  switch (event.type) {
    case "reasoning":
      return (
        <div className="animate-fade-in mb-2">
          <div className="flex items-start gap-2">
            <span className="text-trace-text shrink-0">{">"}</span>
            <span className="text-slate-300 whitespace-pre-wrap">{event.text}</span>
          </div>
        </div>
      );

    case "tool_call":
      return (
        <div className="animate-fade-in mb-2 rounded-md bg-white/5 px-3 py-2">
          <div className="flex items-center gap-2">
            <ToolIcon tool={event.tool} />
            <span className="font-semibold text-trace-text">
              {event.tool === "scrapeVendor" && "Buscando en"}
              {event.tool === "emailVendor" && "Enviando correo a"}
              {event.tool === "reportFindings" && "Reportando hallazgos"}
            </span>
            <span className="text-slate-400">
              {event.tool === "scrapeVendor" && String((event.args as Record<string, unknown>).vendor ?? "")}
              {event.tool === "emailVendor" && String((event.args as Record<string, unknown>).vendorName ?? "")}
            </span>
          </div>
          {event.tool === "scrapeVendor" && (
            <p className="ml-6 mt-1 text-slate-500 text-[11px]">
              Items: {((event.args as Record<string, unknown>).items as string[])?.join(", ")}
            </p>
          )}
        </div>
      );

    case "tool_result": {
      const res = event.result as Record<string, unknown>;
      return (
        <div className="animate-fade-in mb-2 ml-6">
          <div className="flex items-center gap-2">
            <span className={cn(
              "inline-block h-1.5 w-1.5 rounded-full",
              res.error ? "bg-red-400" : "bg-green-400",
            )} />
            <span className="text-slate-400 text-[11px]">
              {event.tool === "scrapeVendor" && `${res.vendor}: ${res.itemCount} resultado(s)`}
              {event.tool === "emailVendor" && (res.success ? `Correo enviado a ${res.vendorName}` : `Error: ${res.error}`)}
              {event.tool === "reportFindings" && `Guardados: ${(res as Record<string, number>).saved} cotizaciones`}
            </span>
          </div>
        </div>
      );
    }

    case "quote_update":
      return (
        <div className="animate-fade-in mb-2 rounded-md bg-accent/10 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-accent font-semibold text-[11px]">
              Actualización de precios — {event.quotes.length} cotización(es)
            </span>
          </div>
        </div>
      );

    case "complete":
      return (
        <div className="animate-fade-in mb-2 mt-3 rounded-md border border-green-800/30 bg-green-900/20 px-3 py-2">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-green-400">Análisis completado</span>
          </div>
          <p className="ml-6 mt-1 text-slate-400 text-[11px]">
            {event.totalVendorsScraped} vendedor(es) consultados, {event.totalEmailsSent} correo(s) enviados
          </p>
        </div>
      );

    case "error":
      return (
        <div className="animate-fade-in mb-2 rounded-md bg-red-900/20 px-3 py-2">
          <span className="text-red-400 text-[11px]">Error: {event.message}</span>
        </div>
      );

    default:
      return null;
  }
}

export function AgentTrace({ events, isStreaming }: AgentTraceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events.length]);

  const isEmpty = events.length === 0;

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-trace-bg shadow-sm">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 font-mono text-xs text-trace-muted">
          findr-agent — trace
        </span>
        {isStreaming && (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-trace-muted">
            <span className="animate-pulse-dot text-green-400">●</span>
            en vivo
          </span>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed"
      >
        {isEmpty && !isStreaming && (
          <p className="text-trace-muted">
            Ingresa tu lista de materiales y presiona &quot;Analizar Mercado&quot;
            para ver el agente trabajar.
          </p>
        )}

        {isEmpty && isStreaming && (
          <p className="text-trace-muted">
            <span className="animate-pulse-dot">●</span> Iniciando agente de compras...
          </p>
        )}

        {events.map((event, i) => (
          <EventEntry key={i} event={event} />
        ))}

        {isStreaming && events.length > 0 && (
          <div className="flex items-center gap-2 text-trace-muted mt-2">
            <span className="animate-pulse-dot">●</span>
            <span>procesando...</span>
          </div>
        )}
      </div>
    </div>
  );
}
