"use client";

import {
  useState,
  useRef,
  type DragEvent,
  type ChangeEvent,
  useCallback,
} from "react";
import { cn } from "@/lib/utils";

export interface ProviderEntry {
  id: string;
  name: string;
  files: File[];
  text: string;
}

interface InputZoneProps {
  onSubmit: (providers: ProviderEntry[]) => void;
  isLoading: boolean;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

const ACCEPTED_TYPES = ".jpg,.jpeg,.png,.webp,.pdf";

function FileDropzone({
  files,
  onFilesChange,
}: {
  files: File[];
  onFilesChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = Array.from(e.dataTransfer.files).filter(
        (f) =>
          f.type.startsWith("image/") || f.type === "application/pdf",
      );
      onFilesChange([...files, ...dropped]);
    },
    [files, onFilesChange],
  );

  const handleSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        onFilesChange([...files, ...Array.from(e.target.files)]);
      }
    },
    [files, onFilesChange],
  );

  const removeFile = useCallback(
    (index: number) => {
      onFilesChange(files.filter((_, i) => i !== index));
    },
    [files, onFilesChange],
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex min-h-[80px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-sm transition-colors",
          isDragOver
            ? "border-primary bg-primary/5 text-primary"
            : "border-border text-muted-foreground hover:border-primary/50",
        )}
      >
        <svg
          className="mb-1 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 3.75 3.75 0 013.572 5.845A4.5 4.5 0 0118 19.5H6.75z"
          />
        </svg>
        <span>Drop images / PDFs or click to browse</span>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          multiple
          onChange={handleSelect}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between rounded-md bg-muted px-3 py-1.5 text-xs"
            >
              <span className="truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="ml-2 shrink-0 text-muted-foreground hover:text-destructive"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProviderCard({
  entry,
  index,
  canRemove,
  onChange,
  onRemove,
}: {
  entry: ProviderEntry;
  index: number;
  canRemove: boolean;
  onChange: (updated: ProviderEntry) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Proveedor {index + 1}
        </label>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Eliminar
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder={`Nombre del proveedor ${index + 1}`}
        value={entry.name}
        onChange={(e) => onChange({ ...entry, name: e.target.value })}
        className="mb-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <FileDropzone
        files={entry.files}
        onFilesChange={(files) => onChange({ ...entry, files })}
      />

      <textarea
        placeholder="O pega el texto de la cotización aquí..."
        value={entry.text}
        onChange={(e) => onChange({ ...entry, text: e.target.value })}
        rows={3}
        className="mt-3 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

export function InputZone({ onSubmit, isLoading }: InputZoneProps) {
  const [providers, setProviders] = useState<ProviderEntry[]>([
    { id: generateId(), name: "", files: [], text: "" },
    { id: generateId(), name: "", files: [], text: "" },
  ]);

  const addProvider = () => {
    setProviders((prev) => [
      ...prev,
      { id: generateId(), name: "", files: [], text: "" },
    ]);
  };

  const removeProvider = (id: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProvider = (id: string, updated: ProviderEntry) => {
    setProviders((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const hasData = providers.some(
    (p) => p.files.length > 0 || p.text.trim().length > 0,
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Cotizaciones</h2>
        <button
          type="button"
          onClick={addProvider}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          + Proveedor
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {providers.map((entry, i) => (
          <ProviderCard
            key={entry.id}
            entry={entry}
            index={i}
            canRemove={providers.length > 2}
            onChange={(updated) => updateProvider(entry.id, updated)}
            onRemove={() => removeProvider(entry.id)}
          />
        ))}
      </div>

      <button
        type="button"
        disabled={!hasData || isLoading}
        onClick={() => onSubmit(providers)}
        className={cn(
          "mt-4 w-full rounded-xl py-3 text-sm font-semibold transition-all",
          hasData && !isLoading
            ? "bg-primary text-primary-foreground shadow-md hover:opacity-90 cursor-pointer"
            : "cursor-not-allowed bg-muted text-muted-foreground",
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Analizando...
          </span>
        ) : (
          "Analizar Cotizaciones"
        )}
      </button>
    </div>
  );
}
