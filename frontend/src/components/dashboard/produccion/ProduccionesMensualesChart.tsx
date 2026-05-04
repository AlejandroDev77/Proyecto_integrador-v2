import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState, useRef } from "react";
import { useDashboard } from "../../../context/DashboardContext";

export default function ProduccionesMensualesChart() {
  const { data, selectedYear } = useDashboard();
  const chartRef = useRef<HTMLDivElement>(null);
  const [series, setSeries] = useState([
    { name: "Producciones", data: Array(12).fill(0) },
  ]);

  useEffect(() => {
    if (data?.producciones_mensuales) {
      setSeries([
        { name: "Producciones Iniciadas", data: data.producciones_mensuales },
      ]);
    }
  }, [data]);

  // Force chart redraw on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const totalProducciones = series[0].data.reduce((a, b) => a + b, 0);

  const options: ApexOptions = {
    colors: ["#8b5cf6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 280,
      toolbar: { show: false },
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 4,
      colors: ["#8b5cf6"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (val) => `${val} producciones`,
      },
    },
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
      labels: {
        style: { colors: "#6b7280" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#6b7280" },
        formatter: (val) => Math.round(val).toString(),
      },
    },
  };

  return (
    <div
      ref={chartRef}
      className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Producciones Mensuales
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Producciones iniciadas en {selectedYear}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
          <span className="text-purple-600 dark:text-purple-400 font-semibold">
            {totalProducciones}
          </span>
          <span className="text-xs text-purple-500 dark:text-purple-400">
            total
          </span>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[500px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={280} />
        </div>
      </div>
    </div>
  );
}
