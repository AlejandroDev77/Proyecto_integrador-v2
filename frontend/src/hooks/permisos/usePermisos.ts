import { useState, useEffect } from "react";
import Swal from "sweetalert2";
//import axiosClient from "../../api/axios";
import {
  getPermisos,
  crearPermiso as crearPermisoService,
  actualizarPermiso as actualizarPermisoService,
  eliminarPermiso as eliminarPermisoService,
  //API_URL
} from "../../services/Permiso";
import { Permiso } from "../../types/permiso";


export const usePermisos = (initialPermiso?: Permiso | null) => {
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
  const [editForm, setEditForm] = useState({ nom_permiso: "", descripcion: "" });
  const [editFormError, setEditFormError] = useState<string>("");
  const [addForm, setAddForm] = useState({ nom_permiso: "", descripcion: "" });
  const [addFormError, setAddFormError] = useState<string>("");

  // Sincronizar el permiso inicial si se proporciona
  useEffect(() => {
    if (initialPermiso !== undefined) {
      setSelectedPermiso(initialPermiso);
    }
  }, [initialPermiso]);

  // Cargar permisos (paginated)


  const fetchPermisos = async () => {
      setLoading(true);
      try {
        const data = await getPermisos(currentPage, itemsPerPage, filters, sort || "");
        const rolesArray = data.data || data.content || (Array.isArray(data) ? data : []);
        setPermisos(rolesArray);
        setTotalPages(data.last_page || data.totalPages || 1);
        setTotalItems(data.total || data.totalElements || rolesArray.length);
      } catch (error) {
        console.error("Error al cargar roles:", error);
        setError("Error al cargar roles");
        setPermisos([]);
      } finally {
        setLoading(false);
      }
    };
    
  useEffect(() => {
    fetchPermisos();
  }, [currentPage, itemsPerPage, filters, sort]);

  // Sincronizar formulario de edición con permiso seleccionado
  useEffect(() => {
    if (selectedPermiso) {
      setEditForm({
        nom_permiso: selectedPermiso.nom_permiso || "",
        descripcion: selectedPermiso.descripcion || "",
      });
    } else {
      setEditForm({ nom_permiso: "", descripcion: "" });
    }
  }, [selectedPermiso]);

  // Validar formulario de crear
  const validateAddForm = (): string | null => {
    if (!addForm.nom_permiso.trim()) {
      return "El nombre es requerido.";
    }
    return null;
  };

  // Guardar nuevo permiso con validación y manejo de errores
  const handleGuardarAddForm = async (onSuccess?: () => void) => {
    const validationError = validateAddForm();
    if (validationError) {
      setAddFormError(validationError);
      return;
    }

    setAddFormError("");
    setLoadingAction(true);

    try {
      const response = await crearPermisoService(
        addForm.nom_permiso.trim(),
        addForm.descripcion.trim()
      );
      setPermisos([...permisos, response]);
      setShowModalAgregar(false);
      clearAddForm();
      setAddFormError("");
      
      Swal.fire({
        icon: "success",
        title: "¡Permiso creado!",
        showConfirmButton: false,
        timer: 1500,
      });
      
      onSuccess?.();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al crear permiso";
      setAddFormError(errorMsg);
      console.error("Error al crear permiso:", err);
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
    setAddForm({ nom_permiso: "", descripcion: "" });
  };

  // Crear permiso
   const crearPermiso = async (datos: Omit<Permiso, "id">) => {
      setLoadingAction(true);
      try {
        const response = await crearPermisoService(datos.nom_permiso, datos.descripcion || "");
        setPermisos([...permisos, response]);
        setShowModalAgregar(false);
        setError(null);
        return response;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Error al crear permiso";
        setError(errorMsg);
        console.error("Error al crear permiso:", err);
        throw err;
      } finally {
        setLoadingAction(false);
      }
    };
  

  // Validar formulario de edición
  const validateEditForm = (): string | null => {
    if (!editForm.nom_permiso.trim()) {
      return "El nombre es requerido.";
    }
    return null;
  };

  // Guardar permiso con validación y manejo de errores
  const handleGuardarEditForm = async (onSuccess?: () => void) => {
    if (!selectedPermiso) return;

    const validationError = validateEditForm();
    if (validationError) {
      setEditFormError(validationError);
      return;
    }

    setEditFormError("");
    setLoadingAction(true);

    try {
      const response = await actualizarPermisoService(
        selectedPermiso.id,
        editForm.nom_permiso.trim(),
        editForm.descripcion.trim()
      );
      setPermisos(permisos.map((r) => (r.id === selectedPermiso.id ? response : r)));
      setShowModalEditar(false);
      clearEditForm();
      setEditFormError("");
      
      Swal.fire({
        icon: "success",
        title: "¡Permiso actualizado!",
        showConfirmButton: false,
        timer: 1500,
      });
      
      onSuccess?.();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al actualizar permiso";
      setEditFormError(errorMsg);
      console.error("Error al actualizar permiso:", err);
    } finally {
      setLoadingAction(false);
    }
  };

  // Actualizar permiso
   const actualizarPermiso = async (id: number, datos: Partial<Permiso>) => {
     setLoadingAction(true);
     try {
       const response = await actualizarPermisoService(id, datos.nom_permiso || "", datos.descripcion || "");
       setPermisos(permisos.map((r) => (r.id === id ? response : r)));
       setShowModalEditar(false);
       setSelectedPermiso(null);
       setError(null);
       return response;
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
  const eliminarPermiso = async (id: number) => {
      setLoadingAction(true);
      try {
        await eliminarPermisoService(id);
        setPermisos(permisos.filter((r) => r.id !== id));
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

   const filteredData = permisos.filter((r) => {
     const nomPermiso = r.nom_permiso || "";
     const descripcion = r.descripcion || "";
     return (
       nomPermiso.toLowerCase().includes(searchTerm.toLowerCase()) ||
       descripcion.toLowerCase().includes(searchTerm.toLowerCase())
     );
   });

  // Actualizar campo del formulario de edición
  const updateEditForm = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Limpiar formulario de edición
  const clearEditForm = () => {
    setEditForm({ nom_permiso: "", descripcion: "" });
    setSelectedPermiso(null);
  };

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
    paginatedData: permisos,
    filters,
    setFilters,
    sort,
    setSort,
    editForm,
    updateEditForm,
    clearEditForm,
    editFormError,
    setEditFormError,
    validateEditForm,
    handleGuardarEditForm,
    addForm,
    updateAddForm,
    clearAddForm,
    addFormError,
    setAddFormError,
    validateAddForm,
    handleGuardarAddForm,
  };
};
