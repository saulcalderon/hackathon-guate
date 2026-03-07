-- ============================================================
-- Migration: cotizaciones table + storage bucket
-- Run this in Supabase SQL Editor or via supabase db push
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------
-- Table: cotizaciones
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cotizaciones (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename         TEXT        NOT NULL,
  file_url         TEXT        NOT NULL,
  ocr_raw          TEXT,
  ocr_status       TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (ocr_status IN ('pending', 'processing', 'done', 'error')),
  analysis_status  TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (analysis_status IN ('pending', 'processing', 'done', 'error')),
  analysis_result  JSONB,
  error_message    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for recent items per status (used by dashboard list)
CREATE INDEX IF NOT EXISTS idx_cotizaciones_created_at
  ON cotizaciones (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cotizaciones_ocr_status
  ON cotizaciones (ocr_status);

CREATE INDEX IF NOT EXISTS idx_cotizaciones_analysis_status
  ON cotizaciones (analysis_status);

-- ----------------------------------------------------------------
-- Trigger: keep updated_at current on every UPDATE
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cotizaciones_updated_at ON cotizaciones;
CREATE TRIGGER cotizaciones_updated_at
  BEFORE UPDATE ON cotizaciones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ----------------------------------------------------------------
-- Storage: private bucket for PDF uploads
-- ----------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('cotizaciones-pdf', 'cotizaciones-pdf', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: service-role backend can read/write (bucket is private,
-- all access happens through the API routes using the admin client).
-- Uncomment and customize these if you add auth later:

-- CREATE POLICY "service_role_all" ON storage.objects
--   FOR ALL TO service_role USING (bucket_id = 'cotizaciones-pdf');
