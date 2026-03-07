import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Clientes from "../../components/tables/BasicTables/Clientes";


{/* esto es para recibir las credenciales del rol para seccionarlo solo para 
  recordarme porque soy medio gil */} 

export default function tableclientes() {
 
  return (
    <>
    
      <PageMeta
        title="Bosquejo"
        description=""
      />
      
      <PageBreadcrumb pageTitle="Tabla Cliente" />

      
        <div className="space-y-6">
          <ComponentCard title="Clientes ">
            <Clientes />
          </ComponentCard>
        </div>
      
    </>
  );
}
