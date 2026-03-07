"use client";

import { useEffect, useRef } from "react";
import type { TraceStep } from "@/lib/schemas";

interface AgentTraceProps {
  steps: Partial<TraceStep>[];
  isStreaming: boolean;
}

export function AgentTrace({ steps, isStreaming }: AgentTraceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [steps.length]);

  const isEmpty = steps.length === 0;

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-trace-bg shadow-sm">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 font-mono text-xs text-trace-muted">
          finr-agent — trace
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed"
      >
        {isEmpty && !isStreaming && (
          <p className="text-trace-muted">
            Sube cotizaciones y presiona &quot;Analizar&quot; para ver el
            razonamiento del agente aquí.
          </p>
        )}

        {isEmpty && isStreaming && (
          <p className="text-trace-muted">
            <span className="animate-pulse-dot">●</span> Iniciando análisis...
          </p>
        )}

        {steps.map((step, i) => (
          <div key={i} className="animate-fade-in mb-3">
            {step.step && (
              <div className="flex items-start gap-2">
                <span className="text-trace-text">{">"}</span>
                <span className="font-semibold text-trace-text">
                  {step.step}
                </span>
              </div>
            )}
            {step.detail && (
              <p className="ml-5 mt-0.5 text-slate-400">{step.detail}</p>
            )}
          </div>
        ))}

        {isStreaming && steps.length > 0 && (
          <div className="flex items-center gap-2 text-trace-muted">
            <span className="animate-pulse-dot">●</span>
            <span>procesando...</span>
          </div>
        )}
      </div>
    </div>
  );
}
