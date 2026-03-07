import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { useDashboard } from "../../context/DashboardContext";

export default function TopMueblesChart() {
  const { data } = useDashboard();
  const [series, setSeries] = useState([
    { name: "Ventas", data: [] as number[] },
  ]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (data?.top_muebles && data.top_muebles.length > 0) {
      setSeries([
        { name: "Ventas (Bs)", data: data.top_muebles.map((m) => m.total) },
      ]);
      setCategories(data.top_muebles.map((m) => m.nombre));
    }
  }, [data]);

  // Force redraw fix
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      toolbar: { show: false },
      redrawOnParentResize: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "60%",
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    colors: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"],
    dataLabels: {
      enabled: true,
      formatter: (val) => `Bs ${Number(val).toLocaleString()}`,
      offsetX: 30,
      style: {
        fontSize: "12px",
        colors: ["#1f2937"],
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        formatter: (val) => `Bs ${Number(val).toLocaleString()}`,
        style: { colors: "#6b7280" },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: "#374151",
        },
      },
    },
    legend: { show: false },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    tooltip: {
      y: {
        formatter: (val) => `Bs ${val.toLocaleString()}`,
      },
    },
  };

  if (!data?.top_muebles || data.top_muebles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-gray-500 dark:text-gray-400">
          Sin datos de muebles vendidos
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-2 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
        Top 5 Muebles Más Vendidos
      </h3>
      <Chart options={options} series={series} type="bar" height={250} />
    </div>
  );
}
