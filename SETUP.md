# Setup del proyecto — Findr.ai

Guía para que cualquier miembro del equipo pueda levantar el proyecto desde cero.

---

## 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd hackathon-guate
npm install
```

---

## 2. Variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y completa todos los valores:

```env
# Supabase (proyecto compartido del equipo)
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Mistral AI — para OCR de PDFs
MISTRAL_API_KEY=<tu-key>

# Google Gemini — para análisis y chat IA
GEMINI_API_KEY=<tu-key>
```

Dónde encontrar cada key:
- **Supabase**: [supabase.com](https://supabase.com) → tu proyecto → **Settings → API**
  - `NEXT_PUBLIC_SUPABASE_URL` → "Project URL"
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → "anon public"
  - `SUPABASE_SERVICE_ROLE_KEY` → "service_role" (nunca exponerla al cliente)
- **Mistral AI**: [console.mistral.ai](https://console.mistral.ai) → API Keys
- **Google Gemini**: [aistudio.google.com](https://aistudio.google.com) → "Get API key"

---

## 3. Base de datos — Migraciones en Supabase

El proyecto usa **Supabase en la nube** (no Supabase CLI local). Las migraciones se corren una sola vez en el **SQL Editor** del proyecto compartido.

> Si alguien ya las corrió antes, no las vuelvas a correr — los scripts usan `CREATE TABLE IF NOT EXISTS` así que son idempotentes, pero es buena práctica verificar primero.

### Migración 001 — Tabla `cotizaciones` (módulo OCR)

1. Ve a [supabase.com](https://supabase.com) → tu proyecto → **SQL Editor**
2. Copia y pega el contenido del archivo:

```
supabase/migrations/20260307_001_cotizaciones.sql
```

3. Haz clic en **Run**

Crea:
- Tabla `cotizaciones` para el módulo de OCR de PDFs
- Función `update_updated_at()` (reutilizada por las demás tablas)
- Bucket privado `cotizaciones-pdf` en Storage

---

### Migración 002 — Tabla `sesiones_solicitud` (módulo de solicitudes)

> El archivo está en `002_migration.sql` en el root del proyecto (pendiente de mover a `supabase/migrations/` — ver nota al final).

1. En el mismo **SQL Editor**
2. Copia y pega el contenido del archivo:

```
002_migration.sql
```

3. Haz clic en **Run**

Crea:
- Tabla `sesiones_solicitud` para guardar el historial de solicitudes de cotización y sus chats
- Índices en `created_at` y `estado`
- Trigger de `updated_at`

---

## 4. Levantar en desarrollo

```bash
npm run dev
```

| URL | Descripción |
|-----|-------------|
| `http://localhost:3000` | Landing page |
| `http://localhost:3000/dashboard` | Overview del dashboard |
| `http://localhost:3000/dashboard/solicitudes` | Historial de solicitudes |
| `http://localhost:3000/dashboard/solicitudes/nueva` | Nueva solicitud de cotización |

---

## 5. Verificar que todo funciona

- [ ] La landing page carga sin errores
- [ ] El dashboard muestra el sidebar y el overview
- [ ] Ir a `/dashboard/solicitudes/nueva`, llenar el formulario y hacer submit
- [ ] Los resultados simulados aparecen con el chat IA
- [ ] El asistente responde y sugiere preguntas rápidas

---

## Nota sobre la migración 002

El archivo `002_migration.sql` quedó en el root del proyecto porque la carpeta `supabase/migrations/` tenía permisos bloqueados. Para moverlo al lugar correcto, cualquier miembro del equipo puede correr:

```bash
mv 002_migration.sql supabase/migrations/20260307_002_sesiones_solicitud.sql
git add supabase/migrations/20260307_002_sesiones_solicitud.sql
git rm --cached 002_migration.sql
git commit -m "move migration 002 to correct location"
```

---

## Estructura de las migraciones

```
supabase/
  migrations/
    20260307_001_cotizaciones.sql     # Tabla cotizaciones + Storage bucket
    20260307_002_sesiones_solicitud.sql  # Tabla sesiones_solicitud (mover desde root)
```

Los archivos siguen el formato `YYYYMMDD_NNN_descripcion.sql` para mantener orden cronológico.
