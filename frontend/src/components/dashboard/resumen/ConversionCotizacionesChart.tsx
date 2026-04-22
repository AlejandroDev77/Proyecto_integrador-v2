import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDashboard } from "../../../context/DashboardContext";

export default function ConversionCotizacionesChart() {
  const { data } = useDashboard();
  const tasa = data?.conversion_cotizaciones?.tasa || 0;
  const total = data?.conversion_cotizaciones?.total || 0;
  const aprobadas = data?.conversion_cotizaciones?.aprobadas || 0;

  const options: ApexOptions = {
    colors: ["#22c55e"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "70%",
        },
        track: {
          background: "#e5e7eb",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "32px",
            fontWeight: 700,
            offsetY: -10,
            color: "#1f2937",
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#3b82f6"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
        Conversión de Cotizaciones
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Tasa de cotizaciones aprobadas
      </p>

      <div className="relative flex justify-center">
        <Chart
          options={options}
          series={[tasa]}
          type="radialBar"
          height={200}
        />
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
            {total}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total Cotizaciones
          </p>
        </div>
        <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {aprobadas}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Aprobadas</p>
        </div>
        <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {total - aprobadas}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Rechazadas/Pendientes
          </p>
        </div>
      </div>
    </div>
  );
}
