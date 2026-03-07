import React from "react";
import { EyeIcon } from "../../../../icons";
import { Shield, Key, FileText } from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface RolPermiso {
  id_rol: number;
  id_permiso: number;
  nom_rol: string;
  nom_permiso: string;
  descripcion?: string;
}

interface ModalVerAsignacionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  asignacionSeleccionada: RolPermiso | null;
}

const ModalVerAsignacion: React.FC<ModalVerAsignacionProps> = ({
  showModal,
  setShowModal,
  asignacionSeleccionada,
}) => {
  if (!showModal || !asignacionSeleccionada) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles de la Asignación"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Rol"
            value={asignacionSeleccionada.nom_rol}
            icon={<Shield className="w-5 h-5 text-indigo-600" />}
          />
          <DetailItem
            label="Permiso"
            value={asignacionSeleccionada.nom_permiso}
            icon={<Key className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Descripción"
            value={asignacionSeleccionada.descripcion || "Sin descripción"}
            icon={<FileText className="w-5 h-5 text-yellow-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerAsignacion;
