-- ============================================================
-- Migration: creditos_usuario + transacciones_creditos tables
-- Run AFTER migration 003.
-- ============================================================

CREATE TABLE IF NOT EXISTS creditos_usuario (
  id                    UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               TEXT        NOT NULL UNIQUE,
  creditos_disponibles  INT         NOT NULL DEFAULT 0 CHECK (creditos_disponibles >= 0),
  creditos_usados       INT         NOT NULL DEFAULT 0 CHECK (creditos_usados >= 0),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creditos_user_id ON creditos_usuario (user_id);

DROP TRIGGER IF EXISTS creditos_usuario_updated_at ON creditos_usuario;
CREATE TRIGGER creditos_usuario_updated_at
  BEFORE UPDATE ON creditos_usuario
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS transacciones_creditos (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     TEXT        NOT NULL,
  tipo        TEXT        NOT NULL CHECK (tipo IN ('compra', 'uso', 'reembolso')),
  cantidad    INT         NOT NULL,
  descripcion TEXT,
  sesion_id   UUID        REFERENCES sesiones_solicitud(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transacciones_user_id   ON transacciones_creditos (user_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_created_at ON transacciones_creditos (created_at DESC);
