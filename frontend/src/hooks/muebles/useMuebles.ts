import { useState, useEffect } from "react";
import { cambiarEstadoMueble, getMuebles } from "../../services/muebleService";

interface Mueble {
  id_mue: number;
  cod_mue?: string;
  nom_mue: string;
  desc_mue: string;
  precio_venta: number;
  precio_costo: number;
  stock: number;
  img_mue?: string;
  modelo_3d: string;
  dimensiones: string;
  stock_min: number;
  est_mue: boolean;
  id_cat: number;

  categoria?: {
    nom_cat: string;
  };
}

export function useMuebles() {
  const [muebles, setMuebles] = useState<Mueble[]>([]);
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
  const [selectedMueId, setSelectedMueId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<string>("");

  // Cargar datos cuando cambia la página o el número de items por página
  useEffect(() => {
    const fetchMuebles = async () => {
      setLoading(true);
      try {
        const data = await getMuebles(currentPage, itemsPerPage, filters, sort);
      setMuebles(data.data || data);
        setTotalPages(data.last_pag || 1);
        setTotalItems(data.total || (data.data ? data.data.length : 0));
      } catch (error) {
        console.error("Error al cargar muebles:", error);
        // Intentar usar cache si hay error
        const cached = localStorage.getItem("Muebles");
        if (cached) {
          const cachedData = JSON.parse(cached);
          setMuebles(cachedData.data || cachedData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMuebles();
  }, [currentPage, itemsPerPage, filters, sort]);

  const abrirModalEstado = (id: number, estado: boolean) => {
    setSelectedMueId(id);
    setNuevoEstado(!estado);
    setShowModalEstado(true);
  };

  const confirmarCambioEstado = async () => {
    if (selectedMueId === null) return;
    setLoadingCambioEstado(true);
    try {
      await cambiarEstadoMueble(selectedMueId, nuevoEstado);
      const actualizados = muebles.map((u) =>
        u.id_mue === selectedMueId ? { ...u, est_mue: nuevoEstado } : u
      );
      setMuebles(actualizados);
      setShowModalEstado(false);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setShowModalEstado(false);
    } finally {
      setLoadingCambioEstado(false);
    }
  };

  // La búsqueda se hará del lado del cliente con los datos cargados
  const filtered = muebles.filter((c) =>
    `${c.cod_mue} ${c.nom_mue} ${c.categoria?.nom_cat}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Datos paginados (ya vienen paginados del servidor, pero aplicamos búsqueda local)
  const paginatedData = filtered;

  return {
    muebles,
    setMuebles,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    showModalAgregar,
    setShowModalAgregar,
    totalPages,
    paginatedData,
    loading,
    showModalEstado,
    setShowModalEstado,
    selectedMueId,
    setSelectedMueId,
    abrirModalEstado,
    confirmarCambioEstado,
    nuevoEstado,
    setNuevoEstado,
    loadingCambioEstado,
    filters,
    setFilters,
    sort,
    setSort,

    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    handlePageChange: (page: number) => setCurrentPage(page),
    handleItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
    },
  };
}
