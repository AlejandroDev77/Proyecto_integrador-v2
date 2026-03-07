import React, { useState } from "react";
import Swal from "sweetalert2";

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
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    if (!rolSeleccionado) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/roles/${rolSeleccionado.id_rol}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          error.message || "Error al eliminar rol"
        );
      }

      Swal.fire({
        icon: "success",
        title: "Rol eliminado",
        text: "El rol se ha eliminado correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });

      setShowModal(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error al eliminar rol:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "No se pudo eliminar el rol.",
      });
    } finally {
      setLoading(false);
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
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded dark:bg-red-500 dark:hover:bg-red-600"
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalEliminarRol;
