import { useState, useEffect } from "react";
import { useRolesPermisos } from "../../../hooks/roles_permisos/useRolesPermisos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import ModalAsignarPermiso from "../../ui/modal/rolesPermisos/ModalAsignarPermiso";
import ModalEditarAsignacion from "../../ui/modal/rolesPermisos/ModalEditarAsignacion";
import ModalEliminarAsignacion from "../../ui/modal/rolesPermisos/ModalEliminarAsignacion";
import ModalVerAsignacion from "../../ui/modal/rolesPermisos/ModalVerAsignacion";
import RolesPermisosAdvancedFilters from "../../filters/RolesPermisosAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ShieldAlert, ChevronLeft, ChevronRight, ShieldCheck, Tag } from "lucide-react";

export default function RolesPermisos() {
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    paginatedData,
    totalPages,
    fetchRolesPermisos,
    setFilters,
    setSort,
  } = useRolesPermisos();

  const [roles, setRoles]                                     = useState<any[]>([]);
  const [permisos, setPermisos]                               = useState<any[]>([]);
  const [showModalAgregar, setShowModalAgregar]               = useState(false);
  const [showModalEditar, setShowModalEditar]                 = useState(false);
  const [showModalEliminar, setShowModalEliminar]             = useState(false);
  const [showModalVer, setShowModalVer]                       = useState(false);
  const [asignacionSeleccionada, setAsignacionSeleccionada]   = useState<any>(null);
  const [currentSort, setCurrentSort]                         = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rolesResRaw, permisosResRaw] = await Promise.all([
          fetch("http://localhost:8080/api/roles").then((r) => r.json()),
          fetch("http://localhost:8080/api/permisos").then((r) => r.json()),
        ]);
        const rolesData = Array.isArray(rolesResRaw) ? rolesResRaw : Array.isArray(rolesResRaw?.data) ? rolesResRaw.data : [];
        const permisosData = Array.isArray(permisosResRaw) ? permisosResRaw : Array.isArray(permisosResRaw?.data) ? permisosResRaw.data : [];
        setRoles(rolesData);
        setPermisos(permisosData);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-4">
      {/* Filtros avanzados */}
      <RolesPermisosAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <ShieldAlert size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Asignación de Permisos</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {paginatedData.length} asignacion{paginatedData.length !== 1 ? "es" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModalAgregar(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus size={16} />
          Nueva asignación
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Nombre Rol",     field: "nom_rol"     },
                  { label: "Nombre Permiso", field: "nom_permiso" },
                  { label: "Descripción",    field: null          },
                  { label: "Acciones",       field: null          },
                ].map(({ label, field }) => (
                  <th
                    key={label}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  >
                    {field ? (
                      <SortableTableHeader
                        label={label}
                        sortField={field}
                        currentSort={currentSort}
                        onSort={handleSort}
                      />
                    ) : label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/4">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <ShieldAlert size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin asignaciones</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron relaciones rol-permiso</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((rp, idx) => (
                    <motion.tr
                      key={`${rp.id_rol}-${rp.id_permiso}-${idx}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, delay: idx * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                    >
                      {/* Rol */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
                            <ShieldCheck size={14} />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {rp.nom_rol}
                          </span>
                        </div>
                      </td>

                      {/* Permiso */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
                            <Tag size={14} />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {rp.nom_permiso}
                          </span>
                        </div>
                      </td>

                      {/* Descripción */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {rp.descripcion || "Sin descripción"}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4">
                        <TableActionButtons
                          actions={[
                            {
                              type: "view",
                              onClick: () => { setAsignacionSeleccionada(rp); setShowModalVer(true); },
                            },
                            {
                              type: "edit",
                              onClick: () => { setAsignacionSeleccionada(rp); setShowModalEditar(true); },
                            },
                            {
                              type: "delete",
                              onClick: () => { setAsignacionSeleccionada(rp); setShowModalEliminar(true); },
                            },
                          ]}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer paginación */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-gray-100 dark:border-white/6 bg-gray-50/50 dark:bg-white/[0.01]">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>Página {currentPage} de {totalPages}</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/40"
            >
              <option value={5}>5 / pág</option>
              <option value={10}>10 / pág</option>
              <option value={20}>20 / pág</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} /> Anterior
            </button>
            <span className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalAsignarPermiso
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        roles={roles}
        permisos={permisos}
        onSuccess={() => { fetchRolesPermisos(); setShowModalAgregar(false); }}
      />
      <ModalEliminarAsignacion
        showModal={showModalEliminar}
        setShowModal={setShowModalEliminar}
        asignacionSeleccionada={asignacionSeleccionada}
        onSuccess={() => { fetchRolesPermisos(); setShowModalEliminar(false); }}
      />
      <ModalVerAsignacion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        asignacionSeleccionada={asignacionSeleccionada}
      />
      <ModalEditarAsignacion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        asignacionSeleccionada={asignacionSeleccionada}
        roles={roles}
        permisos={permisos}
        onSuccess={() => { fetchRolesPermisos(); setShowModalEditar(false); }}
      />
    </div>
  );
}
