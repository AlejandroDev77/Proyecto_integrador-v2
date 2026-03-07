import React from "react";
import { EyeIcon } from "../../../../icons";
import {
  Hash,
  DollarSign,
  Calculator,
  Calendar,
  CircleDot,
  Armchair,
  Percent,
} from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface DetalleVenta {
  id_det_ven: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  id_ven: number;
  venta?: {
    fec_ven: string;
    est_ven: string;
  };
  id_mue: number;
  mueble?: {
    nom_mue: string;
  };
  descuento_item?: number;
}

interface ModalVerDetalleVentaProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  detalleSeleccionado: DetalleVenta | null;
}

const ModalVerDetalleVenta: React.FC<ModalVerDetalleVentaProps> = ({
  showModal,
  setShowModal,
  detalleSeleccionado,
}) => {
  if (!showModal || !detalleSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles de la Venta"
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
            label="Descuento por Unidad"
            value={`Bs. ${Number(
              detalleSeleccionado.descuento_item || 0
            ).toFixed(2)}`}
            icon={<Percent className="w-5 h-5 text-red-600" />}
          />
          <DetailItem
            label="Fecha de Venta"
            value={
              detalleSeleccionado.venta
                ? new Date(
                    detalleSeleccionado.venta.fec_ven
                  ).toLocaleDateString()
                : "No disponible"
            }
            icon={<Calendar className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Estado de Venta"
            value={detalleSeleccionado.venta?.est_ven || "No disponible"}
            icon={<CircleDot className="w-5 h-5 text-orange-600" />}
          />
          <DetailItem
            label="Mueble"
            value={detalleSeleccionado.mueble?.nom_mue || "No disponible"}
            icon={<Armchair className="w-5 h-5 text-teal-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerDetalleVenta;
