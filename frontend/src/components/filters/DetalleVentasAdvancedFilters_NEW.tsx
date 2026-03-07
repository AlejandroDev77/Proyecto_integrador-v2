/* import React, { useEffect, useState } from "react";
import AdvancedFilters from "../filters/AdvancedFilters";
import { ArrowUpDown } from "lucide-react";
import axios from "axios";

interface DetalleVentasFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  onSortChange: (sort: string) => void;
  muebles?: { id_mue: number; nom_mue: string; cod_mue: string }[];
}

export const DetalleVentasAdvancedFilters: React.FC<
  DetalleVentasFiltersProps
> = ({ onFiltersChange, onSortChange, muebles = [] }) => {
  const [mueblesList, setMueblesList] =
    useState<{ id_mue: number; nom_mue: string; cod_mue: string }[]>(muebles);

  // Cargar muebles disponibles al montar
  useEffect(() => {
    if (mueblesList.length === 0) {
      const fetchMuebles = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/muebles");
          setMueblesList(response.data.data || response.data);
        } catch (error) {
          console.error("Error al cargar muebles:", error);
        }
      };
      fetchMuebles();
    }
  }, []);

  const filterFields = [
    {
      id: "filter[cod_det_ven]",
      label: "Código",
      type: "text" as const,
      placeholder: "Ej: DV-001",
    },
    {
      id: "filter[cantidad_min]",
      label: "Cantidad Mínima",
      type: "number" as const,
      placeholder: "Ej: 1",
    },
    {
      id: "filter[cantidad_max]",
      label: "Cantidad Máxima",
      type: "number" as const,
      placeholder: "Ej: 100",
    },
    {
      id: "filter[precio_unitario_min]",
      label: "Precio Unitario Mín.",
      type: "number" as const,
      placeholder: "Ej: 100",
    },
    {
      id: "filter[precio_unitario_max]",
      label: "Precio Unitario Máx.",
      type: "number" as const,
      placeholder: "Ej: 5000",
    },
    {
      id: "filter[descuento_item_min]",
      label: "Descuento Mín.",
      type: "number" as const,
      placeholder: "Ej: 0",
    },
    {
      id: "filter[descuento_item_max]",
      label: "Descuento Máx.",
      type: "number" as const,
      placeholder: "Ej: 500",
    },
    {
      id: "filter[nom_mue]",
      label: "Mueble",
      type: "select" as const,
      options: Array.from(
        new Map(
          mueblesList.map((m) => [
            m.nom_mue,
            {
              value: m.nom_mue,
              label: `${m.cod_mue || "Sin código"} - ${m.nom_mue}`,
            },
          ])
        ).values()
      ),
    },
  ];

  const handleFiltersChange = (filters: Record<string, any>) => {
    onFiltersChange(filters);
  };

  return (
    <div className="space-y-4">
      <AdvancedFilters
        fields={filterFields}
        onFiltersChange={handleFiltersChange}
        onReset={() => onFiltersChange({})}
      />

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Ordenar por:
        </span>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onSortChange("cantidad")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowUpDown size={16} />
            Cantidad ↑
          </button>
          <button
            onClick={() => onSortChange("-cantidad")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowUpDown size={16} />
            Cantidad ↓
          </button>
          <button
            onClick={() => onSortChange("precio_unitario")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowUpDown size={16} />
            Precio ↑
          </button>
          <button
            onClick={() => onSortChange("-precio_unitario")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowUpDown size={16} />
            Precio ↓
          </button>
          <button
            onClick={() => onSortChange("subtotal")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowUpDown size={16} />
            Subtotal ↑
          </button>
          <button
            onClick={() => onSortChange("-subtotal")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowUpDown size={16} />
            Subtotal ↓
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleVentasAdvancedFilters;
 */