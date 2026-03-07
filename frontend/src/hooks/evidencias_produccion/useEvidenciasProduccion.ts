import { useState, useEffect } from "react";
import { getEvidenciasProduccion } from "../../services/evidenciaProduccionService";

interface EvidenciaProduccion {
  id_evi: number;
  cod_evi?: string;
  id_pro_eta: number;
  tipo_evi: string;
  archivo_evi?: string;
  descripcion?: string;
  fec_evi?: string;
  id_emp: number;
  produccion_etapa?: {
    id_pro_eta: number;
    id_pro: number;
    etapa?: {
      nom_eta: string;
    };
  };
  empleado?: {
    nom_emp: string;
    ape_emp?: string;
  };
}

export function useEvidenciasProduccion() {
  const [evidenciasProduccion, setEvidenciasProduccion] = useState<
    EvidenciaProduccion[]
  >([]);
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

        const data = await getEvidenciasProduccion(
          currentPage,
          itemsPerPage,
          params
        );
        setEvidenciasProduccion(data.data || data);
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

  const paginatedData = evidenciasProduccion;

  return {
    evidenciasProduccion,
    setEvidenciasProduccion,
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
