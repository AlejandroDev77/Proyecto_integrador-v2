import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDashboard } from "../../../context/DashboardContext";

export default function MonthlyTarget() {
  const { data } = useDashboard();
  const percentage = data?.usuarios?.percentage ?? 0;
  const activeUsers = data?.usuarios?.activeUsers ?? 0;
  const inactiveUsers = data?.usuarios?.inactiveUsers ?? 0;
  const totalUsers = activeUsers + inactiveUsers;

  const options: ApexOptions = {
    colors: ["#a67c52"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: "68%" },
        track: { background: "#e5e7eb", strokeWidth: "100%" },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "30px",
            fontWeight: 600,
            offsetY: -8,
            color: "#1f2937",
            formatter: (value) => `${Math.round(value)}%`,
          },
        },
      },
    },
    fill: { type: "solid" },
    stroke: { lineCap: "round" },
    labels: ["Activos"],
  };

  return (
    <section className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Usuarios activos
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Proporción de cuentas activas
        </p>
      </div>

      <div className="mx-auto max-w-[320px]" aria-label={`${percentage}% de usuarios activos`}>
        <Chart options={options} series={[percentage]} type="radialBar" height={230} />
      </div>

      <div className="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-center dark:divide-gray-700 dark:border-gray-700">
        <div className="px-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{totalUsers}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Total</p>
        </div>
        <div className="px-2">
          <p className="text-lg font-semibold text-[#a67c52]">{activeUsers}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Activos</p>
        </div>
        <div className="px-2">
          <p className="text-lg font-semibold text-gray-500 dark:text-gray-300">{inactiveUsers}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Inactivos</p>
        </div>
      </div>
    </section>
  );
}
