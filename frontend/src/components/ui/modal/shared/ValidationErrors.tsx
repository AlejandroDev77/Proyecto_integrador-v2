import { AlertCircle, XCircle } from "lucide-react";

interface ValidationError {
  [field: string]: string[];
}

interface Props {
  errors: ValidationError | null;
  generalError?: string | null;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Componente reutilizable para mostrar errores de validación del backend
 * Muestra los errores de cada campo de forma clara y legible
 */
export default function ValidationErrors({
  errors,
  generalError,
  onDismiss,
  className = "",
}: Props) {
  if (!errors && !generalError) return null;

  // Mapeo de nombres de campos en inglés/técnico a español
  const fieldLabels: { [key: string]: string } = {
    // Campos comunes
    cantidad: "Cantidad",
    precio_unitario: "Precio Unitario",
    subtotal: "Subtotal",
    descuento_item: "Descuento por Ítem",
    descuento: "Descuento",
    total: "Total",
    fecha: "Fecha",
    estado: "Estado",
    notas: "Notas",
    motivo: "Motivo",

    // Usuarios
    nom_usu: "Nombre de Usuario",
    email_usu: "Email",
    pas_usu: "Contraseña",
    est_usu: "Estado del Usuario",
    id_rol: "Rol",

    // Clientes
    nom_cli: "Nombre del Cliente",
    ap_pat_cli: "Apellido Paterno",
    ap_mat_cli: "Apellido Materno",
    cel_cli: "Celular",
    dir_cli: "Dirección",
    ci_cli: "Carnet de Identidad",

    // Empleados
    nom_emp: "Nombre del Empleado",
    ap_pat_emp: "Apellido Paterno",
    ap_mat_emp: "Apellido Materno",
    cel_emp: "Celular",
    car_emp: "Cargo",
    ci_emp: "Carnet de Identidad",

    // Muebles
    nom_mue: "Nombre del Mueble",
    desc_mue: "Descripción",
    precio_venta: "Precio de Venta",
    precio_costo: "Precio de Costo",
    stock: "Stock",
    stock_min: "Stock Mínimo",
    id_cat: "Categoría",
    id_mue: "Mueble",

    // Materiales
    nom_mat: "Nombre del Material",
    desc_mat: "Descripción",
    stock_mat: "Stock",
    costo_mat: "Costo",
    unidad_medida: "Unidad de Medida",
    id_mat: "Material",

    // Ventas
    fec_ven: "Fecha de Venta",
    est_ven: "Estado de Venta",
    total_ven: "Total de Venta",
    id_ven: "Venta",
    id_cli: "Cliente",
    id_emp: "Empleado",

    // Cotizaciones
    fec_cot: "Fecha de Cotización",
    est_cot: "Estado de Cotización",
    total_cot: "Total de Cotización",
    validez_dias: "Días de Validez",
    id_cot: "Cotización",

    // Compras
    fec_comp: "Fecha de Compra",
    est_comp: "Estado de Compra",
    total_comp: "Total de Compra",
    id_comp: "Compra",
    id_prov: "Proveedor",

    // Devoluciones
    fec_dev: "Fecha de Devolución",
    est_dev: "Estado de Devolución",
    total_dev: "Total de Devolución",
    motivo_dev: "Motivo de Devolución",
    id_dev: "Devolución",

    // Producción
    fec_ini: "Fecha de Inicio",
    fec_fin: "Fecha de Fin",
    fec_fin_estimada: "Fecha Estimada de Fin",
    est_pro: "Estado de Producción",
    prioridad: "Prioridad",
    id_pro: "Producción",
    est_det_pro: "Estado del Detalle",

    // Pagos
    monto: "Monto",
    fec_pag: "Fecha de Pago",
    metodo_pag: "Método de Pago",
    referencia_pag: "Referencia de Pago",

    // Proveedores
    nom_prov: "Nombre del Proveedor",
    contacto_prov: "Contacto",
    tel_prov: "Teléfono",
    email_prov: "Email",
    nit_prov: "NIT",

    // Diseños
    nom_dis: "Nombre del Diseño",
    desc_dis: "Descripción",
    archivo_3d: "Archivo 3D",
    img_dis: "Imagen del Diseño",
  };

  // Función para obtener el label legible de un campo
  const getFieldLabel = (field: string): string => {
    return (
      fieldLabels[field] ||
      field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  // Mapeo de mensajes de error comunes
  const translateError = (error: string): string => {
    const translations: { [key: string]: string } = {
      "The field is required.": "Este campo es obligatorio.",
      required: "Este campo es obligatorio.",
      "must be a number": "Debe ser un número.",
      "must be an integer": "Debe ser un número entero.",
      "must be at least": "El valor mínimo es",
      "must not be greater than": "El valor máximo es",
      "must be a valid email": "Debe ser un email válido.",
      "has already been taken": "Este valor ya está en uso.",
      "must be a date": "Debe ser una fecha válida.",
      "must be a string": "Debe ser texto.",
      exists: "El registro seleccionado no existe.",
      "min:": "El valor es demasiado pequeño.",
      "max:": "El valor es demasiado grande.",
    };

    // Buscar traducción parcial
    for (const [key, value] of Object.entries(translations)) {
      if (error.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return error;
  };

  const errorCount = errors ? Object.keys(errors).length : 0;

  return (
    <div
      className={`rounded-xl border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">
              {generalError
                ? "Error"
                : `Se encontraron ${errorCount} error${
                    errorCount !== 1 ? "es" : ""
                  } de validación`}
            </h4>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-800/30 rounded-lg transition-colors"
              >
                <XCircle className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>

          {generalError && (
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {generalError}
            </p>
          )}

          {errors && Object.keys(errors).length > 0 && (
            <ul className="mt-2 space-y-1">
              {Object.entries(errors).map(([field, messages]) => (
                <li key={field} className="text-sm">
                  <span className="font-medium text-red-700 dark:text-red-300">
                    {getFieldLabel(field)}:
                  </span>{" "}
                  <span className="text-red-600 dark:text-red-400">
                    {messages.map(translateError).join(", ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Componente inline para mostrar error de un campo específico
 */
export function FieldError({ error }: { error?: string }) {
  if (!error) return null;

  return (
    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" />
      {error}
    </p>
  );
}

/**
 * Hook para parsear errores de respuesta de API
 */
export function parseApiErrors(response: any): {
  fieldErrors: ValidationError | null;
  generalError: string | null;
} {
  // Si es un error de validación de Laravel (422)
  if (response?.errors && typeof response.errors === "object") {
    return {
      fieldErrors: response.errors,
      generalError: response.message || null,
    };
  }

  // Si es un error general
  if (response?.message) {
    return {
      fieldErrors: null,
      generalError: response.message,
    };
  }

  // Si es un error de stock insuficiente u otro error específico
  if (response?.error) {
    const errorMessages: { [key: string]: string } = {
      stock_insuficiente: "Stock insuficiente para completar esta operación.",
      materiales_insuficientes:
        "No hay materiales suficientes para la producción.",
      ya_completado: "Esta operación ya fue completada anteriormente.",
      no_reversible: "No se puede revertir esta operación.",
    };

    return {
      fieldErrors: null,
      generalError:
        errorMessages[response.error] || response.message || response.error,
    };
  }

  return {
    fieldErrors: null,
    generalError: "Ocurrió un error inesperado. Por favor, intente nuevamente.",
  };
}
