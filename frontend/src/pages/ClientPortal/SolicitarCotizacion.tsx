import { useState, useEffect } from "react";
import {
  solicitarCotizacion,
  SolicitudCotizacion,
} from "../../services/clientePortalService";
import {
  FileText,
  Plus,
  Minus,
  Trash2,
  Send,
  Package,
  Search,
  X,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Home,
  Briefcase,
  Store,
  Building,
  Armchair,
  ChefHat,
  BedDouble,
  Monitor,
  BookOpen,
  Bath,
  Sofa,
  DollarSign,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Mueble {
  id_mue: number;
  nom_mue: string;
  img_mue?: string;
  precio_venta: number;
  desc_mue?: string;
  categoria?: { nom_cat: string };
}

interface ProductoSeleccionado {
  id: string; // unique key
  id_mue?: number;
  mueble?: Mueble;
  nombre: string;
  cantidad: number;
  personalizacion: string;
  tipo_mueble: string;
  dimensiones: string;
  material: string;
  color: string;
  precio_referencia: number;
  esPersonalizado: boolean;
}

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
  { value: "estante", label: "Estante", icon: BookOpen },
  { value: "baño", label: "Baño", icon: Bath },
  { value: "sala", label: "Sala", icon: Sofa },
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
const COLORES = [
  "Blanco",
  "Negro",
  "Roble Oscuro",
  "Roble Claro",
  "Nogal",
  "Cerezo",
  "Gris",
  "Wengue",
];

export default function SolicitarCotizacion() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [productosSeleccionados, setProductosSeleccionados] = useState<
    ProductoSeleccionado[]
  >([]);

  // Step 1: Proyecto
  const [tipoProyecto, setTipoProyecto] = useState("hogar");
  const [presupuesto, setPresupuesto] = useState("");
  const [plazo, setPlazo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");

  // Modal para agregar
  const [showAddModal, setShowAddModal] = useState(false);
  const [modoAgregar, setModoAgregar] = useState<"catalogo" | "personalizado">(
    "catalogo"
  );

  // Campos para mueble personalizado
  const [customNombre, setCustomNombre] = useState("");
  const [customTipo, setCustomTipo] = useState("ropero");
  const [customDimensiones, setCustomDimensiones] = useState("");
  const [customMaterial, setCustomMaterial] = useState("Melamina 18mm");
  const [customColor, setCustomColor] = useState("Blanco");
  const [customCantidad, setCustomCantidad] = useState(1);
  const [customNota, setCustomNota] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const steps = [
    { label: "Proyecto", icon: <Home className="w-4 h-4" /> },
    { label: "Muebles", icon: <Armchair className="w-4 h-4" /> },
    { label: "Confirmar", icon: <CheckCircle className="w-4 h-4" /> },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/mueble?per_page=100")
      .then((res) => {
        const data = res.data.data.filter((m: any) => m.est_mue === true);
        setMuebles(data);
      })
      .catch(console.error);
  }, []);

  const filteredMuebles = muebles.filter((m) =>
    m.nom_mue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFromCatalog = (mueble: Mueble) => {
    const exists = productosSeleccionados.find(
      (p) => p.id_mue === mueble.id_mue
    );
    if (exists) {
      setProductosSeleccionados(
        productosSeleccionados.map((p) =>
          p.id_mue === mueble.id_mue ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setProductosSeleccionados([
        ...productosSeleccionados,
        {
          id: `cat-${mueble.id_mue}`,
          id_mue: mueble.id_mue,
          mueble,
          nombre: mueble.nom_mue,
          cantidad: 1,
          personalizacion: "",
          tipo_mueble: "",
          dimensiones: "",
          material: "Melamina 18mm",
          color: "Blanco",
          precio_referencia: mueble.precio_venta,
          esPersonalizado: false,
        },
      ]);
    }
    setShowAddModal(false);
  };

  const addCustomProduct = () => {
    if (!customNombre.trim()) return;
    setProductosSeleccionados([
      ...productosSeleccionados,
      {
        id: `custom-${Date.now()}`,
        nombre: customNombre,
        cantidad: customCantidad,
        personalizacion: customNota,
        tipo_mueble: customTipo,
        dimensiones: customDimensiones,
        material: customMaterial,
        color: customColor,
        precio_referencia: 0, // Admin cotizará
        esPersonalizado: true,
      },
    ]);
    // Reset
    setCustomNombre("");
    setCustomTipo("ropero");
    setCustomDimensiones("");
    setCustomMaterial("Melamina 18mm");
    setCustomColor("Blanco");
    setCustomCantidad(1);
    setCustomNota("");
    setShowAddModal(false);
  };

  const updateProduct = (
    id: string,
    field: keyof ProductoSeleccionado,
    value: any
  ) => {
    setProductosSeleccionados(
      productosSeleccionados.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const removeProduct = (id: string) => {
    setProductosSeleccionados(
      productosSeleccionados.filter((p) => p.id !== id)
    );
  };

  const canGoNext = () => {
    if (step === 1) return tipoProyecto !== "";
    if (step === 2) return productosSeleccionados.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    if (productosSeleccionados.length === 0) {
      setError("Debe seleccionar al menos un producto");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data: SolicitudCotizacion = {
        tipo_proyecto: tipoProyecto,
        presupuesto_cliente: presupuesto ? Number(presupuesto) : undefined,
        plazo_esperado: plazo ? Number(plazo) : undefined,
        direccion_instalacion: direccion || undefined,
        notas: notas || undefined,
        productos: productosSeleccionados.map((p) => ({
          id_mue: p.id_mue || undefined, // undefined for custom items
          cantidad: p.cantidad,
          personalizacion:
            [
              p.esPersonalizado ? `[PERSONALIZADO] ${p.nombre}` : "",
              p.tipo_mueble ? `Tipo: ${p.tipo_mueble}` : "",
              p.dimensiones ? `Dimensiones: ${p.dimensiones}` : "",
              p.material ? `Material: ${p.material}` : "",
              p.color ? `Color: ${p.color}` : "",
              p.personalizacion,
            ]
              .filter(Boolean)
              .join(" | ") || undefined,
        })),
      };

      await solicitarCotizacion(data);
      setSuccess(true);
      setTimeout(() => navigate("/cotizaciones"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const totalEstimado = productosSeleccionados.reduce(
    (sum, p) => sum + (p.precio_referencia || 0) * p.cantidad,
    0
  );

  if (success) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#3a2f22] mb-2">
            ¡Solicitud Enviada!
          </h2>
          <p className="text-gray-500 mb-4">
            Tu solicitud ha sido recibida. Te contactaremos pronto.
          </p>
          <p className="text-sm text-gray-400">
            Redirigiendo a tus cotizaciones...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-[#3a2f22] flex items-center gap-3">
          <FileText className="w-6 h-6 text-[#a67c52]" />
          Solicitar Cotización
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Completa los pasos para solicitar tu cotización
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-6">
        {steps.map((s, idx) => (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  idx + 1 < step
                    ? "bg-green-500 text-white"
                    : idx + 1 === step
                    ? "bg-[#a67c52] text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx + 1 < step ? <CheckCircle className="w-5 h-5" /> : s.icon}
              </div>
              <span
                className={`mt-1 text-xs font-medium ${
                  idx + 1 === step ? "text-[#a67c52]" : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-12 h-1 mx-2 rounded ${
                  idx + 1 < step ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Proyecto */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-[#3a2f22] mb-3 text-sm">
              Tipo de Proyecto
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {TIPOS_PROYECTO.map((tipo) => {
                const Icon = tipo.icon;
                return (
                  <button
                    key={tipo.value}
                    onClick={() => setTipoProyecto(tipo.value)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      tipoProyecto === tipo.value
                        ? "border-[#a67c52] bg-[#f3e7d7] text-[#7c5e3c]"
                        : "border-gray-200 hover:border-[#a67c52]/50"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{tipo.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Presupuesto Estimado (Bs.)
              </label>
              <input
                type="number"
                value={presupuesto}
                onChange={(e) => setPresupuesto(e.target.value)}
                placeholder="Ej: 5000"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#a67c52] outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Plazo Esperado (días)
              </label>
              <input
                type="number"
                value={plazo}
                onChange={(e) => setPlazo(e.target.value)}
                placeholder="Ej: 30"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#a67c52] outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Dirección de Instalación
            </label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dirección donde se instalará el mueble"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#a67c52] outline-none text-sm"
            />
          </div>
        </div>
      )}
      {/* Step 2: Muebles */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Add Button */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setModoAgregar("catalogo");
                setShowAddModal(true);
              }}
              className="flex-1 py-2.5 bg-[#a67c52] text-white rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-[#8b6914] transition"
            >
              <Package className="w-4 h-4" />
              Del Catálogo
            </button>
            <button
              onClick={() => {
                setModoAgregar("personalizado");
                setShowAddModal(true);
              }}
              className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-purple-700 transition"
            >
              <Sparkles className="w-4 h-4" />
              Personalizado
            </button>
          </div>

          {/* Selected Products */}
          {productosSeleccionados.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <Armchair className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">
                No hay muebles seleccionados
              </p>
              <p className="text-gray-400 text-xs">
                Agrega productos del catálogo o crea uno personalizado
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {productosSeleccionados.map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                >
                  <div className="flex gap-3">
                    {p.mueble?.img_mue ? (
                      <img
                        src={p.mueble.img_mue.replace("public", "")}
                        alt={p.nombre}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                          p.esPersonalizado ? "bg-purple-100" : "bg-gray-200"
                        }`}
                      >
                        {p.esPersonalizado ? (
                          <Sparkles className="w-6 h-6 text-purple-500" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {p.esPersonalizado && (
                              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded font-medium">
                                PERSONALIZADO
                              </span>
                            )}
                            <p className="font-medium text-[#3a2f22] text-sm">
                              {p.nombre}
                            </p>
                          </div>
                          {p.precio_referencia > 0 ? (
                            <p className="text-xs text-[#a67c52] font-bold">
                              Bs. {Number(p.precio_referencia).toLocaleString()}{" "}
                              c/u
                            </p>
                          ) : (
                            <p className="text-xs text-gray-400 italic">
                              Precio por cotizar
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeProduct(p.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-gray-200 rounded bg-white">
                          <button
                            onClick={() =>
                              updateProduct(
                                p.id,
                                "cantidad",
                                Math.max(1, p.cantidad - 1)
                              )
                            }
                            className="p-1"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-medium">
                            {p.cantidad}
                          </span>
                          <button
                            onClick={() =>
                              updateProduct(p.id, "cantidad", p.cantidad + 1)
                            }
                            className="p-1"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {p.precio_referencia > 0 && (
                          <span className="text-xs text-gray-500">
                            = Bs.{" "}
                            {(
                              p.precio_referencia * p.cantidad
                            ).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  {(p.tipo_mueble || p.dimensiones || p.material) && (
                    <div className="mt-2 pt-2 border-t border-gray-200 flex flex-wrap gap-1">
                      {p.tipo_mueble && (
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded">
                          {p.tipo_mueble}
                        </span>
                      )}
                      {p.dimensiones && (
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded">
                          {p.dimensiones}
                        </span>
                      )}
                      {p.material && (
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded">
                          {p.material}
                        </span>
                      )}
                      {p.color && (
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded">
                          {p.color}
                        </span>
                      )}
                    </div>
                  )}
                  {p.personalizacion && (
                    <p className="mt-1 text-xs text-gray-500 italic">
                      {p.personalizacion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirmar */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-[#3a2f22] mb-3 text-sm">
              Resumen de la Solicitud
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-lg p-2">
                <p className="text-[10px] text-gray-500">Tipo de Proyecto</p>
                <p className="text-sm font-medium capitalize">{tipoProyecto}</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-[10px] text-gray-500">Productos</p>
                <p className="text-sm font-medium">
                  {productosSeleccionados.length} item(s)
                </p>
              </div>
              {presupuesto && (
                <div className="bg-white rounded-lg p-2">
                  <p className="text-[10px] text-gray-500">Presupuesto</p>
                  <p className="text-sm font-medium">
                    Bs. {Number(presupuesto).toLocaleString()}
                  </p>
                </div>
              )}
              {plazo && (
                <div className="bg-white rounded-lg p-2">
                  <p className="text-[10px] text-gray-500">Plazo</p>
                  <p className="text-sm font-medium">{plazo} días</p>
                </div>
              )}
            </div>

            <h4 className="text-xs font-medium text-gray-700 mb-2">
              Productos
            </h4>
            <div className="space-y-2">
              {productosSeleccionados.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-white rounded-lg p-2"
                >
                  <div className="flex items-center gap-2">
                    {p.esPersonalizado && (
                      <Sparkles className="w-3 h-3 text-purple-500" />
                    )}
                    <span className="text-xs font-medium">{p.cantidad}x</span>
                    <span className="text-xs">{p.nombre}</span>
                  </div>
                  {p.precio_referencia > 0 ? (
                    <span className="text-xs font-bold text-[#a67c52]">
                      Bs. {(p.precio_referencia * p.cantidad).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      Por cotizar
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Notas adicionales
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Requerimientos especiales, observaciones..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#a67c52] outline-none text-sm resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Navigation & Total */}
      <div className="mt-6 bg-[#a67c52] rounded-xl p-4 text-white">
        {(totalEstimado > 0 || productosSeleccionados.length > 0) && (
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm opacity-80">
              {productosSeleccionados.some((p) => p.esPersonalizado) &&
              totalEstimado === 0
                ? "Productos:"
                : "Total Estimado:"}
            </span>
            <div className="text-right">
              {totalEstimado > 0 ? (
                <span className="text-xl font-bold">
                  Bs. {totalEstimado.toLocaleString()}
                </span>
              ) : (
                <span className="text-lg font-medium opacity-80">
                  {productosSeleccionados.length} item(s)
                </span>
              )}
              {productosSeleccionados.some((p) => p.esPersonalizado) &&
                totalEstimado > 0 && (
                  <p className="text-xs opacity-60">+ items por cotizar</p>
                )}
            </div>
          </div>
        )}
        <p className="text-xs opacity-60 mb-4">
          * El precio final será confirmado por nuestro equipo
        </p>

        <div className="flex gap-2">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-2.5 bg-white/20 rounded-lg font-medium flex items-center justify-center gap-1 hover:bg-white/30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => canGoNext() && setStep(step + 1)}
              disabled={!canGoNext()}
              className="flex-1 py-2.5 bg-[#3a2f22] rounded-lg font-medium flex items-center justify-center gap-1 hover:bg-[#2a1f12] disabled:opacity-50 transition"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || productosSeleccionados.length === 0}
              className="flex-1 py-2.5 bg-[#3a2f22] rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#2a1f12] disabled:opacity-50 transition"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Solicitud
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div
              className={`p-4 flex items-center justify-between ${
                modoAgregar === "catalogo" ? "bg-[#a67c52]" : "bg-purple-600"
              } text-white`}
            >
              <div className="flex items-center gap-2">
                {modoAgregar === "catalogo" ? (
                  <Package className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                <h3 className="font-bold">
                  {modoAgregar === "catalogo"
                    ? "Agregar del Catálogo"
                    : "Mueble Personalizado"}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-white/20 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setModoAgregar("catalogo")}
                className={`flex-1 py-2 text-sm font-medium ${
                  modoAgregar === "catalogo"
                    ? "text-[#a67c52] border-b-2 border-[#a67c52]"
                    : "text-gray-500"
                }`}
              >
                <Package className="w-4 h-4 inline mr-1" /> Catálogo
              </button>
              <button
                onClick={() => setModoAgregar("personalizado")}
                className={`flex-1 py-2 text-sm font-medium ${
                  modoAgregar === "personalizado"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500"
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-1" /> Personalizado
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {modoAgregar === "catalogo" ? (
                <>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar producto..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#a67c52] outline-none text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredMuebles.slice(0, 20).map((m) => (
                      <button
                        key={m.id_mue}
                        onClick={() => addFromCatalog(m)}
                        className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-[#a67c52] hover:bg-[#f3e7d7] transition text-left"
                      >
                        {m.img_mue ? (
                          <img
                            src={m.img_mue.replace("public", "")}
                            alt={m.nom_mue}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#3a2f22] line-clamp-1">
                            {m.nom_mue}
                          </p>
                          <p className="text-xs text-[#a67c52] font-bold">
                            Bs. {Number(m.precio_venta).toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Nombre del Mueble *
                    </label>
                    <input
                      type="text"
                      value={customNombre}
                      onChange={(e) => setCustomNombre(e.target.value)}
                      placeholder="Ej: Ropero empotrado de 3 puertas"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Tipo de Mueble
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {TIPOS_MUEBLE.map((t) => {
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.value}
                            onClick={() => setCustomTipo(t.value)}
                            className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition text-center ${
                              customTipo === t.value
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-gray-200 hover:border-purple-300"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-[10px]">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Dimensiones
                    </label>
                    <input
                      type="text"
                      value={customDimensiones}
                      onChange={(e) => setCustomDimensiones(e.target.value)}
                      placeholder="Ej: 2.50m x 0.60m x 2.40m alto"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">
                        Material
                      </label>
                      <select
                        value={customMaterial}
                        onChange={(e) => setCustomMaterial(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                      >
                        {MATERIALES.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">
                        Color
                      </label>
                      <select
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                      >
                        {COLORES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={customCantidad}
                      onChange={(e) =>
                        setCustomCantidad(Number(e.target.value) || 1)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Notas adicionales
                    </label>
                    <textarea
                      value={customNota}
                      onChange={(e) => setCustomNota(e.target.value)}
                      placeholder="Detalles adicionales: herrajes, cajones, espejos, iluminación..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 outline-none text-sm resize-none"
                    />
                  </div>

                  <button
                    onClick={addCustomProduct}
                    disabled={!customNombre.trim()}
                    className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Mueble Personalizado
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
