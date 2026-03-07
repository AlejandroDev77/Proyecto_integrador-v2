import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { useDashboard } from "../../context/DashboardContext";

export default function StockMueblesChart() {
  const { data } = useDashboard();
  const [series, setSeries] = useState([
    { name: "Stock Actual", data: [] as number[] },
    { name: "Stock Mínimo", data: [] as number[] },
  ]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (data?.stock_muebles && data.stock_muebles.length > 0) {
      setSeries([
        { name: "Stock Actual", data: data.stock_muebles.map((m) => m.stock) },
        {
          name: "Stock Mínimo",
          data: data.stock_muebles.map((m) => m.stock_min),
        },
      ]);
      setCategories(data.stock_muebles.map((m) => m.nombre.substring(0, 15)));
    }
  }, [data]);

  // Force redraw
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const options: ApexOptions = {
    colors: ["#3b82f6", "#ef4444"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 320,
      toolbar: { show: false },
      redrawOnParentResize: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: "70%",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: -10,
      style: {
        fontSize: "10px",
        colors: ["#fff"],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      labels: {
        style: { colors: "#6b7280", fontSize: "11px" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#6b7280", fontSize: "10px" },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontFamily: "Outfit",
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  if (!data?.stock_muebles || data.stock_muebles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Sin datos de stock</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-2 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Niveles de Stock - Muebles
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Comparación stock actual vs mínimo requerido
        </p>
      </div>
      <Chart options={options} series={series} type="bar" height={320} />
    </div>
  );
}
