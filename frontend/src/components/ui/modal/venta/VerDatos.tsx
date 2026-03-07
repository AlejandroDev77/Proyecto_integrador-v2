import React from "react";
import { EyeIcon } from "../../../../icons";
import {
  Calendar,
  DollarSign,
  Percent,
  FileText,
  User,
  UserCheck,
  CircleDot,
} from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";
import { Venta } from "../../../../types/venta";

interface ModalVerVentaProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  ventaSeleccionada: Venta | null;
}

const ModalVerVenta: React.FC<ModalVerVentaProps> = ({
  showModal,
  setShowModal,
  ventaSeleccionada,
}) => {
  if (!showModal || !ventaSeleccionada) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles de la Venta"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Fecha"
            value={new Date(ventaSeleccionada.fec_ven).toLocaleDateString()}
            icon={<Calendar className="w-5 h-5 text-orange-600" />}
          />
          <DetailItem
            label="Total"
            value={`Bs. ${Number(ventaSeleccionada.total_ven).toFixed(2)}`}
            icon={<DollarSign className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Descuento"
            value={`Bs. ${Number(ventaSeleccionada.descuento).toFixed(2)}`}
            icon={<Percent className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Notas"
            value={ventaSeleccionada.notas || "Sin notas"}
            icon={<FileText className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Cliente"
            value={`${ventaSeleccionada.cliente?.nom_cli || ""} ${
              ventaSeleccionada.cliente?.ap_pat_cli || ""
            } ${ventaSeleccionada.cliente?.ap_mat_cli || ""}`}
            icon={<User className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="C.I. Cliente"
            value={ventaSeleccionada.cliente?.ci_cli || "Sin C.I."}
            icon={<UserCheck className="w-5 h-5 text-teal-600" />}
          />
          <DetailItem
            label="Empleado"
            value={ventaSeleccionada.empleado?.nom_emp || "Sin empleado"}
            icon={<User className="w-5 h-5 text-indigo-600" />}
          />
          <DetailItem
            label="Estado"
            value={ventaSeleccionada.est_ven}
            icon={<CircleDot className="w-5 h-5 text-red-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerVenta;
