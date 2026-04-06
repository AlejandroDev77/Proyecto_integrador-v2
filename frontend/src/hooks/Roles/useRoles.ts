import { useState, useEffect } from "react";
import axiosClient from "../../api/axios";
import { 
  getRoles, 
  crearRol as crearRolService,
  actualizarRol as actualizarRolService,
  eliminarRol as eliminarRolService,
  API_URL
} from "../../services/rolService";
import { Rol } from "../../types/rol";

export const useRoles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<string | null>(null);

  // Cargar roles con paginación y filtros
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoles(currentPage, itemsPerPage, filters, sort || "");
      const rolesArray = data.data || data.content || (Array.isArray(data) ? data : []);
      setRoles(rolesArray);
      setTotalPages(data.last_page || data.totalPages || 1);
      setTotalItems(data.total || data.totalElements || rolesArray.length);
    } catch (error) {
      console.error("Error al cargar roles:", error);
      setError("Error al cargar roles");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [currentPage, itemsPerPage, filters, sort]);

  // Crear rol
  const crearRol = async (datos: Omit<Rol, "id_rol">) => {
    setLoadingAction(true);
    try {
      const response = await crearRolService(datos.nom_rol);
      setRoles([...roles, response]);
      setShowModalAgregar(false);
      setError(null);
      return response;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al crear rol";
      setError(errorMsg);
      console.error("Error al crear rol:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  // Actualizar rol
  const actualizarRol = async (id_rol: number, datos: Partial<Rol>) => {
    setLoadingAction(true);
    try {
      const response = await actualizarRolService(id_rol, datos.nom_rol || "");
      setRoles(roles.map((r) => (r.id_rol === id_rol ? response : r)));
      setShowModalEditar(false);
      setSelectedRol(null);
      setError(null);
      return response;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al actualizar rol";
      setError(errorMsg);
      console.error("Error al actualizar rol:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  // Eliminar rol
  const eliminarRol = async (id_rol: number) => {
    setLoadingAction(true);
    try {
      await eliminarRolService(id_rol);
      setRoles(roles.filter((r) => r.id_rol !== id_rol));
      setShowModalEliminar(false);
      setSelectedRol(null);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al eliminar rol";
      setError(errorMsg);
      console.error("Error al eliminar rol:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  // Obtener permisos de un rol
  const obtenerPermisosRol = async (id_rol: number) => {
    try {
      const response = await axiosClient.get(`${API_URL}/${id_rol}/permisos`);
      return response.data;
    } catch (err) {
      console.error("Error al obtener permisos del rol:", err);
      throw err;
    }
  };

  // Obtener usuarios de un rol
  const obtenerUsuariosRol = async (id_rol: number) => {
    try {
      const response = await axiosClient.get(`${API_URL}/${id_rol}/usuarios`);
      return response.data;
    } catch (err) {
      console.error("Error al obtener usuarios del rol:", err);
      throw err;
    }
  };

  // Filtrado
  const filteredData = roles.filter((r) =>
    r.nom_rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    roles,
    setRoles,
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
    showModalEditar,
    setShowModalEditar,
    showModalEliminar,
    setShowModalEliminar,
    selectedRol,
    setSelectedRol,
    loadingAction,
    error,
    setError,
    crearRol,
    actualizarRol,
    eliminarRol,
    obtenerPermisosRol,
    obtenerUsuariosRol,
    filteredData,
    paginatedData: roles,  // Alias para compatibilidad
    fetchRoles,            // Función para recargar
    filters,
    setFilters,
    sort,
    setSort,
  };
};
