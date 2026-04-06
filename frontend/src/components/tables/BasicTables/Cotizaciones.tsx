import { useState } from "react";
import { useCotizaciones } from "../../../hooks/cotizaciones/useCotizaciones";
import CotizacionesAdvancedFilters from "../../filters/CotizacionesAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus, Settings } from "lucide-react";
import ModalAgregarCotizacion from "../../ui/modal/cotizacion/AgregarModal";
import ModalEditarCotizacion from "../../ui/modal/cotizacion/EditarModal";
import ModalVerCotizacion from "../../ui/modal/cotizacion/VerDatos";
import ModalGestionCotizacion from "../../ui/modal/negocio/ModalGestionCotizacion";
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

export default function Cotizaciones() {
  const {
    setCotizaciones,
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
  } = useCotizaciones();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [cotizacionSeleccionado, setCotizacionSeleccionado] =
    useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [showModalGestion, setShowModalGestion] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const fetchCotizacionesData = async () => {
    // Refresh by toggling filters - simple approach
    setFilters({});
  };
  const handleEliminar = async (id_cot: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este mueble?");
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
        `http://localhost:8080/api/cotizacion/${id_cot}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error("Error al eliminar mueble");

      setCotizaciones((prev) => prev.filter((cot) => cot.id_cot !== id_cot));
    } catch (error) {
      console.error("Error al eliminar mueble:", error);
      alert("No se pudo eliminar el mueble.");
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/cotizacion/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cotizaciones-backup.sql";
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
      <CotizacionesAdvancedFilters onFiltersChange={setFilters} />

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
                  <SortableTableHeader
                    label="Codigo"
                    sortField="cod_cot"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Fecha Cotizacion"
                    sortField="fec_cot"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>

                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Validez (Días)"
                    sortField="validez_dias"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Total"
                    sortField="total_cot"
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
                    sortField="descuento"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Notas"
                    sortField="notas"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-4 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Cliente"
                    sortField="clientes.nom_cli"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-4 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Empleado"
                    sortField="empleados.nom_emp"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-4 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Estado"
                    sortField="est_cot"
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
              {paginatedData.map((cotizacion) => (
                <TableRow key={cotizacion.id_cot}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {cotizacion.cod_cot || "sin codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {(() => {
                      const fecha = new Date(cotizacion.fec_cot);
                      fecha.setMinutes(
                        fecha.getMinutes() + fecha.getTimezoneOffset()
                      );
                      return fecha.toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      });
                    })()}
                  </TableCell>

                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {cotizacion.validez_dias} Dias.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {cotizacion.total_cot} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {cotizacion.descuento} Bs
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {cotizacion.notas}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {cotizacion.cliente
                      ? `${cotizacion.cliente.nom_cli} ${cotizacion.cliente.ap_pat_cli} ${cotizacion.cliente.ap_mat_cli}`
                      : ""}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {cotizacion.empleado
                      ? `${cotizacion.empleado.nom_emp} ${cotizacion.empleado.ap_pat_emp} ${cotizacion.empleado.ap_mat_emp}`
                      : ""}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-sm ${textColor}`}
                  >
                    <Badge
                      size="sm"
                      color={
                        cotizacion.est_cot === "Aprobado"
                          ? "success"
                          : cotizacion.est_cot === "Rechazado"
                          ? "error"
                          : "warning"
                      }
                    >
                      {cotizacion.est_cot}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <div className="flex items-center gap-1">
                      <TableActionButtons
                        actions={[
                          {
                            type: "view",
                            onClick: () => {
                              setCotizacionSeleccionado(cotizacion);
                              setShowModalVer(true);
                            },
                          },
                          {
                            type: "edit",
                            onClick: () => {
                              console.log(
                                "Cotización seleccionada:",
                                cotizacion
                              );
                              setCotizacionSeleccionado(cotizacion);
                              setShowModalEditar(true);
                            },
                          },
                          {
                            type: "delete",
                            onClick: () => handleEliminar(cotizacion.id_cot),
                          },
                        ]}
                      />
                      {cotizacion.est_cot === "Pendiente" && (
                        <button
                          onClick={() => {
                            setCotizacionSeleccionado(cotizacion);
                            setShowModalGestion(true);
                          }}
                          className="ml-1 px-2 py-1 text-xs bg-amber-500 text-white rounded hover:bg-amber-600 flex items-center gap-1"
                          title="Gestionar Cotización"
                        >
                          <Settings className="w-3 h-3" />
                          Gestionar
                        </button>
                      )}
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
      <ModalAgregarCotizacion
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setCotizaciones={setCotizaciones}
      />

      <ModalEditarCotizacion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        cotizacionSeleccionada={cotizacionSeleccionado}
        setCotizaciones={setCotizaciones}
      />
      <ModalVerCotizacion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        cotizacionSeleccionada={cotizacionSeleccionado}
      />
      <ModalGestionCotizacion
        showModal={showModalGestion}
        setShowModal={setShowModalGestion}
        cotizacion={cotizacionSeleccionado}
        onUpdate={fetchCotizacionesData}
      />
    </div>
  );
}
