import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { useDashboard } from "../../../context/DashboardContext";

export default function VentasCantidadChart() {
  const { data, selectedYear } = useDashboard();
  const [series, setSeries] = useState([
    { name: "Ventas", data: Array(12).fill(0) },
  ]);

  useEffect(() => {
    if (data?.ventas_cantidad) {
      setSeries([{ name: "Ventas Completadas", data: data.ventas_cantidad }]);
    }
  }, [data]);

  // Force redraw
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const totalVentas = series[0].data.reduce((a, b) => a + b, 0);
  const promedioMensual = Math.round(totalVentas / 12);

  const options: ApexOptions = {
    colors: ["#22c55e"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 280,
      toolbar: { show: false },
      redrawOnParentResize: true,
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
        distributed: false,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => (val > 0 ? val.toString() : ""),
      offsetY: -20,
      style: {
        fontSize: "11px",
        colors: ["#374151"],
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
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
    tooltip: {
      y: {
        formatter: (val) => `${val} ventas`,
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Cantidad de Ventas
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ventas completadas por mes en {selectedYear}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalVentas}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
              {promedioMensual}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Prom/Mes</p>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[500px] xl:min-w-full">
          <Chart options={options} series={series} type="bar" height={280} />
        </div>
      </div>
    </div>
  );
}
