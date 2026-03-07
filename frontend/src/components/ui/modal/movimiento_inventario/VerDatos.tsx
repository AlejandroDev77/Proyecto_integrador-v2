import React from "react";
import { EyeIcon } from "../../../../icons";
import {
  Package,
  Calendar,
  Hash,
  User,
  FileText,
  ArrowUp,
  ArrowDown,
  Armchair,
  Tag,
} from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface MovimientoInventario {
  id_mov: number;
  cod_mov?: string;
  tipo_mov: string;
  fecha_mov: string;
  cantidad: number;
  stock_anterior: number;
  stock_posterior: number;
  motivo: string;
  id_mat: number;
  material?: { nom_mat: string };
  id_mue: number;
  mueble?: { nom_mue: string };
  id_ven: number;
  venta?: { fec_ven: string };
  id_pro: number;
  produccion?: { fec_ini: string; fec_fin: string };
  id_comp: number;
  compramaterial?: { fec_comp: string };
  id_dev: number;
  devolucion?: { fec_dev: string };
  id_emp: number;
  empleado?: { nom_emp: string; ap_pat_emp: string; ap_mat_emp: string };
}

interface ModalVerMovimientoInventarioProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  movimientoSeleccionado: MovimientoInventario | null;
}

const ModalVerMovimientoInventario: React.FC<
  ModalVerMovimientoInventarioProps
> = ({ showModal, setShowModal, movimientoSeleccionado }) => {
  if (!showModal || !movimientoSeleccionado) return null;

  const getTipoBadge = (tipo: string) => {
    const baseClass = "px-2 py-1 rounded text-sm font-semibold";
    switch (tipo) {
      case "Entrada":
        return (
          <span
            className={`${baseClass} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`}
          >
            {tipo}
          </span>
        );
      case "Salida":
        return (
          <span
            className={`${baseClass} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`}
          >
            {tipo}
          </span>
        );
      default:
        return (
          <span
            className={`${baseClass} bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300`}
          >
            {tipo}
          </span>
        );
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Sin fecha";
    return new Date(dateString).toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles del Movimiento de Inventario"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Código"
            value={movimientoSeleccionado.cod_mov || "Sin código"}
            icon={<Tag className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Tipo"
            value={getTipoBadge(movimientoSeleccionado.tipo_mov)}
            icon={<Package className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Fecha"
            value={formatDate(movimientoSeleccionado.fecha_mov)}
            icon={<Calendar className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Cantidad"
            value={String(movimientoSeleccionado.cantidad)}
            icon={<Hash className="w-5 h-5 text-orange-600" />}
          />
          <DetailItem
            label="Stock Anterior"
            value={String(movimientoSeleccionado.stock_anterior)}
            icon={<ArrowDown className="w-5 h-5 text-red-600" />}
          />
          <DetailItem
            label="Stock Posterior"
            value={String(movimientoSeleccionado.stock_posterior)}
            icon={<ArrowUp className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Motivo"
            value={movimientoSeleccionado.motivo || "Sin motivo"}
            icon={<FileText className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Material"
            value={movimientoSeleccionado.material?.nom_mat || "No aplica"}
            icon={<Package className="w-5 h-5 text-teal-600" />}
          />
          <DetailItem
            label="Mueble"
            value={movimientoSeleccionado.mueble?.nom_mue || "No aplica"}
            icon={<Armchair className="w-5 h-5 text-indigo-600" />}
          />
          <DetailItem
            label="Empleado"
            value={
              movimientoSeleccionado.empleado
                ? `${movimientoSeleccionado.empleado.nom_emp} ${movimientoSeleccionado.empleado.ap_pat_emp}`
                : "No asignado"
            }
            icon={<User className="w-5 h-5 text-pink-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerMovimientoInventario;
