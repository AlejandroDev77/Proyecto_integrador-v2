import axiosClient from "../../api/axios";
import { FavoritoItem, ToggleFavoriteResponse } from "./types";

const API_BASE_URL = "/api/cliente/favoritos";

/**
 * GET /api/cliente/favoritos - Obtener todos los favoritos del usuario
 */
export const fetchFavoritosFromAPI = async (
  userId: number
): Promise<any[]> => {
  try {
    if (!userId) return [];

    const res = await axiosClient.get(API_BASE_URL, {
      headers: { "X-USER-ID": userId }
    });

    return Array.isArray(res.data) ? res.data : res.data.data || [];
  } catch (error) {
    console.error("Error fetching favoritos:", error);
    return [];
  }
};

/**
 * POST /api/cliente/favoritos/toggle - Agregar/Remover favorito
 */
export const toggleFavoriteInAPI = async (
  userId: number,
  productId: number
): Promise<ToggleFavoriteResponse | null> => {
  try {
    const res = await axiosClient.post(`${API_BASE_URL}/toggle`, {
      id_usu: userId,
      id_mue: productId
    });

    return res.data;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return null;
  }
};
