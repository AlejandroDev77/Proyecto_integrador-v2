import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { useDashboard } from "../../context/DashboardContext";

export default function MonthlySalesChart() {
  const { data, selectedYear } = useDashboard();
  const [series, setSeries] = useState([
    { name: "Aprobadas", data: Array(12).fill(0) },
    { name: "Rechazadas", data: Array(12).fill(0) },
    { name: "Pendientes", data: Array(12).fill(0) },
  ]);

  useEffect(() => {
    if (data) {
      setSeries([
        { name: "Aprobadas", data: data.cotizaciones_mensuales.aprobado },
        { name: "Rechazadas", data: data.cotizaciones_mensuales.rechazado },
        { name: "Pendientes", data: data.cotizaciones_mensuales.pendiente },
      ]);
    }
  }, [data]);

  const totalAprobadas = series[0].data.reduce((a, b) => a + b, 0);
  const totalRechazadas = series[1].data.reduce((a, b) => a + b, 0);
  const totalPendientes = series[2].data.reduce((a, b) => a + b, 0);

  const options: ApexOptions = {
    colors: ["#22c55e", "#ef4444", "#f59e0b"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 280,
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 600,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
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
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
      fontFamily: "Outfit",
      markers: {
        size: 8,
        shape: "circle",
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#6b7280" },
        formatter: (val) => Math.round(val).toString(),
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => `${val} cotizaciones`,
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Cotizaciones Mensuales
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Estado de cotizaciones en {selectedYear}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {totalAprobadas}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {totalRechazadas}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {totalPendientes}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px] xl:min-w-full">
          <Chart options={options} series={series} type="bar" height={280} />
        </div>
      </div>
    </div>
  );
}
