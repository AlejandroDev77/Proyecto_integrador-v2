import DashboardMetrics from "../resumen/DashboardMetrics";
import StatisticsChart from "../resumen/StatisticsChart";
import MonthlyTarget from "../resumen/MonthlyTarget";
import ConversionCotizacionesChart from "../resumen/ConversionCotizacionesChart";
import AlertasInventario from "../inventario/AlertasInventario";

export default function ResumenTab() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <DashboardMetrics />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8">
          <StatisticsChart />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <MonthlyTarget />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <ConversionCotizacionesChart />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <AlertasInventario />
        </div>
      </div>
    </div>
  );
}
