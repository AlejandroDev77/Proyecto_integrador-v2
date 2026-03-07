import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  Package,
  Boxes,
  Armchair,
  UserCheck,
  Settings,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  AlertCircle,
  Calendar,
  FileText,
  Hash,
  ArrowUpDown,
  Save,
} from "lucide-react";

interface MovimientoInventario {
  id_mov: number;
  cod_mov?: string;
  tipo_mov: string;
  fecha_mov: string;
  cantidad: number;
  stock_anterior: number;
  stock_posterior: number;
  motivo: string;
  id_mat?: number;
  material?: { nom_mat: string };
  id_mue?: number;
  mueble?: { nom_mue: string };
  id_emp: number;
  empleado?: { nom_emp: string; ap_pat_emp: string };
}
interface Material {
  id_mat: number;
  nom_mat: string;
  cod_mat?: string;
}
interface Mueble {
  id_mue: number;
  nom_mue: string;
  cod_mue?: string;
}
interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp: string;
  cod_emp?: string;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  movimientoSeleccionado: MovimientoInventario | null;
  setMovimientosInventarios: React.Dispatch<
    React.SetStateAction<MovimientoInventario[]>
  >;
}
interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

type TabType = "datos" | "empleado" | "producto";

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) {
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 text-sm"
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
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-violet-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <UserCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{empleado.cod_emp}</p>
          <p className="font-medium">
            {empleado.nom_emp} {empleado.ap_pat_emp}
          </p>
        </div>
        {isSelected && <Check className="w-5 h-5 text-violet-500" />}
      </div>
    </div>
  );
}

function MaterialCard({
  material,
  isSelected,
  onSelect,
}: {
  material: Material;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-purple-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <Boxes className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{material.cod_mat}</p>
          <p className="font-medium">{material.nom_mat}</p>
        </div>
        {isSelected && <Check className="w-5 h-5 text-purple-500" />}
      </div>
    </div>
  );
}

function MuebleCard({
  mueble,
  isSelected,
  onSelect,
}: {
  mueble: Mueble;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <Armchair className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{mueble.cod_mue}</p>
          <p className="font-medium">{mueble.nom_mue}</p>
        </div>
        {isSelected && <Check className="w-5 h-5 text-indigo-500" />}
      </div>
    </div>
  );
}

export default function ModalEditarMovimientoInventario({
  showModal,
  setShowModal,
  movimientoSeleccionado,
  setMovimientosInventarios,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("datos");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    tipo_mov: "Entrada",
    fecha_mov: "",
    cantidad: 0,
    stock_anterior: 0,
    stock_posterior: 0,
    motivo: "",
  });
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [selectedMueble, setSelectedMueble] = useState<Mueble | null>(null);
  const [productType, setProductType] = useState<"material" | "mueble">(
    "material"
  );
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [empSearch, setEmpSearch] = useState("");
  const [matSearch, setMatSearch] = useState("");
  const [mueSearch, setMueSearch] = useState("");
  const [empPag, setEmpPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [matPag, setMatPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [muePag, setMuePag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingEmp, setLoadingEmp] = useState(false);
  const [loadingMat, setLoadingMat] = useState(false);
  const [loadingMue, setLoadingMue] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const tipos = ["Entrada", "Salida", "Ajuste"];

  const fetchEmpleados = useCallback(async (page = 1, search = "") => {
    setLoadingEmp(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/empleados?page=${page}&per_page=6${
          search ? `&filter[nom_emp]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setEmpleados(p?.data || []);
      setEmpPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setEmpleados([]);
    } finally {
      setLoadingEmp(false);
    }
  }, []);
  const fetchMateriales = useCallback(async (page = 1, search = "") => {
    setLoadingMat(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/materiales?page=${page}&per_page=6${
          search ? `&filter[nom_mat]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setMateriales(p?.data || []);
      setMatPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setMateriales([]);
    } finally {
      setLoadingMat(false);
    }
  }, []);
  const fetchMuebles = useCallback(async (page = 1, search = "") => {
    setLoadingMue(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/mueble?page=${page}&per_page=6${
          search ? `&filter[nom_mue]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setMuebles(p?.data || []);
      setMuePag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setMuebles([]);
    } finally {
      setLoadingMue(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchEmpleados();
      fetchMateriales();
      fetchMuebles();
    }
  }, [showModal, fetchEmpleados, fetchMateriales, fetchMuebles]);
  useEffect(() => {
    const t = setTimeout(() => fetchEmpleados(1, empSearch), 300);
    return () => clearTimeout(t);
  }, [empSearch, fetchEmpleados]);
  useEffect(() => {
    const t = setTimeout(() => fetchMateriales(1, matSearch), 300);
    return () => clearTimeout(t);
  }, [matSearch, fetchMateriales]);
  useEffect(() => {
    const t = setTimeout(() => fetchMuebles(1, mueSearch), 300);
    return () => clearTimeout(t);
  }, [mueSearch, fetchMuebles]);

  useEffect(() => {
    if (movimientoSeleccionado) {
      setForm({
        tipo_mov: movimientoSeleccionado.tipo_mov || "Entrada",
        fecha_mov: movimientoSeleccionado.fecha_mov || "",
        cantidad: movimientoSeleccionado.cantidad || 0,
        stock_anterior: movimientoSeleccionado.stock_anterior || 0,
        stock_posterior: movimientoSeleccionado.stock_posterior || 0,
        motivo: movimientoSeleccionado.motivo || "",
      });
      setSelectedEmpleado({
        id_emp: movimientoSeleccionado.id_emp,
        nom_emp: movimientoSeleccionado.empleado?.nom_emp || "",
        ap_pat_emp: movimientoSeleccionado.empleado?.ap_pat_emp || "",
      });
      if (movimientoSeleccionado.id_mat) {
        setProductType("material");
        setSelectedMaterial({
          id_mat: movimientoSeleccionado.id_mat,
          nom_mat: movimientoSeleccionado.material?.nom_mat || "",
        });
        setSelectedMueble(null);
      } else if (movimientoSeleccionado.id_mue) {
        setProductType("mueble");
        setSelectedMueble({
          id_mue: movimientoSeleccionado.id_mue,
          nom_mue: movimientoSeleccionado.mueble?.nom_mue || "",
        });
        setSelectedMaterial(null);
      }
    }
  }, [movimientoSeleccionado]);

  const handleClose = () => {
    setShowModal(false);
    setActiveTab("datos");
    setErrorMsg("");
  };

  const handleSubmit = async () => {
    if (!movimientoSeleccionado || !selectedEmpleado) return;
    setIsSubmitting(true);
    setErrorMsg("");
    let uid = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        uid = (jwtDecode(token) as any).id_usu;
      }
    } catch {}
    try {
      const res = await fetch(
        `http://localhost:8000/api/movimiento-inventario/${movimientoSeleccionado.id_mov}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(uid ? { "X-USER-ID": uid } : {}),
          },
          body: JSON.stringify({
            tipo_mov: form.tipo_mov,
            fecha_mov: form.fecha_mov,
            cantidad: form.cantidad,
            stock_anterior: form.stock_anterior,
            stock_posterior: form.stock_posterior,
            motivo: form.motivo,
            id_emp: selectedEmpleado.id_emp,
            id_mat: selectedMaterial?.id_mat || null,
            id_mue: selectedMueble?.id_mue || null,
          }),
        }
      );
      if (!res.ok) {
        const e = await res.json();
        setErrorMsg(
          e.errors ? Object.values(e.errors).flat().join(" ") : "Error"
        );
        return;
      }
      const data = (await res.json())?.data;
      setMovimientosInventarios((prev) =>
        prev.map((m) =>
          m.id_mov === movimientoSeleccionado.id_mov
            ? {
                ...data,
                empleado: {
                  nom_emp: selectedEmpleado.nom_emp,
                  ap_pat_emp: selectedEmpleado.ap_pat_emp,
                  ap_mat_emp: "",
                },
                material: selectedMaterial
                  ? { nom_mat: selectedMaterial.nom_mat }
                  : null,
                mueble: selectedMueble
                  ? { nom_mue: selectedMueble.nom_mue }
                  : null,
              }
            : m
        )
      );
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
    } catch {
      setErrorMsg("Error al actualizar");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !movimientoSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Package className="w-6 h-6" />
            Editar Movimiento de Inventario
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-1 px-4 pt-3 bg-gray-50 dark:bg-gray-800/50 border-b">
          <TabButton
            active={activeTab === "datos"}
            onClick={() => setActiveTab("datos")}
            icon={Settings}
            label="Datos"
          />
          <TabButton
            active={activeTab === "empleado"}
            onClick={() => setActiveTab("empleado")}
            icon={UserCheck}
            label="Empleado"
          />
          <TabButton
            active={activeTab === "producto"}
            onClick={() => setActiveTab("producto")}
            icon={Boxes}
            label="Producto"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "datos" && (
            <div className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  {errorMsg}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <ArrowUpDown className="w-4 h-4 text-violet-500" />
                    Tipo *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {tipos.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, tipo_mov: t })}
                        className={`py-2 px-3 rounded-xl border-2 text-sm font-medium ${
                          form.tipo_mov === t
                            ? "border-violet-500 bg-violet-50 text-violet-700"
                            : "border-gray-200 text-gray-500"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 text-violet-500" />
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={form.fecha_mov}
                    onChange={(e) =>
                      setForm({ ...form, fecha_mov: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Hash className="w-4 h-4 text-violet-500" />
                    Cantidad
                  </label>
                  <input
                    type="number"
                    value={form.cantidad}
                    onChange={(e) =>
                      setForm({ ...form, cantidad: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Hash className="w-4 h-4 text-violet-500" />
                    Stock Anterior
                  </label>
                  <input
                    type="number"
                    value={form.stock_anterior}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        stock_anterior: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Hash className="w-4 h-4 text-violet-500" />
                    Stock Posterior
                  </label>
                  <input
                    type="number"
                    value={form.stock_posterior}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        stock_posterior: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FileText className="w-4 h-4 text-violet-500" />
                    Motivo
                  </label>
                  <textarea
                    value={form.motivo}
                    onChange={(e) =>
                      setForm({ ...form, motivo: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-4 h-4 text-violet-600" />
                    <span className="text-xs font-medium">Empleado</span>
                  </div>
                  <p className="font-bold text-sm">
                    {selectedEmpleado?.nom_emp} {selectedEmpleado?.ap_pat_emp}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    {productType === "material" ? (
                      <Boxes className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Armchair className="w-4 h-4 text-purple-600" />
                    )}
                    <span className="text-xs font-medium">
                      {productType === "material" ? "Material" : "Mueble"}
                    </span>
                  </div>
                  <p className="font-bold text-sm">
                    {productType === "material"
                      ? selectedMaterial?.nom_mat || "-"
                      : selectedMueble?.nom_mue || "-"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "empleado" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-violet-600" />
                Cambiar Empleado
              </h3>
              <SearchInput
                value={empSearch}
                onChange={setEmpSearch}
                placeholder="Buscar empleado..."
              />
              {loadingEmp ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {empleados.length > 0 ? (
                      empleados.map((e) => (
                        <EmpleadoCard
                          key={e.id_emp}
                          empleado={e}
                          isSelected={selectedEmpleado?.id_emp === e.id_emp}
                          onSelect={() => setSelectedEmpleado(e)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron empleados</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={empPag}
                    onPageChange={(p) => fetchEmpleados(p, empSearch)}
                    isLoading={loadingEmp}
                  />
                </>
              )}
            </div>
          )}

          {activeTab === "producto" && (
            <div className="space-y-4">
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => {
                    setProductType("material");
                    setSelectedMueble(null);
                  }}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium flex items-center justify-center gap-2 ${
                    productType === "material"
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  <Boxes className="w-5 h-5" />
                  Material
                </button>
                <button
                  onClick={() => {
                    setProductType("mueble");
                    setSelectedMaterial(null);
                  }}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium flex items-center justify-center gap-2 ${
                    productType === "mueble"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  <Armchair className="w-5 h-5" />
                  Mueble
                </button>
              </div>
              {productType === "material" ? (
                <>
                  <SearchInput
                    value={matSearch}
                    onChange={setMatSearch}
                    placeholder="Buscar material..."
                  />
                  {loadingMat ? (
                    <div className="flex justify-center py-12">
                      <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto">
                        {materiales.length > 0 ? (
                          materiales.map((m) => (
                            <MaterialCard
                              key={m.id_mat}
                              material={m}
                              isSelected={selectedMaterial?.id_mat === m.id_mat}
                              onSelect={() => setSelectedMaterial(m)}
                            />
                          ))
                        ) : (
                          <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                            <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                            <p>No se encontraron materiales</p>
                          </div>
                        )}
                      </div>
                      <MiniPagination
                        pagination={matPag}
                        onPageChange={(p) => fetchMateriales(p, matSearch)}
                        isLoading={loadingMat}
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <SearchInput
                    value={mueSearch}
                    onChange={setMueSearch}
                    placeholder="Buscar mueble..."
                  />
                  {loadingMue ? (
                    <div className="flex justify-center py-12">
                      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto">
                        {muebles.length > 0 ? (
                          muebles.map((m) => (
                            <MuebleCard
                              key={m.id_mue}
                              mueble={m}
                              isSelected={selectedMueble?.id_mue === m.id_mue}
                              onSelect={() => setSelectedMueble(m)}
                            />
                          ))
                        ) : (
                          <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                            <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                            <p>No se encontraron muebles</p>
                          </div>
                        )}
                      </div>
                      <MiniPagination
                        pagination={muePag}
                        onPageChange={(p) => fetchMuebles(p, mueSearch)}
                        isLoading={loadingMue}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="border-t bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 rounded-xl font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedEmpleado}
            className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
