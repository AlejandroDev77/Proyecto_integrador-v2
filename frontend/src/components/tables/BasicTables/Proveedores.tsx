import { useState } from "react";
import { useProveedores } from "../../../hooks/proveedores/useProveedores";
import ModalAgregarProveedor from "../../ui/modal/proveedor/AgregarModal";
import ModalEditarProveedor from "../../ui/modal/proveedor/EditarModal";
import ModalVerProveedor from "../../ui/modal/proveedor/VerDatos";
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
import ProveedoresAdvancedFilters from "../../filters/ProveedoresAdvancedFilters";

const textColor = "text-gray-800 dark:text-white/90";

export default function Proveedores() {
  const {
    setProveedores,
    /*     searchTerm,
    setSearchTerm, */
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showModalAgregar,
    setShowModalAgregar,
    showModalEstado,
    abrirModalEstado,
    confirmarCambioEstado,
    loadingCambioEstado,
    setShowModalEstado,
    paginatedData,
    totalPages,
    setFilters,
    setSort,
  } = useProveedores();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false); // Nuevo estado para ver
  /*   const [filtroNombre, setFiltroNombre] = useState(""); // Estado para el filtro de nombre
  const [filtroEstado, setFiltroEstado] = useState(""); // Estado para el filtro de estado */
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_prov: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este Proveedor?");
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
        `http://localhost:8000/api/proveedor/${id_prov}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error("Error al eliminar Proveedor");

      setProveedores((prev) => prev.filter((prov) => prov.id_prov !== id_prov));
    } catch (error) {
      console.error("Error al eliminar material:", error);
      alert("No se pudo eliminar el material.");
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/proveedor/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "proveedores-backup.sql";
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
      <ProveedoresAdvancedFilters onFiltersChange={setFilters} />

      {/* Filtros para el reporte */}
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 p-4">
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <button
            onClick={generarReporte}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-md text-sm"
          >
            <FaFileAlt /> Generar Reporte
          </button>
        </div>
      </div> */}

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

      {/* Tabla con los estilos de borde y líneas separadoras */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 mx-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Código"
                    sortField="cod_prov"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Nombre"
                    sortField="nom_prov"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Contacto"
                    sortField="contacto_prov"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Teléfono"
                    sortField="tel_prov"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Correo Electrónico"
                    sortField="email_prov"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Dirección"
                    sortField="dir_prov"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="NIT"
                    sortField="nit_prov"
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
                    sortField="est_prov"
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
            <TableBody>
              {paginatedData.map((proveedor) => (
                <TableRow
                  key={proveedor.id_prov}
                  className="border-b border-gray-200 dark:border-white/5"
                >
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {proveedor.cod_prov || "Sin Codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {proveedor.nom_prov}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {proveedor.contacto_prov}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {proveedor.tel_prov}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {proveedor.email_prov}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {proveedor.dir_prov}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {proveedor.nit_prov}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-sm ${textColor}`}
                  >
                    <Badge
                      size="sm"
                      color={proveedor.est_prov ? "success" : "error"}
                    >
                      {proveedor.est_prov ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setProveedorSeleccionado(proveedor);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "toggle",
                          onClick: () =>
                            abrirModalEstado(
                              proveedor.id_prov,
                              proveedor.est_prov
                            ),
                          isActive: proveedor.est_prov,
                          activeLabel: "Baja",
                          inactiveLabel: "Alta",
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setProveedorSeleccionado(proveedor);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () => handleEliminar(proveedor.id_prov),
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

      {/* Modal de Confirmación */}
      {showModalEstado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-white">
              ¿Estás seguro de cambiar el estado del Proveedor?
            </h2>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowModalEstado(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCambioEstado}
                disabled={loadingCambioEstado}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-2"
              >
                {loadingCambioEstado ? "Cambiando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalAgregarProveedor
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setProveedores={setProveedores}
      />
      <ModalEditarProveedor
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        proveedorSeleccionado={proveedorSeleccionado}
        setProveedores={setProveedores}
      />
      <ModalVerProveedor
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        proveedorSeleccionado={proveedorSeleccionado}
      />
    </div>
  );
}
