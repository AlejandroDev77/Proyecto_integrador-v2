import { useState } from "react";
import { useDetallesVentas } from "../../../hooks/detalles_ventas/useDetallesVentas";
import ModalAgregarDetalleVenta from "../../ui/modal/detalle_venta/AgregarModal";
import ModalEditarDetalleVenta from "../../ui/modal/detalle_venta/EditarModal";
import ModalVerDetalleVenta from "../../ui/modal/detalle_venta/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus } from "lucide-react";
import Badge from "../../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import SortableTableHeader from "../../ui/SortableTableHeader";
import DetalleVentasAdvancedFilters from "../../filters/DetalleVentasAdvancedFilters";

const textColor = "text-gray-800 dark:text-white/90";

export default function detallesventas() {
  const {
    setDetallesVentas,
    /*   searchTerm,
    setSearchTerm, */
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
  } = useDetallesVentas();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [detalleventaSeleccionado, setDetalleVentaSeleccionado] =
    useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false); // Nuevo estado para ver
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };
  const handleEliminar = async (id_det_ven: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta Venta?");
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
        `http://localhost:8000/api/detalle-venta/${id_det_ven}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error("Error al eliminar Venta");

      setDetallesVentas((prev) =>
        prev.filter((det) => det.id_det_ven !== id_det_ven)
      );
    } catch (error) {
      console.error("Error al eliminar Venta:", error);
      alert("No se pudo eliminar el Venta.");
    }
  };

  /* const generarReporte = async () => {
    try {
      // Abrir el PDF directamente en una nueva pestaña del navegador
      window.open(`http://localhost:8000/api/reporte-DetallesVenta`, "_blank");
    } catch (error) {
      console.error("Error al generar el reporte:", error);
    }
  }; */
  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/detalle-venta/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "detalles-ventas-backup.sql";
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
      <DetalleVentasAdvancedFilters onFiltersChange={setFilters} />

      {/* Búsqueda y botones */}
      {/* <div className="flex flex-wrap justify-between items-center p-4 gap-4">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button
              onClick={generarReporte}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-md text-sm w-full md:w-auto"
            >
              <FaFileAlt /> Generar Reporte
            </button>
          </div>
          <button
            onClick={() => setShowModalAgregar(true)}
            className="flex items-center gap-2 bg-orange-300 hover:bg-orange-400 text-white font-semibold px-4 py-2 rounded-md text-sm w-full md:w-auto"
          >
            + Agregar Detalle Ventas
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
                    label="Código Detalle Venta"
                    sortField="cod_det_ven"
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
                  <SortableTableHeader
                    label="Precio Unitario"
                    sortField="precio_unitario"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Descuento"
                    sortField="descuento_item"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Subtotal"
                    sortField="subtotal"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Fecha Venta"
                    sortField="ventas.fec_ven"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Mueble"
                    sortField="muebles.nom_mue"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Estado Venta"
                    sortField="ventas.est_ven"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
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
              {paginatedData.map((detalleventa) => (
                <TableRow key={detalleventa.id_det_ven}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalleventa.cod_det_ven || "sin codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalleventa.cantidad}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalleventa.precio_unitario} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalleventa.descuento_item} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalleventa.subtotal} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalleventa.venta?.fec_ven
                      ? new Date(detalleventa.venta.fec_ven).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : ""}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalleventa.mueble?.nom_mue}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalleventa.venta?.est_ven === "Completado" ? (
                      <Badge color="success">Completado</Badge>
                    ) : detalleventa.venta?.est_ven === "Cancelado" ? (
                      <Badge color="error">Cancelado</Badge>
                    ) : (
                      <Badge color="warning">Pendiente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setDetalleVentaSeleccionado(detalleventa);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setDetalleVentaSeleccionado(detalleventa);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () =>
                            handleEliminar(detalleventa.id_det_ven),
                        },
                      ]}
                    />
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
      <ModalAgregarDetalleVenta
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setDetallesVentas={setDetallesVentas}
      />
      <ModalEditarDetalleVenta
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        detalleSeleccionado={detalleventaSeleccionado}
        setDetallesVentas={setDetallesVentas}
      />
      <ModalVerDetalleVenta
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        detalleSeleccionado={detalleventaSeleccionado}
      />
    </div>
  );
}
