import React from "react";
import { EyeIcon } from "../../../../icons";
import {
  Hash,
  DollarSign,
  Calculator,
  Calendar,
  CircleDot,
  Armchair,
} from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface DetalleDevolucion {
  id_det_dev: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  devolucion?: {
    fec_dev: string;
    est_dev: string;
  };
  id_mue: number;
  mueble?: {
    nom_mue: string;
  };
}

interface ModalVerDetalleDevolucionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  detalledevolucionSeleccionado: DetalleDevolucion | null;
}

const ModalVerDetalleDevolucion: React.FC<ModalVerDetalleDevolucionProps> = ({
  showModal,
  setShowModal,
  detalledevolucionSeleccionado,
}) => {
  if (!showModal || !detalledevolucionSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles de la Devolución"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Cantidad"
            value={String(detalledevolucionSeleccionado.cantidad)}
            icon={<Hash className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Precio Unitario"
            value={`Bs. ${detalledevolucionSeleccionado.precio_unitario}`}
            icon={<DollarSign className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Subtotal"
            value={`Bs. ${detalledevolucionSeleccionado.subtotal}`}
            icon={<Calculator className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Fecha Devolución"
            value={
              detalledevolucionSeleccionado.devolucion?.fec_dev || "Sin fecha"
            }
            icon={<Calendar className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Estado Devolución"
            value={
              detalledevolucionSeleccionado.devolucion?.est_dev || "Sin estado"
            }
            icon={<CircleDot className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Mueble"
            value={
              detalledevolucionSeleccionado.mueble?.nom_mue || "Sin mueble"
            }
            icon={<Armchair className="w-5 h-5 text-orange-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerDetalleDevolucion;
