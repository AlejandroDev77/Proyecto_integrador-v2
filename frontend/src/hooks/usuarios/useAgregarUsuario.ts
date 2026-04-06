import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { crearUsuario, getUsuarios } from "../../services/usuarioService";
import { getRoles } from "../../services/rolService";
import { parseApiErrors } from "../../components/ui/modal/shared";
import { Usuario } from "../../types/usuario";
import { Rol } from "../../types/rol";
import { PaginationInfo } from "../../types/pagination";

export function useAgregarUsuario(
  showModal: boolean,
  setShowModal: (show: boolean) => void,
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>,
) {
  const [step, setStep] = useState(1);
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

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedRol(null);
    setForm({ nom_usu: "", email_usu: "", est_usu: true });
    setValidationErrors(null);
    setGeneralError(null);
    setRolSearch("");
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedRol;
      case 2:
        return form.nom_usu.trim() !== "" && form.email_usu.trim() !== "";
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedRol || !form.nom_usu || !form.email_usu) return;
    setIsSubmitting(true);
    setValidationErrors(null);
    setGeneralError(null);

    try {
      // Validar duplicados localmente (obteniendo lista amplia de usuarios)
      const resU = await getUsuarios(1, 1000); 
      const users = resU?.data ?? resU?.content ?? [];
      
      const duplicateUser = users.find((u: Usuario) => u.nom_usu?.toLowerCase() === form.nom_usu.toLowerCase());
      if (duplicateUser) {
        setGeneralError("El nombre de usuario ya existe.");
        setStep(2);
        setIsSubmitting(false);
        return;
      }

      const duplicateEmail = users.find((u: Usuario) => u.email_usu?.toLowerCase() === form.email_usu.toLowerCase());
      if (duplicateEmail) {
        setGeneralError("El email ya está registrado.");
        setStep(2);
        setIsSubmitting(false);
        return;
      }

      const responseData = await crearUsuario({
        nom_usu: form.nom_usu,
        email_usu: form.email_usu,
        est_usu: form.est_usu,
        id_rol: selectedRol.id_rol,
      });

      setUsuarios((prev) => [
        ...prev,
        {
          ...(responseData?.data ?? responseData),
          rol: { nom_rol: selectedRol.nom_rol },
        },
      ]);

      Swal.fire({
        icon: "success",
        title: "¡Usuario creado!",
        showConfirmButton: false,
        timer: 1500,
      });
      
      handleClose();
    } catch (error: any) {
      if (error.response) {
        const { fieldErrors, generalError: genError } = parseApiErrors(error.response.data);
        setValidationErrors(fieldErrors);
        setGeneralError(genError);
        setStep(2);
      } else {
        setGeneralError("Error de conexión. Por favor, verifique su conexión a internet.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    setStep,
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
    setValidationErrors,
    generalError,
    setGeneralError,
    canGoNext,
    handleClose,
    handleSubmit,
    fetchRolesData,
  };
}
