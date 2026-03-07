-- CreateTable
CREATE TABLE "sesiones_solicitud" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categorias" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "modo" TEXT NOT NULL,
    "urgencia" TEXT NOT NULL,
    "prioridades" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "presupuesto" TEXT,
    "cantidad" DECIMAL(12,4),
    "unidad" TEXT,
    "resultados" JSONB NOT NULL DEFAULT '[]',
    "mensajes" JSONB NOT NULL DEFAULT '[]',
    "proveedor_elegido" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'activa',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sesiones_solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordenes_compra" (
    "id" TEXT NOT NULL,
    "sesion_id" TEXT,
    "proveedor_nombre" TEXT NOT NULL,
    "proveedor_display" TEXT NOT NULL,
    "descripcion_producto" TEXT NOT NULL,
    "cantidad" TEXT NOT NULL,
    "precio_estimado" DECIMAL(12,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'GTQ',
    "comision_pct" DECIMAL(5,2) NOT NULL DEFAULT 8,
    "total_con_comision" DECIMAL(12,2) NOT NULL,
    "notas_cliente" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordenes_compra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sesiones_solicitud_created_at_idx" ON "sesiones_solicitud"("created_at" DESC);

-- CreateIndex
CREATE INDEX "sesiones_solicitud_estado_idx" ON "sesiones_solicitud"("estado");

-- CreateIndex
CREATE INDEX "ordenes_compra_created_at_idx" ON "ordenes_compra"("created_at" DESC);

-- CreateIndex
CREATE INDEX "ordenes_compra_estado_idx" ON "ordenes_compra"("estado");

-- CreateIndex
CREATE INDEX "ordenes_compra_sesion_id_idx" ON "ordenes_compra"("sesion_id");

-- AddForeignKey
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_sesion_id_fkey" FOREIGN KEY ("sesion_id") REFERENCES "sesiones_solicitud"("id") ON DELETE SET NULL ON UPDATE CASCADE;
