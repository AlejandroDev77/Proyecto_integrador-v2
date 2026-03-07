import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/permisos";

interface Permiso {
  id_permiso: number;
  nombre: string;
  descripcion?: string;
}

export const usePermisos = () => {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [selectedPermiso, setSelectedPermiso] = useState<Permiso | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<string | null>(null);

  // Cargar permisos (paginated)
  useEffect(() => {
    fetchPermisos();
  }, [currentPage, itemsPerPage, filters, sort]);

  const fetchPermisos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: itemsPerPage.toString(),
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(`filter[${key}]`, value);
      });

      if (sort && typeof sort === 'string' && sort !== '') {
        params.append("sort", sort);
      }

      const response = await axios.get(`${API_URL}?${params.toString()}`);
      const data = response.data;
      setPermisos(data.data || data);
      setTotalPages(data.last_page || 1);
      setTotalItems(data.total || (data.data ? data.data.length : 0));
      setError(null);
    } catch (err) {
      console.error("Error al cargar permisos:", err);
      setError("Error al cargar los permisos");
    } finally {
      setLoading(false);
    }
  };

  // Crear permiso
  const crearPermiso = async (datos: Omit<Permiso, "id_permiso">) => {
    setLoadingAction(true);
    try {
      const response = await axios.post(API_URL, datos);
      setPermisos([...permisos, response.data]);
      setShowModalAgregar(false);
      setError(null);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al crear permiso";
      setError(errorMsg);
      console.error("Error al crear permiso:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  // Actualizar permiso
  const actualizarPermiso = async (
    id_permiso: number,
    datos: Partial<Permiso>
  ) => {
    setLoadingAction(true);
    try {
      const response = await axios.put(`${API_URL}/${id_permiso}`, datos);
      setPermisos(
        permisos.map((p) => (p.id_permiso === id_permiso ? response.data : p))
      );
      setShowModalEditar(false);
      setSelectedPermiso(null);
      setError(null);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al actualizar permiso";
      setError(errorMsg);
      console.error("Error al actualizar permiso:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  // Eliminar permiso
  const eliminarPermiso = async (id_permiso: number) => {
    setLoadingAction(true);
    try {
      await axios.delete(`${API_URL}/${id_permiso}`);
      setPermisos(permisos.filter((p) => p.id_permiso !== id_permiso));
      setShowModalEliminar(false);
      setSelectedPermiso(null);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al eliminar permiso";
      setError(errorMsg);
      console.error("Error al eliminar permiso:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  // Filtrado y paginación
  const filteredData = permisos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );
  const paginatedData = filteredData; // server already paginates

  return {
    permisos,
    setPermisos,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showModalAgregar,
    setShowModalAgregar,
    showModalEditar,
    setShowModalEditar,
    showModalEliminar,
    setShowModalEliminar,
    selectedPermiso,
    setSelectedPermiso,
    loadingAction,
    error,
    setError,
    fetchPermisos,
    crearPermiso,
    actualizarPermiso,
    eliminarPermiso,
    filteredData,
    totalItems,
    totalPages,
    loading,
    paginatedData,
    filters,
    setFilters,
    sort,
    setSort,
  };
};
