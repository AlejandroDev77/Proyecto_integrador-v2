// services/favoritos/types.ts
/**
 * Tipos para el módulo de Favoritos
 */

export interface Mueble {
  id_mue: number;
  nom_mue: string;
  cod_mue: string;
  desc_mue?: string;
  img_mue?: string;
  precio_venta: number;
  stock: number;
  modelo_3d?: string;
  categoria?: string;
}

export interface FavoritoItem {
  id_fav: number;
  id_mue: number;
  mueble: Mueble | null;
  created_at: string;
}

export interface ToggleFavoriteResponse {
  success: boolean;
  message: string;
  action: "added" | "removed";
  id_fav?: number;
}

export interface GetFavoritosResponse extends Array<FavoritoItem> {}
