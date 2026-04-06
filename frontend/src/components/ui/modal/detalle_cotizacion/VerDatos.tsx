import React from "react";
import { EyeIcon } from "../../../../icons";
import {
  FileText,
  Hash,
  DollarSign,
  Calculator,
  Calendar,
  CircleDot,
  Armchair,
  Ruler,
  Package,
  Palette,
  Wrench,
} from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface DetalleCotizacion {
  id_det_cot: number;
  cod_det_cot?: string;
  desc_personalizacion?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  id_cot: number;
  cotizacion?: {
    fec_cot: string;
    est_cot: string;
  };
  id_mue?: number | null;
  mueble?: {
    nom_mue: string;
  };
  // Campos para muebles personalizados
  nombre_mueble?: string;
  tipo_mueble?: string;
  dimensiones?: string;
  material_principal?: string;
  color_acabado?: string;
  img_referencia?: string;
  herrajes?: string;
}

interface ModalVerDetalleCotizacionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  detallecotizacionSeleccionado: DetalleCotizacion | null;
}

const ModalVerDetalleCotizacion: React.FC<ModalVerDetalleCotizacionProps> = ({
  showModal,
  setShowModal,
  detallecotizacionSeleccionado,
}) => {
  if (!showModal || !detallecotizacionSeleccionado) return null;

  const d = detallecotizacionSeleccionado;
  const nombreMueble =
    d.nombre_mueble || d.mueble?.nom_mue || "Sin especificar";
  const esPersonalizado = !!d.nombre_mueble && !d.id_mue;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Detalles de la Cotización"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        {/* Indicador de tipo */}
        {esPersonalizado && (
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Mueble Personalizado
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Mueble"
            value={nombreMueble}
            icon={<Armchair className="w-5 h-5 text-purple-600" />}
          />
          {d.tipo_mueble && (
            <DetailItem
              label="Tipo de Mueble"
              value={d.tipo_mueble}
              icon={<Package className="w-5 h-5 text-indigo-600" />}
            />
          )}
          {d.dimensiones && (
            <DetailItem
              label="Dimensiones"
              value={d.dimensiones}
              icon={<Ruler className="w-5 h-5 text-teal-600" />}
            />
          )}
          {d.material_principal && (
            <DetailItem
              label="Material Principal"
              value={d.material_principal}
              icon={<Package className="w-5 h-5 text-amber-600" />}
            />
          )}
          {d.color_acabado && (
            <DetailItem
              label="Color/Acabado"
              value={d.color_acabado}
              icon={<Palette className="w-5 h-5 text-pink-600" />}
            />
          )}
          {d.herrajes && (
            <DetailItem
              label="Herrajes y Accesorios"
              value={d.herrajes}
              icon={<Wrench className="w-5 h-5 text-gray-600" />}
            />
          )}
          <DetailItem
            label="Descripción Personalización"
            value={d.desc_personalizacion || "Sin personalización"}
            icon={<FileText className="w-5 h-5 text-green-600" />}
          />
          <DetailItem
            label="Cantidad"
            value={String(d.cantidad || 0)}
            icon={<Hash className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Precio Unitario"
            value={`Bs. ${d.precio_unitario || 0}`}
            icon={<DollarSign className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Subtotal"
            value={`Bs. ${d.subtotal || 0}`}
            icon={<Calculator className="w-5 h-5 text-yellow-600" />}
          />
          <DetailItem
            label="Fecha de Cotización"
            value={d.cotizacion?.fec_cot || "Sin fecha"}
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
          />
          <DetailItem
            label="Estado Cotización"
            value={d.cotizacion?.est_cot || "Sin estado"}
            icon={<CircleDot className="w-5 h-5 text-green-600" />}
          />
        </div>

        {/* Imagen de referencia */}
        {d.img_referencia && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Imagen de Referencia
            </p>
            <img
              src={
                d.img_referencia.startsWith("http")
                  ? d.img_referencia
                  : `http://localhost:8080/storage/${d.img_referencia}`
              }
              alt="Referencia"
              className="max-w-full h-48 object-cover rounded-xl border"
            />
          </div>
        )}
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerDetalleCotizacion;
