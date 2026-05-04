import VentasVsComprasChart from "../ventas/VentasVsComprasChart";
import VentasPorCategoriaChart from "../ventas/VentasPorCategoriaChart";
import VentasCantidadChart from "../ventas/VentasCantidadChart";
import TopMueblesChart from "../ventas/TopMueblesChart";
import MonthlySalesChart from "../ventas/MonthlySalesChart";

export default function VentasTab() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7">
          <VentasVsComprasChart />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <VentasPorCategoriaChart />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <VentasCantidadChart />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <TopMueblesChart />
        </div>
      </div>
      <MonthlySalesChart />
    </div>
  );
}
