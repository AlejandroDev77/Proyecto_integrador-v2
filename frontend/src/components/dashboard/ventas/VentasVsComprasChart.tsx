import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { useDashboard } from "../../../context/DashboardContext";

export default function VentasVsComprasChart() {
  const { data } = useDashboard();
  const [series, setSeries] = useState([
    { name: "Ventas", type: "bar", data: Array(12).fill(0) },
    { name: "Compras", type: "bar", data: Array(12).fill(0) },
    { name: "Margen", type: "line", data: Array(12).fill(0) },
  ]);

  useEffect(() => {
    if (data?.ventas_vs_compras) {
      const margen = data.ventas_vs_compras.ventas.map(
        (v, i) => v - data.ventas_vs_compras.compras[i]
      );
      setSeries([
        { name: "Ventas", type: "bar", data: data.ventas_vs_compras.ventas },
        { name: "Compras", type: "bar", data: data.ventas_vs_compras.compras },
        { name: "Margen", type: "line", data: margen },
      ]);
    }
  }, [data]);

  const options: ApexOptions = {
    colors: ["#22c55e", "#ef4444", "#3b82f6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 350,
      stacked: false,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 4,
      },
    },
    stroke: {
      width: [0, 0, 3],
      curve: "smooth",
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `Bs ${val.toLocaleString()}`,
        style: { colors: "#6b7280" },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `Bs ${val.toLocaleString()}`,
      },
    },
    fill: {
      opacity: [1, 1, 1],
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Ventas vs Compras
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comparativa mensual de ingresos y gastos
          </p>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px] xl:min-w-full">
          <Chart options={options} series={series} type="line" height={300} />
        </div>
      </div>
    </div>
  );
}
