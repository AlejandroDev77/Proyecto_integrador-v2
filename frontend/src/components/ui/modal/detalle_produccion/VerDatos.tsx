import React from "react";
import { EyeIcon } from "../../../../icons";
import { Hash, CircleDot, Calendar, Armchair } from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";
import { DetalleProduccion } from "../../../../hooks/detalles_producciones/useDetalles_Producciones";



interface ModalVerDetalleProduccionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  detalleproduccionSeleccionado: DetalleProduccion | null;
}

const ModalVerDetalleProduccion: React.FC<ModalVerDetalleProduccionProps> = ({
  showModal,
  setShowModal,
  detalleproduccionSeleccionado,
}) => {
  if (!showModal || !detalleproduccionSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles de la Producción"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Cantidad"
            value={String(detalleproduccionSeleccionado.cantidad)}
            icon={<Hash className="w-5 h-5 text-purple-600" />}
          />
          <DetailItem
            label="Estado"
            value={detalleproduccionSeleccionado.est_det_pro}
            icon={<CircleDot className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Fecha Inicio"
            value={
              detalleproduccionSeleccionado.produccion?.fec_ini
                ? new Date(
                    detalleproduccionSeleccionado.produccion.fec_ini
                  ).toLocaleDateString()
                : "Sin fecha"
            }
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Fecha Fin"
            value={
              detalleproduccionSeleccionado.produccion?.fec_fin
                ? new Date(
                    detalleproduccionSeleccionado.produccion.fec_fin
                  ).toLocaleDateString()
                : "Sin fecha"
            }
            icon={<Calendar className="w-5 h-5 text-red-600" />}
          />
          <DetailItem
            label="Mueble"
            value={
              detalleproduccionSeleccionado.mueble?.nombre || "Sin mueble"
            }
            icon={<Armchair className="w-5 h-5 text-orange-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerDetalleProduccion;
