import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Label from "../../../form/Label";

interface Rol {
  id_rol: number;
  nom_rol: string;
}

interface Permiso {
  id_permiso: number;
  nombre: string;
  descripcion?: string;
}

interface RolPermiso {
  id_rol: number;
  id_permiso: number;
  nom_rol: string;
  nom_permiso: string;
  descripcion?: string;
}

interface ModalEditarAsignacionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  asignacionSeleccionada: RolPermiso | null;
  roles: Rol[];
  permisos: Permiso[];
  onSuccess?: () => void;
}

const ModalEditarAsignacion: React.FC<ModalEditarAsignacionProps> = ({
  showModal,
  setShowModal,
  asignacionSeleccionada,
  roles,
  onSuccess,
}) => {
  const [idRol, setIdRol] = useState("");
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<number[]>([]);
  const [todosPermisos, setTodosPermisos] = useState<Permiso[]>([]);
  const [permisosAsignados, setPermisosAsignados] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (asignacionSeleccionada && showModal) {
      setIdRol(asignacionSeleccionada.id_rol.toString());
    }
  }, [asignacionSeleccionada, showModal]);

  // Cargar permisos disponibles y asignados cuando se selecciona un rol
  useEffect(() => {
    if (idRol && showModal) {
      const cargarPermisos = async () => {
        try {
          const res = await fetch(
            `http://localhost:8000/api/roles/${idRol}/permisos-disponibles`
          );
          if (!res.ok) throw new Error("Error al cargar permisos");
          
          const payload: any = await res.json();
          const data = payload?.data ?? payload;
          const asignados = data.permisos_asignados || [];
          const disponibles = data.permisos_disponibles || [];
          
          // Guardar los permisos asignados
          setPermisosAsignados(asignados);
          
          // Guardar todos los permisos (asignados + disponibles)
          setTodosPermisos([...asignados, ...disponibles]);
          
          // Pre-seleccionar los que ya están asignados
          setPermisosSeleccionados(asignados.map((p: Permiso) => p.id_permiso));
        } catch (error) {
          console.error("Error al cargar permisos:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar los permisos disponibles.",
          });
        }
      };
      cargarPermisos();
    }
  }, [idRol, showModal]);

  const handleCheckboxChange = (id_permiso: number) => {
    setPermisosSeleccionados((prev) =>
      prev.includes(id_permiso)
        ? prev.filter((p) => p !== id_permiso)
        : [...prev, id_permiso]
    );
  };

  const handleSubmit = async () => {
    if (!idRol) {
      Swal.fire({
        icon: "error",
        title: "Validación",
        text: "Debes seleccionar un rol.",
      });
      return;
    }

    if (permisosSeleccionados.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Validación",
        text: "Debes seleccionar al menos un permiso.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/roles/${idRol}/permisos`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_permisos: permisosSeleccionados }),
        }
      );

      if (!res.ok) {
        let errorMessage = "Error al actualizar permisos";
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
        title: "Permisos actualizados",
        text: "Los permisos se han actualizado correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });

      setIdRol("");
      setPermisosSeleccionados([]);
      setTodosPermisos([]);
      setPermisosAsignados([]);
      setShowModal(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error al actualizar permisos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "No se pudieron actualizar los permisos.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Obtener IDs de permisos asignados
  const idPermisosAsignados = permisosAsignados.map((p) => p.id_permiso);
  
  // Obtener IDs de permisos disponibles
  const idPermisosDisponibles = todosPermisos
    .filter((p) => !idPermisosAsignados.includes(p.id_permiso))
    .map((p) => p.id_permiso);

  const permisosAsignadosFiltrados = todosPermisos.filter((p) =>
    idPermisosAsignados.includes(p.id_permiso)
  );

  const permisosDisponiblesFiltrados = todosPermisos.filter((p) =>
    idPermisosDisponibles.includes(p.id_permiso)
  );

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-white">
              Editar Permisos del Rol
            </h2>

            <div className="mb-6">
              <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Rol
              </Label>
              <div className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                {roles.find((r) => r.id_rol.toString() === idRol)?.nom_rol || "Seleccionar rol..."}
              </div>
            </div>

            {idRol && (
              <div className="mb-6">
                <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-3">
                  Permisos *
                </Label>
                <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800 max-h-64 overflow-y-auto">
                  {idPermisosDisponibles.length > 0 ? (
                    <div className="space-y-3">
                      {/* Mostrar permisos asignados */}
                      {permisosAsignadosFiltrados.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase">
                            Permisos Asignados
                          </h4>
                          <div className="space-y-2">
                            {permisosAsignadosFiltrados.map((permiso) => (
                              <label
                                key={permiso.id_permiso}
                                className="flex items-center gap-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/40 transition"
                              >
                                <input
                                  type="checkbox"
                                  checked={permisosSeleccionados.includes(
                                    permiso.id_permiso
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(permiso.id_permiso)
                                  }
                                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                                />
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                                    {permiso.nombre}
                                  </span>
                                  {permiso.descripcion && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      {permiso.descripcion}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                                  Asignado
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mostrar permisos disponibles */}
                      {permisosDisponiblesFiltrados.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase">
                            Permisos Disponibles
                          </h4>
                          <div className="space-y-2">
                            {permisosDisponiblesFiltrados.map((permiso) => (
                              <label
                                key={permiso.id_permiso}
                                className="flex items-center gap-3 p-2 bg-white dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                              >
                                <input
                                  type="checkbox"
                                  checked={permisosSeleccionados.includes(
                                    permiso.id_permiso
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(permiso.id_permiso)
                                  }
                                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                                />
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                                    {permiso.nombre}
                                  </span>
                                  {permiso.descripcion && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      {permiso.descripcion}
                                    </p>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 font-medium">
                        Este rol ya tiene todos los permisos asignados
                      </p>
                      {permisosAsignadosFiltrados.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-3 uppercase">
                            Permisos Asignados al Rol
                          </h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {permisosAsignadosFiltrados.map((permiso) => (
                              <label
                                key={permiso.id_permiso}
                                className="flex items-center gap-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/40 transition"
                              >
                                <input
                                  type="checkbox"
                                  checked={permisosSeleccionados.includes(
                                    permiso.id_permiso
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(permiso.id_permiso)
                                  }
                                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                                />
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                                    {permiso.nombre}
                                  </span>
                                  {permiso.descripcion && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      {permiso.descripcion}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                                  Asignado
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded dark:bg-purple-500 dark:hover:bg-purple-600 disabled:opacity-50"
              >
                {loading ? "Actualizando..." : "Actualizar Permisos"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalEditarAsignacion;
