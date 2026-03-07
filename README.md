# Findrai

Plataforma de procurement inteligente para empresas en Centroamérica (Guatemala, El Salvador, Honduras).

## El problema

Las empresas centroamericanas reciben cotizaciones de proveedores en PDFs con formatos completamente distintos. Compararlas es un proceso manual, lento y propenso a errores: copiar datos a hojas de cálculo, perder condiciones de pago, ignorar diferencias de tiempo de entrega. Los proveedores, por su lado, pierden oportunidades de negocio porque no existe un canal centralizado donde los compradores publiquen sus necesidades.

## La solución

Findrai es un marketplace de RFQ (Request for Quote) con IA integrada:

1. **El comprador describe lo que necesita** — texto libre, categorías, urgencia y prioridades.
2. **La plataforma busca y compara proveedores** — precios actuales en el mercado (scraping inteligente) o invitaciones formales a proveedores registrados.
3. **La IA estructura y analiza todos los resultados** — no solo por precio, sino por tiempo de entrega, condiciones de pago, garantía y especificaciones técnicas.
4. **Un chat asistido por IA** permite al comprador hacer preguntas sobre los resultados y tomar la mejor decisión con datos claros.

## Estado del proyecto

- Módulo de solicitudes de cotización con formulario completo y chat IA: **listo**
- Motor de búsqueda con scraping real (Serper + Firecrawl): **en desarrollo**
- Módulo OCR de cotizaciones PDF (Mistral + Gemini): **listo (backend)**
- Marketplace multi-tenant con licitaciones a proveedores: **próximamente**

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 (strict) |
| Estilos | Tailwind CSS v4 |
| Base de datos | Supabase (PostgreSQL + Storage) |
| OCR | Mistral AI (`mistral-ocr-latest`) |
| Análisis / Chat | Google Gemini 1.5 Flash |
| Iconos | Lucide React |

## Setup local

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd hackathon-guate

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local y agrega tus keys (ver sección Variables de entorno)

# 4. Correr en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la landing page.
El dashboard está en [http://localhost:3000/dashboard](http://localhost:3000/dashboard).
Las solicitudes de cotización están en [http://localhost:3000/dashboard/solicitudes](http://localhost:3000/dashboard/solicitudes).

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores:

```env
# Supabase — requerido para el módulo OCR (DB + Storage)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mistral AI — requerido para OCR de PDFs
MISTRAL_API_KEY=

# Google Gemini — requerido para análisis estructurado y chat
GEMINI_API_KEY=
```

Para obtener las keys:
- **Supabase**: [supabase.com](https://supabase.com) → nuevo proyecto → Settings → API
- **Mistral AI**: [console.mistral.ai](https://console.mistral.ai)
- **Google Gemini**: [aistudio.google.com](https://aistudio.google.com) → Get API Key

## Base de datos

Para el módulo OCR, ejecuta la migración en el SQL Editor de Supabase:

```
supabase/migrations/20260307_001_cotizaciones.sql
```

El módulo de solicitudes funciona sin base de datos (estado en cliente) hasta que se integre el motor de búsqueda real.

## Estructura del proyecto

```
src/
  app/
    page.tsx                    # Landing page
    dashboard/
      page.tsx                  # Overview del dashboard
      layout.tsx                # Layout con sidebar
      solicitudes/
        page.tsx                # Módulo de solicitudes + chat
  components/
    landing/                    # Componentes de la landing page
    dashboard/
      Sidebar.tsx
      Header.tsx
      SolicitudForm.tsx         # Formulario de solicitud de cotización
      ResultadosChat.tsx        # Cards de resultados + chat IA
      ProveedorCard.tsx         # (OCR) Tarjeta de proveedor
      CotizacionCard.tsx        # (OCR) Datos de cotización
      LineasTable.tsx           # (OCR) Tabla de líneas
      FaltantesAlert.tsx        # (OCR) Campos faltantes
  lib/
    supabase/                   # Clientes Supabase (browser/admin/storage)
    mistral/                    # Wrapper OCR Mistral
    gemini/                     # Wrapper análisis y chat Gemini
    mock/                       # Datos simulados para demo
  types/
    cotizaciones.ts             # Tipos del módulo OCR
    solicitudes.ts              # Tipos del módulo de solicitudes
  app/api/
    ocr/route.ts                # POST /api/ocr
    analyze/route.ts            # POST /api/analyze
    chat/route.ts               # POST /api/chat
supabase/
  migrations/                   # Scripts SQL
```
