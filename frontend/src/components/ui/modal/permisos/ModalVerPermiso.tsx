import React from "react";
import { EyeIcon } from "../../../../icons";
import { Key, Hash, FileText } from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface Permiso {
  id: number;
  nom_permiso: string;
  descripcion?: string;
}

interface ModalVerPermisoProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  permisoSeleccionado: Permiso | null;
}

const ModalVerPermiso: React.FC<ModalVerPermisoProps> = ({
  showModal,
  setShowModal,
  permisoSeleccionado,
}) => {
  if (!showModal || !permisoSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles del Permiso"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="ID"
            value={String(permisoSeleccionado.id)}
            icon={<Hash className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Nombre"
            value={permisoSeleccionado.nom_permiso}
            icon={<Key className="w-5 h-5 text-indigo-600" />}
          />
          <DetailItem
            label="Descripción"
            value={permisoSeleccionado.descripcion || "Sin descripción"}
            icon={<FileText className="w-5 h-5 text-green-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerPermiso;
