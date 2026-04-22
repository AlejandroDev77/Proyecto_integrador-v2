// hooks/useProducts.ts
/**
 * Custom hooks para Productos
 */

import { useEffect, useState, useMemo, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import {
  fetchCategoriesFromAPI,
  fetchProductsFromAPI,
  fetchFavoriteIdsFromAPI,
  toggleFavoriteAPI,
} from "../services/products/productService";
import {
  Category,
  Product,
  ProductViewModel,
  PaginationData,
  FilterState,
} from "../services/products/types";

const CATEGORY_IMAGES: Record<string, string> = {
  Mesas: "/images/Mesa de Comedor.jpg",
  Sillas: "/images/Silla Ejecutiva.jpg",
  Sofás: "/images/Sofá 3 Plazas.jpg",
  Camas: "/images/Cama Matrimonial.jpg",
  Escritorios: "/images/Escritorio Ejecutivo.jpg",
  Estantes: "/images/Estantería Modular.jpg",
  "Muebles TV": "/images/Mueble TV Moderno.jpg",
  Cocina: "/images/Isla de Cocina.jpg",
  Baño: "/images/Mueble de Baño.jpg",
  Jardín: "/images/Juego de Jardín.jpg",
  Infantil: "/images/Cuna Infantil.jpg",
  Oficina: "/images/Recepción Ejecutiva.jpg",
};

// Hook: Obtener ID de usuario desde JWT
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

// Hook: Obtener categorías
export const useFetchCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategoriesFromAPI();
        // Filtrar solo activas
        setCategories(data.filter((c) => c.est_cat !== false));
        setError(null);
      } catch (err) {
        setError("Error loading categories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
};

// Hook: Obtener productos
export const useFetchProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetchProductsFromAPI(page);
   
      const productsArray = Array.isArray(response.data) ? response.data : [];
      // Filtrar solo activos
      const activeProducts = productsArray.filter((p) => p.est_mue !== false);
      setProducts(activeProducts);
      setPagination({
        current_page: response.current_page || 1,
        last_page: response.last_page || 1,
        per_page: response.per_page || 20,
        total: response.total || 0,
      });
      setError(null);
    } catch (err) {
      setError("Error en cargar productos");
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    pagination,
    loading,
    error,
    fetchProducts,
  };
};

// Hook: Manejar favoritos
export const useFavorites = (userId: number | null) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const loadFavorites = async () => {
      setLoading(true);
      try {
        const ids = await fetchFavoriteIdsFromAPI(userId);
        setFavoriteIds(ids);
      } catch (error) {
        console.error("Error en cargar favoritos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [userId]);

  const toggleFavorite = useCallback(
    async (productId: number, isFavorite: boolean) => {
      if (!userId) return false;

      try {
        const success = await toggleFavoriteAPI(userId, productId);
        if (success) {
          if (isFavorite) {
            setFavoriteIds((prev) => [...prev, productId]);
          } else {
            setFavoriteIds((prev) => prev.filter((id) => id !== productId));
          }
        }
        return success;
      } catch (error) {
        console.error("Error en favoritos:", error);
        return false;
      }
    },
    [userId]
  );

  return {
    favoriteIds,
    loading,
    toggleFavorite,
    isFavorite: (id: number) => favoriteIds.includes(id),
  };
};

// Hook: Mapear productos BD a ViewModel
export const useMapProductsToVM = (products: Product[]): ProductViewModel[] => {
  return useMemo(() => {
    return products.map((m) => ({
      id: m.id_mue,
      cod: m.cod_mue,
      title: m.nom_mue,
      img: m.img_mue ? m.img_mue.replace("public", "") : "/images/grid-image/sofa.jpg",
      category: m.categoria?.nom_cat || "Sin categoría",
      price: `Bs. ${m.precio_venta}`,
      desc: m.desc_mue,
      stock: m.stock,
      modelo_3d: m.modelo_3d,
      dimensiones: m.dimensiones,
    }));
  }, [products]);
};

// Hook: Filtrar productos
export const useProductFilters = (
  items: ProductViewModel[],
  activeCategory: string,
  searchQuery: string,
  activeFilters: FilterState
) => {
  return useMemo(() => {
    let result = [...items];

    // Por categoría
    if (activeCategory !== "Todos") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Por búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.cod?.toLowerCase().includes(q) ||
          p.desc?.toLowerCase().includes(q)
      );
    }

    // Aplicar filtros
    Object.entries(activeFilters).forEach(([filterKey, values]) => {
      if (!values || values.length === 0) return;

      switch (filterKey) {
        case "Ordenar":
          if (values.includes("Precio: menor a mayor")) {
            result.sort((a, b) => {
              const priceA = parseInt(a.price.replace(/\D/g, "")) || 0;
              const priceB = parseInt(b.price.replace(/\D/g, "")) || 0;
              return priceA - priceB;
            });
          } else if (values.includes("Precio: mayor a menor")) {
            result.sort((a, b) => {
              const priceA = parseInt(a.price.replace(/\D/g, "")) || 0;
              const priceB = parseInt(b.price.replace(/\D/g, "")) || 0;
              return priceB - priceA;
            });
          } else if (values.includes("Alfabético: A-Z")) {
            result.sort((a, b) => a.title.localeCompare(b.title, "es"));
          } else if (values.includes("Alfabético: Z-A")) {
            result.sort((a, b) => b.title.localeCompare(a.title, "es"));
          }
          break;

        case "Precio":
          result = result.filter((item) => {
            const price = parseInt(item.price.replace(/\D/g, "")) || 0;
            return values.some((range) => {
              if (range === "Menos de Bs. 500") return price < 500;
              if (range === "Bs. 500 - 1.000")
                return price >= 500 && price <= 1000;
              if (range === "Bs. 1.000 - 2.000")
                return price >= 1000 && price <= 2000;
              if (range === "Bs. 2.000 - 5.000")
                return price >= 2000 && price <= 5000;
              if (range === "Más de Bs. 5.000") return price > 5000;
              return true;
            });
          });
          break;

        case "Categoría":
          result = result.filter((p) => values.includes(p.category));
          break;
      }
    });

    return result;
  }, [items, activeCategory, searchQuery, activeFilters]);
};

export { CATEGORY_IMAGES };
