import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Categorias_Muebles from "../../components/tables/BasicTables/Categorias_Muebles";


{/* esto es para recibir las credenciales del rol para seccionarlo solo para 
  recordarme porque soy medio gil */} 

export default function tablecategorias_muebles() {
 

  return (
    <>
    
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      
      <PageBreadcrumb pageTitle="Tabla Categoria" />

  
        <div className="space-y-6">
          <ComponentCard title="Categorias Muebles ">
            <Categorias_Muebles />
          </ComponentCard>
        </div>
    
    </>
  );
}
