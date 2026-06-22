import { useState } from "react";
import { useClientes } from "../../../hooks/clientes/useClientes";
import ClientesAdvancedFilters from "../../filters/ClientesAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import ModalAgregarCliente from "../../ui/modal/cliente/AgregarModal";
import ModalEditarCliente from "../../ui/modal/cliente/EditarModal";
import ModalVerCliente from "../../ui/modal/cliente/VerDatos";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users2, ChevronLeft, ChevronRight } from "lucide-react";

// ── Avatar con iniciales ───────────────────────────────────────────────────────
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
export default function Clientes() {
  const {
    setClientes,
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
  } = useClientes();

  const [showModalEditar, setShowModalEditar]       = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer]             = useState(false);
  const [currentSort, setCurrentSort]               = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_cli: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este cliente?");
    if (!confirm) return;
    let idUsuarioLocal = null;
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "null");
      idUsuarioLocal = userObj && userObj.id_usu ? userObj.id_usu : null;
    } catch {
      idUsuarioLocal = null;
    }
    const headers = {
      "Content-Type": "application/json",
      ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
    };
    try {
      const res = await fetch(`http://localhost:8080/api/clientes/${id_cli}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Error al eliminar cliente");
      setClientes((prev) => prev.filter((cli) => cli.id_cli !== id_cli));
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      alert("No se pudo eliminar el cliente.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros avanzados */}
      <ClientesAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Users2 size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Clientes</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {paginatedData.length} registro{paginatedData.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModalAgregar(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus size={16} />
          Nuevo cliente
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Código",           field: "cod_cli" },
                  { label: "Cliente",          field: "nom_cli" },
                  { label: "Celular",          field: null      },
                  { label: "Dirección",        field: null      },
                  { label: "F. Nacimiento",    field: null      },
                  { label: "Usuario",          field: null      },
                  { label: "Acciones",         field: null      },
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
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <Users2 size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin clientes</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron clientes con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((cliente, idx) => (
                    <motion.tr
                      key={cliente.id_cli}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, delay: idx * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                    >
                      {/* Código */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                          {cliente.cod_cli || "—"}
                        </span>
                      </td>

                      {/* Cliente */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={cliente.nom_cli} />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white leading-tight">
                              {cliente.nom_cli} {cliente.ap_pat_cli} {cliente.ap_mat_cli}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                              CI: {cliente.ci_cli}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Celular */}
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                        {cliente.cel_cli || "—"}
                      </td>

                      {/* Dirección */}
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300 max-w-[160px] truncate">
                        {cliente.dir_cli || "—"}
                      </td>

                      {/* Fecha Nacimiento */}
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                        {cliente.fec_nac_cli
                          ? new Date(cliente.fec_nac_cli).toLocaleDateString("es-BO", {
                              day: "2-digit", month: "2-digit", year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Usuario */}
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                        {cliente.usuario?.nom_usu || "—"}
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4">
                        <TableActionButtons
                          actions={[
                            {
                              type: "view",
                              onClick: () => { setClienteSeleccionado(cliente); setShowModalVer(true); },
                            },
                            {
                              type: "edit",
                              onClick: () => { setClienteSeleccionado(cliente); setShowModalEditar(true); },
                            },
                            {
                              type: "delete",
                              onClick: () => handleEliminar(cliente.id_cli),
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
      <ModalAgregarCliente
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setClientes={setClientes}
      />
      <ModalEditarCliente
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        clienteSeleccionado={clienteSeleccionado}
        setClientes={setClientes}
      />
      <ModalVerCliente
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        clienteSeleccionado={clienteSeleccionado}
      />
    </div>
  );
}
