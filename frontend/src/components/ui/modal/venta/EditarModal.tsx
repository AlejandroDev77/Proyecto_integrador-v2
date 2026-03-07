import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { ValidationErrors, parseApiErrors } from "../shared";
import { Venta, Cliente, Empleado } from "../../../../types/venta";
import {
  Edit3,
  Users,
  UserCheck,
  X,
  Save,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  Calendar,
  FileText,
  DollarSign,
  Tag,
} from "lucide-react";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  ventaSeleccionada: Venta | null;
  setVentas: React.Dispatch<React.SetStateAction<Venta[]>>;
}

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

// Componente SearchInput
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
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
      />
    </div>
  );
}

// Componente MiniPagination
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
    <div className="flex items-center justify-center gap-1 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onPageChange(1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
      >
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
        {pagination.currentPage} / {pagination.lastPage}
      </span>
      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.lastPage)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
      >
        <ChevronsRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Card de Cliente
function ClienteCard({
  cliente,
  isSelected,
  onSelect,
}: {
  cliente: Cliente;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <Users className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {cliente.cod_cli}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {cliente.nom_cli} {cliente.ap_pat_cli}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            CI: {cliente.ci_cli}
          </p>
        </div>
        {isSelected && (
          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

// Card de Empleado
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
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <UserCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {empleado.cod_emp}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {empleado.nom_emp} {empleado.ap_pat_emp}
          </h4>
        </div>
        {isSelected && (
          <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

const ModalEditarVenta = ({
  showModal,
  setShowModal,
  ventaSeleccionada,
  setVentas,
}: Props) => {
  const [formData, setFormData] = useState({
    fec_ven: "",
    total_ven: 0,
    descuento: 0,
    notas: "",
    est_ven: "",
    id_cli: 0,
    id_emp: 0,
  });

  // Clientes
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesPagination, setClientesPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [clientesLoading, setClientesLoading] = useState(false);
  const [searchCliente, setSearchCliente] = useState("");

  // Empleados
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [empleadosPagination, setEmpleadosPagination] =
    useState<PaginationInfo>({ currentPage: 1, lastPage: 1, total: 0 });
  const [empleadosLoading, setEmpleadosLoading] = useState(false);
  const [searchEmpleado, setSearchEmpleado] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Fetch functions
  const fetchClientes = useCallback(
    async (page: number, search: string = "") => {
      setClientesLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "6",
        });
        if (search) params.append("filter[nom_cli]", search);
        const res = await fetch(`http://localhost:8000/api/clientes?${params}`);
        const payload = await res.json();
        const items = payload?.data ?? payload;
        setClientes(Array.isArray(items) ? items : []);
        if (payload?.meta || payload?.last_page) {
          setClientesPagination({
            currentPage:
              payload?.meta?.current_page ?? payload?.current_page ?? page,
            lastPage: payload?.meta?.last_page ?? payload?.last_page ?? 1,
            total: payload?.meta?.total ?? payload?.total ?? items.length,
          });
        }
      } catch (error) {
        setClientes([]);
      } finally {
        setClientesLoading(false);
      }
    },
    []
  );

  const fetchEmpleados = useCallback(
    async (page: number, search: string = "") => {
      setEmpleadosLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "6",
        });
        if (search) params.append("filter[nom_emp]", search);
        const res = await fetch(
          `http://localhost:8000/api/empleados?${params}`
        );
        const payload = await res.json();
        const items = payload?.data ?? payload;
        setEmpleados(Array.isArray(items) ? items : []);
        if (payload?.meta || payload?.last_page) {
          setEmpleadosPagination({
            currentPage:
              payload?.meta?.current_page ?? payload?.current_page ?? page,
            lastPage: payload?.meta?.last_page ?? payload?.last_page ?? 1,
            total: payload?.meta?.total ?? payload?.total ?? items.length,
          });
        }
      } catch (error) {
        setEmpleados([]);
      } finally {
        setEmpleadosLoading(false);
      }
    },
    []
  );

  // Load data on modal open
  useEffect(() => {
    if (showModal && ventaSeleccionada) {
      setFormData({
        fec_ven: ventaSeleccionada.fec_ven,
        total_ven: ventaSeleccionada.total_ven,
        descuento: ventaSeleccionada.descuento,
        notas: ventaSeleccionada.notas || "",
        est_ven: ventaSeleccionada.est_ven,
        id_cli: ventaSeleccionada.id_cli,
        id_emp: ventaSeleccionada.id_emp,
      });
      fetchClientes(1, "");
      fetchEmpleados(1, "");
    }
  }, [showModal, ventaSeleccionada, fetchClientes, fetchEmpleados]);

  // Debounced search
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchClientes(1, searchCliente), 300);
    return () => clearTimeout(timer);
  }, [searchCliente, showModal, fetchClientes]);

  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchEmpleados(1, searchEmpleado), 300);
    return () => clearTimeout(timer);
  }, [searchEmpleado, showModal, fetchEmpleados]);

  const handleSubmit = async () => {
    if (!ventaSeleccionada) return;
    setIsSubmitting(true);
    setValidationErrors(null);
    setGeneralError(null);

    try {
      let idUsuarioLocal = null;
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const payload: any = jwtDecode(token);
          idUsuarioLocal = payload.id_usu || null;
        }
      } catch (e) {
        idUsuarioLocal = null;
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
      };

      const res = await fetch(
        `http://localhost:8000/api/venta/${ventaSeleccionada.id_ven}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(formData),
        }
      );

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
        setIsSubmitting(false);
        return;
      }

      // Refrescar todas las ventas desde la API para obtener relaciones correctas
      const updatedRes = await fetch("http://localhost:8000/api/venta");
      const updatedPayload: any = await updatedRes.json();
      const updatedItems = updatedPayload?.data ?? updatedPayload;
      setVentas(Array.isArray(updatedItems) ? updatedItems : []);

      Swal.fire({
        icon: "success",
        title: "¡Venta actualizada!",
        text: "Los cambios se guardaron correctamente.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
      setGeneralError(
        "Error de conexión. Por favor, verifique su conexión a internet."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !ventaSeleccionada) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Edit3 className="w-6 h-6" />
            Editar Venta - {ventaSeleccionada.cod_ven}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                Datos de la Venta
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" /> Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.fec_ven}
                    onChange={(e) =>
                      setFormData({ ...formData, fec_ven: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Tag className="w-4 h-4 inline mr-1" /> Estado
                  </label>
                  <select
                    value={formData.est_ven}
                    onChange={(e) =>
                      setFormData({ ...formData, est_ven: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <DollarSign className="w-4 h-4 inline mr-1" /> Total
                  </label>
                  <input
                    type="number"
                    value={formData.total_ven}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_ven: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descuento
                  </label>
                  <input
                    type="number"
                    value={formData.descuento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descuento: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notas
                </label>
                <textarea
                  value={formData.notas}
                  onChange={(e) =>
                    setFormData({ ...formData, notas: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>

            {/* Right Column - Cliente Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Cliente
              </h3>
              <SearchInput
                value={searchCliente}
                onChange={setSearchCliente}
                placeholder="Buscar cliente..."
              />
              {clientesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {clientes.length > 0 ? (
                      clientes.map((c) => (
                        <ClienteCard
                          key={c.id_cli}
                          cliente={c}
                          isSelected={formData.id_cli === c.id_cli}
                          onSelect={() =>
                            setFormData({ ...formData, id_cli: c.id_cli })
                          }
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center py-6 text-gray-500">
                        <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                        <p>No se encontraron clientes</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={clientesPagination}
                    onPageChange={(p) => fetchClientes(p, searchCliente)}
                    isLoading={clientesLoading}
                  />
                </>
              )}
            </div>

            {/* Full Width - Empleado Selection */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Empleado
              </h3>
              <SearchInput
                value={searchEmpleado}
                onChange={setSearchEmpleado}
                placeholder="Buscar empleado..."
              />
              {empleadosLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto">
                    {empleados.length > 0 ? (
                      empleados.map((e) => (
                        <EmpleadoCard
                          key={e.id_emp}
                          empleado={e}
                          isSelected={formData.id_emp === e.id_emp}
                          onSelect={() =>
                            setFormData({ ...formData, id_emp: e.id_emp })
                          }
                        />
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center py-6 text-gray-500">
                        <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                        <p>No se encontraron empleados</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={empleadosPagination}
                    onPageChange={(p) => fetchEmpleados(p, searchEmpleado)}
                    isLoading={empleadosLoading}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.id_cli || !formData.id_emp}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors shadow-lg shadow-amber-500/30"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarVenta;
