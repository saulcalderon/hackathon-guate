-- ============================================================
-- Migration: ordenes_compra table
-- Run AFTER migration 002.
-- ============================================================

CREATE TABLE IF NOT EXISTS ordenes_compra (
  id                   UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesion_id            UUID        REFERENCES sesiones_solicitud(id) ON DELETE SET NULL,
  proveedor_nombre     TEXT        NOT NULL,
  proveedor_display    TEXT        NOT NULL,
  descripcion_producto TEXT        NOT NULL,
  cantidad             TEXT        NOT NULL,
  precio_estimado      NUMERIC     NOT NULL CHECK (precio_estimado >= 0),
  moneda               TEXT        NOT NULL DEFAULT 'GTQ'
                                   CHECK (moneda IN ('GTQ', 'USD', 'SVC')),
  comision_pct         NUMERIC     NOT NULL DEFAULT 8,
  total_con_comision   NUMERIC     NOT NULL,
  notas_cliente        TEXT,
  estado               TEXT        NOT NULL DEFAULT 'pendiente'
                                   CHECK (estado IN ('pendiente', 'en_proceso', 'completada', 'cancelada')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ordenes_created_at ON ordenes_compra (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ordenes_estado     ON ordenes_compra (estado);
CREATE INDEX IF NOT EXISTS idx_ordenes_sesion_id  ON ordenes_compra (sesion_id);

DROP TRIGGER IF EXISTS ordenes_compra_updated_at ON ordenes_compra;
CREATE TRIGGER ordenes_compra_updated_at
  BEFORE UPDATE ON ordenes_compra
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
