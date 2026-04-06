import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  FileText,
  User,
  UserCheck,
  Armchair,
  Calculator,
  ClipboardCheck,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Search,
  Plus,
  Trash2,
  Home,
  Clock,
  DollarSign,
  Package,
  Briefcase,
  Building,
  Store,
  Ruler,
  Palette,
  Wrench,
  Image,
  Upload,
  Sofa,
  ChefHat,
  BedDouble,
  BookOpen,
  Bath,
  Monitor,
} from "lucide-react";

interface Cliente {
  id_cli: number;
  nom_cli: string;
  ap_pat_cli: string;
  ci_cli: string;
  dir_cli?: string;
  img_cli?: string;
}
interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp: string;
  img_emp?: string;
}
interface Mueble {
  id_mue: number;
  nom_mue: string;
  cod_mue: string;
  precio_venta: number;
  stock: number;
  img_mue?: string;
}
interface DetalleItem {
  id_mue?: number | null;
  nombre_mueble: string;
  tipo_mueble: string;
  dimensiones: string;
  material_principal: string;
  color_acabado: string;
  herrajes: string;
  img_referencia: string;
  cantidad: number;
  precio_unitario: number;
  desc_personalizacion: string;
  esDelCatalogo: boolean;
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const API = "http://localhost:8080/api";

const TIPOS_PROYECTO = [
  { value: "hogar", label: "Hogar", icon: Home },
  { value: "oficina", label: "Oficina", icon: Briefcase },
  { value: "comercio", label: "Comercio", icon: Store },
  { value: "otro", label: "Otro", icon: Building },
];

const TIPOS_MUEBLE = [
  { value: "ropero", label: "Ropero/Closet", icon: Armchair },
  { value: "cocina", label: "Cocina", icon: ChefHat },
  { value: "dormitorio", label: "Dormitorio", icon: BedDouble },
  { value: "escritorio", label: "Escritorio", icon: Monitor },
  { value: "estante", label: "Estante/Librero", icon: BookOpen },
  { value: "baño", label: "Mueble de Baño", icon: Bath },
  { value: "sala", label: "Mueble de Sala", icon: Sofa },
  { value: "otro", label: "Otro", icon: Package },
];

const MATERIALES = [
  "Melamina 18mm",
  "Melamina 15mm",
  "MDF 18mm",
  "MDF 15mm",
  "Madera Maciza",
  "Aglomerado",
];

const COLORES_COMUNES = [
  "Blanco",
  "Negro",
  "Roble Oscuro",
  "Roble Claro",
  "Nogal",
  "Cerezo",
  "Gris",
  "Wengue",
];

// Helper para obtener URL de imagen
const getImageUrl = (path?: string) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `http://localhost:8080/storage/${path}`;
};

function ProductImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const imageUrl = getImageUrl(src);

  if (!imageUrl || error) {
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${className}`}
      >
        <Package className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setError(true)}
    />
  );
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
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                idx + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : idx + 1 === currentStep
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {idx + 1 < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                step.icon
              )}
            </div>
            <span
              className={`mt-1 text-xs font-medium hidden sm:block ${
                idx + 1 === currentStep ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-1 mx-1 rounded ${
                idx + 1 < currentStep
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

export default function ModalCotizacionCompleta({
  showModal,
  setShowModal,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [catalogoMuebles, setCatalogoMuebles] = useState<Mueble[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [detalles, setDetalles] = useState<DetalleItem[]>([]);
  const [searchCliente, setSearchCliente] = useState("");
  const [searchCatalogo, setSearchCatalogo] = useState("");

  // Datos del proyecto
  const [tipoProyecto, setTipoProyecto] = useState("hogar");
  const [presupuestoCliente, setPresupuestoCliente] = useState<number | "">("");
  const [plazoEsperado, setPlazoEsperado] = useState<number | "">("");
  const [tiempoEntrega, setTiempoEntrega] = useState<number | "">(15);
  const [validezDias, setValidezDias] = useState(15);
  const [direccionInstalacion, setDireccionInstalacion] = useState("");
  const [notas, setNotas] = useState("");
  const [descuento, setDescuento] = useState(0);

  // Modal para agregar mueble
  const [showAddModal, setShowAddModal] = useState(false);
  const [modoAgregar, setModoAgregar] = useState<"personalizado" | "catalogo">(
    "personalizado"
  );

  // Campos del mueble nuevo
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState("ropero");
  const [nuevoDimensiones, setNuevoDimensiones] = useState("");
  const [nuevoMaterial, setNuevoMaterial] = useState("Melamina 18mm");
  const [nuevoColor, setNuevoColor] = useState("Blanco");
  const [nuevoHerrajes, setNuevoHerrajes] = useState("");
  const [nuevoImgRef, setNuevoImgRef] = useState("");
  const [nuevoCantidad, setNuevoCantidad] = useState(1);
  const [nuevoPrecio, setNuevoPrecio] = useState(0);
  const [nuevoDesc, setNuevoDesc] = useState("");

  // Costos (opcional)
  const [calcularCostos, setCalcularCostos] = useState(false);
  const [costoMateriales, setCostoMateriales] = useState(0);
  const [costoManoObra, setCostoManoObra] = useState(0);
  const [costosIndirectos, setCostosIndirectos] = useState(0);
  const [margenGanancia, setMargenGanancia] = useState(30);

  const steps = [
    { label: "Cliente", icon: <User className="w-4 h-4" /> },
    { label: "Proyecto", icon: <Home className="w-4 h-4" /> },
    { label: "Muebles", icon: <Armchair className="w-4 h-4" /> },
    { label: "Costos", icon: <Calculator className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchData = useCallback(async () => {
    try {
      const [cRes, eRes, mRes] = await Promise.all([
        fetch(`${API}/clientes?per_page=100`),
        fetch(`${API}/empleados?per_page=100`),
        fetch(`${API}/mueble?per_page=100`),
      ]);
      const [cData, eData, mData] = await Promise.all([
        cRes.json(),
        eRes.json(),
        mRes.json(),
      ]);
      setClientes(cData.data || cData);
      setEmpleados(eData.data || eData);
      setCatalogoMuebles(mData.data || mData);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (showModal) fetchData();
  }, [showModal, fetchData]);

  useEffect(() => {
    if (selectedCliente?.dir_cli && !direccionInstalacion) {
      setDireccionInstalacion(selectedCliente.dir_cli);
    }
  }, [selectedCliente]);

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedCliente(null);
    setSelectedEmpleado(null);
    setDetalles([]);
    setTipoProyecto("hogar");
    setPresupuestoCliente("");
    setPlazoEsperado("");
    setTiempoEntrega(15);
    setValidezDias(15);
    setDireccionInstalacion("");
    setNotas("");
    setDescuento(0);
    setCalcularCostos(false);
    setCostoMateriales(0);
    setCostoManoObra(0);
    setCostosIndirectos(0);
    setMargenGanancia(30);
  };

  const resetNuevoMueble = () => {
    setNuevoNombre("");
    setNuevoTipo("ropero");
    setNuevoDimensiones("");
    setNuevoMaterial("Melamina 18mm");
    setNuevoColor("Blanco");
    setNuevoHerrajes("");
    setNuevoImgRef("");
    setNuevoCantidad(1);
    setNuevoPrecio(0);
    setNuevoDesc("");
  };

  const agregarMueblePersonalizado = () => {
    if (!nuevoNombre || nuevoPrecio <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Complete los campos",
        text: "Nombre y precio son obligatorios",
      });
      return;
    }
    setDetalles([
      ...detalles,
      {
        id_mue: null,
        nombre_mueble: nuevoNombre,
        tipo_mueble: nuevoTipo,
        dimensiones: nuevoDimensiones,
        material_principal: nuevoMaterial,
        color_acabado: nuevoColor,
        herrajes: nuevoHerrajes,
        img_referencia: nuevoImgRef,
        cantidad: nuevoCantidad,
        precio_unitario: nuevoPrecio,
        desc_personalizacion: nuevoDesc,
        esDelCatalogo: false,
      },
    ]);
    resetNuevoMueble();
    setShowAddModal(false);
  };

  const agregarDesdeCatalogo = (m: Mueble) => {
    if (detalles.find((d) => d.id_mue === m.id_mue)) return;
    setDetalles([
      ...detalles,
      {
        id_mue: m.id_mue,
        nombre_mueble: m.nom_mue,
        tipo_mueble: "",
        dimensiones: "",
        material_principal: "",
        color_acabado: "",
        herrajes: "",
        img_referencia: m.img_mue || "",
        cantidad: 1,
        precio_unitario: Number(m.precio_venta) || 0,
        desc_personalizacion: "",
        esDelCatalogo: true,
      },
    ]);
    setShowAddModal(false);
  };

  const removeDetalle = (idx: number) =>
    setDetalles(detalles.filter((_, i) => i !== idx));

  const updateDetalle = (idx: number, field: string, value: any) => {
    const updated = [...detalles];
    (updated[idx] as any)[field] = value;
    setDetalles(updated);
  };

  const calcSubtotal = (d: DetalleItem) =>
    (Number(d.cantidad) || 0) * (Number(d.precio_unitario) || 0);
  const subtotalProductos = detalles.reduce(
    (sum, d) => sum + calcSubtotal(d),
    0
  );
  const totalCotizacion = subtotalProductos - (Number(descuento) || 0);

  const costoTotal =
    (Number(costoMateriales) || 0) +
    (Number(costoManoObra) || 0) +
    (Number(costosIndirectos) || 0);
  const precioSugerido =
    costoTotal > 0 ? costoTotal * (1 + margenGanancia / 100) : totalCotizacion;

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedCliente && !!selectedEmpleado;
      case 2:
        return tipoProyecto !== "";
      case 3:
        return detalles.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedCliente || !selectedEmpleado || detalles.length === 0) return;
    setIsSubmitting(true);
    try {
      const payload: any = {
        cotizacion: {
          fec_cot: new Date().toISOString().split("T")[0],
          validez_dias: validezDias,
          descuento: Number(descuento) || 0,
          notas,
          id_cli: selectedCliente.id_cli,
          id_emp: selectedEmpleado.id_emp,
          presupuesto_cliente: presupuestoCliente || null,
          plazo_esperado: plazoEsperado || null,
          tiempo_entrega: tiempoEntrega || null,
          direccion_instalacion: direccionInstalacion || null,
          tipo_proyecto: tipoProyecto,
        },
        detalles: detalles.map((d) => ({
          id_mue: d.id_mue || null,
          cantidad: Number(d.cantidad) || 1,
          precio_unitario: Number(d.precio_unitario) || 0,
          desc_personalizacion: d.desc_personalizacion || null,
          nombre_mueble: d.nombre_mueble || null,
          tipo_mueble: d.tipo_mueble || null,
          dimensiones: d.dimensiones || null,
          material_principal: d.material_principal || null,
          color_acabado: d.color_acabado || null,
          img_referencia: d.img_referencia || null,
          herrajes: d.herrajes || null,
        })),
      };

      if (calcularCostos && costoTotal > 0) {
        payload.costos = {
          costo_materiales: Number(costoMateriales) || 0,
          costo_mano_obra: Number(costoManoObra) || 0,
          costos_indirectos: Number(costosIndirectos) || 0,
          margen_ganancia: Number(margenGanancia) || 0,
        };
      }

      const res = await fetch(`${API}/negocio/cotizacion-completa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Swal.fire({
        icon: "success",
        title: "¡Cotización Creada!",
        html: `<p>Código: <strong>${data.data.cotizacion.cod_cot}</strong></p>
               <p>Total: <strong>${totalCotizacion.toFixed(2)} Bs.</strong></p>
               <p>Muebles: <strong>${detalles.length}</strong></p>`,
        timer: 4000,
      });
      handleClose();
    } catch (e: any) {
      Swal.fire({ icon: "error", title: "Error", text: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  const filteredClientes = clientes.filter((c) =>
    `${c.nom_cli} ${c.ap_pat_cli} ${c.ci_cli}`
      .toLowerCase()
      .includes(searchCliente.toLowerCase())
  );
  const filteredCatalogo = catalogoMuebles.filter((m) =>
    `${m.nom_mue} ${m.cod_mue}`
      .toLowerCase()
      .includes(searchCatalogo.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <FileText className="w-6 h-6" />
            Nueva Cotización - Mueble Personalizado
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <StepIndicator currentStep={step} steps={steps} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Cliente y Empleado */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-indigo-600" /> Seleccionar
                  Cliente
                </h3>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchCliente}
                    onChange={(e) => setSearchCliente(e.target.value)}
                    placeholder="Buscar cliente..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto">
                  {filteredClientes.map((c) => (
                    <div
                      key={c.id_cli}
                      onClick={() => setSelectedCliente(c)}
                      className={`cursor-pointer rounded-xl border-2 p-3 transition-all flex items-center gap-3 ${
                        selectedCliente?.id_cli === c.id_cli
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                      }`}
                    >
                      <ProductImage
                        src={c.img_cli}
                        alt={c.nom_cli}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {c.nom_cli} {c.ap_pat_cli}
                        </p>
                        <p className="text-xs text-gray-500">CI: {c.ci_cli}</p>
                      </div>
                      {selectedCliente?.id_cli === c.id_cli && (
                        <Check className="w-5 h-5 text-indigo-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <UserCheck className="w-5 h-5 text-indigo-600" /> Empleado que
                  Atiende
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[150px] overflow-y-auto">
                  {empleados.map((e) => (
                    <div
                      key={e.id_emp}
                      onClick={() => setSelectedEmpleado(e)}
                      className={`cursor-pointer rounded-xl border-2 p-2 transition-all flex items-center gap-2 ${
                        selectedEmpleado?.id_emp === e.id_emp
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                      }`}
                    >
                      <ProductImage
                        src={e.img_emp}
                        alt={e.nom_emp}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium truncate">
                        {e.nom_emp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Proyecto */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Home className="w-5 h-5 text-indigo-600" /> Tipo de Proyecto
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TIPOS_PROYECTO.map((tipo) => {
                    const Icon = tipo.icon;
                    return (
                      <button
                        key={tipo.value}
                        onClick={() => setTipoProyecto(tipo.value)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                          tipoProyecto === tipo.value
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700"
                            : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                        }`}
                      >
                        <Icon className="w-8 h-8" />
                        <span className="font-medium">{tipo.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Presupuesto del Cliente
                    (Bs.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={presupuestoCliente}
                    onChange={(e) =>
                      setPresupuestoCliente(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    placeholder="Ej: 5000"
                    className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Plazo Esperado (días)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={plazoEsperado}
                    onChange={(e) =>
                      setPlazoEsperado(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    placeholder="Ej: 30"
                    className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1">
                    Tiempo de Entrega Estimado (días)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={tiempoEntrega}
                    onChange={(e) =>
                      setTiempoEntrega(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1">
                    Validez de Cotización (días)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={validezDias}
                    onChange={(e) =>
                      setValidezDias(Number(e.target.value) || 15)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1">
                  Dirección de Instalación
                </label>
                <input
                  type="text"
                  value={direccionInstalacion}
                  onChange={(e) => setDireccionInstalacion(e.target.value)}
                  placeholder="Dirección donde se instalará el mueble"
                  className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
            </div>
          )}

          {/* Step 3: Muebles */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Armchair className="w-5 h-5 text-indigo-600" /> Muebles a
                  Cotizar
                </h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" /> Agregar Mueble
                </button>
              </div>

              {detalles.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed">
                  <Armchair className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">
                    No hay muebles agregados
                  </p>
                  <p className="text-gray-400 text-sm">
                    Haga clic en "Agregar Mueble" para comenzar
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {detalles.map((d, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border"
                    >
                      <div className="flex items-start gap-4">
                        {d.img_referencia ? (
                          <ProductImage
                            src={d.img_referencia}
                            alt={d.nombre_mueble}
                            className="w-20 h-20 rounded-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                d.esDelCatalogo
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {d.esDelCatalogo
                                ? "Del catálogo"
                                : "Personalizado"}
                            </span>
                            {d.tipo_mueble && (
                              <span className="text-xs text-gray-500 capitalize">
                                {d.tipo_mueble}
                              </span>
                            )}
                          </div>
                          <p className="font-semibold">{d.nombre_mueble}</p>
                          {d.dimensiones && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Ruler className="w-3 h-3" /> {d.dimensiones}
                            </p>
                          )}
                          {d.material_principal && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Package className="w-3 h-3" />{" "}
                              {d.material_principal} - {d.color_acabado}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={d.cantidad}
                              onChange={(e) =>
                                updateDetalle(
                                  idx,
                                  "cantidad",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-16 px-2 py-1 rounded border text-center text-sm dark:bg-gray-700"
                            />
                            <span className="text-sm text-gray-500">×</span>
                            <input
                              type="number"
                              min="0"
                              value={d.precio_unitario}
                              onChange={(e) =>
                                updateDetalle(
                                  idx,
                                  "precio_unitario",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-24 px-2 py-1 rounded border text-right text-sm dark:bg-gray-700"
                            />
                            <span className="text-sm">Bs.</span>
                          </div>
                          <p className="text-lg font-bold text-indigo-600 mt-1">
                            {calcSubtotal(d).toFixed(2)} Bs.
                          </p>
                        </div>
                        <button
                          onClick={() => removeDetalle(idx)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 border-t text-lg">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-bold text-indigo-600">
                      {subtotalProductos.toFixed(2)} Bs.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Costos */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Descuento (Bs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={descuento}
                    onChange={(e) =>
                      setDescuento(parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Notas / Observaciones
                  </label>
                  <input
                    type="text"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Notas adicionales..."
                    className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={calcularCostos}
                    onChange={(e) => setCalcularCostos(e.target.checked)}
                    className="w-5 h-5 accent-indigo-500"
                  />
                  <label className="font-medium">
                    Calcular desglose de costos (opcional)
                  </label>
                </div>

                {calcularCostos && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm">Costo Materiales</label>
                        <input
                          type="number"
                          min="0"
                          value={costoMateriales}
                          onChange={(e) =>
                            setCostoMateriales(parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-sm">Mano de Obra</label>
                        <input
                          type="number"
                          min="0"
                          value={costoManoObra}
                          onChange={(e) =>
                            setCostoManoObra(parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-sm">Costos Indirectos</label>
                        <input
                          type="number"
                          min="0"
                          value={costosIndirectos}
                          onChange={(e) =>
                            setCostosIndirectos(parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-sm">
                          Margen de Ganancia (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={margenGanancia}
                          onChange={(e) =>
                            setMargenGanancia(parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Costo Total</p>
                        <p className="font-bold text-lg">
                          {costoTotal.toFixed(2)} Bs.
                        </p>
                        <p className="text-sm text-gray-500">Precio Sugerido</p>
                        <p className="font-bold text-lg text-indigo-600">
                          {precioSugerido.toFixed(2)} Bs.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Cotización:</span>
                  <span className="text-indigo-600">
                    {totalCotizacion.toFixed(2)} Bs.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmar */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" /> Resumen de
                Cotización
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">
                    {selectedCliente?.nom_cli} {selectedCliente?.ap_pat_cli}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-sm text-gray-500">Proyecto</p>
                  <p className="font-medium capitalize">{tipoProyecto}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500">Validez</p>
                  <p className="font-bold">{validezDias} días</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500">Entrega</p>
                  <p className="font-bold">{tiempoEntrega || "-"} días</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500">Muebles</p>
                  <p className="font-bold">{detalles.length}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl max-h-[150px] overflow-y-auto">
                {detalles.map((d, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-2 border-b last:border-0 text-sm"
                  >
                    <div>
                      <span className="font-medium">
                        {d.cantidad}x {d.nombre_mueble}
                      </span>
                      {d.dimensiones && (
                        <span className="text-gray-500 ml-2">
                          ({d.dimensiones})
                        </span>
                      )}
                    </div>
                    <span className="font-medium">
                      {calcSubtotal(d).toFixed(2)} Bs.
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl text-center">
                <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
                  {totalCotizacion.toFixed(2)} Bs.
                </p>
                <p className="text-sm text-indigo-600 mt-1">
                  Total de la cotización
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 rounded-xl font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            {step > 1 ? "Anterior" : "Cancelar"}
          </button>
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
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
              {isSubmitting ? "Creando..." : "Crear Cotización"}
            </button>
          )}
        </div>
      </div>

      {/* Modal para agregar mueble */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Agregar Mueble</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetNuevoMueble();
                }}
                className="text-white/80 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 border-b">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setModoAgregar("personalizado")}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${
                    modoAgregar === "personalizado"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Wrench className="w-8 h-8 text-purple-600" />
                  <span className="font-medium">Mueble Personalizado</span>
                  <span className="text-xs text-gray-500">
                    Describir desde cero
                  </span>
                </button>
                <button
                  onClick={() => setModoAgregar("catalogo")}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${
                    modoAgregar === "catalogo"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Image className="w-8 h-8 text-blue-600" />
                  <span className="font-medium">Del Catálogo</span>
                  <span className="text-xs text-gray-500">
                    Usar como referencia
                  </span>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {modoAgregar === "personalizado" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-1">
                        <Armchair className="w-4 h-4" /> Tipo de Mueble
                      </label>
                      <select
                        value={nuevoTipo}
                        onChange={(e) => setNuevoTipo(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                      >
                        {TIPOS_MUEBLE.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Nombre/Descripción *
                      </label>
                      <input
                        type="text"
                        value={nuevoNombre}
                        onChange={(e) => setNuevoNombre(e.target.value)}
                        placeholder="Ej: Ropero 3 puertas con espejo"
                        className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Ruler className="w-4 h-4" /> Dimensiones
                    </label>
                    <input
                      type="text"
                      value={nuevoDimensiones}
                      onChange={(e) => setNuevoDimensiones(e.target.value)}
                      placeholder="Ej: 2.40m (alto) × 1.80m (ancho) × 0.60m (profundidad)"
                      className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-1">
                        <Package className="w-4 h-4" /> Material Principal
                      </label>
                      <select
                        value={nuevoMaterial}
                        onChange={(e) => setNuevoMaterial(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                      >
                        {MATERIALES.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-1">
                        <Palette className="w-4 h-4" /> Color/Acabado
                      </label>
                      <select
                        value={nuevoColor}
                        onChange={(e) => setNuevoColor(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                      >
                        {COLORES_COMUNES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Wrench className="w-4 h-4" /> Herrajes y Accesorios
                    </label>
                    <input
                      type="text"
                      value={nuevoHerrajes}
                      onChange={(e) => setNuevoHerrajes(e.target.value)}
                      placeholder="Ej: Correderas telescópicas, bisagras soft-close, jaladores cromados"
                      className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Upload className="w-4 h-4" /> URL de Imagen de Referencia
                    </label>
                    <input
                      type="text"
                      value={nuevoImgRef}
                      onChange={(e) => setNuevoImgRef(e.target.value)}
                      placeholder="Pegar URL de imagen (Pinterest, WhatsApp, etc.)"
                      className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={nuevoCantidad}
                        onChange={(e) =>
                          setNuevoCantidad(parseInt(e.target.value) || 1)
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-1">
                        <DollarSign className="w-4 h-4" /> Precio Unitario (Bs.)
                        *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={nuevoPrecio}
                        onChange={(e) =>
                          setNuevoPrecio(parseFloat(e.target.value) || 0)
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Notas adicionales
                    </label>
                    <textarea
                      value={nuevoDesc}
                      onChange={(e) => setNuevoDesc(e.target.value)}
                      placeholder="Detalles adicionales del cliente..."
                      rows={2}
                      className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchCatalogo}
                      onChange={(e) => setSearchCatalogo(e.target.value)}
                      placeholder="Buscar en catálogo..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
                    {filteredCatalogo.map((m) => (
                      <button
                        key={m.id_mue}
                        onClick={() => agregarDesdeCatalogo(m)}
                        disabled={detalles.some((d) => d.id_mue === m.id_mue)}
                        className={`relative rounded-xl border overflow-hidden transition-all hover:shadow-lg text-left ${
                          detalles.some((d) => d.id_mue === m.id_mue)
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:border-blue-400"
                        }`}
                      >
                        <ProductImage
                          src={m.img_mue}
                          alt={m.nom_mue}
                          className="w-full h-24"
                        />
                        <div className="p-2 bg-white dark:bg-gray-800">
                          <p className="text-xs font-medium truncate">
                            {m.nom_mue}
                          </p>
                          <span className="text-xs text-blue-600 font-bold">
                            {m.precio_venta} Bs.
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {modoAgregar === "personalizado" && (
              <div className="border-t px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetNuevoMueble();
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarMueblePersonalizado}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Agregar Mueble
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
