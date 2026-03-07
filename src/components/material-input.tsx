"use client";

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";

interface MaterialInputProps {
  onSubmit: (text: string, pdfBase64?: string) => void;
  isLoading: boolean;
}

export function MaterialInput({ onSubmit, isLoading }: MaterialInputProps) {
  const [text, setText] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = Array.from(e.dataTransfer.files).find(
      (f) => f.type === "application/pdf",
    );
    if (file) setPdfFile(file);
  }, []);

  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPdfFile(file);
  }, []);

  const handleSubmit = useCallback(async () => {
    let pdfBase64: string | undefined;

    if (pdfFile) {
      const buffer = await pdfFile.arrayBuffer();
      pdfBase64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ""),
      );
    }

    onSubmit(text, pdfBase64);
  }, [text, pdfFile, onSubmit]);

  const hasInput = text.trim().length > 0 || pdfFile !== null;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground">Lista de Materiales</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Escribe o pega tu lista de materiales de construcción
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Ejemplo:\n50 sacos de Cemento UGC 4000 PSI (Cementos Progreso)\n10 quintales de Hierro corrugado 3/8" grado 40 (SIDEGUA)\n30 láminas de zinc galvanizado 12 pies calibre 26 (Zinc Acanalado)\n20 tubos PVC 4" drenaje (Amanco/Mexichem)\n8 galones de pintura látex blanca (Sherwin-Williams SuperPaint)\n15 bolsas de pegamix para piso (Intaco)\n200 blocks de 15x20x40 cm`}
        rows={8}
        className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="mt-3">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 text-xs transition-colors",
            isDragOver
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:border-primary/50",
            pdfFile && "border-primary/30 bg-primary/5",
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          {pdfFile ? (
            <span className="text-primary font-medium">{pdfFile.name}</span>
          ) : (
            <span>Subir PDF de lista de materiales (opcional)</span>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {pdfFile && (
          <button
            type="button"
            onClick={() => setPdfFile(null)}
            className="mt-1 text-xs text-muted-foreground hover:text-destructive"
          >
            Quitar PDF
          </button>
        )}
      </div>

      <button
        type="button"
        disabled={!hasInput || isLoading}
        onClick={handleSubmit}
        className={cn(
          "mt-4 w-full rounded-xl py-3 text-sm font-semibold transition-all",
          hasInput && !isLoading
            ? "bg-primary text-primary-foreground shadow-md hover:opacity-90 cursor-pointer"
            : "cursor-not-allowed bg-muted text-muted-foreground",
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Procesando...
          </span>
        ) : (
          "Analizar Mercado"
        )}
      </button>
    </div>
  );
}
