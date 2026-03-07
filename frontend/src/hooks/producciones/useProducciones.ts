import { useState, useEffect } from "react";
import { getProducciones } from "../../services/produccionService";

interface Produccion {
    id_pro: number;
    cod_pro?: string;
    fec_ini: string;
    fec_fin: string;
    fec_fin_estimada: string;
    est_pro: string;
    prioridad: string;
    notas: string;
    id_ven: number;
    venta?: {
        fec_ven: string;
        est_ven: string;
    };
    id_emp: number;
    empleado?: {
        nom_emp: string;
        ap_pat_emp: string;
        ap_mat_emp: string;
    };
    id_cot: number;
    cotizacion?: {
        fec_cot: string;
        est_cot: string;
    };
}

export function useProducciones() {
  const [producciones, setProducciones] = useState<Produccion[]>([]);
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
    const fetch = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = { 
          page: currentPage, 
          per_page: itemsPerPage 
        };
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            if (key.startsWith('filter[')) {
              params[key] = value;
            } else {
              params[`filter[${key}]`] = value;
            }
          }
        });

        if (sort && typeof sort === 'string' && sort.trim() !== '') {
          params.sort = sort;
        }

        const data = await getProducciones(currentPage, itemsPerPage, params);
        setProducciones(data.data || data);
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

  const filtered = producciones.filter((c) =>
    `${c.fec_ini} ${c.fec_fin} ${c.fec_fin_estimada} ${c.est_pro} ${c.prioridad} ${c.notas} ${c.id_ven} ${c.venta?.fec_ven} ${c.venta?.est_ven} ${c.id_emp} ${c.empleado?.nom_emp} ${c.empleado?.ap_pat_emp} ${c.empleado?.ap_mat_emp} ${c.id_cot} ${c.cotizacion?.fec_cot} ${c.cotizacion?.est_cot}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // already paginated by server

  return {
    producciones,
    setProducciones,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    totalPages,
    loading,
    showModalAgregar,
    setShowModalAgregar,  
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
