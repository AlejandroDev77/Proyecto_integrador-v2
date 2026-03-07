import { useState, useEffect } from "react";
import { getCostosCotizacion } from "../../services/costoCotizacionService";

interface CostoCotizacion {
  id_costo: number;
  id_cot: number;
  costo_materiales?: number;
  costo_mano_obra?: number;
  costos_indirectos?: number;
  margen_ganancia?: number;
  costo_total?: number;
  precio_sugerido?: number;
  cotizacion?: {
    cod_cot?: string;
    fec_cot?: string;
  };
}

export function useCostosCotizacion() {
  const [costosCotizacion, setCostosCotizacion] = useState<CostoCotizacion[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          page: currentPage,
          per_page: itemsPerPage,
        };
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params[`filter[${key}]`] = value;
        });
        if (sort && sort.trim() !== "") params.sort = sort;

        const data = await getCostosCotizacion(
          currentPage,
          itemsPerPage,
          params
        );
        setCostosCotizacion(data.data || data);
        setTotalPages(data.last_page || 1);
        setTotalItems(data.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage, filters, sort]);

  const paginatedData = costosCotizacion;

  return {
    costosCotizacion,
    setCostosCotizacion,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems,
    loading,
    showModalAgregar,
    setShowModalAgregar,
    paginatedData,
    filters,
    setFilters,
    sort,
    setSort,
  };
}
