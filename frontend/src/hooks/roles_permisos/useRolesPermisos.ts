import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/roles-permisos";

interface RolPermiso {
  id_rol: number;
  id_permiso: number;
  nom_rol: string;
  nom_permiso: string;
  descripcion?: string;
}

export const useRolesPermisos = () => {
  const [rolesPermisos, setRolesPermisos] = useState<RolPermiso[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [selectedRolPermiso, setSelectedRolPermiso] = useState<RolPermiso | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterRol, setFilterRol] = useState<number | null>(null);
  const [filterPermiso, setFilterPermiso] = useState<number | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<string | null>(null);

  // Cargar relaciones rol-permiso
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchRolesPermisos = async (page: number = 1, perPage: number = 20) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(`filter[${key}]`, value);
      });

      if (sort && typeof sort === 'string' && sort !== '') {
        params.append("sort", sort);
      }

      const response = await axios.get(`${API_URL}?${params.toString()}`);
      const data = response.data;
      setRolesPermisos(data.data || data);
      setTotalPages(data.last_page || 1);
      setTotalItems(data.total || (data.data ? data.data.length : 0));
      setError(null);
    } catch (err) {
      console.error("Error al cargar roles-permisos:", err);
      setError("Error al cargar las relaciones rol-permiso");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesPermisos(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, filters, sort]);

  // Obtener con filtros
  const fetchRolesPermisosFiltered = async (
    id_rol?: number,
    id_permiso?: number
  ) => {
    try {
      const params = new URLSearchParams();
      if (id_rol) params.append("id_rol", id_rol.toString());
      if (id_permiso) params.append("id_permiso", id_permiso.toString());

      const response = await axios.get(
        `${API_URL}/filtrar?${params.toString()}`
      );
      setRolesPermisos(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al filtrar roles-permisos:", err);
      setError("Error al filtrar las relaciones rol-permiso");
    }
  };

  // Asignar permiso a rol
  const asignarPermiso = async (id_rol: number, id_permiso: number) => {
    setLoadingAction(true);
    try {
      await axios.post(`http://localhost:8080/api/roles/${id_rol}/permisos/${id_permiso}`);
      await fetchRolesPermisos();
      setShowModalAgregar(false);
      setError(null);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Error al asignar permiso";
      setError(errorMsg);
      console.error("Error al asignar permiso:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  // Revocar permiso de rol
  const revocarPermiso = async (id_rol: number, id_permiso: number) => {
    setLoadingAction(true);
    try {
      await axios.delete(
        `http://localhost:8080/api/roles/${id_rol}/permisos/${id_permiso}`
      );
      await fetchRolesPermisos();
      setShowModalEliminar(false);
      setSelectedRolPermiso(null);
      setError(null);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Error al revocar permiso";
      setError(errorMsg);
      console.error("Error al revocar permiso:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  // Asignar múltiples permisos a un rol
  const asignarPermisosLote = async (id_rol: number, id_permisos: number[]) => {
    setLoadingAction(true);
    try {
      await axios.post(
        `http://localhost:8080/api/roles/${id_rol}/permisos-batch`,
        { id_permisos }
      );
      await fetchRolesPermisos();
      setShowModalAgregar(false);
      setError(null);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Error al asignar permisos";
      setError(errorMsg);
      console.error("Error al asignar permisos:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  // Revocar múltiples permisos de un rol
  const revocarPermisosLote = async (
    id_rol: number,
    id_permisos: number[]
  ) => {
    setLoadingAction(true);
    try {
      await axios.delete(
        `http://localhost:8080/api/roles/${id_rol}/permisos-batch`,
        { data: { id_permisos } }
      );
      await fetchRolesPermisos();
      setShowModalEliminar(false);
      setError(null);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Error al revocar permisos";
      setError(errorMsg);
      console.error("Error al revocar permisos:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  // Sincronizar permisos de un rol
  const sincronizarPermisos = async (id_rol: number, id_permisos: number[]) => {
    setLoadingAction(true);
    try {
      await axios.put(
        `http://localhost:8080/api/roles/${id_rol}/permisos`,
        { id_permisos }
      );
      await fetchRolesPermisos();
      setShowModalAgregar(false);
      setError(null);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Error al sincronizar permisos";
      setError(errorMsg);
      console.error("Error al sincronizar permisos:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  // Filtrado y paginación
  const filteredData = rolesPermisos.filter((rp) => {
    const matchSearch =
      rp.nom_rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rp.nom_permiso.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRolFilter = !filterRol || rp.id_rol === filterRol;
    const matchPermisoFilter = !filterPermiso || rp.id_permiso === filterPermiso;

    return matchSearch && matchRolFilter && matchPermisoFilter;
  });

  const paginatedData = filteredData; // server already paginates

  return {
    rolesPermisos,
    setRolesPermisos,
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
    showModalEliminar,
    setShowModalEliminar,
    selectedRolPermiso,
    setSelectedRolPermiso,
    loadingAction,
    error,
    setError,
    filterRol,
    setFilterRol,
    filterPermiso,
    setFilterPermiso,
    fetchRolesPermisos,
    fetchRolesPermisosFiltered,
    asignarPermiso,
    revocarPermiso,
    asignarPermisosLote,
    revocarPermisosLote,
    sincronizarPermisos,
    filteredData,
    paginatedData,
    filters,
    setFilters,
    sort,
    setSort,
  };
};
