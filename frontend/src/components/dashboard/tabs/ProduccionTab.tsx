import EstadoProduccionesChart from "../produccion/EstadoProduccionesChart";
import ProduccionesMensualesChart from "../produccion/ProduccionesMensualesChart";

export default function ProduccionTab() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <EstadoProduccionesChart />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <ProduccionesMensualesChart />
        </div>
      </div>
    </div>
  );
}
