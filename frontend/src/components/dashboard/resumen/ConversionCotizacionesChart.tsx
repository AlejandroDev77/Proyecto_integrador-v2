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
        gradientToColors: ["#a67c52"],
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
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div>
        <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
          Conversión de Cotizaciones
        </h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
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

        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="text-center group">
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              {total}
            </p>
            <p className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
              Total
            </p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
          <div className="text-center group">
            <p className="text-xl font-semibold text-[#a67c52] dark:text-[#d4b48f]">
              {aprobadas}
            </p>
            <p className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">Aprobadas</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
          <div className="text-center group">
            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
              {total - aprobadas}
            </p>
            <p className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
              Pendientes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
