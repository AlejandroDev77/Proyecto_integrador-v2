import React from "react";
import Swal from "sweetalert2";
import { usePermisos } from "../../../../hooks/permisos/usePermisos";
import { Permiso } from "../../../../types/permiso";

interface ModalEliminarPermisoProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  permisoSeleccionado: Permiso | null;
  onSuccess?: () => void;
}

const ModalEliminarPermiso: React.FC<ModalEliminarPermisoProps> = ({
  showModal,
  setShowModal,
  permisoSeleccionado,
  onSuccess,
}) => {
  const { eliminarPermiso, loadingAction } = usePermisos();

  const handleEliminar = async () => {
    if (!permisoSeleccionado) return;

    try {
      await eliminarPermiso(permisoSeleccionado.id);

      Swal.fire({
        icon: "success",
        title: "Permiso eliminado",
        text: "El permiso se ha eliminado correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });

      setShowModal(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error al eliminar permiso:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "No se pudo eliminar el permiso.",
      });
    }
  };

  return (
    <>
      {showModal && permisoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-white">
              ¿Estás seguro de eliminar este permiso?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              <strong>{permisoSeleccionado.nom_permiso}</strong>
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={loadingAction}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded dark:bg-red-500 dark:hover:bg-red-600"
              >
                {loadingAction ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalEliminarPermiso;
