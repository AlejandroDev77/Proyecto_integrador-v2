import React from "react";
import { EyeIcon } from "../../../../icons";
import { Shield, Hash, Key, Users } from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface Rol {
  id_rol: number;
  nom_rol: string;
  permisos?: any[];
  usuarios?: any[];
}

interface ModalVerRolProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  rolSeleccionado: Rol | null;
}

const ModalVerRol: React.FC<ModalVerRolProps> = ({
  showModal,
  setShowModal,
  rolSeleccionado,
}) => {
  if (!showModal || !rolSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles del Rol"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="ID"
            value={String(rolSeleccionado.id_rol)}
            icon={<Hash className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Nombre"
            value={rolSeleccionado.nom_rol}
            icon={<Shield className="w-5 h-5 text-indigo-600" />}
          />
          <DetailItem
            label="Permisos Asignados"
            value={`${rolSeleccionado.permisos?.length || 0} permisos`}
            icon={<Key className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Usuarios Asignados"
            value={`${rolSeleccionado.usuarios?.length || 0} usuarios`}
            icon={<Users className="w-5 h-5 text-orange-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerRol;
