import { useState, useEffect } from "react";
import { getProduccionesEtapas } from "../../services/produccion_etapaService";

interface ProduccionEtapa {
    id_pro_eta: number;
    cod_pro_eta?: string;
    fec_ini: string;
    fec_fin: string;
    est_eta: string;
    notas: string;
    id_emp: number;
    empleado?: {
        nom_emp: string;
        ap_pat_emp: string;
        ap_mat_emp: string;
    };
    id_pro: number;
    produccion?: {
        fec_ini: string;
        fec_fin: string;
    }
    id_eta: number;
    etapa?: {
        nom_eta: string;
    };
    
}

export function useProduccionesEtapas() {
  const [produccionesetapas, setProduccionesEtapas] = useState<ProduccionEtapa[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<string>("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const extraParams: Record<string, any> = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            if (key.startsWith('filter[')) {
              extraParams[key] = value;
            } else {
              extraParams[`filter[${key}]`] = value;
            }
          }
        });
        if (sort) extraParams.sort = sort;

        const data = await getProduccionesEtapas(currentPage, itemsPerPage, extraParams);
        setProduccionesEtapas(data.data || data);
        setTotalPages(data.last_page || 1);
        setTotalItems(data.total || (data.data ? data.data.length : 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [currentPage, itemsPerPage, filters, sort]);

  const filtered = produccionesetapas.filter((c) =>
    `${c.fec_ini} ${c.fec_fin} ${c.est_eta} ${c.notas} ${c.id_emp} ${c.empleado?.nom_emp} ${c.empleado?.ap_pat_emp} ${c.empleado?.ap_mat_emp} ${c.id_pro} ${c.produccion?.fec_ini} ${c.produccion?.fec_fin} ${c.id_eta} ${c.etapa?.nom_eta}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    produccionesetapas,
    setProduccionesEtapas,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    
    showModalAgregar,
    setShowModalAgregar,  
    totalItems,
    totalPages,
    loading,
    paginatedData,
    filters,
    setFilters,
    sort,
    setSort,
    
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    },
    handlePageChange: (page: number) => setCurrentPage(page),
    handleItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
    },
  };
}
