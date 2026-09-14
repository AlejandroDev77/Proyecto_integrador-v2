import { useState, useEffect } from "react";
import { getUsuarios, cambiarEstadoUsuario } from "../../services/usuarioService";
import { Usuario } from "../../types/usuario";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModalEstado, setShowModalEstado] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState(false);
  const [loadingCambioEstado, setLoadingCambioEstado] = useState(false);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<string>("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        // Filtros ya vienen con el formato correcto (sin filter[])
        const data = await getUsuarios(currentPage, itemsPerPage, filters, sort);
        const realData = data.data && data.success !== undefined ? data.data : data;
        const itemsArray = realData.content || realData.data || (Array.isArray(realData) ? realData : []);
        setUsuarios(itemsArray);
        setTotalPages(realData.totalPages || realData.total_pages || realData.last_page || 1);
        setTotalItems(realData.totalElements || realData.total_elements || realData.total || itemsArray.length);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [currentPage, itemsPerPage, filters, sort]);

  const abrirModalEstado = (id: number, estado: boolean) => {
    setSelectedUserId(id);
    setNuevoEstado(!estado);
    setShowModalEstado(true);
  };

  const confirmarCambioEstado = async () => {
    if (selectedUserId === null) return;
    setLoadingCambioEstado(true);
    try {
      await cambiarEstadoUsuario(selectedUserId, nuevoEstado);
      const actualizados = usuarios.map((u) =>
        u.id_usu === selectedUserId ? { ...u, est_usu: nuevoEstado } : u
      );
      setUsuarios(actualizados);
      setShowModalEstado(false);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setShowModalEstado(false);
    } finally {
      setLoadingCambioEstado(false);
    }
  };

  const filteredData = usuarios.filter((u) =>
    u.nom_usu.toLowerCase().includes(searchTerm.toLowerCase())
  || u.email_usu.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const paginatedData = filteredData;

  return {
    usuarios,
    setUsuarios,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    totalPages,
    loading,
    showModalEstado,
    setShowModalEstado,
    selectedUserId,
    setSelectedUserId,
    nuevoEstado,
    setNuevoEstado,
    loadingCambioEstado,
    showModalAgregar,
    setShowModalAgregar,
    abrirModalEstado,
    confirmarCambioEstado,
    filteredData,
    paginatedData,
    filters,
    setFilters,
    sort,
    setSort,
  };
};
