import React, { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  RotateCcw,
  X,
  Save,
  AlertCircle,
  Calendar,
  ShoppingBag,
  User,
  DollarSign,
  CheckCircle,
  FileText,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Interfaces
interface Devolucion {
  id_dev: number;
  cod_dev?: string;
  fec_dev: string;
  motivo_dev: string;
  total_dev: number;
  est_dev: string;
  id_ven: number;
  id_emp: number;
  venta?: { fec_ven: string };
  empleado?: { nom_emp: string; ap_pat_emp: string; ap_mat_emp: string };
}
interface Venta {
  id_ven: number;
  fec_ven: string;
  est_ven: string;
  cod_ven?: string;
  total_ven: number;
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
  devolucionSeleccionado: Devolucion | null;
  setDevoluciones: React.Dispatch<React.SetStateAction<Devolucion[]>>;
}
interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

// Components
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 text-sm"
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

function VentaCard({
  venta,
  isSelected,
  onSelect,
}: {
  venta: Venta;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-rose-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-rose-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {venta.cod_ven}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            {venta.fec_ven}
          </h4>
          <div className="flex gap-2">
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                venta.est_ven === "Completada"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {venta.est_ven}
            </span>
            <span className="text-xs text-rose-600 font-medium">
              {venta.total_ven} Bs.
            </span>
          </div>
        </div>
        {isSelected && <Check className="w-5 h-5 text-rose-500 shrink-0" />}
      </div>
    </div>
  );
}

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
          ? "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-red-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-red-500 text-white"
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
        {isSelected && <Check className="w-5 h-5 text-red-500 shrink-0" />}
      </div>
    </div>
  );
}

const ModalEditarDevolucion: React.FC<Props> = ({
  showModal,
  setShowModal,
  devolucionSeleccionado,
  setDevoluciones,
}) => {
  const [form, setForm] = useState({
    fecha: "",
    motivo: "",
    total: 0,
    estado: "",
  });
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [ventaSearch, setVentaSearch] = useState("");
  const [empleadoSearch, setEmpleadoSearch] = useState("");
  const [ventaPagination, setVentaPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [empPagination, setEmpPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingVenta, setLoadingVenta] = useState(false);
  const [loadingEmp, setLoadingEmp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "form" | "venta" | "empleado"
  >("form");

  const fetchVentas = useCallback(async (page = 1, search = "") => {
    setLoadingVenta(true);
    try {
      const url = `http://localhost:8000/api/venta?page=${page}&per_page=6${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }`;
      const res = await fetch(url);
      const payload = await res.json();
      if (payload?.data) {
        setVentas(payload.data);
        setVentaPagination({
          currentPage: payload.current_page || 1,
          lastPage: payload.last_page || 1,
          total: payload.total || 0,
        });
      } else {
        setVentas(Array.isArray(payload) ? payload : []);
      }
    } catch {
      setVentas([]);
    } finally {
      setLoadingVenta(false);
    }
  }, []);

  const fetchEmpleados = useCallback(async (page = 1, search = "") => {
    setLoadingEmp(true);
    try {
      const url = `http://localhost:8000/api/empleados?page=${page}&per_page=6${
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
      fetchVentas();
      fetchEmpleados();
    }
  }, [showModal, fetchVentas, fetchEmpleados]);
  useEffect(() => {
    const t = setTimeout(() => fetchVentas(1, ventaSearch), 300);
    return () => clearTimeout(t);
  }, [ventaSearch, fetchVentas]);
  useEffect(() => {
    const t = setTimeout(() => fetchEmpleados(1, empleadoSearch), 300);
    return () => clearTimeout(t);
  }, [empleadoSearch, fetchEmpleados]);

  useEffect(() => {
    if (devolucionSeleccionado) {
      const fecha = new Date(devolucionSeleccionado.fec_dev);
      fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
      setForm({
        fecha: fecha.toISOString().split("T")[0],
        motivo: devolucionSeleccionado.motivo_dev || "",
        total: devolucionSeleccionado.total_dev || 0,
        estado: devolucionSeleccionado.est_dev || "",
      });
      if (devolucionSeleccionado.id_ven) {
        fetch(
          `http://localhost:8000/api/venta/${devolucionSeleccionado.id_ven}`
        )
          .then((r) => r.json())
          .then((v) => setSelectedVenta(v?.data ?? v))
          .catch(() => {});
      }
      if (devolucionSeleccionado.id_emp) {
        fetch(
          `http://localhost:8000/api/empleados/${devolucionSeleccionado.id_emp}`
        )
          .then((r) => r.json())
          .then((e) => setSelectedEmpleado(e?.data ?? e))
          .catch(() => {});
      }
    }
  }, [devolucionSeleccionado]);

  const handleSubmit = async () => {
    if (!devolucionSeleccionado || !selectedVenta || !selectedEmpleado) {
      setErrorMsg("Seleccione venta y empleado.");
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
      const fechaAjustada = form.fecha
        ? (() => {
            const f = new Date(form.fecha);
            f.setMinutes(f.getMinutes() - f.getTimezoneOffset());
            return f.toISOString().split("T")[0];
          })()
        : null;
      const res = await fetch(
        `http://localhost:8000/api/devolucion/${devolucionSeleccionado.id_dev}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
          },
          body: JSON.stringify({
            fec_dev: fechaAjustada,
            motivo_dev: form.motivo,
            total_dev: form.total,
            est_dev: form.estado,
            id_ven: selectedVenta.id_ven,
            id_emp: selectedEmpleado.id_emp,
          }),
        }
      );

      if (!res.ok) {
        const e = await res.json();
        setErrorMsg(e.message || "Error");
        return;
      }
      const payload: any = await res.json();
      const data = payload?.data ?? payload;
      setDevoluciones((prev) =>
        prev.map((d) =>
          d.id_dev === data.id_dev
            ? {
                ...data,
                venta: { fec_ven: selectedVenta.fec_ven },
                empleado: {
                  nom_emp: selectedEmpleado.nom_emp,
                  ap_pat_emp: selectedEmpleado.ap_pat_emp || "",
                  ap_mat_emp: selectedEmpleado.ap_mat_emp || "",
                },
              }
            : d
        )
      );
      Swal.fire({
        icon: "success",
        title: "¡Devolución actualizada!",
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

  if (!showModal || !devolucionSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <RotateCcw className="w-6 h-6" />
            Editar Devolución
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm bg-white/20 px-3 py-1 rounded-lg">
              {devolucionSeleccionado.cod_dev}
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            {
              key: "form",
              label: "Datos",
              icon: <Calendar className="w-4 h-4" />,
            },
            {
              key: "venta",
              label: "Venta",
              icon: <ShoppingBag className="w-4 h-4" />,
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
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50 dark:bg-red-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.key === "venta" && selectedVenta && (
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
                  <Calendar className="w-4 h-4 text-red-500" />
                  Fecha
                </label>
                <DatePicker
                  selected={
                    form.fecha
                      ? (() => {
                          const f = new Date(form.fecha);
                          f.setMinutes(f.getMinutes() + f.getTimezoneOffset());
                          return f;
                        })()
                      : null
                  }
                  onChange={(date: Date | null) => {
                    if (date) {
                      const f = new Date(date);
                      f.setMinutes(f.getMinutes() - f.getTimezoneOffset());
                      setForm({
                        ...form,
                        fecha: f.toISOString().split("T")[0],
                      });
                    } else {
                      setForm({ ...form, fecha: "" });
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecciona fecha"
                  isClearable
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CheckCircle className="w-4 h-4 text-red-500" />
                  Estado
                </label>
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="w-4 h-4 text-red-500" />
                  Total (Bs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.total}
                  onChange={(e) =>
                    setForm({ ...form, total: Number(e.target.value) })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  Motivo
                </label>
                <input
                  type="text"
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="md:col-span-2 mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Resumen de Selección
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-3 rounded-lg border-2 ${
                      selectedVenta
                        ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Venta
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedVenta
                        ? `${selectedVenta.cod_ven} - ${selectedVenta.fec_ven}`
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

          {activeSection === "venta" && (
            <div>
              <SearchInput
                value={ventaSearch}
                onChange={setVentaSearch}
                placeholder="Buscar venta..."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {loadingVenta ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    Cargando...
                  </div>
                ) : (
                  ventas.map((v) => (
                    <VentaCard
                      key={v.id_ven}
                      venta={v}
                      isSelected={selectedVenta?.id_ven === v.id_ven}
                      onSelect={() => setSelectedVenta(v)}
                    />
                  ))
                )}
              </div>
              <MiniPagination
                pagination={ventaPagination}
                onPageChange={(p) => fetchVentas(p, ventaSearch)}
                isLoading={loadingVenta}
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
            disabled={isSubmitting || !selectedVenta || !selectedEmpleado}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg shadow-red-600/30"
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

export default ModalEditarDevolucion;
