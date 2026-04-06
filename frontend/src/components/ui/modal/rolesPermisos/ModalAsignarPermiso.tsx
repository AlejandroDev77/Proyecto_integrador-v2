import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  Shield,
  Key,
  X,
  Check,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  AlertCircle,
} from "lucide-react";

interface Rol {
  id_rol: number;
  nom_rol: string;
  descripcion?: string;
}

interface Permiso {
  id_permiso: number;
  nombre: string;
  descripcion?: string;
}

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

interface ModalAsignarPermisoProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  roles: Rol[];
  permisos: Permiso[];
  onSuccess?: () => void;
}

// Card de Rol
function RolCard({
  rol,
  isSelected,
  onSelect,
}: {
  rol: Rol;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-purple-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <Shield className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            {rol.nom_rol}
          </h4>
          {rol.descripcion && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {rol.descripcion}
            </p>
          )}
        </div>
        {isSelected && <Check className="w-5 h-5 text-purple-500 shrink-0" />}
      </div>
    </div>
  );
}

// SearchInput
function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
      />
    </div>
  );
}

// MiniPagination
function MiniPagination({
  pagination,
  onPageChange,
  isLoading,
}: {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}) {
  if (pagination.lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
      >
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
        {pagination.currentPage}/{pagination.lastPage}
      </span>
      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.lastPage)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
      >
        <ChevronsRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Permiso Item
function PermisoItem({
  permiso,
  isSelected,
  onToggle,
  variant,
}: {
  permiso: Permiso;
  isSelected: boolean;
  onToggle: () => void;
  variant: "disponible" | "asignado";
}) {
  const bgColor =
    variant === "asignado"
      ? isSelected
        ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700"
        : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      : isSelected
      ? "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700"
      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";

  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer rounded-lg border p-3 transition-all duration-200 hover:shadow-sm ${bgColor}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            variant === "asignado"
              ? "bg-green-500 text-white"
              : isSelected
              ? "bg-purple-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600"
          }`}
        >
          {variant === "asignado" ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Unlock className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            {permiso.nombre}
          </h4>
          {permiso.descripcion && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {permiso.descripcion}
            </p>
          )}
        </div>
        {isSelected && (
          <Check
            className={`w-5 h-5 shrink-0 ${
              variant === "asignado" ? "text-green-500" : "text-purple-500"
            }`}
          />
        )}
      </div>
    </div>
  );
}

const ModalAsignarPermiso: React.FC<ModalAsignarPermisoProps> = ({
  showModal,
  setShowModal,
  roles,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [searchRol, setSearchRol] = useState("");

  const [permisosDisponibles, setPermisosDisponibles] = useState<Permiso[]>([]);
  const [permisosAsignados, setPermisosAsignados] = useState<Permiso[]>([]);
  const [selectedDisponibles, setSelectedDisponibles] = useState<number[]>([]);
  const [selectedAsignados, setSelectedAsignados] = useState<number[]>([]);
  const [searchDisponible, setSearchDisponible] = useState("");
  const [searchAsignado, setSearchAsignado] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingPermisos, setLoadingPermisos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Roles pagination
  const [rolesPagination, setRolesPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [rolesFiltered, setRolesFiltered] = useState<Rol[]>(roles);

  useEffect(() => {
    if (searchRol) {
      setRolesFiltered(
        roles.filter((r) =>
          r.nom_rol.toLowerCase().includes(searchRol.toLowerCase())
        )
      );
    } else {
      setRolesFiltered(roles);
    }
  }, [searchRol, roles]);

  // Cargar permisos cuando se selecciona un rol
  const cargarPermisos = useCallback(async (rolId: number) => {
    setLoadingPermisos(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/roles/${rolId}/permisos-disponibles`
      );
      if (!res.ok) throw new Error("Error al cargar permisos");

      const payload: any = await res.json();
      const data = payload?.data ?? payload;
      const asignados = data.permisos_asignados || [];
      const disponibles = data.permisos_disponibles || [];

      setPermisosAsignados(asignados);
      setPermisosDisponibles(disponibles);
      setSelectedDisponibles([]);
      setSelectedAsignados([]);
    } catch (error) {
      console.error("Error al cargar permisos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los permisos.",
      });
    } finally {
      setLoadingPermisos(false);
    }
  }, []);

  useEffect(() => {
    if (selectedRol && showModal && step === 2) {
      cargarPermisos(selectedRol.id_rol);
    }
  }, [selectedRol, showModal, step, cargarPermisos]);

  const toggleDisponible = (id: number) => {
    setSelectedDisponibles((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleAsignado = (id: number) => {
    setSelectedAsignados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const moverAAsignados = () => {
    const toMove = permisosDisponibles.filter((p) =>
      selectedDisponibles.includes(p.id_permiso)
    );
    setPermisosAsignados([...permisosAsignados, ...toMove]);
    setPermisosDisponibles(
      permisosDisponibles.filter(
        (p) => !selectedDisponibles.includes(p.id_permiso)
      )
    );
    setSelectedDisponibles([]);
  };

  const moverADisponibles = () => {
    const toMove = permisosAsignados.filter((p) =>
      selectedAsignados.includes(p.id_permiso)
    );
    setPermisosDisponibles([...permisosDisponibles, ...toMove]);
    setPermisosAsignados(
      permisosAsignados.filter((p) => !selectedAsignados.includes(p.id_permiso))
    );
    setSelectedAsignados([]);
  };

  const moverTodosAAsignados = () => {
    setPermisosAsignados([...permisosAsignados, ...permisosDisponibles]);
    setPermisosDisponibles([]);
    setSelectedDisponibles([]);
  };

  const moverTodosADisponibles = () => {
    setPermisosDisponibles([...permisosDisponibles, ...permisosAsignados]);
    setPermisosAsignados([]);
    setSelectedAsignados([]);
  };

  const handleSubmit = async () => {
    if (!selectedRol) return;

    setIsSubmitting(true);
    try {
      const permisosIds = permisosAsignados.map((p) => p.id_permiso);

      const res = await fetch(
        `http://localhost:8080/api/roles/${selectedRol.id_rol}/permisos`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_permisos: permisosIds }),
        }
      );

      if (!res.ok) throw new Error("Error al asignar permisos");

      Swal.fire({
        icon: "success",
        title: "¡Permisos actualizados!",
        text: `Los permisos del rol "${selectedRol.nom_rol}" se han actualizado correctamente.`,
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron actualizar los permisos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedRol(null);
    setSearchRol("");
    setPermisosDisponibles([]);
    setPermisosAsignados([]);
    setSelectedDisponibles([]);
    setSelectedAsignados([]);
  };

  // Filtrar permisos
  const disponiblesFiltrados = searchDisponible
    ? permisosDisponibles.filter((p) =>
        p.nombre.toLowerCase().includes(searchDisponible.toLowerCase())
      )
    : permisosDisponibles;

  const asignadosFiltrados = searchAsignado
    ? permisosAsignados.filter((p) =>
        p.nombre.toLowerCase().includes(searchAsignado.toLowerCase())
      )
    : permisosAsignados;

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Key className="w-6 h-6" />
            Asignar Permisos a Rol
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-3">
          <div className="flex items-center justify-center gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                step === 1
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                  : "text-gray-500"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === 1
                    ? "bg-purple-600 text-white"
                    : step > 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className="font-medium">Seleccionar Rol</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                step === 2
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                  : "text-gray-500"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === 2
                    ? "bg-purple-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="font-medium">Gestionar Permisos</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Seleccionar Rol
              </h3>
              <SearchInput
                value={searchRol}
                onChange={setSearchRol}
                placeholder="Buscar rol..."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
                {rolesFiltered.length > 0 ? (
                  rolesFiltered.map((r) => (
                    <RolCard
                      key={r.id_rol}
                      rol={r}
                      isSelected={selectedRol?.id_rol === r.id_rol}
                      onSelect={() => setSelectedRol(r)}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center py-12 text-gray-500">
                    <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                    <p>No se encontraron roles</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-600" />
                  Gestionar Permisos para:{" "}
                  <span className="text-purple-600">
                    {selectedRol?.nom_rol}
                  </span>
                </h3>
              </div>

              {loadingPermisos ? (
                <div className="flex justify-center py-20">
                  <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-11 gap-4">
                  {/* Panel Disponibles */}
                  <div className="lg:col-span-5 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Unlock className="w-4 h-4" />
                        Disponibles ({permisosDisponibles.length})
                      </h4>
                      <button
                        onClick={moverTodosAAsignados}
                        disabled={permisosDisponibles.length === 0}
                        className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Añadir todos
                      </button>
                    </div>
                    <SearchInput
                      value={searchDisponible}
                      onChange={setSearchDisponible}
                      placeholder="Buscar..."
                    />
                    <div className="space-y-2 mt-3 max-h-[280px] overflow-y-auto">
                      {disponiblesFiltrados.length > 0 ? (
                        disponiblesFiltrados.map((p) => (
                          <PermisoItem
                            key={p.id_permiso}
                            permiso={p}
                            isSelected={selectedDisponibles.includes(
                              p.id_permiso
                            )}
                            onToggle={() => toggleDisponible(p.id_permiso)}
                            variant="disponible"
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          {permisosDisponibles.length === 0
                            ? "Todos los permisos están asignados"
                            : "Sin resultados"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botones de transferencia */}
                  <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-2">
                    <button
                      onClick={moverAAsignados}
                      disabled={selectedDisponibles.length === 0}
                      className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-lg"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={moverADisponibles}
                      disabled={selectedAsignados.length === 0}
                      className="p-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Panel Asignados */}
                  <div className="lg:col-span-5 bg-green-50 dark:bg-green-900/10 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-600" />
                        Asignados ({permisosAsignados.length})
                      </h4>
                      <button
                        onClick={moverTodosADisponibles}
                        disabled={permisosAsignados.length === 0}
                        className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Quitar todos
                      </button>
                    </div>
                    <SearchInput
                      value={searchAsignado}
                      onChange={setSearchAsignado}
                      placeholder="Buscar..."
                    />
                    <div className="space-y-2 mt-3 max-h-[280px] overflow-y-auto">
                      {asignadosFiltrados.length > 0 ? (
                        asignadosFiltrados.map((p) => (
                          <PermisoItem
                            key={p.id_permiso}
                            permiso={p}
                            isSelected={selectedAsignados.includes(
                              p.id_permiso
                            )}
                            onToggle={() => toggleAsignado(p.id_permiso)}
                            variant="asignado"
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          {permisosAsignados.length === 0
                            ? "Sin permisos asignados"
                            : "Sin resultados"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-between">
          <button
            onClick={step === 1 ? handleClose : () => setStep(1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            {step === 1 ? "Cancelar" : "Volver"}
          </button>

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              disabled={!selectedRol}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-purple-600/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Guardar Permisos
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalAsignarPermiso;
