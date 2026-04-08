// hooks/useFavoritos.ts
/**
 * Custom hooks para Favoritos
 */

import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import {
  fetchFavoritosFromAPI,
  toggleFavoriteInAPI,
} from "../services/favoritos/favoriteService";

/**
 * Hook: Obtener ID del usuario del JWT
 */
export const useUserId = (): number | null => {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id_usu || null);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  return userId;
};

/**
 * Hook: Obtener todos los favoritos del usuario
 */
export const useFetchFavoritos = () => {
  const userId = useUserId();
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavoritos = useCallback(async () => {
    if (!userId) {
      setFavoritos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchFavoritosFromAPI(userId);
      setFavoritos(data || []);
      setError(null);
    } catch (err) {
      setError("Error al cargar favoritos");
      console.error(err);
      setFavoritos([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFavoritos();
  }, [fetchFavoritos]);

  return { favoritos, loading, error, setFavoritos, refetch: fetchFavoritos };
};

/**
 * Hook: Remover favorito
 */
export const useRemoveFavorito = (
  onSuccess?: (id_mue: number) => void
) => {
  const userId = useUserId();
  const [removingId, setRemovingId] = useState<number | null>(null);

  const removeFavorito = useCallback(
    async (id_mue: number) => {
      if (!userId) return false;

      setRemovingId(id_mue);
      try {
        const result = await toggleFavoriteInAPI(userId, id_mue);
        if (result?.success) {
          onSuccess?.(id_mue);
          return true;
        }
      } catch (error) {
        console.error("Error removing favorite:", error);
      } finally {
        setRemovingId(null);
      }
      return false;
    },
    [userId, onSuccess]
  );

  return { removeFavorito, removingId };
};

/**
 * Hook: Estado de favoritos con agregar/remover
 */
export const useFavorites = () => {
  const userId = useUserId();
  const { favoritos, loading, error, setFavoritos, refetch } =
    useFetchFavoritos();
  const { removeFavorito, removingId } = useRemoveFavorito((id_mue) => {
    setFavoritos((prev: any[]) => prev.filter((f) => f.id_mue !== id_mue));
  });

  const handleRemove = useCallback(
    async (id_mue: number) => {
      return await removeFavorito(id_mue);
    },
    [removeFavorito]
  );

  return {
    favoritos,
    loading,
    error,
    removingId,
    handleRemove,
    refetch,
    userId,
  };
};
