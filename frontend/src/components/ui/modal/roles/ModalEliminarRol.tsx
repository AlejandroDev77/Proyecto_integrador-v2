import React from "react";
import Swal from "sweetalert2";
import { useRoles } from "../../../../hooks/Roles/useRoles";

interface Rol {
  id_rol: number;
  nom_rol: string;
  permisos?: any[];
  usuarios?: any[];
}

interface ModalEliminarRolProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  rolSeleccionado: Rol | null;
  onSuccess?: () => void;
}

const ModalEliminarRol: React.FC<ModalEliminarRolProps> = ({
  showModal,
  setShowModal,
  rolSeleccionado,
  onSuccess,
}) => {
  const { eliminarRol, loadingAction } = useRoles();

  const handleEliminar = async () => {
    if (!rolSeleccionado) return;

    try {
      await eliminarRol(rolSeleccionado.id_rol);
      Swal.fire({
        icon: "success",
        title: "Rol eliminado",
        text: "El rol se ha eliminado correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });

      setShowModal(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error al eliminar rol:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo eliminar el rol.",
      });
    }
  };

  return (
    <>
      {showModal && rolSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-white">
              ¿Estás seguro de eliminar este rol?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              <strong>{rolSeleccionado.nom_rol}</strong>
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                disabled={loadingAction}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={loadingAction}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded dark:bg-red-500 dark:hover:bg-red-600 disabled:opacity-50"
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

export default ModalEliminarRol;
