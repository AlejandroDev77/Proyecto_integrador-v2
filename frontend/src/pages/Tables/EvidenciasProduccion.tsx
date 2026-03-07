import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import EvidenciasProduccion from "../../components/tables/BasicTables/Evidencias_Produccion";
import ComponentCard from "../../components/common/ComponentCard";

export default function EvidenciasProduccionPage() {
  return (
    <>
      <PageMeta
        title="Evidencias de Producción | Dashboard"
        description="Gestión de evidencias de producción"
      />
      <PageBreadcrumb pageTitle="Evidencias de Producción" />
      <div className="space-y-6">
        <ComponentCard title="Evidencias de Producción">
          <EvidenciasProduccion />
        </ComponentCard>
      </div>
    </>
  );
}
