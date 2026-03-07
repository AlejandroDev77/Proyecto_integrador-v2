import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { useDashboard } from "../../context/DashboardContext";

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const MONTH_SHORT = [
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
];

export default function StatisticsChart() {
  const { data, selectedYear, selectedMonth, dateRange } = useDashboard();
  const [series, setSeries] = useState([
    { name: `Ganancias ${selectedYear}`, data: Array(12).fill(0) },
    { name: `Ganancias ${selectedYear - 1}`, data: Array(12).fill(0) },
  ]);

  // Force redraw
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (data) {
      setSeries([
        {
          name: `Ganancias ${selectedYear}`,
          data: data.ganancias_mensuales || Array(12).fill(0),
        },
        {
          name: `Ganancias ${selectedYear - 1}`,
          data: data.ganancias_ano_anterior || Array(12).fill(0),
        },
      ]);
    }
  }, [data, selectedYear]);

  // Calculate title and subtitle based on filters
  let subtitle = `Comparativa anual ${selectedYear} vs ${selectedYear - 1}`;

  if (dateRange.start && dateRange.end) {
    subtitle = `Período: ${dateRange.start} a ${dateRange.end}`;
  } else if (selectedMonth !== null) {
    subtitle = `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear} vs ${
      MONTH_NAMES[selectedMonth - 1]
    } ${selectedYear - 1}`;
  }

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    colors: ["#FFA420", "#94a3b8"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
      redrawOnParentResize: true,
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    stroke: {
      curve: "smooth",
      width: [3, 2],
      dashArray: [0, 5],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 0,
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
      enabled: true,
      shared: true,
      y: {
        formatter: (val) => `Bs ${val.toLocaleString("es-BO")}`,
      },
    },
    xaxis: {
      type: "category",
      categories: MONTH_SHORT,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#6b7280" },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `Bs ${(val / 1000).toFixed(0)}k`,
        style: { fontSize: "12px", colors: ["#6B7280"] },
      },
    },
  };

  // Calculate totals - either for selected month or full year
  let totalActual = 0;
  let totalAnterior = 0;

  if (selectedMonth !== null) {
    // Show only the selected month
    totalActual = (data?.ganancias_mensuales || [])[selectedMonth - 1] || 0;
    totalAnterior =
      (data?.ganancias_ano_anterior || [])[selectedMonth - 1] || 0;
  } else {
    // Show full year
    totalActual = (data?.ganancias_mensuales || []).reduce((a, b) => a + b, 0);
    totalAnterior = (data?.ganancias_ano_anterior || []).reduce(
      (a, b) => a + b,
      0
    );
  }

  const crecimiento =
    totalAnterior > 0
      ? (((totalActual - totalAnterior) / totalAnterior) * 100).toFixed(1)
      : totalActual > 0
      ? "100"
      : "0";

  // Period label for display
  let periodLabel = `Año ${selectedYear}`;
  if (selectedMonth !== null) {
    periodLabel = `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between sm:items-center">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Estadísticas de Ganancias
          </h3>
          <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-4 sm:justify-end">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {periodLabel}
            </p>
            <p className="text-xl font-bold text-orange-500 dark:text-orange-400">
              Bs {totalActual.toLocaleString("es-BO")}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              Number(crecimiento) >= 0
                ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
            }`}
          >
            {Number(crecimiento) >= 0 ? "+" : ""}
            {crecimiento}%
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
