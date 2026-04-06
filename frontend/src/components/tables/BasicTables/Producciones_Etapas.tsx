import { useState } from "react";
import { useProduccionesEtapas } from "../../../hooks/producciones_etapas/useProduccion_Etapa";
import ProduccionesEtapasAdvancedFilters from "../../filters/ProduccionesEtapasAdvancedFilters";
import ModalAgregarProduccionEtapa from "../../ui/modal/produccion_etapa/AgregarModal";
import ModalEditarProduccionEtapa from "../../ui/modal/produccion_etapa/EditarModal";
import ModalVerProduccionEtapa from "../../ui/modal/produccion_etapa/VerDatos";
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

export default function ProduccionEtapa() {
  const {
    setProduccionesEtapas,
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
  } = useProduccionesEtapas();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [produccionetapaSeleccionado, setProduccionEtapaSeleccionado] =
    useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const handleEliminar = async (id_pro_eta: number) => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar esta producción etapa?"
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
        `http://localhost:8080/api/produccion-etapa/${id_pro_eta}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error("Error al eliminar producción etapa");

      setProduccionesEtapas((prev) =>
        prev.filter((pta) => pta.id_pro_eta !== id_pro_eta)
      );
    } catch (error) {
      console.error("Error al eliminar producción etapa:", error);
      alert("No se pudo eliminar la producción etapa.");
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/produccion-etapa/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "produccion-etapa-backup.sql";
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
      <ProduccionesEtapasAdvancedFilters onFiltersChange={setFilters} />

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
                  Fecha Inicio{" "}
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Fecha Fin
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
                  Nota
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
                  Produccion inicio
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Produccion fin
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Nombre Etapa
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
              {paginatedData.map((produccionetapa) => (
                <TableRow key={produccionetapa.id_pro_eta}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccionetapa.cod_pro_eta || "Sin Codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccionetapa.fec_ini
                      ? (() => {
                          const fecha = new Date(produccionetapa.fec_ini);
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
                    {produccionetapa.fec_fin
                      ? (() => {
                          const fecha = new Date(produccionetapa.fec_fin);
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
                        produccionetapa.est_eta === "Completado"
                          ? "success"
                          : produccionetapa.est_eta === "Cancelado"
                          ? "error"
                          : "warning"
                      }
                    >
                      {produccionetapa.est_eta || "Sin estado"}
                    </Badge>
                  </TableCell>

                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccionetapa.notas || "Sin nota"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccionetapa.empleado
                      ? `${produccionetapa.empleado.nom_emp} ${produccionetapa.empleado.ap_pat_emp} ${produccionetapa.empleado.ap_mat_emp}`
                      : "Sin empleado"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccionetapa.produccion?.fec_ini
                      ? (() => {
                          const fecha = new Date(
                            produccionetapa.produccion?.fec_ini
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
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccionetapa.produccion?.fec_fin
                      ? (() => {
                          const fecha = new Date(
                            produccionetapa.produccion?.fec_fin
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
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {produccionetapa.etapa?.nom_eta || "Sin etapa"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setProduccionEtapaSeleccionado(produccionetapa);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setProduccionEtapaSeleccionado(produccionetapa);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () =>
                            handleEliminar(produccionetapa.id_pro_eta),
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
      <ModalAgregarProduccionEtapa
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setProduccionesEtapas={setProduccionesEtapas}
      />

      <ModalEditarProduccionEtapa
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        produccionetapaSeleccionado={produccionetapaSeleccionado}
        setProduccionesEtapas={setProduccionesEtapas}
      />
      <ModalVerProduccionEtapa
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        produccionetapaSeleccionado={produccionetapaSeleccionado}
      />
    </div>
  );
}
