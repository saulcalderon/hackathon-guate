// ────────────────────────────────────────────────────────────
// Planes de créditos y comisión de Findrai
// ────────────────────────────────────────────────────────────

export const COMISION_FINDRAI_PCT = 8;

export const PLANES_CREDITOS = [
  {
    id: 'starter',
    nombre: 'Starter',
    descripcion: 'Ideal para probar el servicio',
    creditos: 5,
    precio_gtq: 50,
    precio_usd: 6,
    popular: false,
  },
  {
    id: 'pro',
    nombre: 'Pro',
    descripcion: 'Para equipos de compras activos',
    creditos: 20,
    precio_gtq: 175,
    precio_usd: 22,
    popular: true,
  },
  {
    id: 'business',
    nombre: 'Business',
    descripcion: 'Para empresas con alto volumen',
    creditos: 100,
    precio_gtq: 700,
    precio_usd: 88,
    popular: false,
  },
] as const;

export const COSTO_POR_CONSULTA = 1;

export const CONTACTO_WHATSAPP = 'https://wa.me/50212345678?text=Hola%2C%20quiero%20comprar%20cr%C3%A9ditos%20Findrai';
export const CONTACTO_EMAIL = 'ventas@findrai.com';
