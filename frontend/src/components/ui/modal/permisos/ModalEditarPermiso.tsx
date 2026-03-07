import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { Key, X, Save, AlertCircle, FileText } from "lucide-react";

interface Permiso {
  id_permiso: number;
  nombre: string;
  descripcion?: string;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  permisoSeleccionado: Permiso | null;
  onSuccess?: () => void;
}

const ModalEditarPermiso: React.FC<Props> = ({
  showModal,
  setShowModal,
  permisoSeleccionado,
  onSuccess,
}) => {
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (permisoSeleccionado)
      setForm({
        nombre: permisoSeleccionado.nombre || "",
        descripcion: permisoSeleccionado.descripcion || "",
      });
  }, [permisoSeleccionado]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!permisoSeleccionado) return;
    if (!form.nombre.trim()) {
      setErrorMsg("El nombre es requerido.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");

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
        `http://localhost:8000/api/permisos/${permisoSeleccionado.id_permiso}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
          },
          body: JSON.stringify({
            nombre: form.nombre.trim(),
            descripcion: form.descripcion.trim(),
          }),
        }
      );

      if (!res.ok) {
        const e = await res.json();
        setErrorMsg(e.message || "Error");
        return;
      }
      Swal.fire({
        icon: "success",
        title: "¡Permiso actualizado!",
        showConfirmButton: false,
        timer: 1500,
      });
      setShowModal(false);
      onSuccess?.();
    } catch (err) {
      setErrorMsg("Error al editar");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !permisoSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Key className="w-6 h-6" />
            Editar Permiso
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{errorMsg}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Key className="w-4 h-4 text-emerald-500" />
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
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
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/30"
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
};

export default ModalEditarPermiso;
