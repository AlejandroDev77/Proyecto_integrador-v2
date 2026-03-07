import { useState } from "react";
import { useRoles } from "../../../hooks/Roles/useRoles";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus } from "lucide-react";
import ModalAgregarRol from "../../ui/modal/roles/ModalAgregarRol";
import ModalEditarRol from "../../ui/modal/roles/ModalEditarRol";
import ModalEliminarRol from "../../ui/modal/roles/ModalEliminarRol";
import ModalVerRol from "../../ui/modal/roles/ModalVerRol";
import SortableTableHeader from "../../ui/SortableTableHeader";
import RolesAdvancedFilters from "../../filters/RolesAdvancedFilters";

const textColor = "text-gray-800 dark:text-white/90";

export default function Roles() {
  const {
    /*  searchTerm,
    setSearchTerm, */
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    paginatedData,
    totalPages,
    fetchRoles,
    setFilters,
    setSort,
  } = useRoles();

  const [showModalAgregar, setShowModalAgregarLocal] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<any>(null);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  return (
    <div>
      {/* Filtros avanzados */}

      <RolesAdvancedFilters onFiltersChange={setFilters} />

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
                    label="Nombre del Rol"
                    sortField="nom_rol"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Permisos
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Usuarios
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
              {paginatedData.map((rol) => (
                <TableRow key={rol.id_rol}>
                  <TableCell className={`px-5 py-4 text-start ${textColor}`}>
                    <span className="font-medium">{rol.nom_rol}</span>
                  </TableCell>
                  <TableCell className={`px-5 py-4 text-start ${textColor}`}>
                    {rol.permisos && rol.permisos.length > 0 ? (
                      <ul className="space-y-1">
                        {rol.permisos.map((permiso: any) => (
                          <li key={permiso.id_permiso} className="text-sm">
                            • {permiso.nombre}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500 italic text-sm">
                        Sin permisos
                      </span>
                    )}
                  </TableCell>
                  <TableCell className={`px-5 py-4 text-start ${textColor}`}>
                    <div className="space-y-1">
                      <Badge size="sm" color="success">
                        Total: {rol.usuarios?.total || 0}
                      </Badge>
                      <Badge size="sm" color="info">
                        Activos: {rol.usuarios?.activos || 0}
                      </Badge>
                      <Badge size="sm" color="warning">
                        Inactivos: {rol.usuarios?.inactivos || 0}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setRolSeleccionado(rol);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setRolSeleccionado(rol);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () => {
                            setRolSeleccionado(rol);
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
      <ModalAgregarRol
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregarLocal}
        onSuccess={fetchRoles}
      />
      <ModalEditarRol
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        rolSeleccionado={rolSeleccionado}
        onSuccess={fetchRoles}
      />
      <ModalEliminarRol
        showModal={showModalEliminar}
        setShowModal={setShowModalEliminar}
        rolSeleccionado={rolSeleccionado}
        onSuccess={fetchRoles}
      />
      <ModalVerRol
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        rolSeleccionado={rolSeleccionado}
      />
    </div>
  );
}
