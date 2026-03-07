import React from "react";
import { EyeIcon } from "../../../../icons";
import {
  Calendar,
  CreditCard,
  FileText,
  DollarSign,
  CircleDot,
  ShoppingCart,
} from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface Venta {
  est_ven: string;
  total_ven: number;
}

interface Pago {
  fec_pag: string;
  metodo_pag: string;
  referencia_pag: string;
  monto: number;
  id_ven: number;
  venta?: Venta;
}

interface ModalVerPagoProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  pagoSeleccionado: Pago | null;
}

const ModalVerPago: React.FC<ModalVerPagoProps> = ({
  showModal,
  setShowModal,
  pagoSeleccionado,
}) => {
  if (!showModal || !pagoSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles del Pago"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Fecha"
            value={new Date(pagoSeleccionado.fec_pag).toLocaleDateString()}
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Método"
            value={pagoSeleccionado.metodo_pag}
            icon={<CreditCard className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Referencia"
            value={pagoSeleccionado.referencia_pag || "Sin referencia"}
            icon={<FileText className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Monto"
            value={`Bs. ${pagoSeleccionado.monto}`}
            icon={<DollarSign className="w-5 h-5 text-red-600" />}
          />
          {pagoSeleccionado.venta && (
            <>
              <DetailItem
                label="Estado de Venta"
                value={pagoSeleccionado.venta.est_ven}
                icon={<CircleDot className="w-5 h-5 text-purple-600" />}
              />
              <DetailItem
                label="Total de Venta"
                value={`Bs. ${pagoSeleccionado.venta.total_ven}`}
                icon={<ShoppingCart className="w-5 h-5 text-orange-600" />}
              />
            </>
          )}
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerPago;
