import { useState } from "react";
import { useVentas } from "../../../hooks/ventas/useVentas";
import VentasAdvancedFilters from "../../filters/VentasAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { FaFileAlt } from "react-icons/fa";
import { Plus } from "lucide-react";
import ModalAgregarVenta from "../../ui/modal/venta/AgregarModal";
import ModalEditarVenta from "../../ui/modal/venta/EditarModal";
import ModalVerVenta from "../../ui/modal/venta/VerDatos";
import Badge from "../../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

const textColor = "text-gray-800 dark:text-white/90";

export default function ventas() {
  const {
    setVentas,
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
  } = useVentas();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [ventaSeleccionado, setVentaSeleccionado] = useState<any>(null); // Permitir null o un objeto de tipo Venta
  const [showModalVer, setShowModalVer] = useState(false); // Nuevo estado para ver
  /*   const [filtroFecha, setFiltroFecha] = useState(""); // Estado para el filtro de fecha
  const [filtroEstado, setFiltroEstado] = useState(""); // Estado para el filtro de estado */
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_ven: number) => {
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
      const res = await fetch(`http://localhost:8080/api/venta/${id_ven}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar Venta");

      setVentas((prev) => prev.filter((ven) => ven.id_ven !== id_ven));
    } catch (error) {
      console.error("Error al eliminar Venta:", error);
      alert("No se pudo eliminar el Venta.");
    }
  };
  const generarReporte = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reporte-Ventas`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Error al generar el reporte");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte-ventas.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el reporte:", error);
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/venta/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ventas-backup.sql";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el respaldo:", error);
    }
  }; */

  return (
    <div className="w-full">
      {/* Advanced Filters */}
      <VentasAdvancedFilters onFiltersChange={setFilters} />

      {/* Filtros para el reporte */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 p-4">
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <button
            onClick={generarReporte}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-md text-sm"
          >
            <FaFileAlt /> Generar Reporte
          </button>
        </div>
      </div> 

      <div className="flex flex-wrap justify-between items-center p-4 gap-4">
        <Button
          onClick={() => setShowModalAgregar(true)}
          startIcon={<Plus size={20} />}
          size="sm"
        >
          {""}
        </Button>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center">
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
      </div>

      {/* Tabla con los estilos de borde */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 mx-4">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Codigo"
                    sortField="cod_ven"
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
                    sortField="fec_ven"
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
                    sortField="total_ven"
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
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
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
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="C.I"
                    sortField="clientes.ci_cli"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
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
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Estado"
                    sortField="est_ven"
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
              {paginatedData.map((venta) => (
                <TableRow key={venta.id_ven}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {venta.cod_ven || "Sin Codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {new Date(venta.fec_ven).toLocaleDateString()}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {venta.total_ven} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {venta.descuento} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {venta.notas}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {`${venta.cliente?.nom_cli} ${venta.cliente?.ap_pat_cli} ${venta.cliente?.ap_mat_cli}`}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {venta.cliente?.ci_cli}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {venta.empleado?.nom_emp}
                  </TableCell>

                  <TableCell
                    className={`px-4 py-3 text-start text-sm ${textColor}`}
                  >
                    <Badge
                      size="sm"
                      color={
                        venta.est_ven === "Completado"
                          ? "success"
                          : venta.est_ven === "Cancelado"
                          ? "error"
                          : "warning"
                      }
                    >
                      {venta.est_ven}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setVentaSeleccionado(venta);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setVentaSeleccionado(venta);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () => handleEliminar(venta.id_ven),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-full md:w-auto px-4 py-2 border rounded-md disabled:opacity-50 ${textColor}`}
        >
          Anterior
        </button>
        <span className={`text-center ${textColor}`}>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-full md:w-auto px-4 py-2 border rounded-md disabled:opacity-50 ${textColor}`}
        >
          Siguiente
        </button>
      </div>

      <ModalAgregarVenta
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setVentas={setVentas}
      />
      <ModalEditarVenta
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        ventaSeleccionada={ventaSeleccionado}
        setVentas={setVentas}
      />
      <ModalVerVenta
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        ventaSeleccionada={ventaSeleccionado}
      />
    </div>
  );
}
