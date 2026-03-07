-- ============================================================
-- Migration: sesiones_solicitud table
-- Run in Supabase SQL Editor AFTER migration 001.
-- ============================================================

CREATE TABLE IF NOT EXISTS sesiones_solicitud (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  descripcion       TEXT        NOT NULL,
  categorias        TEXT[]      NOT NULL DEFAULT '{}',
  modo              TEXT        NOT NULL CHECK (modo IN ('inmediato', 'cotizacion_formal')),
  urgencia          TEXT        NOT NULL CHECK (urgencia IN ('normal', 'urgente', 'critico')),
  prioridades       TEXT[]      NOT NULL DEFAULT '{}',
  presupuesto       TEXT,
  resultados        JSONB       NOT NULL DEFAULT '[]',
  mensajes          JSONB       NOT NULL DEFAULT '[]',
  proveedor_elegido TEXT,
  estado            TEXT        NOT NULL DEFAULT 'activa'
                                CHECK (estado IN ('activa', 'resuelta', 'cancelada')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sesiones_created_at ON sesiones_solicitud (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sesiones_estado ON sesiones_solicitud (estado);

DROP TRIGGER IF EXISTS sesiones_solicitud_updated_at ON sesiones_solicitud;
CREATE TRIGGER sesiones_solicitud_updated_at
  BEFORE UPDATE ON sesiones_solicitud
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
