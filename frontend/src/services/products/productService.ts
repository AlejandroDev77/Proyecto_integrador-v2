// services/products/productService.ts
/**
 * Servicios de API para Productos
 * Maneja todas las llamadas HTTP al backend
 */

import axios from "axios";
import {
  Product,
  Category,
  ApiPagedResponse,
} from "./types";

const API_BASE_URL = "http://localhost:8080/api";

// Helper: obtener header auth si existe
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Categorías - PÚBLICO
export const fetchCategoriesFromAPI = async (): Promise<Category[]> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/categoria`);
    // El backend retorna solo array o con 'data'
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
    let url = `${API_BASE_URL}/mueble?page=${page}&per_page=${perPage}`;

    if (sort) {
      url += `&sort=${sort}`;
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          url += `&filter[${key}]=${encodeURIComponent(value)}`;
        }
      });
    }

    const res = await axios.get(url);
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
    if (!userId) {
      console.warn("No userId provided to fetch favorites");
      return [];
    }
    const headers = getAuthHeader();
    const res = await fetch(`${API_BASE_URL}/cliente/favoritos/ids?id_usu=${userId}`, {
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });
    if (!res.ok) {
      console.warn("Favorites endpoint not available:", res.status);
      return [];
    }
    const data = await res.json();
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
    // Validar que ambos parámetros sean válidos números enteros
    if (!userId || !productId) {
      console.error("Invalid parameters:", { userId, productId });
      return false;
    }

    if (!Number.isInteger(userId) || !Number.isInteger(productId)) {
      console.error("Parameters must be integers:", { userId, productId, userIdType: typeof userId, productIdType: typeof productId });
      return false;
    }

    const authHeaders = getAuthHeader();
    const payload = { id_usu: userId, id_mue: productId };
    
    console.log("Toggling favorite:", payload);
    
    const res = await fetch(`${API_BASE_URL}/cliente/favoritos/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      } as Record<string, string>,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Toggle favorite failed:", res.status, errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return false;
  }
};
