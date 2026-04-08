import { useState } from "react";
import { usePermisos } from "../../../hooks/permisos/usePermisos";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus } from "lucide-react";
import ModalAgregarPermiso from "../../ui/modal/permisos/ModalAgregarPermiso";
import ModalEditarPermiso from "../../ui/modal/permisos/ModalEditarPermiso";
import ModalEliminarPermiso from "../../ui/modal/permisos/ModalEliminarPermiso";
import ModalVerPermiso from "../../ui/modal/permisos/ModalVerPermiso";
import SortableTableHeader from "../../ui/SortableTableHeader";
import PermisosAdvancedFilters from "../../filters/PermisosAdvancedFilters";

const textColor = "text-gray-800 dark:text-white/90";

export default function Permisos() {
  const {
    /*     searchTerm,
    setSearchTerm, */
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    // setShowModalAgregar,
    paginatedData,
    totalPages,
    fetchPermisos,
    setFilters,
    setSort,
  } = usePermisos();

  const [showModalAgregar, setShowModalAgregarLocal] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [permisoSeleccionado, setPermisoSeleccionado] = useState<any>(null);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  return (
    <div>
      {/* Filtros avanzados */}

      <PermisosAdvancedFilters onFiltersChange={setFilters} />

      {/* Search and Add Button */}
      <div className="flex flex-wrap justify-between items-center p-4 gap-4">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            onClick={() => setShowModalAgregarLocal(true)}
            startIcon={<Plus size={20} />}
            size="sm"
          >
            {""}
          </Button>
        </div>
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

      {/* Table with container */}
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
                    label="Nombre"
                    sortField="nom_permiso"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Descripción"
                    sortField="descripcion"
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
              {paginatedData.map((permiso) => (
                <TableRow key={permiso.id}>
                  <TableCell className={`px-5 py-4 text-start ${textColor}`}>
                    <span className="font-medium">{permiso.nom_permiso}</span>
                  </TableCell>
                  <TableCell className={`px-5 py-4 text-start ${textColor}`}>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {permiso.descripcion || "Sin descripción"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setPermisoSeleccionado(permiso);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setPermisoSeleccionado(permiso);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () => {
                            setPermisoSeleccionado(permiso);
                            setShowModalEliminar(true);
                          },
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

      {/* Modales */}
      <ModalAgregarPermiso
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregarLocal}
        onSuccess={fetchPermisos}
      />
      <ModalEditarPermiso
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        permisoSeleccionado={permisoSeleccionado}
        onSuccess={fetchPermisos}
      />
      <ModalEliminarPermiso
        showModal={showModalEliminar}
        setShowModal={setShowModalEliminar}
        permisoSeleccionado={permisoSeleccionado}
        onSuccess={fetchPermisos}
      />
      <ModalVerPermiso
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        permisoSeleccionado={permisoSeleccionado}
      />
    </div>
  );
}
