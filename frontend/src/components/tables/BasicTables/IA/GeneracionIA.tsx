import { useState, useEffect, useCallback } from "react";
import Badge from "../../../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import Button from "../../../ui/button/Button";
import { Plus, Eye, RefreshCw, Trash2, Box } from "lucide-react";
import { generacionIAService } from "../../../../services/generacionIAService";
import { GeneracionIA as IGeneracionIA } from "../../../../types/generacionIA";
import Generar3DModal from "../../../ui/modal/ia/Generar3DModal";
import Visualizador3DModal from "../../../ui/modal/ia/Visualizador3DModal";
import Swal from "sweetalert2";

const textColor = "text-gray-800 dark:text-white/90";

export default function GeneracionIA() {
  const [generaciones, setGeneraciones] = useState<IGeneracionIA[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Visualizador states
  const [showVisualizador, setShowVisualizador] = useState(false);
  const [selectedModelUrl, setSelectedModelUrl] = useState<string | null>(null);
  const [selectedModelTitle, setSelectedModelTitle] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await generacionIAService.getAll();
      setGeneraciones(data.data || []);
    } catch (error) {
      console.error("Error fetching generations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await generacionIAService.delete(id);
        setGeneraciones(prev => prev.filter(g => g.id !== id));
        Swal.fire("Eliminado", "La generación ha sido eliminada.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la generación.", "error");
      }
    }
  };

  const handleVerModelo = (gen: IGeneracionIA) => {
    if (gen.modelo_3d_url) {
      setSelectedModelUrl(gen.modelo_3d_url);
      setSelectedModelTitle(gen.nom_mue);
      setShowVisualizador(true);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center p-4 gap-4">
        <Button
          onClick={() => setShowModal(true)}
          startIcon={<Plus size={20} />}
          size="sm"
        >
          Nueva Generación
        </Button>
        <button 
          onClick={fetchData}
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
          title="Actualizar"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}>
                  Nombre Mueble
                </TableCell>
                <TableCell isHeader className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}>
                  Imágenes
                </TableCell>
                <TableCell isHeader className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}>
                  Estado
                </TableCell>
                <TableCell isHeader className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}>
                  Modelo 3D
                </TableCell>
                <TableCell isHeader className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="px-5 py-10 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Cargando generaciones...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : generaciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="px-5 py-10 text-center text-gray-500">
                    No hay generaciones registradas.
                  </TableCell>
                </TableRow>
              ) : (
                generaciones.map((gen) => (
                  <TableRow key={gen.id}>
                    <TableCell className={`px-5 py-4 ${textColor}`}>
                      {gen.nom_mue}
                    </TableCell>
                    <TableCell className={`px-5 py-4 ${textColor}`}>
                      <div className="flex gap-2 flex-wrap max-w-[200px]">
                        {gen.imgs_ref && gen.imgs_ref.map((img, index) => (
                          <img key={index} src={img} alt="Ref" className="w-10 h-10 rounded border object-cover" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className={`px-5 py-4 ${textColor}`}>
                      <Badge
                        size="sm"
                        color={
                          gen.estado === "completado" ? "success" : 
                          gen.estado === "procesando" ? "warning" : "error"
                        }
                      >
                        {gen.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className={`px-5 py-4 ${textColor}`}>
                      {gen.modelo_3d_url ? (
                        <button 
                          onClick={() => handleVerModelo(gen)}
                          className="text-blue-500 hover:text-blue-700 underline flex items-center gap-1"
                        >
                          <Box size={14} /> Ver Modelo
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">No disponible</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-sm">
                      <div className="flex items-center gap-3">
                          <button className="text-gray-500 hover:text-blue-600" title="Ver detalles">
                              <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => gen.id && handleDelete(gen.id)}
                            className="text-gray-500 hover:text-red-600" 
                            title="Eliminar"
                          >
                              <Trash2 size={18} />
                          </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Generar3DModal 
        showModal={showModal} 
        setShowModal={setShowModal} 
        onSuccess={fetchData} 
      />

      <Visualizador3DModal 
        isOpen={showVisualizador}
        onClose={() => setShowVisualizador(false)}
        modelUrl={selectedModelUrl || ""}
        title={selectedModelTitle}
      />
    </div>
  );
}
