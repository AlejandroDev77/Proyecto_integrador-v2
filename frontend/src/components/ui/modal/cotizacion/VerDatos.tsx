import React from "react";
import { EyeIcon } from "../../../../icons";
import {
  Calendar,
  DollarSign,
  Percent,
  FileText,
  User,
  Clock,
  CircleDot,
} from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface Cotizacion {
  id_cot: number;
  fec_cot: string;
  est_cot: string;
  validez_dias: number;
  total_cot: number;
  descuento: number;
  notas: string;
  id_cli: number;
  cliente?: {
    nom_cli: string;
    ap_pat_cli: string;
    ap_mat_cli: string;
  };
  id_emp: number;
  empleado?: {
    nom_emp: string;
    ap_pat_emp: string;
    ap_mat_emp: string;
  };
}

interface ModalVerCotizacionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  cotizacionSeleccionada: Cotizacion | null;
}

const ModalVerCotizacion: React.FC<ModalVerCotizacionProps> = ({
  showModal,
  setShowModal,
  cotizacionSeleccionada,
}) => {
  if (!showModal || !cotizacionSeleccionada) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles de la Cotización"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Fecha"
            value={new Date(
              cotizacionSeleccionada.fec_cot
            ).toLocaleDateString()}
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Estado"
            value={cotizacionSeleccionada.est_cot}
            icon={<CircleDot className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Validez (días)"
            value={String(cotizacionSeleccionada.validez_dias)}
            icon={<Clock className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Total"
            value={`Bs. ${cotizacionSeleccionada.total_cot}`}
            icon={<DollarSign className="w-5 h-5 text-red-600" />}
          />
          <DetailItem
            label="Descuento"
            value={`Bs. ${cotizacionSeleccionada.descuento}`}
            icon={<Percent className="w-5 h-5 text-orange-600" />}
          />
          <DetailItem
            label="Notas"
            value={cotizacionSeleccionada.notas || "Sin notas"}
            icon={<FileText className="w-5 h-5 text-purple-600" />}
          />
          {cotizacionSeleccionada.cliente && (
            <DetailItem
              label="Cliente"
              value={`${cotizacionSeleccionada.cliente.nom_cli} ${cotizacionSeleccionada.cliente.ap_pat_cli} ${cotizacionSeleccionada.cliente.ap_mat_cli}`}
              icon={<User className="w-5 h-5 text-teal-600" />}
            />
          )}
          {cotizacionSeleccionada.empleado && (
            <DetailItem
              label="Empleado"
              value={`${cotizacionSeleccionada.empleado.nom_emp} ${cotizacionSeleccionada.empleado.ap_pat_emp} ${cotizacionSeleccionada.empleado.ap_mat_emp}`}
              icon={<User className="w-5 h-5 text-indigo-600" />}
            />
          )}
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerCotizacion;
