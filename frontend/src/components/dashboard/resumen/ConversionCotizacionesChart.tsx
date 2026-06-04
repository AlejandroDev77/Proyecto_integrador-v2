import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDashboard } from "../../../context/DashboardContext";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative overflow-hidden rounded-[2rem] bg-white/60 p-5 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-lg sm:p-6"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#a67c52]/10 rounded-full mix-blend-multiply filter blur-[60px] -mr-10 -mt-10 pointer-events-none" />
      
      <div className="relative z-10">
        <h3 className="text-xl font-black text-gray-900 dark:text-white drop-shadow-sm mb-1">
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
            <p className="text-2xl font-black text-gray-800 dark:text-white/90 group-hover:scale-110 transition-transform">
              {total}
            </p>
            <p className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
              Total
            </p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
          <div className="text-center group">
            <p className="text-2xl font-black text-[#a67c52] dark:text-[#d4b48f] group-hover:scale-110 transition-transform">
              {aprobadas}
            </p>
            <p className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">Aprobadas</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
          <div className="text-center group">
            <p className="text-2xl font-black text-gray-400 dark:text-gray-500 group-hover:scale-110 transition-transform">
              {total - aprobadas}
            </p>
            <p className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
              Pendientes
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
