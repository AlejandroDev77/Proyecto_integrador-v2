import { useState } from "react";
import { useDetallesCotizaciones } from "../../../hooks/detalles_cotizaciones/useDetalles_Cotizaciones";
import DetalleCotizacionAdvancedFilters from "../../filters/DetalleCotizacionAdvancedFilters";
import ModalAgregarDetalleCotizacion from "../../ui/modal/detalle_cotizacion/AgregarModal";
import ModalEditarDetalleCotizacion from "../../ui/modal/detalle_cotizacion/EditarModal";
import ModalVerDetalleCotizacion from "../../ui/modal/detalle_cotizacion/VerDatos";
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

export default function DetallesCotizaciones() {
  const {
    setDetallesCotizaciones,
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
  } = useDetallesCotizaciones();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [detallecotizacionSeleccionado, setDetalleCotizacionSeleccionado] =
    useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const handleEliminar = async (id_det_cot: number) => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar este detalle de cotización?"
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
        `http://localhost:8080/api/detalle-cotizacion/${id_det_cot}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error("Error al eliminar detalle de cotización");

      setDetallesCotizaciones((prev) =>
        prev.filter((det) => det.id_det_cot !== id_det_cot)
      );
    } catch (error) {
      console.error("Error al eliminar detalle de cotización:", error);
      alert("No se pudo eliminar el detalle de cotización.");
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/detalle-cotizacion/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "detalles-cotizaciones-backup.sql";
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
      <DetalleCotizacionAdvancedFilters onFiltersChange={setFilters} />

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
                  Mueble
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
                  Dimensiones
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
                  Color
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Herrajes
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
                  Precio Unit.
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Subtotal
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Fecha Cot.
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
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {paginatedData.map((detallecotizacion) => (
                <TableRow key={detallecotizacion.id_det_cot}>
                  {/* Codigo */}
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {detallecotizacion.cod_det_cot || "S/C"}
                    </span>
                  </TableCell>

                  {/* Mueble */}
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    <span className="font-medium">
                      {detallecotizacion.nombre_mueble ||
                        detallecotizacion.mueble?.nom_mue ||
                        "-"}
                    </span>
                  </TableCell>

                  {/* Tipo */}
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detallecotizacion.tipo_mueble ? (
                      <span className="text-sm capitalize bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">
                        {detallecotizacion.tipo_mueble}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  {/* Dimensiones */}
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    <span className="text-sm">
                      {detallecotizacion.dimensiones || "-"}
                    </span>
                  </TableCell>

                  {/* Material */}
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    <span className="text-sm">
                      {detallecotizacion.material_principal || "-"}
                    </span>
                  </TableCell>

                  {/* Color */}
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    <span className="text-sm">
                      {detallecotizacion.color_acabado || "-"}
                    </span>
                  </TableCell>

                  {/* Herrajes */}
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    <span className="text-sm truncate max-w-[150px] block">
                      {detallecotizacion.herrajes || "-"}
                    </span>
                  </TableCell>

                  {/* Cantidad */}
                  <TableCell className={`px-5 py-4 ${textColor} text-center`}>
                    <span className="font-medium">
                      {detallecotizacion.cantidad}
                    </span>
                  </TableCell>

                  {/* Precio Unitario */}
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detallecotizacion.precio_unitario} Bs
                  </TableCell>

                  {/* Subtotal */}
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {detallecotizacion.subtotal} Bs
                    </span>
                  </TableCell>

                  {/* Fecha Cotización */}
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {detallecotizacion.cotizacion?.fec_cot
                      ? (() => {
                          const fecha = new Date(
                            detallecotizacion.cotizacion.fec_cot
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
                      : "-"}
                  </TableCell>

                  {/* Estado */}
                  <TableCell
                    className={`px-4 py-3 text-start text-sm ${textColor}`}
                  >
                    <Badge
                      size="sm"
                      color={
                        detallecotizacion.cotizacion?.est_cot === "Aprobado"
                          ? "success"
                          : detallecotizacion.cotizacion?.est_cot ===
                            "Rechazado"
                          ? "error"
                          : "warning"
                      }
                    >
                      {detallecotizacion.cotizacion?.est_cot ?? "Pendiente"}
                    </Badge>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setDetalleCotizacionSeleccionado(detallecotizacion);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setDetalleCotizacionSeleccionado(detallecotizacion);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () =>
                            handleEliminar(detallecotizacion.id_det_cot),
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
      <ModalAgregarDetalleCotizacion
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setDetallesCotizaciones={setDetallesCotizaciones}
      />

      <ModalEditarDetalleCotizacion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        detallecotizacionSeleccionado={detallecotizacionSeleccionado}
        setDetallesCotizaciones={setDetallesCotizaciones}
      />
      <ModalVerDetalleCotizacion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        detallecotizacionSeleccionado={detallecotizacionSeleccionado}
      />
    </div>
  );
}
