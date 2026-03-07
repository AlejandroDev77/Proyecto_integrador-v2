import { useState, useEffect } from "react";
import { getVentas } from "../../services/ventaService";
import { Venta } from "../../types/venta";

export function useVentas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
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
        const data = await getVentas(currentPage, itemsPerPage , filters, sort);
        setVentas(data.data || data);
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

  const filtered = ventas.filter((c) =>
    `${c.fec_ven} ${c.est_ven} ${c.total_ven} ${c.id_cli} ${c.id_emp}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    ventas,
    setVentas,
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
    filters,
    setFilters,
    sort,
    setSort,
    paginatedData,
    
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
