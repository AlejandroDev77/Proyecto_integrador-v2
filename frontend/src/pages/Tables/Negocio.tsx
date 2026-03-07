import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Negocio from "../../components/tables/BasicTables/Negocio";

{
  /* esto es para recibir las credenciales del rol para seccionarlo solo para 
  recordarme porque soy medio gil */
}

export default function negocio() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />

      <PageBreadcrumb pageTitle="Tabla Negocio" />

      <div className="space-y-6">
        <ComponentCard title="Negocio ">
          <Negocio />
        </ComponentCard>
      </div>
    </>
  );
}
