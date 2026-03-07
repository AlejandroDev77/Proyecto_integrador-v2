import { useState, useEffect } from "react";
import axios from "axios";


const API_URL = "http://localhost:8000/api/roles";

interface Rol {
  id_rol: number;
  nom_rol: string;
  permisos?: any[];
  usuarios?: {
    total: number;
    activos: number;
    inactivos: number;
  };
}

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

  // Cargar roles
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<string | null>(null);

  // Cargar roles con paginación
  const fetchRoles = async (page: number = 1, perPage: number = 20) => {
    setLoading(true);
    try {
      const params: any = { page, per_page: perPage };
      if (Object.keys(filters).length > 0) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            // Evitar duplicar filter[ si ya lo tiene
            if (key.startsWith('filter[')) {
              params[key] = value;
            } else {
              params[`filter[${key}]`] = value;
            }
          }
        });
      }
      if (sort && typeof sort === 'string' && sort !== '') {
        params.sort = sort;
      }
      
      const response = await axios.get(API_URL, { params });
      const data = response.data;
      setRoles(data.data || data);
      setTotalPages(data.last_page || 1);
      setTotalItems(data.total || (data.data ? data.data.length : 0));
      setError(null);
    } catch (err) {
      console.error("Error al cargar roles:", err);
      setError("Error al cargar los roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, filters, sort]);

  // Crear rol
  const crearRol = async (datos: Omit<Rol, "id_rol">) => {
    setLoadingAction(true);
    try {
      const response = await axios.post(API_URL, datos);
      setRoles([...roles, response.data]);
      setShowModalAgregar(false);
      setError(null);
      return response.data;
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
      const response = await axios.put(`${API_URL}/${id_rol}`, datos);
      setRoles(roles.map((r) => (r.id_rol === id_rol ? response.data : r)));
      setShowModalEditar(false);
      setSelectedRol(null);
      setError(null);
      return response.data;
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
      await axios.delete(`${API_URL}/${id_rol}`);
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
      const response = await axios.get(`${API_URL}/${id_rol}/permisos`);
      return response.data;
    } catch (err) {
      console.error("Error al obtener permisos del rol:", err);
      throw err;
    }
  };

  // Obtener usuarios de un rol
  const obtenerUsuariosRol = async (id_rol: number) => {
    try {
      const response = await axios.get(`${API_URL}/${id_rol}/usuarios`);
      return response.data;
    } catch (err) {
      console.error("Error al obtener usuarios del rol:", err);
      throw err;
    }
  };

  // Filtrado y paginación
  const filteredData = roles.filter((r) =>
    r.nom_rol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedData = filteredData; // server already paginates

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
    fetchRoles,
    crearRol,
    actualizarRol,
    eliminarRol,
    obtenerPermisosRol,
    obtenerUsuariosRol,
    filteredData,
    paginatedData,
    filters,
    setFilters,
    sort,
    setSort,
  };
};
