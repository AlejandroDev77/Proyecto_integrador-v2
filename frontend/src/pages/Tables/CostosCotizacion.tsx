import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import CostosCotizacion from "../../components/tables/BasicTables/Costos_Cotizacion";
import ComponentCard from "../../components/common/ComponentCard";

export default function CostosCotizacionPage() {
  return (
    <>
      <PageMeta
        title="Costos de Cotización | Dashboard"
        description="Gestión de costos de cotización"
      />
      <PageBreadcrumb pageTitle="Costos de Cotización" />
      <div className="space-y-6">
        <ComponentCard title="Costos de Cotización">
          <CostosCotizacion />
        </ComponentCard>
      </div>
    </>
  );
}
