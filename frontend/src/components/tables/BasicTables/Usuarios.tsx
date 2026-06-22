import { useState } from "react";
import { useUsuarios } from "../../../hooks/usuarios/useUsuarios";
import ModalAgregar from "../../ui/modal/usuario/AgregarModal";
import ModalEditar from "../../ui/modal/usuario/EditarModal";
import ModalVerUsuario from "../../ui/modal/usuario/VerDatos";
import UsuariosAdvancedFilters from "../../filters/UsuariosAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Badge from "../../ui/badge/Badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Users,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCircle,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import axiosClient from "../../../api/axios";

// ── Helpers ────────────────────────────────────────────────────────────────────

const ROL_MAP: Record<number, { label: string; Icon: React.ElementType; color: string }> = {
  1: { label: "Administrador", Icon: ShieldCheck, color: "text-violet-500 bg-violet-50 dark:bg-violet-500/10" },
  2: { label: "Cliente",       Icon: UserCircle,  color: "text-sky-500    bg-sky-50    dark:bg-sky-500/10"    },
  3: { label: "Empleado",      Icon: Briefcase,   color: "text-amber-500  bg-amber-50  dark:bg-amber-500/10"  },
};

function RolChip({ idRol }: { idRol: number }) {
  const cfg = ROL_MAP[idRol] ?? { label: "Desconocido", Icon: HelpCircle, color: "text-gray-400 bg-gray-100 dark:bg-white/5" };
  const { label, Icon, color } = cfg;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
      <Icon size={12} />
      {label}
    </span>
  );
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
      {initials}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function Usuarios() {
  const {
    setUsuarios,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showModalEstado,
    setShowModalEstado,
    loadingCambioEstado,
    showModalAgregar,
    setShowModalAgregar,
    abrirModalEstado,
    confirmarCambioEstado,
    paginatedData,
    totalPages,
    totalItems,
    loading,
    setFilters,
    setSort,
  } = useUsuarios();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const descargarBackupCompleto = async () => {
    try {
      const response = await axiosClient.get("/api/backup", { responseType: "blob" });
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "completo-backup.sql";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el respaldo:", error);
    }
  };

  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const to   = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="space-y-4">

      {/* Filtros avanzados */}
      <UsuariosAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Título / contador */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Users size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Usuarios del sistema</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {loading ? "Cargando..." : `${totalItems} registro${totalItems !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-2">
          <button
            onClick={descargarBackupCompleto}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            title="Descargar respaldo completo"
          >
            <Download size={15} />
            Respaldo
          </button>
          <button
            onClick={() => setShowModalAgregar(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-500/20 transition-all active:scale-95"
          >
            <Plus size={16} />
            Nuevo usuario
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Código",         field: "cod_usu" },
                  { label: "Usuario",        field: "nom_usu" },
                  { label: "Rol",            field: null       },
                  { label: "Estado",         field: "est_usu" },
                  { label: "Acciones",       field: null       },
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
                    ) : (
                      label
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-white/4">
              {loading ? (
                // Skeleton
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 rounded-md bg-gray-100 dark:bg-white/6 animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <Users size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin usuarios</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron usuarios con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((usuario, idx) => (
                    <motion.tr
                      key={usuario.id_usu}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, delay: idx * 0.03 }}
                      className="group hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                    >
                      {/* Código */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                          {usuario.cod_usu || "—"}
                        </span>
                      </td>

                      {/* Usuario */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={usuario.nom_usu} />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white leading-tight">
                              {usuario.nom_usu}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                              {usuario.email_usu}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Rol */}
                      <td className="px-5 py-4">
                        <RolChip idRol={usuario.id_rol} />
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-4">
                        <Badge size="sm" color={usuario.est_usu ? "success" : "error"}>
                          {usuario.est_usu ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4">
                        <TableActionButtons
                          actions={[
                            {
                              type: "view",
                              onClick: () => {
                                setUsuarioSeleccionado(usuario);
                                setShowModalVer(true);
                              },
                            },
                            {
                              type: "toggle",
                              onClick: () => abrirModalEstado(usuario.id_usu, usuario.est_usu),
                              isActive: usuario.est_usu,
                              activeLabel: "Baja",
                              inactiveLabel: "Alta",
                            },
                            {
                              type: "edit",
                              onClick: () => {
                                setUsuarioSeleccionado(usuario);
                                setShowModalEditar(true);
                              },
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

        {/* Footer: paginación + items por página */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-gray-100 dark:border-white/6 bg-gray-50/50 dark:bg-white/[0.01]">
          {/* Info + selector */}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>
              {loading ? "..." : `${from}–${to} de ${totalItems}`}
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/40"
            >
              <option value={5}>5 / pág</option>
              <option value={10}>10 / pág</option>
              <option value={20}>20 / pág</option>
            </select>
          </div>

          {/* Botones Anterior / Siguiente */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
              Anterior
            </button>
            <span className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de estado */}
      <AnimatePresence>
        {showModalEstado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 8 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 border border-gray-200 dark:border-white/10"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Users size={22} />
                </div>
                <h2 className="text-base font-bold text-gray-800 dark:text-white">
                  ¿Cambiar estado del usuario?
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Esta acción modificará el acceso del usuario al sistema.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModalEstado(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarCambioEstado}
                  disabled={loadingCambioEstado}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-60"
                >
                  {loadingCambioEstado ? "Cambiando..." : "Confirmar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modales */}
      <ModalAgregar
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setUsuarios={setUsuarios}
      />
      <ModalEditar
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        usuarioSeleccionado={usuarioSeleccionado}
        setUsuarios={setUsuarios}
      />
      <ModalVerUsuario
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        usuarioSeleccionado={usuarioSeleccionado}
      />
    </div>
  );
}
