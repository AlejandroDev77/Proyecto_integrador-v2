import React from "react";
import { EyeIcon } from "../../../../icons";
import { Building2, User, Phone, Mail, MapPin, FileText } from "lucide-react";
import { BaseVerDatosModal, DetailItem, StatusBadge } from "../shared";

interface Proveedor {
  id_prov: number;
  nom_prov: string;
  contacto_prov: string;
  tel_prov: string;
  email_prov: string;
  dir_prov: string;
  nit_prov: string;
  est_prov: boolean;
}

interface ModalVerProveedorProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  proveedorSeleccionado: Proveedor | null;
}

const ModalVerProveedor: React.FC<ModalVerProveedorProps> = ({
  showModal,
  setShowModal,
  proveedorSeleccionado,
}) => {
  if (!showModal || !proveedorSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Datos del Proveedor"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Nombre"
            value={proveedorSeleccionado.nom_prov}
            icon={<Building2 className="w-5 h-5 text-orange-600" />}
          />
          <DetailItem
            label="Contacto"
            value={proveedorSeleccionado.contacto_prov}
            icon={<User className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Teléfono"
            value={proveedorSeleccionado.tel_prov}
            icon={<Phone className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Email"
            value={proveedorSeleccionado.email_prov}
            icon={<Mail className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Dirección"
            value={proveedorSeleccionado.dir_prov}
            icon={<MapPin className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="NIT"
            value={proveedorSeleccionado.nit_prov}
            icon={<FileText className="w-5 h-5 text-teal-600" />}
          />
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <StatusBadge isActive={proveedorSeleccionado.est_prov} />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerProveedor;
