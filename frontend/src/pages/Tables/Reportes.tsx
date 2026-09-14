import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Reportes from "../../components/tables/BasicTables/Reportes";

export default function tableReportes() {
  return (
    <>
      <PageMeta
        title="Reportes | Bosquejo"
        description="Página de Reportes de Bosquejo"
      />
      
      <PageBreadcrumb pageTitle="Reportes" />

      <div className="space-y-6">
        <ComponentCard title="Reportes">
          <Reportes />
        </ComponentCard>
      </div>
    </>
  );
}
