import { useState, useEffect } from "react";
import { useRolesPermisos } from "../../../hooks/roles_permisos/useRolesPermisos";
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
import ModalAsignarPermiso from "../../ui/modal/rolesPermisos/ModalAsignarPermiso";
import ModalEditarAsignacion from "../../ui/modal/rolesPermisos/ModalEditarAsignacion";
import ModalEliminarAsignacion from "../../ui/modal/rolesPermisos/ModalEliminarAsignacion";
import ModalVerAsignacion from "../../ui/modal/rolesPermisos/ModalVerAsignacion";
import RolesPermisosAdvancedFilters from "../../filters/RolesPermisosAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";

const textColor = "text-gray-800 dark:text-white/90";

export default function RolesPermisos() {
  const {
    /*  searchTerm,
    setSearchTerm, */
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    /* error,
    setError,
    filterRol,
    setFilterRol,
    filterPermiso,
    setFilterPermiso, */
    paginatedData,
    totalPages,
    fetchRolesPermisos,
    setFilters,
    setSort,
  } = useRolesPermisos();

  const [roles, setRoles] = useState<any[]>([]);
  const [permisos, setPermisos] = useState<any[]>([]);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [asignacionSeleccionada, setAsignacionSeleccionada] =
    useState<any>(null);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  // Cargar roles y permisos disponibles
  useEffect(() => {
    const loadData = async () => {
      try {
        const [rolesResRaw, permisosResRaw] = await Promise.all([
          fetch("http://localhost:8080/api/roles").then((r) => r.json()),
          fetch("http://localhost:8080/api/permisos").then((r) => r.json()),
        ]);

        // A veces la API devuelve { data: [...] } u otra envoltura. Normalizamos a array.
        const rolesData = Array.isArray(rolesResRaw)
          ? rolesResRaw
          : Array.isArray(rolesResRaw?.data)
          ? rolesResRaw.data
          : [];

        const permisosData = Array.isArray(permisosResRaw)
          ? permisosResRaw
          : Array.isArray(permisosResRaw?.data)
          ? permisosResRaw.data
          : [];

        setRoles(rolesData);
        setPermisos(permisosData);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  return (
    <div>
      {/* Filtros avanzados */}

      <RolesPermisosAdvancedFilters onFiltersChange={setFilters} />

      {/* Filtros */}
      <div className="flex flex-wrap justify-between items-center p-4 gap-4">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            onClick={() => setShowModalAgregar(true)}
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
                    label="Nombre Rol"
                    sortField="nom_rol"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>

                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Nombre Permiso"
                    sortField="nom_permiso"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Descripción
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
              {paginatedData.length > 0 ? (
                paginatedData.map((rp, idx) => (
                  <TableRow key={`${rp.id_rol}-${rp.id_permiso}-${idx}`}>
                    <TableCell className={`px-5 py-4 text-start ${textColor}`}>
                      <Badge size="sm" color="info">
                        {rp.nom_rol}
                      </Badge>
                    </TableCell>

                    <TableCell className={`px-5 py-4 text-start ${textColor}`}>
                      <Badge size="sm" color="success">
                        {rp.nom_permiso}
                      </Badge>
                    </TableCell>
                    <TableCell className={`px-5 py-4 text-start ${textColor}`}>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {rp.descripcion || "Sin descripción"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-sm">
                      <TableActionButtons
                        actions={[
                          {
                            type: "view",
                            onClick: () => {
                              setAsignacionSeleccionada(rp);
                              setShowModalVer(true);
                            },
                          },
                          {
                            type: "edit",
                            onClick: () => {
                              setAsignacionSeleccionada(rp);
                              setShowModalEditar(true);
                            },
                          },
                          {
                            type: "delete",
                            onClick: () => {
                              setAsignacionSeleccionada(rp);
                              setShowModalEliminar(true);
                            },
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>
                    <div className={`px-5 py-4 text-center ${textColor}`}>
                      No hay relaciones rol-permiso disponibles
                    </div>
                  </TableCell>
                </TableRow>
              )}
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

      {/* ========================== MODALES SEPARADOS ========================== */}
      {/* Modal Asignar Permiso */}
      <ModalAsignarPermiso
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        roles={roles}
        permisos={permisos}
        onSuccess={() => {
          fetchRolesPermisos();
          setShowModalAgregar(false);
        }}
      />

      {/* Modal Eliminar Asignación */}
      <ModalEliminarAsignacion
        showModal={showModalEliminar}
        setShowModal={setShowModalEliminar}
        asignacionSeleccionada={asignacionSeleccionada}
        onSuccess={() => {
          fetchRolesPermisos();
          setShowModalEliminar(false);
        }}
      />

      {/* Modal Ver Asignación */}
      <ModalVerAsignacion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        asignacionSeleccionada={asignacionSeleccionada}
      />

      {/* Modal Editar Asignación */}
      <ModalEditarAsignacion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        asignacionSeleccionada={asignacionSeleccionada}
        roles={roles}
        permisos={permisos}
        onSuccess={() => {
          fetchRolesPermisos();
          setShowModalEditar(false);
        }}
      />
    </div>
  );
}
