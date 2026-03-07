import { useState, useEffect } from "react";
import { getDevolucion } from "../../services/devolucionService";

interface Devolucion {
  id_dev: number;
  cod_dev?: string;
  fec_dev: string;
  motivo_dev: string;
  total_dev: number;
  est_dev: string;
  id_ven: number;
  venta?: {
    fec_ven: string;
  };
  id_emp: number;
  empleado?: {
    nom_emp: string;
    ap_pat_emp: string;
    ap_mat_emp: string;
  };
}

export function useDevoluciones() {
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
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
        const data = await getDevolucion(
          currentPage,
          itemsPerPage,
          filters,
          sort
        );
        setDevoluciones(data.data || data);
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

  const filtered = devoluciones.filter((c) =>
    `${c.fec_dev} ${c.motivo_dev} ${c.total_dev} ${c.est_dev} ${c.id_ven} ${c.venta?.fec_ven} ${c.id_emp} ${c.empleado?.nom_emp}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    devoluciones,
    setDevoluciones,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    totalPages,
    loading,
    filters,
    setFilters,
    sort,
    setSort,
    showModalAgregar,
    setShowModalAgregar,
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
