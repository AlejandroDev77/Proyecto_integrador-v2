import AlertasInventario from "../inventario/AlertasInventario";
import StockMueblesChart from "../inventario/StockMueblesChart";
import ComprasPorProveedorChart from "../inventario/ComprasPorProveedorChart";

export default function InventarioTab() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <AlertasInventario />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <StockMueblesChart />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <ComprasPorProveedorChart />
        </div>
      </div>
    </div>
  );
}
