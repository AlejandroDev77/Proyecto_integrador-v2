import React from "react";
import { EyeIcon } from "../../../../icons";
import { Tag, FileText } from "lucide-react";
import { BaseVerDatosModal, DetailItem } from "../shared";

interface ModalVerCategoriaMuebleProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  categoriamuebleSeleccionado: any;
}

const ModalVerCategoriasMuebles: React.FC<ModalVerCategoriaMuebleProps> = ({
  showModal,
  setShowModal,
  categoriamuebleSeleccionado,
}) => {
  if (!showModal || !categoriamuebleSeleccionado) return null;

  return (
    <BaseVerDatosModal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Datos de la Categoría"
      titleIcon={<EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailItem
            label="Nombre Categoría"
            value={categoriamuebleSeleccionado.nom_cat}
            icon={<Tag className="w-5 h-5 text-orange-600" />}
          />
          <DetailItem
            label="Descripción"
            value={categoriamuebleSeleccionado.desc_cat || "Sin descripción"}
            icon={<FileText className="w-5 h-5 text-blue-600" />}
          />
        </div>
      </div>
    </BaseVerDatosModal>
  );
};

export default ModalVerCategoriasMuebles;
