import { useState } from "react";
import { usePagos } from "../../../hooks/pagos/usePagos";
import ModalAgregarPago from "../../ui/modal/pago/AgregarModal";
import ModalEditarPago from "../../ui/modal/pago/EditarModal";
import ModalVerPago from "../../ui/modal/pago/VerDatos";
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

import SortableTableHeader from "../../ui/SortableTableHeader";
import PagosAdvancedFilters from "../../filters/PagosAdvancedFilters";

const textColor = "text-gray-800 dark:text-white/90";

export default function Pagos() {
  const {
    setPagos,
    /*     searchTerm,
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
  } = usePagos();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };
  const handleEliminar = async (id_pag: number) => {
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
      const res = await fetch(`http://localhost:8080/api/pago/${id_pag}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar mueble");

      setPagos((prev) => prev.filter((pag) => pag.id_pag !== id_pag));
    } catch (error) {
      console.error("Error al eliminar mueble:", error);
      alert("No se pudo eliminar el mueble.");
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/pago/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pagos-backup.sql";
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
      <PagosAdvancedFilters onFiltersChange={setFilters} />

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
                    label="Código Pago"
                    sortField="cod_pag"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-4 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Fecha Pago"
                    sortField="fec_pag"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-4 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Monto"
                    sortField="monto"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Metodo Pago"
                    sortField="metodo_pag"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Referencia Pago"
                    sortField="referencia_pag"
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
                  className={`px-4 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Total Venta"
                    sortField="ventas.total_ven"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>

                <TableCell
                  isHeader
                  className={`px-4 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {paginatedData.map((pago) => (
                <TableRow key={pago.id_pag}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {pago.cod_pag || "Sin Codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {(() => {
                      const fecha = new Date(pago.fec_pag);
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
                    {pago.monto} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {pago.metodo_pag}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {pago.referencia_pag}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-sm ${textColor}`}
                  >
                    <Badge
                      size="sm"
                      color={
                        pago.venta?.est_ven === "Completado"
                          ? "success"
                          : pago.venta?.est_ven === "cancelado"
                          ? "error"
                          : "warning"
                      }
                    >
                      {pago.venta?.est_ven ?? "pendiente"}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-sm ${textColor}`}
                  >
                    {pago.venta?.total_ven ?? "-"} Bs.
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setPagoSeleccionado(pago);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setPagoSeleccionado(pago);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () => handleEliminar(pago.id_pag),
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
      <ModalAgregarPago
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setPagos={setPagos}
      />

      <ModalEditarPago
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        pagoSeleccionado={pagoSeleccionado}
        setPagos={setPagos}
      />
      <ModalVerPago
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        pagoSeleccionado={pagoSeleccionado}
      />
    </div>
  );
}
