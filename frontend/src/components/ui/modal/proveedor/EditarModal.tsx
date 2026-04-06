import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { ValidationErrors, parseApiErrors } from "../shared";
import {
  Truck,
  X,
  Building,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle,
  Save,
  User,
} from "lucide-react";

interface Proveedor {
  id_prov: number;
  cod_prov?: string;
  nom_prov: string;
  contacto_prov: string;
  email_prov: string;
  tel_prov: string;
  dir_prov: string;
  nit_prov: string;
  est_prov: boolean;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  proveedorSeleccionado: Proveedor | null;
  setProveedores: React.Dispatch<React.SetStateAction<Proveedor[]>>;
}

export default function ModalEditarProveedor({
  showModal,
  setShowModal,
  proveedorSeleccionado,
  setProveedores,
}: Props) {
  const [form, setForm] = useState({
    nom_prov: "",
    contacto_prov: "",
    email_prov: "",
    tel_prov: "",
    dir_prov: "",
    nit_prov: "",
    est_prov: "1",
  });
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (proveedorSeleccionado) {
      setForm({
        nom_prov: proveedorSeleccionado.nom_prov || "",
        contacto_prov: proveedorSeleccionado.contacto_prov || "",
        email_prov: proveedorSeleccionado.email_prov || "",
        tel_prov: proveedorSeleccionado.tel_prov || "",
        dir_prov: proveedorSeleccionado.dir_prov || "",
        nit_prov: proveedorSeleccionado.nit_prov || "",
        est_prov: proveedorSeleccionado.est_prov ? "1" : "0",
      });
    }
  }, [proveedorSeleccionado]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!proveedorSeleccionado) return;
    setIsSubmitting(true);
    setValidationErrors(null);
    setGeneralError(null);

    let idUsuarioLocal = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const p: any = jwtDecode(token);
        idUsuarioLocal = p.id_usu || null;
      }
    } catch {
      idUsuarioLocal = null;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/proveedor/${proveedorSeleccionado.id_prov}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
          },
          body: JSON.stringify({ ...form, est_prov: form.est_prov === "1" }),
        }
      );

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

      setProveedores((prev) =>
        prev.map((p) => (p.id_prov === responseData.id_prov ? responseData : p))
      );
      Swal.fire({
        icon: "success",
        title: "¡Proveedor actualizado!",
        showConfirmButton: false,
        timer: 1500,
      });
      setShowModal(false);
    } catch (err) {
      setGeneralError(
        "Error de conexión. Por favor, verifique su conexión a internet."
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !proveedorSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Truck className="w-6 h-6" />
            Editar Proveedor
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm bg-white/20 px-3 py-1 rounded-lg">
              {proveedorSeleccionado.cod_prov}
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

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
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Building className="w-4 h-4 text-orange-500" />
                Nombre Empresa
              </label>
              <input
                type="text"
                name="nom_prov"
                value={form.nom_prov}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 text-orange-500" />
                Contacto
              </label>
              <input
                type="text"
                name="contacto_prov"
                value={form.contacto_prov}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4 text-orange-500" />
                Teléfono
              </label>
              <input
                type="text"
                name="tel_prov"
                value={form.tel_prov}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 text-orange-500" />
                Email
              </label>
              <input
                type="email"
                name="email_prov"
                value={form.email_prov}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 text-orange-500" />
                NIT
              </label>
              <input
                type="text"
                name="nit_prov"
                value={form.nit_prov}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CheckCircle className="w-4 h-4 text-orange-500" />
                Estado
              </label>
              <select
                name="est_prov"
                value={form.est_prov}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              >
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                Dirección
              </label>
              <input
                type="text"
                name="dir_prov"
                value={form.dir_prov}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 rounded-xl font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg shadow-orange-600/30"
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
