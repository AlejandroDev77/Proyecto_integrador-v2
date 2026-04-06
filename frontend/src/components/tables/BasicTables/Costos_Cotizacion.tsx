import { useState } from "react";
import { useCostosCotizacion } from "../../../hooks/costos_cotizacion/useCostosCotizacion";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import ModalAgregarCostoCotizacion from "../../ui/modal/costo_cotizacion/AgregarModal";
import ModalEditarCostoCotizacion from "../../ui/modal/costo_cotizacion/EditarModal";
import ModalVerCostoCotizacion from "../../ui/modal/costo_cotizacion/VerDatos";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

const textColor = "text-gray-800 dark:text-white/90";

interface CostoCotizacion {
  id_costo: number;
  id_cot: number;
  costo_materiales?: number;
  costo_mano_obra?: number;
  costos_indirectos?: number;
  margen_ganancia?: number;
  costo_total?: number;
  precio_sugerido?: number;
  cotizacion?: { cod_cot?: string; fec_cot?: string };
}

export default function CostosCotizacion() {
  const {
    setCostosCotizacion,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    paginatedData,
    loading,
  } = useCostosCotizacion();

  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [seleccionado, setSeleccionado] = useState<CostoCotizacion | null>(
    null
  );

  const handleEliminar = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar costo?",
      text: "Esta acción no se puede deshacer",
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
        `http://localhost:8080/api/costo-cotizacion/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Error");
      setCostosCotizacion((prev) => prev.filter((c) => c.id_costo !== id));
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
                  Cotización
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Materiales
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Mano Obra
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Indirectos
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Margen %
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Costo Total
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Precio Sugerido
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
              {paginatedData.map((costo) => (
                <TableRow key={costo.id_costo}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {costo.cotizacion?.cod_cot || `COT-${costo.id_cot}`}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {Number(costo.costo_materiales || 0).toFixed(2)} Bs
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {Number(costo.costo_mano_obra || 0).toFixed(2)} Bs
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {Number(costo.costos_indirectos || 0).toFixed(2)} Bs
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {Number(costo.margen_ganancia || 0).toFixed(1)}%
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {Number(costo.costo_total || 0).toFixed(2)} Bs
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {Number(costo.precio_sugerido || 0).toFixed(2)} Bs
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setSeleccionado(costo);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setSeleccionado(costo);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () => handleEliminar(costo.id_costo),
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

      <ModalAgregarCostoCotizacion
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setCostosCotizacion={setCostosCotizacion}
      />
      <ModalEditarCostoCotizacion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        costoCotizacionSeleccionado={seleccionado}
        setCostosCotizacion={setCostosCotizacion}
      />
      <ModalVerCostoCotizacion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        costoCotizacionSeleccionado={seleccionado}
      />
    </div>
  );
}
