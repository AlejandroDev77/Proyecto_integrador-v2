import { useState, useEffect } from "react";
import { getMovimientosInventarios } from "../../services/movimiento_inventarioService";

interface MovimientoInventario {
    id_mov: number;
    cod_mov?: string;
    tipo_mov: string;
    fecha_mov: string;
    cantidad: number;
    stock_anterior: number;
    stock_posterior: number;
    motivo: string;
    id_mat: number;
    material?: {
        nom_mat: string;
    };
    id_mue: number;
    mueble?: {
        nom_mue: string;
    };
    id_ven: number;
    venta?: {
        fec_ven: string;
    };
    id_pro: number;
    produccion?: {
        fec_ini: string;
        fec_fin: string;
    };
    id_comp: number;
    compramaterial?: {
        fec_comp: string;
    };
    id_dev: number;
    devolucion?: {
        fec_dev: string;
    };
    id_emp: number;
    empleado?: {
        nom_emp: string;
        ap_pat_emp: string;
        ap_mat_emp: string;
    };
 
}

export function useMovimientosInventarios() {
  const [movimientosinventarios, setMovimietosInventarios] = useState<MovimientoInventario[]>([]);
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
        const data = await getMovimientosInventarios(currentPage, itemsPerPage, filters, sort);
        setMovimietosInventarios(data.data || data);
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

  const filtered = movimientosinventarios.filter((c) =>
    `${c.tipo_mov} ${c.fecha_mov} ${c.cantidad} ${c.stock_anterior} ${c.stock_posterior} ${c.motivo} ${c.id_mat} ${c.material?.nom_mat} ${c.id_mue} ${c.mueble?.nom_mue} ${c.id_ven} ${c.venta?.fec_ven} ${c.id_pro} ${c.produccion?.fec_ini} ${c.produccion?.fec_fin} ${c.id_comp} ${c.compramaterial?.fec_comp} ${c.id_dev} ${c.devolucion?.fec_dev} ${c.id_emp} ${c.empleado?.nom_emp} ${c.empleado?.ap_pat_emp} ${c.empleado?.ap_mat_emp}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // servidor ya pagina

  return {
    movimientosinventarios,
    setMovimietosInventarios,
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
