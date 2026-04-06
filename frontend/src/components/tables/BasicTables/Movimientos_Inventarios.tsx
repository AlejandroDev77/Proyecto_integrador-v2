import { useState } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import Button from "../../ui/button/Button";
import { useMovimientosInventarios } from "../../../hooks/movimientos_inventarios/useMovimientos_Inventarios";
import MovimientosInventarioAdvancedFilters from "../../filters/MovimientosInventarioAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import ModalAgregarMovimientoInventario from "../../ui/modal/movimiento_inventario/AgregarModal";
import ModalEditarMovimientoInventario from "../../ui/modal/movimiento_inventario/EditarModal";
import ModalVerMovimientoInventario from "../../ui/modal/movimiento_inventario/VerDatos";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

const textColor = "text-gray-800 dark:text-white/90";

export default function MovimientosInventarios() {
  const {
    setMovimietosInventarios,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showModalAgregar,
    setShowModalAgregar,
    paginatedData,
    totalPages,
    setFilters,
    setSort,
  } = useMovimientosInventarios();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [movimientoSeleccionado, setMovimientoSeleccionado] =
    useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_mov: number) => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar este movimiento?"
    );
    if (!confirm) return;
    let idUsuarioLocal = null;
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "null");
      idUsuarioLocal = userObj && userObj.id_usu ? userObj.id_usu : null;
    } catch (e) {
      idUsuarioLocal = null;
    }

    const headers = {
      "Content-Type": "application/json",
      ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/movimiento-inventario/${id_mov}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error("Error al eliminar movimiento");

      setMovimietosInventarios((prev) =>
        prev.filter((mov) => mov.id_mov !== id_mov)
      );
    } catch (error) {
      console.error("Error al eliminar movimiento:", error);
      alert("No se pudo eliminar el movimiento.");
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/movimiento-inventario/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "movimientos_inventarios-backup.sql";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el respaldo:", error);
    }
  }; */

  return (
    <div>
      {/* Filtros avanzados */}

      <MovimientosInventarioAdvancedFilters onFiltersChange={setFilters} />

      {/* Filtros para el reporte */}
      {/* <div className="flex flex-wrap justify-between items-center p-4 gap-4">
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <button
            onClick={generarReporte}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-md text-sm w-full md:w-auto"
          >
            <FaFileAlt /> Generar Reporte
          </button>
        </div>
      </div> */}

      {/* Search and Add Button */}
      <div className="flex flex-wrap justify-between items-center p-4 gap-4">
        <Button
          onClick={() => setShowModalAgregar(true)}
          startIcon={<Plus size={20} />}
          size="sm"
        >
          {""}
        </Button>
      </div>

      {/* Items per page */}
      <div className="p-4 flex flex-wrap gap-4 items-center">
        <label
          htmlFor="itemsPerPage"
          className={`mr-2 ${textColor} w-full md:w-auto`}
        >
          Items por página:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-2 py-1 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-full md:w-auto"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Código"
                    sortField="cod_mov"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Tipo"
                    sortField="tipo_mov"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Fecha"
                    sortField="fecha_mov"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Cantidad"
                    sortField="cantidad"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Stock Anterior
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Stock Posterior
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Motivo
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Material
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Mueble
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
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {paginatedData.map((movimiento) => (
                <TableRow key={movimiento.id_mov}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {movimiento.cod_mov || "sin codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        movimiento.tipo_mov === "Entrada"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {movimiento.tipo_mov}
                    </span>
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {movimiento.fecha_mov
                      ? new Date(movimiento.fecha_mov).toLocaleDateString(
                          "es-BO",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : ""}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {movimiento.cantidad}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {movimiento.stock_anterior}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {movimiento.stock_posterior}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {movimiento.motivo || "-"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {movimiento.material?.nom_mat || "-"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {movimiento.mueble?.nom_mue || "-"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {movimiento.empleado
                      ? `${movimiento.empleado.nom_emp} ${movimiento.empleado.ap_pat_emp}`
                      : "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setMovimientoSeleccionado(movimiento);
                          setShowModalVer(true);
                        }}
                        className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        title="Ver"
                      >
                        <Eye size={20} strokeWidth={2.2} />
                      </button>
                      <button
                        onClick={() => {
                          setMovimientoSeleccionado(movimiento);
                          setShowModalEditar(true);
                        }}
                        className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={20} strokeWidth={2.2} />
                      </button>
                      <button
                        onClick={() => handleEliminar(movimiento.id_mov)}
                        className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={20} strokeWidth={2.2} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap justify-between items-center p-4 gap-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-md disabled:opacity-50 w-full md:w-auto ${textColor}`}
          >
            Anterior
          </button>
          <span className={`w-full text-center md:w-auto ${textColor}`}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-md disabled:opacity-50 w-full md:w-auto ${textColor}`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modals */}
      <ModalAgregarMovimientoInventario
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setMovimientosInventarios={setMovimietosInventarios}
      />

      <ModalEditarMovimientoInventario
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        movimientoSeleccionado={movimientoSeleccionado}
        setMovimientosInventarios={setMovimietosInventarios}
      />
      <ModalVerMovimientoInventario
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        movimientoSeleccionado={movimientoSeleccionado}
      />
    </div>
  );
}
