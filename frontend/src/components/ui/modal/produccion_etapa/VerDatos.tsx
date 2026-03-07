import React from "react";
import { EyeIcon } from "../../../../icons";
import {
  Calendar,
  CircleDot,
  FileText,
  User,
  Tag,
  Factory,
} from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface ProduccionEtapa {
  id_pro_eta: number;
  fec_ini: string;
  fec_fin: string;
  est_eta: string;
  notas: string;
  empleado?: {
    nom_emp: string;
    ap_pat_emp: string;
    ap_mat_emp: string;
  };
  produccion?: {
    fec_ini: string;
    fec_fin: string;
  };
  etapa?: {
    nom_eta: string;
  };
}

interface ModalVerProduccionEtapaProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  produccionetapaSeleccionado: ProduccionEtapa | null;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Sin fecha";
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ModalVerProduccionEtapa: React.FC<ModalVerProduccionEtapaProps> = ({
  showModal,
  setShowModal,
  produccionetapaSeleccionado,
}) => {
  if (!showModal || !produccionetapaSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles de la Producción Etapa"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Fecha Inicio"
            value={formatDate(produccionetapaSeleccionado.fec_ini)}
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Fecha Fin"
            value={formatDate(produccionetapaSeleccionado.fec_fin)}
            icon={<Calendar className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Estado"
            value={produccionetapaSeleccionado.est_eta || "Sin estado"}
            icon={<CircleDot className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Notas"
            value={produccionetapaSeleccionado.notas || "Sin notas"}
            icon={<FileText className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Empleado"
            value={
              produccionetapaSeleccionado.empleado
                ? `${produccionetapaSeleccionado.empleado.nom_emp} ${produccionetapaSeleccionado.empleado.ap_pat_emp} ${produccionetapaSeleccionado.empleado.ap_mat_emp}`
                : "Sin empleado"
            }
            icon={<User className="w-5 h-5 text-orange-600" />}
          />
          <DetailItem
            label="Nombre Etapa"
            value={produccionetapaSeleccionado.etapa?.nom_eta || "Sin etapa"}
            icon={<Tag className="w-5 h-5 text-teal-600" />}
          />
          <DetailItem
            label="Producción Inicio"
            value={formatDate(produccionetapaSeleccionado.produccion?.fec_ini)}
            icon={<Factory className="w-5 h-5 text-indigo-600" />}
          />
          <DetailItem
            label="Producción Fin"
            value={formatDate(produccionetapaSeleccionado.produccion?.fec_fin)}
            icon={<Factory className="w-5 h-5 text-red-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerProduccionEtapa;
