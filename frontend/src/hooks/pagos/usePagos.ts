import { useState, useEffect } from "react";
import { getPagos } from "../../services/pagoService";

interface Pago {
    id_pag: number;
    cod_pag?: string;
    monto: number;
    fec_pag: string;
    metodo_pag: string;
    referencia_pag: string;
    id_ven: number;
    venta?: {
        est_ven: string;
        total_ven: number;
    };
}

export function usePagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
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
        const data = await getPagos(currentPage, itemsPerPage, filters, sort);
        setPagos(data.data || data);
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

  const filtered = pagos.filter((c) =>
    `${c.fec_pag} ${c.metodo_pag} ${c.referencia_pag} ${c.id_ven} ${c.venta?.est_ven} ${c.venta?.total_ven}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    pagos,
    setPagos,
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
