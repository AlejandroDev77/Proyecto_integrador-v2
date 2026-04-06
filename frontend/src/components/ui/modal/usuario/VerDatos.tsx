import React from "react";
import { EyeIcon } from "../../../../icons";
import { User, Mail, Shield } from "lucide-react";
import { BaseVerDatosModal, DetailItem, StatusBadge } from "../shared";

import { Usuario } from "../../../../types/usuario";

interface ModalVerUsuarioProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  usuarioSeleccionado: Usuario | null;
}

const ModalVerUsuario: React.FC<ModalVerUsuarioProps> = ({
  showModal,
  setShowModal,
  usuarioSeleccionado,
}) => {
  if (!showModal || !usuarioSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Datos del Usuario"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Usuario"
            value={usuarioSeleccionado.nom_usu}
            icon={<User className="w-5 h-5 text-orange-600" />}
          />
          <DetailItem
            label="Email"
            value={usuarioSeleccionado.email_usu}
            icon={<Mail className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Rol"
            value={usuarioSeleccionado.rol?.nom_rol || "Sin rol"}
            icon={<Shield className="w-5 h-5 text-purple-600" />}
          />
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <StatusBadge isActive={usuarioSeleccionado.est_usu} />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerUsuario;
