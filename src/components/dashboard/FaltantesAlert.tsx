import { AlertTriangle } from 'lucide-react';

interface FaltantesAlertProps {
  campos: string[];
  preguntas: string[];
}

export default function FaltantesAlert({ campos, preguntas }: FaltantesAlertProps) {
  if (campos.length === 0 && preguntas.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
      {campos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <h3 className="text-sm font-bold text-amber-800">Missing Information</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {campos.map((campo) => (
              <span
                key={campo}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200"
              >
                {campo}
              </span>
            ))}
          </div>
        </div>
      )}

      {preguntas.length > 0 && (
        <div>
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
            Suggested questions for supplier
          </p>
          <ul className="space-y-1.5">
            {preguntas.map((pregunta, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-amber-800">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">{idx + 1}.</span>
                <span>{pregunta}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
