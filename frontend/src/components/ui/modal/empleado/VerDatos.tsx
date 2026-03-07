import React from "react";
import { EyeIcon } from "../../../../icons";
import {
  User,
  IdCard,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  UserCircle,
} from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface ModalVerEmpleadoProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  empleadoSeleccionado: any;
}

const ModalVerEmpleado: React.FC<ModalVerEmpleadoProps> = ({
  showModal,
  setShowModal,
  empleadoSeleccionado,
}) => {
  if (!showModal || !empleadoSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Datos del Empleado"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Nombre completo"
            value={`${empleadoSeleccionado.nom_emp} ${empleadoSeleccionado.ap_pat_emp} ${empleadoSeleccionado.ap_mat_emp}`}
            icon={<User className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="C.I."
            value={empleadoSeleccionado.ci_emp}
            icon={<IdCard className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Celular"
            value={empleadoSeleccionado.cel_emp}
            icon={<Phone className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Dirección"
            value={empleadoSeleccionado.dir_emp}
            icon={<MapPin className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Fecha Nacimiento"
            value={empleadoSeleccionado.fec_nac_emp}
            icon={<Calendar className="w-5 h-5 text-pink-600" />}
          />
          <DetailItem
            label="Cargo"
            value={empleadoSeleccionado.car_emp}
            icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
          />
          <DetailItem
            label="Usuario"
            value={empleadoSeleccionado.usuario?.nom_usu || "Sin usuario"}
            icon={<UserCircle className="w-5 h-5 text-orange-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerEmpleado;
