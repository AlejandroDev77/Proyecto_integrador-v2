import React from "react";
import { EyeIcon } from "../../../../icons";
import {
  User,
  IdCard,
  Phone,
  MapPin,
  Calendar,
  UserCircle,
} from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface ModalVerClienteProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  clienteSeleccionado: any;
}

const ModalVerCliente: React.FC<ModalVerClienteProps> = ({
  showModal,
  setShowModal,
  clienteSeleccionado,
}) => {
  if (!showModal || !clienteSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Datos del Cliente"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Nombre completo"
            value={`${clienteSeleccionado.nom_cli} ${clienteSeleccionado.ap_pat_cli} ${clienteSeleccionado.ap_mat_cli}`}
            icon={<User className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="C.I."
            value={clienteSeleccionado.ci_cli}
            icon={<IdCard className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Celular"
            value={clienteSeleccionado.cel_cli}
            icon={<Phone className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Dirección"
            value={clienteSeleccionado.dir_cli}
            icon={<MapPin className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Fecha Nacimiento"
            value={clienteSeleccionado.fec_nac_cli}
            icon={<Calendar className="w-5 h-5 text-pink-600" />}
          />
          <DetailItem
            label="Usuario"
            value={clienteSeleccionado.usuario?.nom_usu || "Sin usuario"}
            icon={<UserCircle className="w-5 h-5 text-orange-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerCliente;
