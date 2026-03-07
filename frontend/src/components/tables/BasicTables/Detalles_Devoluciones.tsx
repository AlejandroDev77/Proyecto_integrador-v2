import { useState } from "react";
import { useDetallesDevoluciones } from "../../../hooks/detalles_devoluciones/useDetalles_Devoluciones";
import DetalleDevolucionAdvancedFilters from "../../filters/DetalleDevolucionAdvancedFilters";
import ModalAgregarDetalleDevolucion from "../../ui/modal/detalle_devolucion/AgregarModal";
import ModalEditarDetalleDevolucion from "../../ui/modal/detalle_devolucion/EditarModal";
import ModalVerDetalleDevolucion from "../../ui/modal/detalle_devolucion/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus } from "lucide-react";
import Badge from "../../ui/badge/Badge";
import "react-datepicker/dist/react-datepicker.css";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

const textColor = "text-gray-800 dark:text-white/90";

export default function DetallesDevoluciones() {
  const {
    setDetallesDevoluciones,
    /* searchTerm,
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
  } = useDetallesDevoluciones();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [detalledevolucionSeleccionado, setDetalleDevolucionSeleccionado] =
    useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const handleEliminar = async (id_det_dev: number) => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar este detalle de devolución?"
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
        `http://localhost:8000/api/detalle-devolucion/${id_det_dev}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error("Error al eliminar detalle de devolución");

      setDetallesDevoluciones((prev) =>
        prev.filter((dev) => dev.id_det_dev !== id_det_dev)
      );
    } catch (error) {
      console.error("Error al eliminar detalle de devolución:", error);
      alert("No se pudo eliminar el detalle de devolución.");
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/detalle-devolucion/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "detalles-devoluciones-backup.sql";
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
      {/* Advanced Filters */}
      <DetalleDevolucionAdvancedFilters onFiltersChange={setFilters} />

      {/* Filtros para el reporte */}
      {/* <div className="flex flex-wrap justify-between items-center p-4 gap-4">
        <div className="flex flex-wrap gap-4 w-full md:w-auto"></div>

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
                  Codigo
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Cantidad
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Precio Unitario
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  SubTotal
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Fecha Devolucion
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Estado
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
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {paginatedData.map((detalledevolucion) => (
                <TableRow key={detalledevolucion.id_det_dev}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalledevolucion.cod_det_dev || "sin codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalledevolucion.cantidad}[u]
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalledevolucion.precio_unitario} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalledevolucion.subtotal} Bs.
                  </TableCell>

                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalledevolucion.devolucion?.fec_dev
                      ? (() => {
                          const fecha = new Date(
                            detalledevolucion.devolucion.fec_dev
                          );
                          fecha.setMinutes(
                            fecha.getMinutes() + fecha.getTimezoneOffset()
                          );
                          return fecha.toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          });
                        })()
                      : "Sin fecha"}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-sm ${textColor}`}
                  >
                    <Badge
                      size="sm"
                      color={
                        detalledevolucion.devolucion?.est_dev === "Completado"
                          ? "success"
                          : detalledevolucion.devolucion?.est_dev ===
                            "Cancelado"
                          ? "error"
                          : "warning"
                      }
                    >
                      {detalledevolucion.devolucion?.est_dev || "Sin estado"}
                    </Badge>
                  </TableCell>

                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detalledevolucion.mueble?.nom_mue}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setDetalleDevolucionSeleccionado(detalledevolucion);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setDetalleDevolucionSeleccionado(detalledevolucion);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () =>
                            handleEliminar(detalledevolucion.id_det_dev),
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
      <ModalAgregarDetalleDevolucion
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setDetallesDevoluciones={setDetallesDevoluciones}
      />

      <ModalEditarDetalleDevolucion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        detalledevolucionSeleccionado={detalledevolucionSeleccionado}
        setDetallesDevoluciones={setDetallesDevoluciones}
      />
      <ModalVerDetalleDevolucion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        detalledevolucionSeleccionado={detalledevolucionSeleccionado}
      />
    </div>
  );
}
