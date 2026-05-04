import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { useDashboard } from "../../../context/DashboardContext";

export default function ComprasPorProveedorChart() {
  const { data, selectedYear } = useDashboard();
  const [series, setSeries] = useState([
    { name: "Total Compras", data: [] as number[] },
  ]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (data?.compras_por_proveedor && data.compras_por_proveedor.length > 0) {
      // Ensure numbers are properly parsed
      const totales = data.compras_por_proveedor.map(
        (c) => Number(c.total) || 0
      );
      const proveedores = data.compras_por_proveedor.map((c) =>
        c.proveedor.length > 20
          ? c.proveedor.substring(0, 18) + "..."
          : c.proveedor
      );
      setSeries([{ name: "Total Compras (Bs)", data: totales }]);
      setCategories(proveedores);
    }
  }, [data]);

  // Force redraw
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const options: ApexOptions = {
    colors: ["#f59e0b", "#3b82f6", "#22c55e", "#ef4444", "#8b5cf6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 280,
      toolbar: { show: false },
      redrawOnParentResize: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "65%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `Bs ${val.toLocaleString()}`,
      style: {
        fontSize: "11px",
        fontWeight: 600,
      },
      offsetX: 10,
    },
    xaxis: {
      categories: categories,
      labels: {
        formatter: (val: string) => `Bs ${Number(val).toLocaleString()}`,
        style: { colors: "#6b7280", fontSize: "11px" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#374151", fontSize: "12px", fontWeight: 500 },
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (val: number) => `Bs ${val.toLocaleString()}`,
      },
    },
  };

  if (!data?.compras_por_proveedor || data.compras_por_proveedor.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <svg
          className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Sin compras registradas
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          en {selectedYear}
        </p>
      </div>
    );
  }

  const totalCompras = series[0].data.reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-3 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Compras por Proveedor
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Top proveedores en {selectedYear}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total:
          </span>
          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
            Bs {totalCompras.toLocaleString()}
          </span>
        </div>
      </div>
      <Chart options={options} series={series} type="bar" height={280} />
    </div>
  );
}
