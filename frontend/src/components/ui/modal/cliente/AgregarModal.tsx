import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { ValidationErrors, parseApiErrors } from "../shared";
import {
  UserPlus,
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  Save,
} from "lucide-react";

interface Cliente {
  id_cli: number;
  nom_cli: string;
  ap_pat_cli: string;
  ap_mat_cli: string;
  cel_cli: number;
  dir_cli: string;
  fec_nac_cli: string;
  ci_cli: string;
  img_cli: string;
  id_usu: number;
}

interface Usuario {
  id_usu: number;
  nom_usu: string;
  cod_usu?: string;
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>;
}

export default function ModalAgregarCliente({
  showModal,
  setShowModal,
  setClientes,
}: Props) {
  const [form, setForm] = useState({
    nom_cli: "",
    ap_pat_cli: "",
    ap_mat_cli: "",
    cel_cli: "",
    dir_cli: "",
    fec_nac_cli: "",
    ci_cli: "",
    img_cli: "",
    id_usu: "",
  });
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<Usuario[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showModal) {
      setValidationErrors(null);
      setGeneralError(null);
      fetch("http://localhost:8080/api/usuarios-sin-relaciones")
        .then((res) => res.json())
        .then((payload: any) => {
          const items = payload?.data ?? payload;
          setUsuariosDisponibles(Array.isArray(items) ? items : []);
        })
        .catch(() => setUsuariosDisponibles([]));
    }
  }, [showModal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.id_usu) {
      setGeneralError("Debe seleccionar un usuario.");
      return;
    }
    setIsSubmitting(true);
    setValidationErrors(null);
    setGeneralError(null);

    let idUsuarioLocal = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload: any = jwtDecode(token);
        idUsuarioLocal = payload.id_usu || null;
      }
    } catch {
      idUsuarioLocal = null;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
    };

    try {
      const res = await fetch("http://localhost:8080/api/clientes", {
        method: "POST",
        headers,
        body: JSON.stringify({ ...form, id_usu: parseInt(form.id_usu) }),
      });

      let responseData;
      try {
        responseData = await res.json();
      } catch {
        responseData = { message: `Error del servidor (${res.status})` };
      }

      if (!res.ok) {
        const { fieldErrors, generalError: genError } =
          parseApiErrors(responseData);
        setValidationErrors(fieldErrors);
        setGeneralError(genError);
        setIsSubmitting(false);
        return;
      }

      const usuario = usuariosDisponibles.find(
        (u) => u.id_usu === responseData.id_usu
      );
      setClientes((prev) => [
        ...prev,
        {
          ...responseData,
          usuario: usuario ? { nom_usu: usuario.nom_usu } : null,
        } as any,
      ]);

      Swal.fire({
        icon: "success",
        title: "¡Cliente creado!",
        text: "El cliente se ha registrado exitosamente.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      handleClose();
    } catch (err) {
      setGeneralError(
        "Error de conexión. Por favor, verifique su conexión a internet."
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setForm({
      nom_cli: "",
      ap_pat_cli: "",
      ap_mat_cli: "",
      cel_cli: "",
      dir_cli: "",
      fec_nac_cli: "",
      ci_cli: "",
      img_cli: "",
      id_usu: "",
    });
    setValidationErrors(null);
    setGeneralError(null);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <UserPlus className="w-6 h-6" />
            Nuevo Cliente
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {(validationErrors || generalError) && (
            <ValidationErrors
              errors={validationErrors}
              generalError={generalError}
              onDismiss={() => {
                setValidationErrors(null);
                setGeneralError(null);
              }}
              className="mb-4"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nombre */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 text-blue-500" />
                Nombre *
              </label>
              <input
                type="text"
                name="nom_cli"
                value={form.nom_cli}
                onChange={handleChange}
                placeholder="Nombre del cliente"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Apellido Paterno */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 text-blue-500" />
                Apellido Paterno *
              </label>
              <input
                type="text"
                name="ap_pat_cli"
                value={form.ap_pat_cli}
                onChange={handleChange}
                placeholder="Apellido paterno"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Apellido Materno */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 text-blue-500" />
                Apellido Materno
              </label>
              <input
                type="text"
                name="ap_mat_cli"
                value={form.ap_mat_cli}
                onChange={handleChange}
                placeholder="Apellido materno"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* CI */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CreditCard className="w-4 h-4 text-blue-500" />
                Cédula de Identidad *
              </label>
              <input
                type="text"
                name="ci_cli"
                value={form.ci_cli}
                onChange={handleChange}
                placeholder="Ej: 12345678"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Celular */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4 text-blue-500" />
                Celular
              </label>
              <input
                type="number"
                name="cel_cli"
                value={form.cel_cli}
                onChange={handleChange}
                placeholder="Ej: 70000000"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="fec_nac_cli"
                value={form.fec_nac_cli}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                Dirección
              </label>
              <input
                type="text"
                name="dir_cli"
                value={form.dir_cli}
                onChange={handleChange}
                placeholder="Dirección completa"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Usuario */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users className="w-4 h-4 text-blue-500" />
                Usuario Asignado *
              </label>
              <select
                name="id_usu"
                value={form.id_usu}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Seleccione un usuario...</option>
                {usuariosDisponibles.map((u) => (
                  <option key={u.id_usu} value={u.id_usu}>
                    {u.cod_usu} - {u.nom_usu}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-600/30"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
