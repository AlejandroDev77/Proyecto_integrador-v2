import React from "react";
import { Key, X, Save, AlertCircle, FileText } from "lucide-react";
import { usePermisos } from "../../../../hooks/permisos/usePermisos";
import { Permiso } from "../../../../types/permiso";

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
  const { 
    editForm, 
    updateEditForm, 
    editFormError, 
    setEditFormError,
    handleGuardarEditForm, 
    loadingAction 
  } = usePermisos(permisoSeleccionado);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditFormError("");
    updateEditForm(e.target.name, e.target.value);
  };

  const handleSubmit = async () => {
    await handleGuardarEditForm(onSuccess);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditFormError("");
  };

  if (!showModal || !permisoSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        <div className="bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
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
          {editFormError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{editFormError}</span>
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
                name="nom_permiso"
                value={editForm.nom_permiso}
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
                value={editForm.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 rounded-xl font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loadingAction}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/30"
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

export default ModalEditarPermiso;
