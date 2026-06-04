// types/products.ts
/**
 * Tipos para el módulo de Productos
 * Basado en estructura BD: muebles, categorias_muebles, favoritos
 */

export interface Category {
  id_cat: number;
  nom_cat: string;
  desc_cat?: string;
  est_cat: boolean;
  cod_cat?: string;
}

export interface Product {
  id_mue: number;
  nom_mue: string;
  desc_mue?: string;
  img_mue?: string;
  precio_venta: number;
  precio_costo?: number;
  stock: number;
  stock_min?: number;
  modelo_3d?: string;
  dimensiones?: string;
  est_mue: boolean;
  id_cat: number;
  cod_mue: string;
  categoria?: Category;
}

// Formato para el frontend (después de mapeo)
export interface ProductViewModel {
  id: number;
  title: string;
  img: string;
  category: string;
  price: string;
  desc?: string;
  cod: string;
  stock?: number;
  modelo_3d?: string;
  dimensiones?: string;
}

export interface CategoryViewModel {
  id: number;
  name: string;
  image: string;
}

export interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiPagedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface FilterState {
  [key: string]: string[];
}

export interface CategoryImages {
  [key: string]: string;
}
