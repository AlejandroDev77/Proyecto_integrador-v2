import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Muebles_Materiales from "../../components/tables/BasicTables/Muebles_Materiales";



export default function tablemuebles_materiales() {
  

  return (
    <>
    
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      
      <PageBreadcrumb pageTitle="Tabla Mueble-Material" />

      
        <div className="space-y-6">
          <ComponentCard title="Muebles Materiales ">
            <Muebles_Materiales />
          </ComponentCard>
        </div>
      
    </>
  );
}
