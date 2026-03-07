export type SesionSolicitudRow = {
  id: string;
  descripcion: string;
  categorias: string[];
  modo: string;
  urgencia: string;
  prioridades: string[];
  presupuesto: string | null;
  cantidad: number | null;
  unidad: string | null;
  resultados: any;
  mensajes: any;
  proveedorElegido: string | null;
  estado: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrdenCompraRow = {
  id: string;
  sesionId: string | null;
  proveedorNombre: string;
  proveedorDisplay: string;
  descripcionProducto: string;
  cantidad: string;
  precioEstimado: number;
  moneda: string;
  comisionPct: number;
  totalConComision: number;
  notasCliente: string | null;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
};
