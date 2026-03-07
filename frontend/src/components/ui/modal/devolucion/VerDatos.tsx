import React from "react";
import { EyeIcon } from "../../../../icons";
import {
  Calendar,
  FileText,
  DollarSign,
  CircleDot,
  ShoppingCart,
  User,
} from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface Devolucion {
  id_dev: number;
  fec_dev: string;
  motivo_dev: string;
  total_dev: number;
  est_dev: string;
  id_ven: number;
  id_emp: number;
  venta?: {
    fec_ven: string;
  };
  empleado?: {
    nom_emp: string;
    ap_pat_emp: string;
    ap_mat_emp: string;
  };
}

interface ModalVerDevolucionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  devolucionSeleccionado: Devolucion | null;
}

const ModalVerDevolucion: React.FC<ModalVerDevolucionProps> = ({
  showModal,
  setShowModal,
  devolucionSeleccionado,
}) => {
  if (!showModal || !devolucionSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles de la Devolución"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Fecha de Devolución"
            value={new Date(
              devolucionSeleccionado.fec_dev
            ).toLocaleDateString()}
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Motivo"
            value={devolucionSeleccionado.motivo_dev}
            icon={<FileText className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Total"
            value={`Bs. ${devolucionSeleccionado.total_dev}`}
            icon={<DollarSign className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Estado"
            value={devolucionSeleccionado.est_dev}
            icon={<CircleDot className="w-5 h-5 text-red-600" />}
          />
          <DetailItem
            label="Fecha de Venta"
            value={
              devolucionSeleccionado.venta?.fec_ven
                ? new Date(
                    devolucionSeleccionado.venta.fec_ven
                  ).toLocaleDateString()
                : "Sin fecha"
            }
            icon={<ShoppingCart className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Empleado"
            value={
              devolucionSeleccionado.empleado
                ? `${devolucionSeleccionado.empleado.nom_emp} ${devolucionSeleccionado.empleado.ap_pat_emp} ${devolucionSeleccionado.empleado.ap_mat_emp}`
                : "Sin empleado"
            }
            icon={<User className="w-5 h-5 text-orange-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerDevolucion;
