import { useState, useEffect } from "react";
import { cambiarEstadoMaterial, getMateriales } from "../../services/materialService";

interface Material {
  id_mat: number;
  cod_mat?: string;
  nom_mat: string;
  desc_mat: string;
  stock_mat: number;
  unidad_medida: string;
  stock_min: number;
  est_mat: boolean;
  costo_mat: number;
  img_mat: string;


};


export function useMateriales() {
  const [materiales, setMateriales] = useState<Material[]>([]);
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
  const [selectedMatId, setSelectedMatId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<string>("");
  

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getMateriales(currentPage, itemsPerPage, filters, sort);
        setMateriales(data.data || data);
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
      setSelectedMatId(id);
      setNuevoEstado(!estado);
      setShowModalEstado(true);
    };
  
    const confirmarCambioEstado = async () => {
      if (selectedMatId === null) return;
      setLoadingCambioEstado(true);
      try {
        await cambiarEstadoMaterial(selectedMatId, nuevoEstado);
        const actualizados = materiales.map((u) =>
          u.id_mat === selectedMatId ? { ...u, est_mat: nuevoEstado } : u
        );
        setMateriales(actualizados);
        setShowModalEstado(false);
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        setShowModalEstado(false);
      } finally {
        setLoadingCambioEstado(false);
      }
    };

  const filtered = materiales.filter((c) =>
    `${c.nom_mat}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedData = filtered; // server paginates

  return {
    materiales,
    setMateriales,
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
    selectedMatId,
    setSelectedMatId,
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
