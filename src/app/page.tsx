"use client";

import { useState, useCallback, useRef } from "react";
import { type ComparisonResult } from "@/lib/schemas";
import { fileToBase64 } from "@/lib/utils";
import { InputZone, type ProviderEntry } from "@/components/input-zone";
import { AgentTrace } from "@/components/agent-trace";
import { ComparisonTable } from "@/components/comparison-table";

export default function Dashboard() {
  const [result, setResult] = useState<Partial<ComparisonResult> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  const handleSubmit = useCallback(async (providers: ProviderEntry[]) => {
    setError(null);
    setResult(null);
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const payload = await Promise.all(
        providers.map(async (p, i) => ({
          name: p.name || `Proveedor ${i + 1}`,
          files: await Promise.all(
            p.files.map(async (f) => ({
              name: f.name,
              type: f.type,
              data: await fileToBase64(f),
            })),
          ),
          text: p.text,
        })),
      );

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providers: payload }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed._error) {
              setError(parsed._error);
            } else {
              setResult(parsed as Partial<ComparisonResult>);
            }
          } catch {
            // incomplete line, skip
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Analysis failed");
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              F
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Finr.ai
              </h1>
              <p className="text-xs text-muted-foreground">
                Analizador Inteligente de Cotizaciones
              </p>
            </div>
          </div>

          {isLoading && (
            <button
              onClick={handleStop}
              className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
            >
              Detener
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="border-b border-destructive/30 bg-destructive/10 px-6 py-3">
          <div className="mx-auto flex max-w-[1600px] items-center gap-2 text-sm text-destructive">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-xs underline hover:no-underline cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 lg:p-6">
        <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.5fr] lg:gap-6">
          <div className="min-h-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm md:col-span-1 lg:col-span-1">
            <InputZone onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          <div className="min-h-0 overflow-hidden md:col-span-1 lg:col-span-1">
            <AgentTrace
              steps={result?.trace ?? []}
              isStreaming={isLoading}
            />
          </div>

          <div className="min-h-0 overflow-y-auto md:col-span-2 lg:col-span-1">
            <ComparisonTable
              items={result?.items ?? []}
              summary={result?.summary}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
