// services/products/productService.ts
/**
 * Servicios de API para Productos
 * Maneja todas las llamadas HTTP al backend
 */

import axiosClient from "../../api/axios";
import {
  Product,
  Category,
  ApiPagedResponse,
} from "./types";

const API_BASE_URL = "/api";

// Categorías - PÚBLICO
export const fetchCategoriesFromAPI = async (): Promise<Category[]> => {
  try {
    const res = await axiosClient.get(`${API_BASE_URL}/categorias`);
    return (res.data.data || res.data) as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Productos con paginación - PÚBLICO
export const fetchProductsFromAPI = async (
  page: number = 1,
  perPage: number = 20,
  filters?: Record<string, string>,
  sort?: string
): Promise<ApiPagedResponse<Product>> => {
  try {
    const params: any = { page, per_page: perPage };

    if (sort) params.sort = sort;
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[`filter[${key}]`] = value;
      });
    }

    const res = await axiosClient.get(`${API_BASE_URL}/muebles`, { params });
    return res.data as ApiPagedResponse<Product>;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Favoritos - Obtener IDs (requiere auth)
export const fetchFavoriteIdsFromAPI = async (
  userId: number
): Promise<number[]> => {
  try {
    if (!userId) return [];
    const res = await axiosClient.get(`${API_BASE_URL}/cliente/favoritos/ids`, {
      params: { id_usu: userId }
    });
    const data = res.data;
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
};

// Favoritos - Toggle (requiere auth)
export const toggleFavoriteAPI = async (
  userId: number,
  productId: number
): Promise<boolean> => {
  try {
    if (!userId || !productId) return false;

    await axiosClient.post(`${API_BASE_URL}/cliente/favoritos/toggle`, {
      id_usu: userId,
      id_mue: productId
    });

    return true;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return false;
  }
};
