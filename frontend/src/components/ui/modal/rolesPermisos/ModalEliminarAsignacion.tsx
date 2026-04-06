import React, { useState } from "react";
import Swal from "sweetalert2";

interface RolPermiso {
  id_rol: number;
  id_permiso: number;
  nom_rol: string;
  nom_permiso: string;
  descripcion?: string;
}

interface ModalEliminarAsignacionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  asignacionSeleccionada: RolPermiso | null;
  onSuccess?: () => void;
}

const ModalEliminarAsignacion: React.FC<ModalEliminarAsignacionProps> = ({
  showModal,
  setShowModal,
  asignacionSeleccionada,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    if (!asignacionSeleccionada) return;

    setLoading(true);
    try {
      // Intentar con la ruta RolesPermisos primero
      let res = await fetch(
        `http://localhost:8080/api/roles/${asignacionSeleccionada.id_rol}/permisos/${asignacionSeleccionada.id_permiso}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        let errorMessage = "Error al revocar permiso";
        try {
          const error = await res.json();
          errorMessage = error.message || errorMessage;
        } catch {
          errorMessage = `Error del servidor: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      Swal.fire({
        icon: "success",
        title: "Permiso revocado",
        text: "El permiso se ha revocado correctamente del rol.",
        timer: 1800,
        showConfirmButton: false,
      });

      setShowModal(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error al revocar permiso:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "No se pudo revocar el permiso.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && asignacionSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-white">
              ¿Estás seguro de revocar este permiso?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
              <strong>Rol:</strong> {asignacionSeleccionada.nom_rol}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              <strong>Permiso:</strong> {asignacionSeleccionada.nom_permiso}
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
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded dark:bg-red-500 dark:hover:bg-red-600"
              >
                {loading ? "Revocando..." : "Revocar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalEliminarAsignacion;
