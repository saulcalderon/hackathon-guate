import Link from 'next/link';
import { Zap, Check, MessageCircle, Mail, Star } from 'lucide-react';
import { PLANES_CREDITOS, COMISION_FINDRAI_PCT, CONTACTO_WHATSAPP, CONTACTO_EMAIL } from '@/lib/constants/planes';

export default function PlanesPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="text-center mt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold mb-4">
          <Zap className="w-3.5 h-3.5" />
          Sistema de créditos
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Planes y precios</h1>
        <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
          Cada consulta con scraping real usa 1 crédito. Elige el paquete que mejor se adapte a tu empresa.
        </p>
      </div>

      {/* What is a credit */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 grid sm:grid-cols-3 gap-4 text-center">
        {[
          { icon: '🔍', title: '1 crédito', desc: '= 1 búsqueda de proveedores con precios reales' },
          { icon: '🔒', title: 'Sin créditos', desc: 'Puedes ver el análisis IA pero los nombres quedan ocultos' },
          { icon: '🛒', title: 'Comprar con Findr.ai', desc: 'La gestión de compra es aparte — comisión del ' + COMISION_FINDRAI_PCT + '%' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span className="text-2xl">{item.icon}</span>
            <p className="text-sm font-bold text-slate-800">{item.title}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Plans grid */}
      <div className="grid sm:grid-cols-3 gap-6">
        {PLANES_CREDITOS.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden ${
              plan.popular
                ? 'border-findrai-primary shadow-findrai-primary/20 shadow-lg'
                : 'border-slate-200'
            }`}
          >
            {plan.popular && (
              <div className="bg-findrai-primary text-white text-xs font-bold text-center py-1.5 flex items-center justify-center gap-1">
                <Star className="w-3 h-3" /> Más popular
              </div>
            )}

            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-slate-900">{plan.nombre}</h3>
              <p className="text-xs text-slate-500 mt-1 mb-5">{plan.descripcion}</p>

              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900">Q {plan.precio_gtq}</span>
                  <span className="text-slate-400 text-sm">/ paquete</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">≈ USD ${plan.precio_usd}</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <strong>{plan.creditos} créditos</strong> de búsqueda
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  Q {(plan.precio_gtq / plan.creditos).toFixed(0)} por consulta
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  Análisis IA incluido
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  Nombres de proveedores visibles
                </li>
                {plan.creditos >= 20 && (
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    Soporte prioritario
                  </li>
                )}
                {plan.creditos >= 100 && (
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    API access (próximamente)
                  </li>
                )}
              </ul>

              <a
                href={`${CONTACTO_WHATSAPP}&text=Hola%2C%20quiero%20comprar%20el%20plan%20${encodeURIComponent(plan.nombre)}%20de%20${plan.creditos}%20cr%C3%A9ditos`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  plan.popular
                    ? 'bg-findrai-primary hover:bg-findrai-secondary text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Comprar por WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Contact alternatives */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-slate-800 text-sm">¿Necesitas un plan personalizado?</p>
          <p className="text-xs text-slate-500 mt-1">
            Para empresas con alto volumen o integraciones especiales, contáctanos.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <a
            href={CONTACTO_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          <a
            href={`mailto:${CONTACTO_EMAIL}`}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-xl transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
        </div>
      </div>

      {/* Comision info */}
      <div className="text-center">
        <p className="text-xs text-slate-400">
          Los créditos no vencen. El servicio &quot;Comprar con Findr.ai&quot; tiene una comisión del {COMISION_FINDRAI_PCT}% sobre el valor del producto, independiente del plan.
        </p>
        <Link href="/dashboard" className="text-xs text-findrai-primary hover:underline mt-1 inline-block">
          ← Volver al overview
        </Link>
      </div>
    </div>
  );
}
