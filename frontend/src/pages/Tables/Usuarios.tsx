import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Usuarios from "../../components/tables/BasicTables/Usuarios";

export default function tableusuario() {
  
  
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Tabla Usuarios" />
     
      <div className="space-y-6">
        <ComponentCard title="Usuarios">
          <Usuarios />
        </ComponentCard>
      </div>
      
    </>
  );
}
