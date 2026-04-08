import { useState, useEffect } from "react";
import Swal from "sweetalert2";
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
  const [addForm, setAddForm] = useState({ nom_rol: "" });
  const [addFormError, setAddFormError] = useState<string>("");
  const [editForm, setEditForm] = useState({ nom_rol: "" });
  const [editFormError, setEditFormError] = useState<string>("");

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

  // Sincronizar formulario de edición con rol seleccionado
  useEffect(() => {
    if (selectedRol) {
      setEditForm({
        nom_rol: selectedRol.nom_rol || "",
      });
    } else {
      setEditForm({ nom_rol: "" });
    }
  }, [selectedRol]);

  // Validar formulario de crear
  const validateAddForm = (): string | null => {
    if (!addForm.nom_rol.trim()) {
      return "El nombre del rol es requerido.";
    }
    return null;
  };

  // Guardar nuevo rol con validación y manejo de errores
  const handleGuardarAddForm = async (onSuccess?: () => void) => {
    const validationError = validateAddForm();
    if (validationError) {
      setAddFormError(validationError);
      return;
    }

    setAddFormError("");
    setLoadingAction(true);

    try {
      const response = await crearRolService(addForm.nom_rol.trim());
      setRoles([...roles, response]);
      setShowModalAgregar(false);
      clearAddForm();
      setAddFormError("");
      
      Swal.fire({
        icon: "success",
        title: "¡Rol creado!",
        showConfirmButton: false,
        timer: 1500,
      });
      
      onSuccess?.();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al crear rol";
      setAddFormError(errorMsg);
      console.error("Error al crear rol:", err);
    } finally {
      setLoadingAction(false);
    }
  };

  // Validar formulario de edición
  const validateEditForm = (): string | null => {
    if (!editForm.nom_rol.trim()) {
      return "El nombre del rol es requerido.";
    }
    return null;
  };

  // Guardar rol con validación y manejo de errores
  const handleGuardarEditForm = async (onSuccess?: () => void) => {
    if (!selectedRol) return;

    const validationError = validateEditForm();
    if (validationError) {
      setEditFormError(validationError);
      return;
    }

    setEditFormError("");
    setLoadingAction(true);

    try {
      const response = await actualizarRolService(
        selectedRol.id_rol,
        editForm.nom_rol.trim()
      );
      setRoles(roles.map((r) => (r.id_rol === selectedRol.id_rol ? response : r)));
      setShowModalEditar(false);
      clearEditForm();
      setEditFormError("");
      
      Swal.fire({
        icon: "success",
        title: "¡Rol actualizado!",
        showConfirmButton: false,
        timer: 1500,
      });
      
      onSuccess?.();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al actualizar rol";
      setEditFormError(errorMsg);
      console.error("Error al actualizar rol:", err);
    } finally {
      setLoadingAction(false);
    }
  };

  // Actualizar campo del formulario de crear
  const updateAddForm = (field: string, value: string) => {
    setAddForm((prev) => ({ ...prev, [field]: value }));
  };

  // Limpiar formulario de crear
  const clearAddForm = () => {
    setAddForm({ nom_rol: "" });
  };

  // Actualizar campo del formulario de edición
  const updateEditForm = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Limpiar formulario de edición
  const clearEditForm = () => {
    setEditForm({ nom_rol: "" });
    setSelectedRol(null);
  };

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
    addForm,
    updateAddForm,
    clearAddForm,
    addFormError,
    setAddFormError,
    validateAddForm,
    handleGuardarAddForm,
    editForm,
    updateEditForm,
    clearEditForm,
    editFormError,
    setEditFormError,
    validateEditForm,
    handleGuardarEditForm,
  };
};
