import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PruebaEnhanced from "../../components/tables/BasicTables/PruebaEnhanced";

export default function PruebaModificacion3D() {
  return (
    <>
      <PageMeta
        title="Visualizador 3D Profesional | Editor de Modelos"
        description="Visualizador y editor 3D profesional con soporte para GLB/GLTF, cambio de colores, texturas, dimensiones y más"
      />

      <PageBreadcrumb pageTitle="Visualizador 3D" />

      <div className="space-y-6">
        <PruebaEnhanced />
      </div>
    </>
  );
}
