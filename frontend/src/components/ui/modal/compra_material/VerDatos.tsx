import React from "react";
import { EyeIcon } from "../../../../icons";
import { Calendar, CircleDot, DollarSign, Building2, User } from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface CompraMaterial {
  id_comp: number;
  fec_comp: string;
  est_comp: string;
  total_comp: number;
  id_prov: number;
  id_emp: number;
  proveedor?: {
    nom_prov: string;
  };
  empleado?: {
    nom_emp: string;
  };
}

interface ModalVerCompraMaterialProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  compramaterialSeleccionado: CompraMaterial | null;
}

const ModalVerCompraMaterial: React.FC<ModalVerCompraMaterialProps> = ({
  showModal,
  setShowModal,
  compramaterialSeleccionado,
}) => {
  if (!showModal || !compramaterialSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles de la Compra de Material"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Fecha"
            value={new Date(
              compramaterialSeleccionado.fec_comp
            ).toLocaleDateString()}
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Estado"
            value={compramaterialSeleccionado.est_comp}
            icon={<CircleDot className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Total"
            value={`Bs. ${compramaterialSeleccionado.total_comp}`}
            icon={<DollarSign className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Proveedor"
            value={
              compramaterialSeleccionado.proveedor?.nom_prov || "Sin proveedor"
            }
            icon={<Building2 className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Empleado"
            value={
              compramaterialSeleccionado.empleado?.nom_emp || "Sin empleado"
            }
            icon={<User className="w-5 h-5 text-orange-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerCompraMaterial;
