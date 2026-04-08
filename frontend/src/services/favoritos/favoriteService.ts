// services/favoritos/favoriteService.ts
/**
 * API service para Favoritos
 */

import { FavoritoItem, ToggleFavoriteResponse } from "./types";

const API_BASE_URL = "http://localhost:8080/api";

// Helper: obtener token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Helper: obtener header auth
const getAuthHeader = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * GET /api/cliente/favoritos - Obtener todos los favoritos del usuario
 * Requiere header X-USER-ID
 */
export const fetchFavoritosFromAPI = async (
  userId: number
): Promise<any[]> => {
  try {
    if (!userId) {
      console.warn("No userId provided to fetch favoritos");
      return [];
    }

    const res = await fetch(
      `${API_BASE_URL}/cliente/favoritos`,
      {
        headers: {
          "X-USER-ID": userId.toString(),
          ...getAuthHeader(),
        },
      }
    );

    if (!res.ok) {
      console.warn("Failed to fetch favoritos:", res.status);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching favoritos:", error);
    return [];
  }
};

/**
 * POST /api/cliente/favoritos/toggle - Agregar/Remover favorito
 * Body: { id_usu: number, id_mue: number }
 */
export const toggleFavoriteInAPI = async (
  userId: number,
  productId: number
): Promise<ToggleFavoriteResponse | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/cliente/favoritos/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-USER-ID": userId.toString(),
        ...getAuthHeader(),
      },
      body: JSON.stringify({ id_usu: userId, id_mue: productId }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Toggle favorite failed:", res.status, errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return null;
  }
};
