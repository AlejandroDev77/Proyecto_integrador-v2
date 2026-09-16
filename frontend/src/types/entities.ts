/**
 * Modelos compartidos que representan las entidades de la API.
 * Los alias `id` permiten consumir respuestas paginadas normalizadas.
 */
export interface Cliente {
  id?: number;
  id_cli: number;
  nom_cli: string;
  ap_pat_cli: string;
  ap_mat_cli: string;
  ci_cli: string;
  cod_cli?: string;
  cel_cli?: string | number;
  dir_cli?: string;
  fec_nac_cli?: string;
  img_cli?: string;
  id_usu?: number;
}

export interface Empleado {
  id?: number;
  id_emp: number;
  nom_emp: string;
  ap_pat_emp?: string;
  ap_mat_emp?: string;
  cod_emp?: string;
  cel_emp?: string | number;
  dir_emp?: string;
  fec_nac_emp?: string;
  ci_emp?: string;
  img_emp?: string;
  car_emp?: string;
  id_usu?: number;
  usuario?: { nom_usu: string; id_usu?: number; idUsu?: number };
}

export interface Proveedor {
  id?: number;
  id_prov: number;
  nom_prov: string;
  cod_prov?: string;
  contacto_prov?: string;
  email_prov?: string;
  tel_prov?: string;
  dir_prov?: string;
  nit_prov?: string;
  est_prov?: boolean;
}

export interface Material {
  id?: number;
  id_mat: number;
  nom_mat: string;
  cod_mat?: string;
  desc_mat?: string;
  stock_mat?: number;
  stock_min?: number;
  est_mat?: boolean;
  unidad_medida?: string;
  costo_mat?: number;
  img_mat?: string;
}

export interface Mueble {
  id?: number;
  id_mue: number;
  nom_mue: string;
  cod_mue?: string;
  desc_mue: string;
  precio_venta: number;
  precio_costo: number;
  stock: number;
  stock_min: number;
  est_mue: boolean;
  dimensiones: string;
  img_mue?: string;
  modelo_3d?: string;
  id_cat: number;
  categoria?: { id_cat?: number; nom_cat: string } | null;
}

export interface Venta {
  id?: number;
  id_ven: number;
  cod_ven?: string;
  fec_ven: string;
  est_ven: string;
  total_ven: number;
  descuento?: number;
  notas?: string;
  id_cli?: number;
  cliente?: Cliente;
  id_emp?: number;
  empleado?: Empleado;
}

export interface Pago {
  id?: number;
  id_pag: number;
  cod_pag?: string;
  fec_pag: string;
  metodo_pag: string;
  referencia_pag?: string;
  monto: number;
  id_ven?: number;
  venta?: Venta;
}

/** Tipos ligeros usados en selectores y tarjetas de relaciones. */
export interface MuebleReferencia {
  id?: number;
  id_mue: number;
  nom_mue: string;
  cod_mue?: string;
  img_mue?: string;
  precio_venta?: number;
  precio_mue?: number;
  stock?: number;
}

export interface MaterialReferencia {
  id?: number;
  id_mat: number;
  nom_mat: string;
  cod_mat?: string;
  img_mat?: string;
}

export interface VentaReferencia {
  id?: number;
  id_ven: number;
  fec_ven?: string;
  est_ven: string;
  cod_ven?: string;
  total_ven?: number;
  cliente?: Pick<Cliente, "nom_cli" | "ap_pat_cli">;
}

export interface CompraReferencia {
  id?: number;
  id_comp: number;
  fec_comp?: string;
  est_comp?: string;
  cod_comp?: string;
  total_comp?: number;
}
