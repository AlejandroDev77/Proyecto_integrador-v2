import { useState } from "react";
import { useComprasMateriales } from "../../../hooks/compras_materiales/useComprasMateriales";
import ModalAgregarCompraMaterial from "../../ui/modal/compra_material/AgregarModal";
import ModalEditarCompraMaterial from "../../ui/modal/compra_material/EditarModal";
import ModalVerCompraMaterial from "../../ui/modal/compra_material/VerDatos";
import CompraMaterialesAdvancedFilters from "../../filters/CompraMaterialesAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
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

export default function ComprasMateriales() {
  const {
    setComprasMateriales,
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
  } = useComprasMateriales();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [compramaterialSeleccionado, setCompraMaterialSeleccionado] =
    useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  /*   const [filtroFecha, setFiltroFecha] = useState(""); // Estado para el filtro de fecha
  const [filtroEstado, setFiltroEstado] = useState(""); // Estado para el filtro de estado */
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_comp: number) => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar este compra-material?"
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
        `http://localhost:8000/api/compra-material/${id_comp}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error("Error al eliminar CompraMaterial");

      setComprasMateriales((prev) =>
        prev.filter((comp) => comp.id_comp !== id_comp)
      );
    } catch (error) {
      console.error("Error al eliminar CompraMaterial:", error);
      alert("No se pudo eliminar el CompraMaterial.");
    }
  };
  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/compra-material/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compras-materiales-backup.sql";
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
      <CompraMaterialesAdvancedFilters onFiltersChange={setFilters} />
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
                    sortField="cod_comp"
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
                    sortField="fec_comp"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Estado"
                    sortField="est_comp"
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
                    sortField="total_comp"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  proveedor
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  empleado
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
              {paginatedData.map((compramaterial) => (
                <TableRow key={compramaterial.id_comp}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {compramaterial.cod_comp || "sin codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {(() => {
                      const fecha = new Date(compramaterial.fec_comp);
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
                  <TableCell
                    className={`px-4 py-3 text-start text-sm ${textColor}`}
                  >
                    <Badge
                      size="sm"
                      color={
                        compramaterial.est_comp === "Completado"
                          ? "success"
                          : compramaterial.est_comp === "Cancelado"
                          ? "error"
                          : "warning"
                      }
                    >
                      {compramaterial.est_comp}
                    </Badge>
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {compramaterial.total_comp} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {compramaterial.proveedor?.nom_prov}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {compramaterial.empleado?.nom_emp}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setCompraMaterialSeleccionado(compramaterial);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setCompraMaterialSeleccionado(compramaterial);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () => handleEliminar(compramaterial.id_comp),
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
      <ModalAgregarCompraMaterial
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setComprasMateriales={setComprasMateriales}
      />

      <ModalEditarCompraMaterial
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        compramaterialSeleccionado={compramaterialSeleccionado}
        setComprasMateriales={setComprasMateriales}
      />
      <ModalVerCompraMaterial
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        compramaterialSeleccionado={compramaterialSeleccionado}
      />
    </div>
  );
}
