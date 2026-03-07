import React from "react";
import { EyeIcon } from "../../../../icons";
import {
  Calendar,
  FileText,
  User,
  AlertCircle,
  CircleDot,
  ShoppingCart,
} from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface Produccion {
  id_pro: number;
  fec_ini: string;
  fec_fin: string;
  fec_fin_estimada: string;
  est_pro: string;
  prioridad: string;
  notas: string;
  venta?: {
    fec_ven: string;
    est_ven: string;
  };
  empleado?: {
    nom_emp: string;
    ap_pat_emp: string;
    ap_mat_emp: string;
  };
  cotizacion?: {
    fec_cot: string;
    est_cot: string;
  };
}

interface ModalVerProduccionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  produccionSeleccionado: Produccion | null;
}

const ModalVerProduccion: React.FC<ModalVerProduccionProps> = ({
  showModal,
  setShowModal,
  produccionSeleccionado,
}) => {
  if (!showModal || !produccionSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles de la Producción"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Fecha Inicio"
            value={new Date(produccionSeleccionado.fec_ini).toLocaleDateString(
              "es-ES"
            )}
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Fecha Fin"
            value={new Date(produccionSeleccionado.fec_fin).toLocaleDateString(
              "es-ES"
            )}
            icon={<Calendar className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Fecha Estimada"
            value={new Date(
              produccionSeleccionado.fec_fin_estimada
            ).toLocaleDateString("es-ES")}
            icon={<Calendar className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Estado"
            value={produccionSeleccionado.est_pro}
            icon={<CircleDot className="w-5 h-5 text-red-600" />}
          />
          <DetailItem
            label="Prioridad"
            value={produccionSeleccionado.prioridad}
            icon={<AlertCircle className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Notas"
            value={produccionSeleccionado.notas || "Sin notas"}
            icon={<FileText className="w-5 h-5 text-orange-600" />}
          />
          <DetailItem
            label="Empleado"
            value={
              produccionSeleccionado.empleado
                ? `${produccionSeleccionado.empleado.nom_emp} ${produccionSeleccionado.empleado.ap_pat_emp} ${produccionSeleccionado.empleado.ap_mat_emp}`
                : "Sin empleado"
            }
            icon={<User className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Fecha Venta"
            value={
              produccionSeleccionado.venta?.fec_ven
                ? new Date(
                    produccionSeleccionado.venta.fec_ven
                  ).toLocaleDateString("es-ES")
                : "Sin fecha"
            }
            icon={<ShoppingCart className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Estado Venta"
            value={produccionSeleccionado.venta?.est_ven || "Sin estado"}
            icon={<CircleDot className="w-5 h-5 text-red-600" />}
          />
          <DetailItem
            label="Fecha Cotización"
            value={
              produccionSeleccionado.cotizacion?.fec_cot
                ? new Date(
                    produccionSeleccionado.cotizacion.fec_cot
                  ).toLocaleDateString("es-ES")
                : "Sin fecha"
            }
            icon={<Calendar className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Estado Cotización"
            value={produccionSeleccionado.cotizacion?.est_cot || "Sin estado"}
            icon={<CircleDot className="w-5 h-5 text-purple-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerProduccion;
