import type { ResultadoProveedor, Categoria } from '@/types/solicitudes';

// ────────────────────────────────────────────────────────────
// Mock data pools by category
// Prices reflect real Guatemalan / Salvadoran market ranges.
// ────────────────────────────────────────────────────────────

const CONSTRUCCION: ResultadoProveedor[] = [
  {
    id: 'c1',
    nombre: 'Cemaco Guatemala',
    descripcion_producto: 'Cemento gris Portland tipo 1 — saco 42.5 kg. Disponible en todas las tiendas zona metropolitana y entrega a domicilio.',
    precio: 68.5,
    moneda: 'GTQ',
    tiempo_entrega: '24 horas (zona metro) / 3 días (interior)',
    condiciones_pago: 'Contado o crédito 30 días con cuenta empresarial',
    garantia: 'Garantía de producto contra defectos de fabricación',
    pros: ['Red de tiendas más grande del país', 'Entrega a obra', 'Factura electrónica'],
    contras: ['Precio ligeramente mayor que distribuidores directos', 'Restricción de volumen en despacho mismo día'],
    url_referencia: 'https://www.cemaco.com',
    disponibilidad: 'disponible',
    calificacion: 4.3,
  },
  {
    id: 'c2',
    nombre: 'Distribuidora El Constructor S.A.',
    descripcion_producto: 'Cemento gris Portland tipo 1 — venta por pallet (50 sacos). Precio mayorista. Incluye flete zona 1-6 ciudad capital.',
    precio: 61.0,
    moneda: 'GTQ',
    tiempo_entrega: '48 horas',
    condiciones_pago: 'Crédito 60 días para clientes registrados / Contado con descuento adicional 2%',
    garantia: null,
    pros: ['Precio más bajo por volumen', 'Crédito extendido', 'Descuento por pago contado'],
    contras: ['Venta mínima 50 sacos', 'Sin tiendas físicas al detalle', 'Requiere registro previo'],
    url_referencia: null,
    disponibilidad: 'disponible',
    calificacion: 3.9,
  },
  {
    id: 'c3',
    nombre: 'Pricesmart Guatemala (Mayoreo)',
    descripcion_producto: 'Cemento gris Portland tipo 1 — pack 4 sacos x 42.5 kg. Precio unitario incluido. Disponible Bodega Km 9.5 y Miraflores.',
    precio: 64.75,
    moneda: 'GTQ',
    tiempo_entrega: 'Retiro inmediato en bodega',
    condiciones_pago: 'Contado únicamente (efectivo, tarjeta, transferencia)',
    garantia: 'Política de devolución Pricesmart 30 días',
    pros: ['Retiro inmediato', 'Precio competitivo', 'Factura autorizada'],
    contras: ['Solo retiro en bodega, no entrega', 'Requiere membresía vigente'],
    url_referencia: 'https://www.pricesmart.com/gt',
    disponibilidad: 'disponible',
    calificacion: 4.1,
  },
  {
    id: 'c4',
    nombre: 'Ferretería El Maestro (El Salvador)',
    descripcion_producto: 'Cemento Cessa tipo 1 — saco 42.5 kg. Producto estándar salvadoreño. Requiere flete internacional si aplica.',
    precio: 8.5,
    moneda: 'USD',
    tiempo_entrega: '5–7 días (con gestión aduanera)',
    condiciones_pago: 'Transferencia internacional anticipada o crédito con carta de crédito bancaria',
    garantia: 'Garantía del fabricante Cessa',
    pros: ['Precio en dólares facilita comparación', 'Proveedor regional alternativo'],
    contras: ['Logística internacional compleja', 'Tiempo de entrega mayor', 'Gestión aduanera requerida'],
    url_referencia: null,
    disponibilidad: 'bajo_stock',
    calificacion: 3.5,
  },
];

const TECNOLOGIA: ResultadoProveedor[] = [
  {
    id: 't1',
    nombre: 'CompuOffice Guatemala',
    descripcion_producto: 'Laptops, desktop, periféricos e impresoras para uso empresarial. Marcas HP, Lenovo, Dell. Garantía local y soporte técnico.',
    precio: 3200.0,
    moneda: 'GTQ',
    tiempo_entrega: '3–5 días hábiles (pedido bajo demanda)',
    condiciones_pago: 'Crédito 30/60 días con aval bancario / Contado con 5% descuento',
    garantia: '1 año garantía del fabricante + soporte local 6 meses',
    pros: ['Garantía local', 'Soporte técnico incluido', 'Crédito empresarial'],
    contras: ['No tiene inventario de grandes volúmenes en stock', 'Tiempos de entrega variables'],
    url_referencia: null,
    disponibilidad: 'disponible',
    calificacion: 4.0,
  },
  {
    id: 't2',
    nombre: 'Inguat Tech Distribuciones',
    descripcion_producto: 'Equipos de cómputo importados directo USA. Precio en dólares. Tramitación aduanera incluida en pedidos corporativos +$5,000.',
    precio: 420.0,
    moneda: 'USD',
    tiempo_entrega: '7–10 días hábiles',
    condiciones_pago: '50% anticipo, 50% contra entrega',
    garantia: 'Garantía internacional del fabricante',
    pros: ['Precios importación directa', 'Mayor variedad de modelos', 'Garantía internacional'],
    contras: ['Anticipo requerido', 'Tiempos de entrega largos', 'Gestión aduanera del cliente en pedidos pequeños'],
    url_referencia: null,
    disponibilidad: 'disponible',
    calificacion: 3.7,
  },
  {
    id: 't3',
    nombre: 'Office Depot Guatemala',
    descripcion_producto: 'Impresoras, suministros, equipo de oficina y tecnología de consumo. Entrega a empresa incluida en pedidos +Q1,000.',
    precio: 1850.0,
    moneda: 'GTQ',
    tiempo_entrega: '24–48 horas',
    condiciones_pago: 'Contado. Crédito 30 días disponible con línea preaprobada.',
    garantia: '1 año garantía del fabricante',
    pros: ['Entrega rápida', 'Amplio catálogo online', 'Factura electrónica inmediata'],
    contras: ['Precios retail, no mayorista', 'Garantía básica sin soporte técnico'],
    url_referencia: 'https://www.officedepot.com.gt',
    disponibilidad: 'disponible',
    calificacion: 4.2,
  },
];

const OFICINA: ResultadoProveedor[] = [
  {
    id: 'o1',
    nombre: 'Office Depot Guatemala',
    descripcion_producto: 'Suministros de oficina: papel, bolígrafos, carpetas, material de archivo. Catálogo completo con entrega a empresa.',
    precio: 450.0,
    moneda: 'GTQ',
    tiempo_entrega: '24 horas (zona metro)',
    condiciones_pago: 'Contado o crédito 30 días',
    garantia: null,
    pros: ['Entrega en 24h', 'Catálogo amplio', 'Precios publicados online'],
    contras: ['Precio al detalle sin descuento mayorista', 'Volúmenes mínimos para envío gratis'],
    url_referencia: 'https://www.officedepot.com.gt',
    disponibilidad: 'disponible',
    calificacion: 4.2,
  },
  {
    id: 'o2',
    nombre: 'Papelería Magna Guatemala',
    descripcion_producto: 'Distribuidor mayorista de suministros de oficina. Precios de lista con descuentos por volumen desde 20 unidades.',
    precio: 310.0,
    moneda: 'GTQ',
    tiempo_entrega: '48 horas',
    condiciones_pago: 'Crédito 45 días para clientes con historial / Contado con -5%',
    garantia: null,
    pros: ['Precios mayoristas', 'Descuentos por volumen', 'Crédito extendido'],
    contras: ['Mínimo de compra requerido', 'Sin tienda online desarrollada'],
    url_referencia: null,
    disponibilidad: 'disponible',
    calificacion: 3.8,
  },
];

const ALIMENTOS: ResultadoProveedor[] = [
  {
    id: 'a1',
    nombre: 'Pricesmart Guatemala — División Alimentos',
    descripcion_producto: 'Alimentos no perecederos, bebidas y suministros de cafetería en presentación mayorista. Ideal para empresas medianas.',
    precio: 1200.0,
    moneda: 'GTQ',
    tiempo_entrega: 'Retiro inmediato',
    condiciones_pago: 'Contado únicamente',
    garantia: 'Política de devolución 30 días',
    pros: ['Variedad amplia', 'Precio de mayoreo', 'Retiro inmediato'],
    contras: ['Solo retiro en bodega', 'Requiere membresía', 'Sin crédito'],
    url_referencia: 'https://www.pricesmart.com/gt',
    disponibilidad: 'disponible',
    calificacion: 4.0,
  },
  {
    id: 'a2',
    nombre: 'Distribuidora La Colonial S.A.',
    descripcion_producto: 'Distribuidor autorizado de marcas nacionales e importadas. Entrega directa a empresa, mínimo Q2,500 por pedido.',
    precio: 980.0,
    moneda: 'GTQ',
    tiempo_entrega: '3–4 días hábiles',
    condiciones_pago: 'Crédito 30/60 días. Descuento por pago anticipado.',
    garantia: 'Garantía de inocuidad y fecha de vencimiento garantizada',
    pros: ['Crédito disponible', 'Entrega a empresa', 'Precios distribución'],
    contras: ['Pedido mínimo alto', 'Tiempos de entrega más largos'],
    url_referencia: null,
    disponibilidad: 'disponible',
    calificacion: 3.9,
  },
];

const DEFAULT_FALLBACK: ResultadoProveedor[] = [
  {
    id: 'd1',
    nombre: 'Proveedor General GT — Resultado simulado',
    descripcion_producto: 'Resultado de demostración. El motor de búsqueda real encontrará proveedores específicos para tu solicitud.',
    precio: 500.0,
    moneda: 'GTQ',
    tiempo_entrega: '3–5 días hábiles',
    condiciones_pago: 'Contado / Crédito 30 días',
    garantia: '6 meses',
    pros: ['Precio competitivo', 'Disponibilidad inmediata', 'Factura autorizada'],
    contras: ['Datos de demostración — no reflejan precios reales'],
    url_referencia: null,
    disponibilidad: 'disponible',
    calificacion: 4.0,
  },
  {
    id: 'd2',
    nombre: 'Distribuidor Regional CA — Resultado simulado',
    descripcion_producto: 'Proveedor regional con cobertura Guatemala, El Salvador y Honduras.',
    precio: 460.0,
    moneda: 'GTQ',
    tiempo_entrega: '5–7 días',
    condiciones_pago: 'Crédito 60 días',
    garantia: '1 año',
    pros: ['Cobertura regional', 'Crédito extendido'],
    contras: ['Tiempos de entrega más largos', 'Datos de demostración'],
    url_referencia: null,
    disponibilidad: 'disponible',
    calificacion: 3.8,
  },
];

const CATEGORIA_MAP: Record<string, ResultadoProveedor[]> = {
  'Construcción y ferretería': CONSTRUCCION,
  'Tecnología y equipos': TECNOLOGIA,
  'Suministros de oficina': OFICINA,
  'Alimentos y bebidas': ALIMENTOS,
};

/**
 * Returns mock supplier results for a given set of categories.
 * When multiple categories are selected, merges results and deduplicates.
 * Falls back to DEFAULT_FALLBACK when no matching category exists.
 */
export function getMockResultados(categorias: Categoria[]): ResultadoProveedor[] {
  if (categorias.length === 0) return DEFAULT_FALLBACK;

  const merged: ResultadoProveedor[] = [];
  const seen = new Set<string>();

  for (const cat of categorias) {
    const pool = CATEGORIA_MAP[cat] ?? DEFAULT_FALLBACK;
    for (const item of pool) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    }
  }

  return merged.length > 0 ? merged.slice(0, 4) : DEFAULT_FALLBACK;
}
