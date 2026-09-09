import React, { ReactNode } from "react";
import { Download, Filter, Calendar } from "lucide-react";

interface ReportLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  filters?: ReactNode;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
}

export default function ReportLayout({
  title,
  description,
  icon,
  children,
  filters,
  onExportPdf,
  onExportExcel,
}: ReportLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header del Reporte */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            {icon}
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        {/* Botones Globales de Exportación */}
        <div className="flex flex-wrap items-center gap-3">
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-500 font-medium text-sm rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" /> Exportar PDF
            </button>
          )}
          {onExportExcel && (
            <button
              onClick={onExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-500 font-medium text-sm rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" /> Exportar Excel
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtros (Opcional) */}
      {filters && (
        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>
          <div className="flex-1 flex flex-wrap items-center gap-3">
            {filters}
          </div>
        </div>
      )}

      {/* Contenido Dinámico (Gráficos, Tablas, Tarjetas) */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
