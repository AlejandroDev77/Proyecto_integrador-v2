import React, { useState } from "react";
import Swal from "sweetalert2";
import { Shield, X, Save, AlertCircle } from "lucide-react";
import { useRoles } from "../../../../hooks/Roles/useRoles";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onSuccess?: () => void;
}

const ModalAgregarRol: React.FC<Props> = ({
  showModal,
  setShowModal,
  onSuccess,
}) => {
  const { crearRol, loadingAction } = useRoles();
  const [nombre, setNombre] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      setErrorMsg("El nombre del rol es requerido.");
      return;
    }

    setErrorMsg("");
    try {
      await crearRol({ nom_rol: nombre.trim() });
      Swal.fire({
        icon: "success",
        title: "¡Rol creado!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      handleClose();
      onSuccess?.();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al agregar";
      setErrorMsg(errorMsg);
      console.error("Error al crear rol:", err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setNombre("");
    setErrorMsg("");
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Shield className="w-6 h-6" />
            Nuevo Rol
          </h2>
          <button
            onClick={handleClose}
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

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Shield className="w-4 h-4 text-rose-500" />
              Nombre del Rol *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Moderador"
              disabled={loadingAction}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loadingAction}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 rounded-xl font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loadingAction}
            className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg shadow-rose-600/30"
          >
            {loadingAction ? (
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

export default ModalAgregarRol;
