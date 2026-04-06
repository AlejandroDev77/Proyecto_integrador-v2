import { Shield, Settings, X, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, AlertCircle, Mail, CheckCircle, Save, UserPlus } from "lucide-react";
import { ValidationErrors } from "../shared";
import { useEditarUsuario } from "../../../../hooks/usuarios/useEditarUsuario";

import { Usuario } from "../../../../types/usuario";
import { Rol } from "../../../../types/rol";
import { PaginationInfo } from "../../../../types/pagination";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  usuarioSeleccionado: Usuario | null;
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-lg transition-all ${
        active
          ? "bg-white dark:bg-gray-900 text-violet-600 border-t-2 border-x border-violet-500 -mb-px"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 text-sm"
      />
    </div>
  );
}

function MiniPagination({ pagination, onPageChange, isLoading }: { pagination: PaginationInfo; onPageChange: (p: number) => void; isLoading: boolean }) {
  if (pagination.lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-3 pt-2 border-t">
      <button onClick={() => onPageChange(1)} disabled={isLoading || pagination.currentPage <= 1} className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50">
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => onPageChange(pagination.currentPage - 1)} disabled={isLoading || pagination.currentPage <= 1} className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50">
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs px-2">
        {pagination.currentPage}/{pagination.lastPage}
      </span>
      <button onClick={() => onPageChange(pagination.currentPage + 1)} disabled={isLoading || pagination.currentPage >= pagination.lastPage} className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50">
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => onPageChange(pagination.lastPage)} disabled={isLoading || pagination.currentPage >= pagination.lastPage} className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50">
        <ChevronsRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function RolCard({ rol, isSelected, onSelect }: { rol: Rol; isSelected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
        isSelected ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-md" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? "bg-violet-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}>
          <Shield className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white">{rol.nom_rol}</h4>
          {rol.desc_rol && <p className="text-sm text-gray-500 truncate">{rol.desc_rol}</p>}
        </div>
        {isSelected && <Check className="w-6 h-6 text-violet-500" />}
      </div>
    </div>
  );
}

export default function ModalEditarUsuario({ showModal, setShowModal, usuarioSeleccionado, setUsuarios }: Props) {
  const {
    activeTab,
    setActiveTab,
    isSubmitting,
    form,
    setForm,
    selectedRol,
    setSelectedRol,
    roles,
    rolSearch,
    setRolSearch,
    rolPag,
    loadingRol,
    validationErrors,
    generalError,
    handleClose,
    handleSubmit,
    setValidationErrors,
    setGeneralError,
    fetchRolesData,
  } = useEditarUsuario(showModal, setShowModal, usuarioSeleccionado, setUsuarios);

  if (!showModal || !usuarioSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-linear-to-r from-violet-500 to-fuchsia-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <UserPlus className="w-6 h-6" />
            Editar Usuario
          </h2>
          <button onClick={handleClose} className="text-white/80 hover:text-white p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-1 px-4 pt-3 bg-gray-50 dark:bg-gray-800/50 border-b">
          <TabButton active={activeTab === "datos"} onClick={() => setActiveTab("datos")} icon={Settings} label="Datos" />
          <TabButton active={activeTab === "rol"} onClick={() => setActiveTab("rol")} icon={Shield} label="Rol" />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "datos" && (
            <div className="space-y-5">
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
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <UserPlus className="w-4 h-4 text-violet-500" />
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={form.nom_usu}
                    onChange={(e) => setForm({ ...form, nom_usu: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Mail className="w-4 h-4 text-violet-500" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email_usu}
                    onChange={(e) => setForm({ ...form, email_usu: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <CheckCircle className="w-4 h-4 text-violet-500" />
                    Estado
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, est_usu: true })}
                      className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                        form.est_usu ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700" : "border-gray-200 dark:border-gray-700 text-gray-500"
                      }`}
                    >
                      Activo
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, est_usu: false })}
                      className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                        !form.est_usu ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700" : "border-gray-200 dark:border-gray-700 text-gray-500"
                      }`}
                    >
                      Inactivo
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-5 h-5 text-violet-600" />
                  <span className="text-sm font-medium">Rol actual</span>
                </div>
                <p className="font-bold text-violet-600">{selectedRol?.nom_rol || `ID: ${selectedRol?.id_rol}`}</p>
              </div>
            </div>
          )}

          {activeTab === "rol" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-600" />
                Cambiar Rol
              </h3>
              <SearchInput value={rolSearch} onChange={setRolSearch} placeholder="Buscar rol..." />
              {loadingRol ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {roles.length > 0 ? (
                      roles.map((r) => (
                        <RolCard key={r.id_rol} rol={r} isSelected={selectedRol?.id_rol === r.id_rol} onSelect={() => setSelectedRol(r)} />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron roles</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination pagination={rolPag} onPageChange={(p) => fetchRolesData(p, rolSearch)} isLoading={loadingRol} />
                </>
              )}
            </div>
          )}
        </div>

        <div className="border-t bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3">
          <button onClick={handleClose} className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 rounded-xl font-medium">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedRol}
            className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg transition-all"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
