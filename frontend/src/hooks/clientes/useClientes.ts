import { useState, useEffect } from "react";
import { getClientes } from "../../services/clienteService";

interface Cliente {

  id_cli: number;
  cod_cli?: string;
  nom_cli: string;
  ap_pat_cli: string;
  ap_mat_cli: string;
  cel_cli: number;
  dir_cli: string;
  fec_nac_cli: string;
  ci_cli: string;
  img_cli: string;
  id_usu: number;
  usuario?: {
    nom_usu: string;
  };
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
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
        const data = await getClientes(currentPage, itemsPerPage, filters, sort);
        setClientes(data.data || data);
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

  const filtered = clientes.filter((c) =>
    `${c.nom_cli} ${c.ap_pat_cli} ${c.ap_mat_cli}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    clientes,
    setClientes,
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
