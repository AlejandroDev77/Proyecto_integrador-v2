import React, { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  ShoppingCart,
  X,
  Save,
  AlertCircle,
  Calendar,
  Truck,
  User,
  DollarSign,
  CheckCircle,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Interfaces
interface CompraMaterial {
  id_comp: number;
  cod_comp?: string;
  fec_comp: string;
  est_comp: string;
  total_comp: number;
  id_prov: number;
  id_emp: number;
  proveedor?: { nom_prov: string };
  empleado?: { nom_emp: string };
}
interface Proveedor {
  id_prov: number;
  nom_prov: string;
  contacto_prov?: string;
  cod_prov?: string;
}
interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp?: string;
  ap_mat_emp?: string;
  cod_emp?: string;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  compramaterialSeleccionado: CompraMaterial | null;
  setComprasMateriales: React.Dispatch<React.SetStateAction<CompraMaterial[]>>;
}
interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

// SearchInput Component
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 text-sm"
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
  onPageChange: (p: number) => void;
  isLoading: boolean;
}) {
  if (pagination.lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onPageChange(1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 text-gray-700 dark:text-gray-300"
      >
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 text-gray-700 dark:text-gray-300"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
        {pagination.currentPage} / {pagination.lastPage}
      </span>
      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 text-gray-700 dark:text-gray-300"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.lastPage)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 text-gray-700 dark:text-gray-300"
      >
        <ChevronsRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ProveedorCard
function ProveedorCard({
  proveedor,
  isSelected,
  onSelect,
}: {
  proveedor: Proveedor;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-orange-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <Truck className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {proveedor.cod_prov}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {proveedor.nom_prov}
          </h4>
          {proveedor.contacto_prov && (
            <p className="text-xs text-gray-500 truncate">
              {proveedor.contacto_prov}
            </p>
          )}
        </div>
        {isSelected && <Check className="w-5 h-5 text-orange-500 shrink-0" />}
      </div>
    </div>
  );
}

// EmpleadoCard
function EmpleadoCard({
  empleado,
  isSelected,
  onSelect,
}: {
  empleado: Empleado;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-amber-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-amber-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <User className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {empleado.cod_emp}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {empleado.nom_emp} {empleado.ap_pat_emp}
          </h4>
        </div>
        {isSelected && <Check className="w-5 h-5 text-amber-500 shrink-0" />}
      </div>
    </div>
  );
}

const ModalEditarCompraMaterial: React.FC<Props> = ({
  showModal,
  setShowModal,
  compramaterialSeleccionado,
  setComprasMateriales,
}) => {
  const [form, setForm] = useState({ fecha: "", estado: "", total: 0 });
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(
    null
  );
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [proveedorSearch, setProveedorSearch] = useState("");
  const [empleadoSearch, setEmpleadoSearch] = useState("");
  const [provPagination, setProvPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [empPagination, setEmpPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingProv, setLoadingProv] = useState(false);
  const [loadingEmp, setLoadingEmp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "form" | "proveedor" | "empleado"
  >("form");

  const fetchProveedores = useCallback(async (page = 1, search = "") => {
    setLoadingProv(true);
    try {
      const url = `http://localhost:8080/api/proveedor?page=${page}&per_page=6${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }`;
      const res = await fetch(url);
      const payload = await res.json();
      if (payload?.data) {
        setProveedores(payload.data);
        setProvPagination({
          currentPage: payload.current_page || 1,
          lastPage: payload.last_page || 1,
          total: payload.total || 0,
        });
      } else {
        setProveedores(Array.isArray(payload) ? payload : []);
      }
    } catch {
      setProveedores([]);
    } finally {
      setLoadingProv(false);
    }
  }, []);

  const fetchEmpleados = useCallback(async (page = 1, search = "") => {
    setLoadingEmp(true);
    try {
      const url = `http://localhost:8080/api/empleados?page=${page}&per_page=6${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }`;
      const res = await fetch(url);
      const payload = await res.json();
      if (payload?.data) {
        setEmpleados(payload.data);
        setEmpPagination({
          currentPage: payload.current_page || 1,
          lastPage: payload.last_page || 1,
          total: payload.total || 0,
        });
      } else {
        setEmpleados(Array.isArray(payload) ? payload : []);
      }
    } catch {
      setEmpleados([]);
    } finally {
      setLoadingEmp(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchProveedores();
      fetchEmpleados();
    }
  }, [showModal, fetchProveedores, fetchEmpleados]);
  useEffect(() => {
    const t = setTimeout(() => fetchProveedores(1, proveedorSearch), 300);
    return () => clearTimeout(t);
  }, [proveedorSearch, fetchProveedores]);
  useEffect(() => {
    const t = setTimeout(() => fetchEmpleados(1, empleadoSearch), 300);
    return () => clearTimeout(t);
  }, [empleadoSearch, fetchEmpleados]);

  useEffect(() => {
    if (compramaterialSeleccionado) {
      const fechaLocal = new Date(
        compramaterialSeleccionado.fec_comp + "T00:00:00"
      );
      setForm({
        fecha: fechaLocal.toISOString().split("T")[0],
        estado: compramaterialSeleccionado.est_comp || "",
        total: compramaterialSeleccionado.total_comp || 0,
      });
      // Preseleccionar proveedor y empleado
      if (compramaterialSeleccionado.id_prov) {
        fetch(
          `http://localhost:8080/api/proveedor/${compramaterialSeleccionado.id_prov}`
        )
          .then((r) => r.json())
          .then((p) => setSelectedProveedor(p?.data ?? p))
          .catch(() => {});
      }
      if (compramaterialSeleccionado.id_emp) {
        fetch(
          `http://localhost:8080/api/empleados/${compramaterialSeleccionado.id_emp}`
        )
          .then((r) => r.json())
          .then((e) => setSelectedEmpleado(e?.data ?? e))
          .catch(() => {});
      }
    }
  }, [compramaterialSeleccionado]);

  const handleSubmit = async () => {
    if (
      !compramaterialSeleccionado ||
      !selectedProveedor ||
      !selectedEmpleado
    ) {
      setErrorMsg("Seleccione proveedor y empleado.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");

    let idUsuarioLocal = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const p: any = jwtDecode(token);
        idUsuarioLocal = p.id_usu || null;
      }
    } catch {
      idUsuarioLocal = null;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/compra-material/${compramaterialSeleccionado.id_comp}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
          },
          body: JSON.stringify({
            fec_comp: form.fecha,
            est_comp: form.estado,
            total_comp: form.total,
            id_prov: selectedProveedor.id_prov,
            id_emp: selectedEmpleado.id_emp,
          }),
        }
      );

      if (!res.ok) {
        const e = await res.json();
        setErrorMsg(e.message || "Error");
        return;
      }
      const data = await res.json();
      setComprasMateriales((prev) =>
        prev.map((c) =>
          c.id_comp === data.id_comp
            ? {
                ...data,
                proveedor: { nom_prov: selectedProveedor.nom_prov },
                empleado: { nom_emp: selectedEmpleado.nom_emp },
              }
            : c
        )
      );
      Swal.fire({
        icon: "success",
        title: "¡Compra actualizada!",
        showConfirmButton: false,
        timer: 1500,
      });
      setShowModal(false);
    } catch (err) {
      setErrorMsg("Error al editar");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !compramaterialSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            Editar Compra de Material
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm bg-white/20 px-3 py-1 rounded-lg">
              {compramaterialSeleccionado.cod_comp}
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            {
              key: "form",
              label: "Datos",
              icon: <Calendar className="w-4 h-4" />,
            },
            {
              key: "proveedor",
              label: "Proveedor",
              icon: <Truck className="w-4 h-4" />,
            },
            {
              key: "empleado",
              label: "Empleado",
              icon: <User className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as typeof activeSection)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
                activeSection === tab.key
                  ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50 dark:bg-amber-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.key === "proveedor" && selectedProveedor && (
                <Check className="w-4 h-4 text-green-500" />
              )}
              {tab.key === "empleado" && selectedEmpleado && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{errorMsg}</span>
            </div>
          )}

          {activeSection === "form" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  Fecha
                </label>
                <DatePicker
                  selected={
                    form.fecha ? new Date(form.fecha + "T00:00:00") : null
                  }
                  onChange={(date: Date | null) => {
                    if (date) {
                      const ld = new Date(
                        date.getTime() - date.getTimezoneOffset() * 60000
                      );
                      setForm({
                        ...form,
                        fecha: ld.toISOString().split("T")[0],
                      });
                    } else {
                      setForm({ ...form, fecha: "" });
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecciona fecha"
                  isClearable
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  Estado
                </label>
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  Total (Bs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.total}
                  onChange={(e) =>
                    setForm({ ...form, total: Number(e.target.value) })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
              {/* Resumen de selecciones */}
              <div className="md:col-span-2 mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Resumen de Selección
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-3 rounded-lg border-2 ${
                      selectedProveedor
                        ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Proveedor
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedProveedor
                        ? selectedProveedor.nom_prov
                        : "No seleccionado"}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg border-2 ${
                      selectedEmpleado
                        ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Empleado
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedEmpleado
                        ? `${selectedEmpleado.nom_emp} ${
                            selectedEmpleado.ap_pat_emp || ""
                          }`
                        : "No seleccionado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "proveedor" && (
            <div>
              <SearchInput
                value={proveedorSearch}
                onChange={setProveedorSearch}
                placeholder="Buscar proveedor..."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {loadingProv ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    Cargando...
                  </div>
                ) : (
                  proveedores.map((p) => (
                    <ProveedorCard
                      key={p.id_prov}
                      proveedor={p}
                      isSelected={selectedProveedor?.id_prov === p.id_prov}
                      onSelect={() => setSelectedProveedor(p)}
                    />
                  ))
                )}
              </div>
              <MiniPagination
                pagination={provPagination}
                onPageChange={(p) => fetchProveedores(p, proveedorSearch)}
                isLoading={loadingProv}
              />
            </div>
          )}

          {activeSection === "empleado" && (
            <div>
              <SearchInput
                value={empleadoSearch}
                onChange={setEmpleadoSearch}
                placeholder="Buscar empleado..."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {loadingEmp ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    Cargando...
                  </div>
                ) : (
                  empleados.map((e) => (
                    <EmpleadoCard
                      key={e.id_emp}
                      empleado={e}
                      isSelected={selectedEmpleado?.id_emp === e.id_emp}
                      onSelect={() => setSelectedEmpleado(e)}
                    />
                  ))
                )}
              </div>
              <MiniPagination
                pagination={empPagination}
                onPageChange={(p) => fetchEmpleados(p, empleadoSearch)}
                isLoading={loadingEmp}
              />
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 rounded-xl font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedProveedor || !selectedEmpleado}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg shadow-amber-600/30"
          >
            {isSubmitting ? (
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

export default ModalEditarCompraMaterial;
