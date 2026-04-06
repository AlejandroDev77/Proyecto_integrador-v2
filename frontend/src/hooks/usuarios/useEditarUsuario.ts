import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { actualizarUsuario } from "../../services/usuarioService";
import { getRoles } from "../../services/rolService";
import { parseApiErrors } from "../../components/ui/modal/shared";
import { Usuario } from "../../types/usuario";
import { Rol } from "../../types/rol";
import { PaginationInfo } from "../../types/pagination";

type TabType = "datos" | "rol";

export function useEditarUsuario(
  showModal: boolean,
  setShowModal: (show: boolean) => void,
  usuarioSeleccionado: Usuario | null,
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>,
) {
  const [activeTab, setActiveTab] = useState<TabType>("datos");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    nom_usu: "",
    email_usu: "",
    est_usu: true,
  });
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [rolSearch, setRolSearch] = useState("");
  const [rolPag, setRolPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingRol, setLoadingRol] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const fetchRolesData = useCallback(async (page = 1, search = "") => {
    setLoadingRol(true);
    try {
      const p = await getRoles(page, 6, { nom_rol: search });
      setRoles(p?.data || p?.content || []);
      setRolPag({
        currentPage: p.page || p.current_page || (p.number !== undefined ? p.number + 1 : 1),
        lastPage: p.last_page || p.totalPages || 1,
        total: p.total || p.totalElements || 0,
      });
    } catch {
      setRoles([]);
    } finally {
      setLoadingRol(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchRolesData();
    }
  }, [showModal, fetchRolesData]);

  useEffect(() => {
    const t = setTimeout(() => fetchRolesData(1, rolSearch), 300);
    return () => clearTimeout(t);
  }, [rolSearch, fetchRolesData]);

  useEffect(() => {
    if (usuarioSeleccionado) {
      setForm({
        nom_usu: usuarioSeleccionado.nom_usu,
        email_usu: usuarioSeleccionado.email_usu,
        est_usu: usuarioSeleccionado.est_usu,
      });
      setSelectedRol({
        id_rol: usuarioSeleccionado.id_rol,
        nom_rol: usuarioSeleccionado.rol?.nom_rol || "",
      });
    }
  }, [usuarioSeleccionado]);

  const handleClose = () => {
    setShowModal(false);
    setActiveTab("datos");
    setValidationErrors(null);
    setGeneralError(null);
    setRolSearch("");
  };

  const handleSubmit = async () => {
    if (!usuarioSeleccionado || !selectedRol || !form.nom_usu || !form.email_usu) return;
    setIsSubmitting(true);
    setValidationErrors(null);
    setGeneralError(null);

    try {
      const responseData = await actualizarUsuario(usuarioSeleccionado.id_usu, {
        nom_usu: form.nom_usu,
        email_usu: form.email_usu,
        est_usu: form.est_usu,
        id_rol: selectedRol.id_rol,
      });

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usu === usuarioSeleccionado.id_usu
            ? {
                ...(responseData?.data ?? responseData),
                rol: { nom_rol: selectedRol.nom_rol },
              }
            : u,
        ),
      );

      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
    } catch (error: any) {
      if (error.response) {
        const { fieldErrors, generalError: genError } = parseApiErrors(error.response.data);
        setValidationErrors(fieldErrors);
        setGeneralError(genError);
        setActiveTab("datos");
      } else {
        setGeneralError("Error de conexión. Por favor, verifique su conexión a internet.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    isSubmitting,
    form,
    setForm,
    selectedRol,
    setSelectedRol,
    roles,
    rolSearch,
    setRolSearch,
    rolPag,
    loadingRol,
    validationErrors,
    generalError,
    handleClose,
    handleSubmit,
    setValidationErrors,
    setGeneralError,
    fetchRolesData
  };
}
