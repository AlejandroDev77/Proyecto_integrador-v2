import { useState, useEffect } from "react";
import { cambiarEstadoProveedor, getProveedores } from "../../services/proveedorService";

interface Proveedor {
    id_prov: number;
    cod_prov?: string;
    nom_prov: string;
    contacto_prov: string;
    email_prov: string;
    tel_prov: string;
    dir_prov: string;
    nit_prov: string;
    est_prov: boolean;

};


export function useProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState(false);
  const [loadingCambioEstado, setLoadingCambioEstado] = useState(false);
  const [showModalEstado, setShowModalEstado] = useState(false);
  const [selectedProId, setSelectedProId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<string>("");
  

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getProveedores(currentPage, itemsPerPage, filters, sort);
        setProveedores(data.data || data);
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
  const abrirModalEstado = (id: number, estado: boolean) => {
      setSelectedProId(id);
      setNuevoEstado(!estado);
      setShowModalEstado(true);
    };
  
    const confirmarCambioEstado = async () => {
      if (selectedProId === null) return;
      setLoadingCambioEstado(true);
      try {
        await cambiarEstadoProveedor(selectedProId, nuevoEstado);
        const actualizados = proveedores.map((u) =>
          u.id_prov === selectedProId ? { ...u, est_prov: nuevoEstado } : u
        );
        setProveedores(actualizados);
        setShowModalEstado(false);
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        setShowModalEstado(false);
      } finally {
        setLoadingCambioEstado(false);
      }
    };

  const filtered = proveedores.filter((c) =>
    `${c.nom_prov} ${c.contacto_prov} ${c.email_prov} ${c.tel_prov} ${c.dir_prov} ${c.nit_prov}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // already paginated by server

  return {
    proveedores,
    setProveedores,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    nuevoEstado,
    setNuevoEstado,
    loadingCambioEstado,
    showModalAgregar,
    setShowModalAgregar,  
    totalItems,
    totalPages,
    loading,
    abrirModalEstado,
    confirmarCambioEstado,
    paginatedData,
    showModalEstado,
    setShowModalEstado,
    selectedProId,
    setSelectedProId,
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
