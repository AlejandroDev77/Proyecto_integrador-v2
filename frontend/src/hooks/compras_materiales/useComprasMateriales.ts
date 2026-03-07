import { useState, useEffect } from "react";
import { getComprasMateriales } from "../../services/compra_materialService";

interface CompraMaterial {
    id_comp: number;
    cod_comp?: string;
    fec_comp: string;
    est_comp: string;
    total_comp: number;
    id_prov: number;
    proveedor?: {
    nom_prov: string;
  };
    id_emp: number;
    empleado?: {
    nom_emp: string;
    }    
}

export function useComprasMateriales() {
  const [comprasmateriales, setComprasMateriales] = useState<CompraMaterial[]>([]);
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
        const data = await getComprasMateriales(currentPage, itemsPerPage , filters, sort);
        setComprasMateriales(data.data || data);
        setTotalPages(data.last_page || 1);
        setTotalItems(data.total || (data.data ? data.data.length : 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [currentPage, itemsPerPage , filters, sort]);

  const filtered = comprasmateriales.filter((c) =>
    `${c.fec_comp} ${c.est_comp} ${c.total_comp} ${c.id_prov} ${c.id_emp}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // already paginated by server

  return {
    comprasmateriales,
    setComprasMateriales,
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
