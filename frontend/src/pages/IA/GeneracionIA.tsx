import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import GeneracionIA from "../../components/tables/BasicTables/IA/GeneracionIA";

export default function GeneracionIAPage() {
  return (
    <>
      <PageMeta
        title="IA Generación 3D | Admin Dashboard"
        description="Gestión de generación de modelos 3D mediante IA"
      />
      
      <PageBreadcrumb pageTitle="IA Generación 3D" />

      <div className="space-y-6">
        <ComponentCard title="Modelos Generados por IA">
          <GeneracionIA />
        </ComponentCard>
      </div>
    </>
  );
}
