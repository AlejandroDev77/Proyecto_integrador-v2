import { Shield, Settings, ClipboardCheck, X, Check, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Search, AlertCircle, Mail, CheckCircle, UserPlus } from "lucide-react";
import { ValidationErrors } from "../shared";
import { useAgregarUsuario } from "../../../../hooks/usuarios/useAgregarUsuario";

import { Usuario } from "../../../../types/usuario";
import { Rol } from "../../../../types/rol";
import { PaginationInfo } from "../../../../types/pagination";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
}

function StepIndicator({ currentStep, steps }: { currentStep: number; steps: { label: string; icon: React.ReactNode }[] }) {
  return (
    <div className="flex items-center justify-center w-full px-2 py-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                index + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : index + 1 === currentStep
                    ? "bg-orange-600 text-white shadow-lg"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {index + 1 < currentStep ? <Check className="w-5 h-5" /> : step.icon}
            </div>
            <span className={`mt-1 text-xs font-medium hidden sm:block ${index + 1 === currentStep ? "text-orange-600" : "text-gray-500"}`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-8 sm:w-16 h-1 mx-1 rounded ${index + 1 < currentStep ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`} />
          )}
        </div>
      ))}
    </div>
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 text-sm"
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
        isSelected ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? "bg-orange-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}>
          <Shield className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white">{rol.nom_rol}</h4>
          {rol.desc_rol && <p className="text-sm text-gray-500 truncate">{rol.desc_rol}</p>}
        </div>
        {isSelected && <Check className="w-6 h-6 text-orange-500" />}
      </div>
    </div>
  );
}

export default function ModalAgregarUsuario({ showModal, setShowModal, setUsuarios }: Props) {
  const {
    step,
    setStep,
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
    setValidationErrors,
    generalError,
    setGeneralError,
    canGoNext,
    handleClose,
    handleSubmit,
    fetchRolesData,
  } = useAgregarUsuario(showModal, setShowModal, setUsuarios);

  const steps = [
    { label: "Rol", icon: <Shield className="w-4 h-4" /> },
    { label: "Datos", icon: <Settings className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-linear-to-r from-orange-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <UserPlus className="w-6 h-6" />
            Nuevo Usuario
          </h2>
          <button onClick={handleClose} className="text-white/80 hover:text-white p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="border-b bg-gray-50 dark:bg-gray-800/50">
          <StepIndicator currentStep={step} steps={steps} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                Seleccionar Rol
              </h3>
              <SearchInput value={rolSearch} onChange={setRolSearch} placeholder="Buscar rol..." />
              {loadingRol ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
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

          {step === 2 && (
            <div className="space-y-6">
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
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-600" />
                Datos del Usuario
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <UserPlus className="w-4 h-4 text-orange-500" />
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={form.nom_usu}
                    onChange={(e) => setForm({ ...form, nom_usu: e.target.value })}
                    placeholder="Nombre de usuario"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Mail className="w-4 h-4 text-orange-500" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email_usu}
                    onChange={(e) => setForm({ ...form, email_usu: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
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
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
                Confirmar Usuario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-orange-600" />
                    <span className="font-semibold">Rol</span>
                  </div>
                  <p className="text-lg font-bold text-orange-600">{selectedRol?.nom_rol}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className={`w-6 h-6 ${form.est_usu ? "text-green-600" : "text-red-600"}`} />
                    <span className="font-semibold">Estado</span>
                  </div>
                  <p className={`text-lg font-bold ${form.est_usu ? "text-green-600" : "text-red-600"}`}>{form.est_usu ? "Activo" : "Inactivo"}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Nombre</p>
                    <p className="font-medium text-lg">{form.nom_usu}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-lg">{form.email_usu}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 rounded-xl font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            {step > 1 ? "Anterior" : "Cancelar"}
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              {isSubmitting ? "Guardando..." : "Crear Usuario"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
