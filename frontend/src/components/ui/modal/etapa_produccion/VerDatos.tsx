import React from "react";
import { EyeIcon } from "../../../../icons";
import { Tag, FileText, Clock, ListOrdered } from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface EtapaProduccion {
  id_eta: number;
  nom_eta: string;
  desc_eta: string;
  duracion_estimada: number;
  orden_secuencia: number;
}

interface ModalVerEtapaProduccionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  etapaproduccionSeleccionado: EtapaProduccion | null;
}

const ModalVerEtapaProduccion: React.FC<ModalVerEtapaProduccionProps> = ({
  showModal,
  setShowModal,
  etapaproduccionSeleccionado,
}) => {
  if (!showModal || !etapaproduccionSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles de la Etapa de Producción"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Nombre Etapa"
            value={etapaproduccionSeleccionado.nom_eta}
            icon={<Tag className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Descripción"
            value={etapaproduccionSeleccionado.desc_eta || "Sin descripción"}
            icon={<FileText className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Duración Estimada"
            value={`${etapaproduccionSeleccionado.duracion_estimada} días`}
            icon={<Clock className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Orden Secuencia"
            value={String(etapaproduccionSeleccionado.orden_secuencia)}
            icon={<ListOrdered className="w-5 h-5 text-red-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerEtapaProduccion;
