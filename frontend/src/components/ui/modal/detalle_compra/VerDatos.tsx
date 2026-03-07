import React from "react";
import { EyeIcon } from "../../../../icons";
import { Hash, DollarSign, Calculator, Calendar, Package } from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface DetalleCompra {
  id_det_comp: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  id_comp: number;
  compramaterial?: {
    fec_comp: string;
  };
  id_mat: number;
  material?: {
    nom_mat: string;
  };
}

interface ModalVerDetalleCompraProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  detalleSeleccionado: DetalleCompra | null;
}

const ModalVerDetalleCompra: React.FC<ModalVerDetalleCompraProps> = ({
  showModal,
  setShowModal,
  detalleSeleccionado,
}) => {
  if (!showModal || !detalleSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles de la Compra"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Cantidad"
            value={String(detalleSeleccionado.cantidad)}
            icon={<Hash className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Precio Unitario"
            value={`Bs. ${Number(detalleSeleccionado.precio_unitario).toFixed(
              2
            )}`}
            icon={<DollarSign className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Subtotal"
            value={`Bs. ${Number(detalleSeleccionado.subtotal).toFixed(2)}`}
            icon={<Calculator className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Fecha de Compra"
            value={
              detalleSeleccionado.compramaterial
                ? new Date(
                    detalleSeleccionado.compramaterial.fec_comp
                  ).toLocaleDateString()
                : "No disponible"
            }
            icon={<Calendar className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Material"
            value={detalleSeleccionado.material?.nom_mat || "No disponible"}
            icon={<Package className="w-5 h-5 text-orange-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerDetalleCompra;
