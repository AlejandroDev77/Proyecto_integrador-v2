import { useState, useEffect } from "react";
import { getEmpleados } from "../../services/empleadoService";

interface Empleado {
  id_emp: number;
  cod_emp?: string;
  nom_emp: string;
  ap_pat_emp: string;
  ap_mat_emp: string;
  cel_emp: number;
  dir_emp: string;
  fec_nac_emp: string;
  ci_emp: string;
  img_emp: string;
  car_emp: string;
  id_usu: number;
  usuario?: {
    nom_usu: string;
  };
}

export function useEmpleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
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
        const data = await getEmpleados(currentPage, itemsPerPage, filters, sort);
        setEmpleados(data.data || data);
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

  const filtered = empleados.filter((c) =>
    `${c.nom_emp} ${c.ap_pat_emp} ${c.ap_mat_emp}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server already paginates

  return {
    empleados,
    setEmpleados,
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
