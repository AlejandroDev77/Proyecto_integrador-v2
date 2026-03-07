import React, { useState } from "react";
import {
  X,
  Eye,
  Layers,
  User,
  Calendar,
  FileText,
  Image as ImageIcon,
  Video,
  File,
} from "lucide-react";

interface EvidenciaProduccion {
  id_evi: number;
  cod_evi?: string;
  id_pro_eta: number;
  tipo_evi: string;
  archivo_evi?: string;
  descripcion?: string;
  fec_evi?: string;
  id_emp: number;
  produccion_etapa?: {
    id_pro_eta: number;
    id_pro: number;
    etapa?: { nom_eta: string };
  };
  empleado?: { nom_emp: string; ape_emp?: string };
}

interface ModalVerEvidenciaProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  evidenciaSeleccionado: EvidenciaProduccion | null;
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

const ModalVerEvidencia: React.FC<ModalVerEvidenciaProps> = ({
  showModal,
  setShowModal,
  evidenciaSeleccionado,
}) => {
  const [activeTab, setActiveTab] = useState<"DETALLES" | "ARCHIVO">(
    "DETALLES"
  );

  if (!showModal || !evidenciaSeleccionado) return null;

  const e = evidenciaSeleccionado;

  const formatFecha = (fecha?: string) => {
    if (!fecha) return "-";
    const d = new Date(fecha);
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getArchivoUrl = () => {
    if (!e.archivo_evi) return null;
    return e.archivo_evi.startsWith("http")
      ? e.archivo_evi
      : `http://localhost:8000/storage/${e.archivo_evi}`;
  };

  const tipoIcon = () => {
    switch (e.tipo_evi) {
      case "foto":
        return <ImageIcon className="w-5 h-5 text-green-600" />;
      case "video":
        return <Video className="w-5 h-5 text-red-600" />;
      default:
        return <File className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 sm:px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Eye className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
            Evidencia: {e.cod_evi || `EVI-${e.id_evi}`}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 bg-white">
          {(["DETALLES", "ARCHIVO"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 sm:px-6 py-4 font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 border-b-2 ${
                activeTab === tab
                  ? "text-green-600 border-green-600 bg-gray-50"
                  : "text-gray-600 hover:text-gray-900 border-transparent"
              }`}
            >
              {tab === "DETALLES" && <FileText className="w-5 h-5" />}
              {tab === "ARCHIVO" && tipoIcon()}
              <span className="hidden sm:inline">
                {tab === "DETALLES" ? "Detalles" : "Archivo"}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white">
          {activeTab === "DETALLES" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DetailItem
                  label="Código"
                  value={e.cod_evi || `EVI-${e.id_evi}`}
                  icon={<FileText className="w-5 h-5 text-blue-600" />}
                />
                <DetailItem label="Tipo" value={e.tipo_evi} icon={tipoIcon()} />
                <DetailItem
                  label="Etapa"
                  value={
                    e.produccion_etapa?.etapa?.nom_eta ||
                    `Etapa ${e.id_pro_eta}`
                  }
                  icon={<Layers className="w-5 h-5 text-purple-600" />}
                />
                <DetailItem
                  label="Producción"
                  value={`#${e.produccion_etapa?.id_pro || "-"}`}
                  icon={<Layers className="w-5 h-5 text-indigo-600" />}
                />
                <DetailItem
                  label="Empleado"
                  value={`${e.empleado?.nom_emp || ""} ${
                    e.empleado?.ape_emp || ""
                  }`}
                  icon={<User className="w-5 h-5 text-orange-600" />}
                />
                <DetailItem
                  label="Fecha"
                  value={formatFecha(e.fec_evi)}
                  icon={<Calendar className="w-5 h-5 text-teal-600" />}
                />
              </div>

              {e.descripcion && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Descripción
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {e.descripcion}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "ARCHIVO" && (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              {getArchivoUrl() ? (
                e.tipo_evi === "foto" ? (
                  <img
                    src={getArchivoUrl()!}
                    alt="Evidencia"
                    className="max-h-[500px] rounded-xl shadow-lg border border-gray-200"
                  />
                ) : e.tipo_evi === "video" ? (
                  <video
                    src={getArchivoUrl()!}
                    controls
                    className="max-h-[500px] rounded-xl shadow-lg w-full"
                  />
                ) : (
                  <div className="text-center">
                    <File className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-4">Documento</p>
                    <a
                      href={getArchivoUrl()!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold"
                    >
                      Descargar documento
                    </a>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <File className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">Sin archivo disponible</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-6 sm:px-8 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 sm:px-8 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
          >
            Cancelar
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="px-6 sm:px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerEvidencia;
