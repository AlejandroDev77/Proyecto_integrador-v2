import { useState } from "react";
import { useProducciones } from "../../../hooks/producciones/useProducciones";
import ProduccionesAdvancedFilters from "../../filters/ProduccionesAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus } from "lucide-react";
import ModalAgregarProduccion from "../../ui/modal/produccion/AgregarModal";
import ModalEditarProduccion from "../../ui/modal/produccion/EditarModal";
import ModalVerProduccion from "../../ui/modal/produccion/VerDatos";
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

export default function Produccion() {
  const {
    setProducciones,
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
    setSort,
  } = useProducciones();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [produccionSeleccionado, setProduccionSeleccionado] =
    useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };
  const handleEliminar = async (id_pro: number) => {
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
        `http://localhost:8080/api/produccion/${id_pro}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error("Error al eliminar mueble");

      setProducciones((prev) => prev.filter((pro) => pro.id_pro !== id_pro));
    } catch (error) {
      console.error("Error al eliminar mueble:", error);
      alert("No se pudo eliminar el mueble.");
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/produccion/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "produccion-backup.sql";
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
      <ProduccionesAdvancedFilters onFiltersChange={setFilters} />

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
                    label="Código"
                    sortField="cod_pro"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Fecha Inicio"
                    sortField="fec_ini"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Fecha Fin"
                    sortField="fec_fin"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Fecha Estimada
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Estado"
                    sortField="est_pro"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Prioridad"
                    sortField="prioridad"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Notas
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Fecha Venta
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Estado Venta
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
                  Fecha Cotización
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Estado Cotización
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
              {paginatedData.map((produccion) => (
                <TableRow key={produccion.id_pro}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccion.cod_pro || "sin codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccion.fec_ini
                      ? (() => {
                          const fecha = new Date(produccion.fec_ini);
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
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccion.fec_fin
                      ? (() => {
                          const fecha = new Date(produccion.fec_fin);
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
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccion.fec_fin_estimada
                      ? (() => {
                          const fecha = new Date(produccion.fec_fin_estimada);
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
                        produccion.est_pro === "Completado"
                          ? "success"
                          : produccion.est_pro === "Cancelado"
                          ? "error"
                          : "warning"
                      }
                    >
                      {produccion.est_pro || "Sin estado"}
                    </Badge>
                  </TableCell>

                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccion.prioridad || "Sin Prioridad"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccion.notas || "Sin notas"}
                  </TableCell>

                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccion.venta?.fec_ven
                      ? (() => {
                          const fecha = new Date(produccion.venta?.fec_ven);
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
                        produccion.venta?.est_ven === "Completado"
                          ? "success"
                          : produccion.venta?.est_ven === "Cancelado"
                          ? "error"
                          : "warning"
                      }
                    >
                      {produccion.venta?.est_ven || "Sin estado"}
                    </Badge>
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccion.empleado
                      ? `${produccion.empleado.nom_emp} ${produccion.empleado.ap_pat_emp} ${produccion.empleado.ap_mat_emp}`
                      : "Sin empleado"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccion.cotizacion?.fec_cot
                      ? (() => {
                          const fecha = new Date(
                            produccion.cotizacion?.fec_cot
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
                        produccion.cotizacion?.est_cot === "Aprobado"
                          ? "success"
                          : produccion.cotizacion?.est_cot === "Rechazado"
                          ? "error"
                          : "warning"
                      }
                    >
                      {produccion.cotizacion?.est_cot || "Sin estado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setProduccionSeleccionado(produccion);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setProduccionSeleccionado(produccion);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () => handleEliminar(produccion.id_pro),
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
      <ModalAgregarProduccion
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setProducciones={setProducciones}
      />

      <ModalEditarProduccion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        produccionSeleccionado={produccionSeleccionado}
        setProducciones={setProducciones}
      />
      <ModalVerProduccion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        produccionSeleccionado={produccionSeleccionado}
      />
    </div>
  );
}
