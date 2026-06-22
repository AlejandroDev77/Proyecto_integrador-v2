import { useState } from "react";
import { useRoles } from "../../../hooks/Roles/useRoles";
import Badge from "../../ui/badge/Badge";
import TableActionButtons from "../../ui/button/TableActionButtons";
import ModalAgregarRol from "../../ui/modal/roles/ModalAgregarRol";
import ModalEditarRol from "../../ui/modal/roles/ModalEditarRol";
import ModalEliminarRol from "../../ui/modal/roles/ModalEliminarRol";
import ModalVerRol from "../../ui/modal/roles/ModalVerRol";
import SortableTableHeader from "../../ui/SortableTableHeader";
import RolesAdvancedFilters from "../../filters/RolesAdvancedFilters";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ShieldCheck, ChevronLeft, ChevronRight, Tag } from "lucide-react";

export default function Roles() {
  const {
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
  const [showModalEditar, setShowModalEditar]         = useState(false);
  const [showModalEliminar, setShowModalEliminar]     = useState(false);
  const [showModalVer, setShowModalVer]               = useState(false);
  const [rolSeleccionado, setRolSeleccionado]         = useState<any>(null);
  const [currentSort, setCurrentSort]                 = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  return (
    <div className="space-y-4">
      {/* Filtros avanzados */}
      <RolesAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Roles del sistema</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {paginatedData.length} registro{paginatedData.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModalAgregarLocal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus size={16} />
          Nuevo rol
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Nombre del Rol", field: "nom_rol" },
                  { label: "Permisos",       field: null      },
                  { label: "Usuarios",       field: null      },
                  { label: "Acciones",       field: null      },
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
                      <ShieldCheck size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin roles</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron roles con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((rol, idx) => (
                    <motion.tr
                      key={rol.id_rol}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, delay: idx * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                    >
                      {/* Nombre del rol */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-500 dark:text-violet-400 shrink-0">
                            <ShieldCheck size={14} />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {rol.nom_rol}
                          </span>
                        </div>
                      </td>

                      {/* Permisos como chips */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {rol.permisos && rol.permisos.length > 0 ? (
                            rol.permisos.map((permiso: any) => (
                              <span
                                key={permiso.id_permiso}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"
                              >
                                <Tag size={9} />
                                {permiso.nombre}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">Sin permisos</span>
                          )}
                        </div>
                      </td>

                      {/* Usuarios stats compacto */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {rol.usuarios?.total || 0} total
                          </span>
                          <span className="text-xs text-emerald-500 font-medium">
                            {rol.usuarios?.activos || 0} activos
                          </span>
                          <span className="text-xs text-gray-400">
                            {rol.usuarios?.inactivos || 0} inact.
                          </span>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4">
                        <TableActionButtons
                          actions={[
                            {
                              type: "view",
                              onClick: () => { setRolSeleccionado(rol); setShowModalVer(true); },
                            },
                            {
                              type: "edit",
                              onClick: () => { setRolSeleccionado(rol); setShowModalEditar(true); },
                            },
                            {
                              type: "delete",
                              onClick: () => { setRolSeleccionado(rol); setShowModalEliminar(true); },
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
