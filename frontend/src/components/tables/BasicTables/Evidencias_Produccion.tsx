import { useState } from "react";
import { useEvidenciasProduccion } from "../../../hooks/evidencias_produccion/useEvidenciasProduccion";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import ModalAgregarEvidencia from "../../ui/modal/evidencia_produccion/AgregarModal";
import ModalEditarEvidencia from "../../ui/modal/evidencia_produccion/EditarModal";
import ModalVerEvidencia from "../../ui/modal/evidencia_produccion/VerDatos";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

const textColor = "text-gray-800 dark:text-white/90";

interface EvidenciaProduccion {
  id_evi: number;
  cod_evi?: string;
  id_pro_eta: number;
  tipo_evi: string;
  archivo_evi?: string;
  descripcion?: string;
  fec_evi?: string;
  id_emp: number;
  produccion_etapa?: {
    id_pro_eta: number;
    id_pro: number;
    etapa?: { nom_eta: string };
  };
  empleado?: { nom_emp: string; ape_emp?: string };
}

export default function EvidenciasProduccion() {
  const {
    setEvidenciasProduccion,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    paginatedData,
    loading,
  } = useEvidenciasProduccion();

  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [seleccionado, setSeleccionado] = useState<EvidenciaProduccion | null>(
    null
  );

  const handleEliminar = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar evidencia?",
      text: "El archivo también será eliminado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/evidencia-produccion/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Error");
      setEvidenciasProduccion((prev) => prev.filter((e) => e.id_evi !== id));
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({ icon: "error", title: "Error al eliminar" });
    }
  };

  const formatFecha = (fecha?: string) => {
    if (!fecha) return "-";
    const d = new Date(fecha);
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center p-4 gap-4">
        <Button
          onClick={() => setShowModalAgregar(true)}
          startIcon={<Plus size={20} />}
          size="sm"
        >
          {""}
        </Button>
      </div>

      <div className="p-4 flex flex-wrap gap-4 items-center">
        <label htmlFor="itemsPerPage" className={`mr-2 ${textColor}`}>
          Items por página:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-2 py-1 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Código
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Etapa
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Tipo
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Descripción
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Fecha
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Empleado
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Archivo
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {paginatedData.map((evi) => (
                <TableRow key={evi.id_evi}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {evi.cod_evi || `EVI-${evi.id_evi}`}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {evi.produccion_etapa?.etapa?.nom_eta ||
                      `Etapa ${evi.id_pro_eta}`}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {evi.tipo_evi}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {evi.descripcion || "-"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {formatFecha(evi.fec_evi)}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {evi.empleado?.nom_emp} {evi.empleado?.ape_emp || ""}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {evi.archivo_evi ? (
                      <a
                        href={
                          evi.archivo_evi.startsWith("http")
                            ? evi.archivo_evi
                            : `http://localhost:8080/storage/${evi.archivo_evi}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Ver archivo
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setSeleccionado(evi);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setSeleccionado(evi);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () => handleEliminar(evi.id_evi),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap justify-between items-center p-4 gap-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-md disabled:opacity-50 ${textColor}`}
          >
            Anterior
          </button>
          <span className={textColor}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-md disabled:opacity-50 ${textColor}`}
          >
            Siguiente
          </button>
        </div>
      </div>

      <ModalAgregarEvidencia
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setEvidenciasProduccion={setEvidenciasProduccion}
      />
      <ModalEditarEvidencia
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        evidenciaSeleccionado={seleccionado}
        setEvidenciasProduccion={setEvidenciasProduccion}
      />
      <ModalVerEvidencia
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        evidenciaSeleccionado={seleccionado}
      />
    </div>
  );
}
