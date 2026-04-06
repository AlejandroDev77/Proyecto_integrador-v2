import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { ValidationErrors, parseApiErrors } from "../shared";
import {
  UserPlus,
  Users,
  Settings,
  ClipboardCheck,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Briefcase,
} from "lucide-react";

interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp: string;
  ap_mat_emp: string;
  cel_emp: number;
  dir_emp: string;
  fec_nac_emp: string;
  ci_emp: string;
  img_emp: string;
  car_emp: string;
  id_usu: number;
  usuario?: { nom_usu: string };
}
interface Usuario {
  id_usu: number;
  nom_usu: string;
  cod_usu?: string;
  email_usu?: string;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setEmpleados: React.Dispatch<React.SetStateAction<Empleado[]>>;
}
interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: { label: string; icon: React.ReactNode }[];
}) {
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
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {index + 1 < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                step.icon
              )}
            </div>
            <span
              className={`mt-1 text-xs font-medium hidden sm:block ${
                index + 1 === currentStep ? "text-green-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-16 h-1 mx-1 rounded ${
                index + 1 < currentStep
                  ? "bg-green-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 text-sm"
      />
    </div>
  );
}

function MiniPagination({
  pagination,
  onPageChange,
  isLoading,
}: {
  pagination: PaginationInfo;
  onPageChange: (p: number) => void;
  isLoading: boolean;
}) {
  if (pagination.lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-3 pt-2 border-t">
      <button
        onClick={() => onPageChange(1)}
        disabled={isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
      >
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs px-2">
        {pagination.currentPage}/{pagination.lastPage}
      </span>
      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.lastPage)}
        disabled={isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
      >
        <ChevronsRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function UsuarioCard({
  usuario,
  isSelected,
  onSelect,
}: {
  usuario: Usuario;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
        isSelected
          ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-green-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <Users className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{usuario.cod_usu}</p>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {usuario.nom_usu}
          </h4>
          {usuario.email_usu && (
            <p className="text-sm text-gray-500 truncate">
              {usuario.email_usu}
            </p>
          )}
        </div>
        {isSelected && <Check className="w-6 h-6 text-green-500" />}
      </div>
    </div>
  );
}

export default function ModalAgregarEmpleado({
  showModal,
  setShowModal,
  setEmpleados,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    nom_emp: "",
    ap_pat_emp: "",
    ap_mat_emp: "",
    cel_emp: "",
    dir_emp: "",
    fec_nac_emp: "",
    ci_emp: "",
    car_emp: "",
  });
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuSearch, setUsuSearch] = useState("");
  const [usuPag, setUsuPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingUsu, setLoadingUsu] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const steps = [
    { label: "Usuario", icon: <Users className="w-4 h-4" /> },
    { label: "Datos", icon: <Settings className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchUsuarios = useCallback(async (page = 1, search = "") => {
    setLoadingUsu(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/usuarios-sin-relaciones?page=${page}&per_page=6${
          search ? `&filter[nom_usu]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setUsuarios(p?.data || []);
      setUsuPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setUsuarios([]);
    } finally {
      setLoadingUsu(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchUsuarios();
    }
  }, [showModal, fetchUsuarios]);
  useEffect(() => {
    const t = setTimeout(() => fetchUsuarios(1, usuSearch), 300);
    return () => clearTimeout(t);
  }, [usuSearch, fetchUsuarios]);

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedUsuario(null);
    setForm({
      nom_emp: "",
      ap_pat_emp: "",
      ap_mat_emp: "",
      cel_emp: "",
      dir_emp: "",
      fec_nac_emp: "",
      ci_emp: "",
      car_emp: "",
    });
    setValidationErrors(null);
    setGeneralError(null);
  };
  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedUsuario;
      case 2:
        return form.nom_emp.trim() && form.ap_pat_emp.trim();
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedUsuario || !form.nom_emp || !form.ap_pat_emp) return;
    setIsSubmitting(true);
    setValidationErrors(null);
    setGeneralError(null);
    let uid = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        uid = (jwtDecode(token) as any).id_usu;
      }
    } catch {}
    try {
      const res = await fetch("http://localhost:8080/api/empleados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(uid ? { "X-USER-ID": uid } : {}),
        },
        body: JSON.stringify({ ...form, id_usu: selectedUsuario.id_usu }),
      });

      let responseData;
      try {
        responseData = await res.json();
      } catch {
        responseData = { message: `Error del servidor (${res.status})` };
      }

      if (!res.ok) {
        const { fieldErrors, generalError: genError } =
          parseApiErrors(responseData);
        setValidationErrors(fieldErrors);
        setGeneralError(genError);
        setStep(2);
        setIsSubmitting(false);
        return;
      }

      const data = responseData?.data || responseData;
      setEmpleados((prev) => [
        ...prev,
        { ...data, usuario: { nom_usu: selectedUsuario.nom_usu } },
      ]);
      Swal.fire({
        icon: "success",
        title: "¡Empleado creado!",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
    } catch {
      setGeneralError(
        "Error de conexión. Por favor, verifique su conexión a internet."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <UserPlus className="w-6 h-6" />
            Nuevo Empleado
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2 rounded-lg"
          >
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
                <Users className="w-5 h-5 text-green-600" />
                Seleccionar Usuario (sin empleado asignado)
              </h3>
              <SearchInput
                value={usuSearch}
                onChange={setUsuSearch}
                placeholder="Buscar usuario..."
              />
              {loadingUsu ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {usuarios.length > 0 ? (
                      usuarios.map((u) => (
                        <UsuarioCard
                          key={u.id_usu}
                          usuario={u}
                          isSelected={selectedUsuario?.id_usu === u.id_usu}
                          onSelect={() => setSelectedUsuario(u)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No hay usuarios disponibles</p>
                        <p className="text-xs">
                          Todos los usuarios ya tienen empleado asignado
                        </p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={usuPag}
                    onPageChange={(p) => fetchUsuarios(p, usuSearch)}
                    isLoading={loadingUsu}
                  />
                </>
              )}
            </div>
          )}

          {step === 2 && (
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
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5 text-green-600" />
                Datos del Empleado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <User className="w-4 h-4 text-green-500" />
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={form.nom_emp}
                    onChange={(e) =>
                      setForm({ ...form, nom_emp: e.target.value })
                    }
                    placeholder="Nombre"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <User className="w-4 h-4 text-green-500" />
                    Apellido Paterno *
                  </label>
                  <input
                    type="text"
                    value={form.ap_pat_emp}
                    onChange={(e) =>
                      setForm({ ...form, ap_pat_emp: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <User className="w-4 h-4 text-green-500" />
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    value={form.ap_mat_emp}
                    onChange={(e) =>
                      setForm({ ...form, ap_mat_emp: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <CreditCard className="w-4 h-4 text-green-500" />
                    CI *
                  </label>
                  <input
                    type="text"
                    value={form.ci_emp}
                    onChange={(e) =>
                      setForm({ ...form, ci_emp: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Phone className="w-4 h-4 text-green-500" />
                    Celular
                  </label>
                  <input
                    type="number"
                    value={form.cel_emp}
                    onChange={(e) =>
                      setForm({ ...form, cel_emp: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    Fecha Nacimiento
                  </label>
                  <input
                    type="date"
                    value={form.fec_nac_emp}
                    onChange={(e) =>
                      setForm({ ...form, fec_nac_emp: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Briefcase className="w-4 h-4 text-green-500" />
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={form.car_emp}
                    onChange={(e) =>
                      setForm({ ...form, car_emp: e.target.value })
                    }
                    placeholder="Ej: Carpintero"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={form.dir_emp}
                    onChange={(e) =>
                      setForm({ ...form, dir_emp: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
                Confirmar Empleado
              </h3>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-green-600" />
                  <span className="font-semibold">Usuario vinculado</span>
                </div>
                <p className="text-sm text-gray-500">
                  {selectedUsuario?.cod_usu}
                </p>
                <p className="text-lg font-bold text-green-600">
                  {selectedUsuario?.nom_usu}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Nombre completo</p>
                    <p className="font-medium">
                      {form.nom_emp} {form.ap_pat_emp} {form.ap_mat_emp}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">CI</p>
                    <p className="font-medium">{form.ci_emp || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Celular</p>
                    <p className="font-medium">{form.cel_emp || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cargo</p>
                    <p className="font-medium">{form.car_emp || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fecha Nacimiento</p>
                    <p className="font-medium">{form.fec_nac_emp || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Dirección</p>
                    <p className="font-medium">{form.dir_emp || "-"}</p>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
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
              {isSubmitting ? "Guardando..." : "Crear Empleado"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
