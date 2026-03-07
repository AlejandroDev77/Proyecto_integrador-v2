import { useState, useEffect } from "react";
import { getCotizaciones } from "../../services/cotizacionService";

interface Cotizacion {
    id_cot: number;
    cod_cot?: string;
    fec_cot: string;
    est_cot: string;
    validez_dias: number;
    total_cot: number;
    descuento: number;
    notas: string;
    id_cli: number;
    cliente?: {
        nom_cli: string;
        ap_pat_cli: string;
        ap_mat_cli: string;
    };
    id_emp: number;
    empleado?: {
        nom_emp: string;
        ap_pat_emp: string;
        ap_mat_emp: string;
    };
}

export function useCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
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
        const data = await getCotizaciones(currentPage, itemsPerPage, filters, sort);
        setCotizaciones(data.data || data);
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

  const filtered = cotizaciones.filter((c) =>
    `${c.fec_cot} ${c.est_cot} ${c.validez_dias} ${c.total_cot} ${c.descuento} ${c.notas} ${c.id_cli} ${c.cliente?.nom_cli} ${c.cliente?.ap_pat_cli} ${c.cliente?.ap_mat_cli} ${c.id_emp} ${c.empleado?.nom_emp} ${c.empleado?.ap_pat_emp} ${c.empleado?.ap_mat_emp}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    cotizaciones,
    setCotizaciones,
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
