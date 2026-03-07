import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Roles_Permiso from "../../components/tables/BasicTables/Roles_Permiso";

export default function tablerolespermiso() {
  
  
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Tabla Usuarios" />
     
      <div className="space-y-6">
        <ComponentCard title="Roles y Permisos">
          <Roles_Permiso />
        </ComponentCard>
      </div>
      
    </>
  );
}
