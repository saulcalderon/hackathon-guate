-- Add cantidad and unidad to sesiones_solicitud
ALTER TABLE sesiones_solicitud
  ADD COLUMN IF NOT EXISTS cantidad NUMERIC,
  ADD COLUMN IF NOT EXISTS unidad TEXT;
