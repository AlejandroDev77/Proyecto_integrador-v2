import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { useDashboard } from "../../context/DashboardContext";

export default function EstadoProduccionesChart() {
  const { data } = useDashboard();
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const estadoColors: Record<string, string> = {
    "en proceso": "#3b82f6",
    en_proceso: "#3b82f6",
    pendiente: "#f59e0b",
    completado: "#22c55e",
    completada: "#22c55e",
    cancelado: "#ef4444",
    cancelada: "#ef4444",
    retrasado: "#dc2626",
    retrasada: "#dc2626",
  };

  const estadoLabels: Record<string, string> = {
    "en proceso": "En Proceso",
    en_proceso: "En Proceso",
    pendiente: "Pendiente",
    completado: "Completado",
    completada: "Completada",
    cancelado: "Cancelado",
    cancelada: "Cancelada",
    retrasado: "Retrasado",
    retrasada: "Retrasada",
  };

  useEffect(() => {
    if (data?.estado_producciones && data.estado_producciones.length > 0) {
      setSeries(data.estado_producciones.map((e) => e.total));
      setLabels(
        data.estado_producciones.map(
          (e) => estadoLabels[e.estado.toLowerCase()] || e.estado
        )
      );
    }
  }, [data]);

  // Force redraw fix
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const colors =
    data?.estado_producciones?.map(
      (e) => estadoColors[e.estado.toLowerCase()] || "#6b7280"
    ) || [];

  const options: ApexOptions = {
    colors: colors,
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "pie",
      redrawOnParentResize: true,
    },
    labels: labels,
    legend: {
      position: "bottom",
      fontFamily: "Outfit",
      labels: {
        colors: "#6b7280",
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        dataLabels: {
          offset: -5,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (_val: number, opts) => {
        return opts.w.config.series[opts.seriesIndex];
      },
      style: {
        fontSize: "14px",
        fontWeight: 600,
      },
      dropShadow: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      colors: ["#fff"],
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} producciones`,
      },
    },
  };

  if (!data?.estado_producciones || data.estado_producciones.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-gray-500 dark:text-gray-400">
          Sin datos de producciones
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
        Estado de Producciones
      </h3>
      <Chart options={options} series={series} type="pie" height={280} />
    </div>
  );
}
