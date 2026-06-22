import { useLogs } from "../../../hooks/logss/useLogs";
import ComponentCard from "../../common/ComponentCard";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ChevronLeft, ChevronRight, FileJson } from "lucide-react";

const textColor = "text-gray-800 dark:text-white/90";

function renderChangedValues(oldValues: string | null, newValues: string | null) {
  let oldParsed: Record<string, any> = {};
  let newParsed: Record<string, any> = {};
  try { if (oldValues) oldParsed = JSON.parse(oldValues); } catch {}
  try { if (newValues) newParsed = JSON.parse(newValues); } catch {}

  const allKeys = Array.from(new Set([...Object.keys(oldParsed), ...Object.keys(newParsed)]));
  const changedKeys = allKeys.filter((key) => oldParsed[key] !== newParsed[key]);

  if (changedKeys.length === 0) return <span className="text-gray-400">—</span>;

  return (
    <ul className="space-y-1.5 w-full">
      {changedKeys.map((key) => (
        <li key={key}>
          <div className="bg-gray-50/50 dark:bg-white/5 rounded-lg p-2 flex flex-col md:flex-row md:items-center gap-2 border border-gray-100 dark:border-white/10">
            <span className="font-semibold text-xs text-sky-600 dark:text-sky-400 min-w-[90px]">
              {key}:
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-2 py-0.5 rounded-md line-through truncate max-w-[150px]">
                {oldParsed[key] !== undefined ? String(oldParsed[key]) : "—"}
              </span>
              <span className="text-gray-400">→</span>
              <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded-md font-medium truncate max-w-[150px]">
                {newParsed[key] !== undefined ? String(newParsed[key]) : "—"}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function LogsTable() {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    paginatedData,
    totalPages,
  } = useLogs();

  return (
    <div className="space-y-4">
      {/* Barra superior con Buscador */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Logs del Sistema</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Auditoría de cambios</p>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar por usuario (cod_usu)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-72 px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-sm bg-white dark:bg-white/5 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  "Código Usuario",
                  "Tabla",
                  "Acción",
                  "Cambios",
                  "Fecha",
                ].map((label) => (
                  <th
                    key={label}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/4">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <FileJson size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin registros</p>
                      <p className="text-xs mt-1 opacity-70">No hay logs que coincidan con la búsqueda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData
                    .slice()
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((log, idx) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                      >
                        {/* Código Usuario */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            {log.cod_usu || "SISTEMA"}
                          </span>
                        </td>

                        {/* Tabla */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                            {log.table_name}
                          </span>
                        </td>

                        {/* Acción */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              log.action === "INSERT"
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : log.action === "UPDATE"
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>

                        {/* Cambios */}
                        <td className="px-5 py-4 w-[300px]">
                          {renderChangedValues(log.old_values, log.new_values)}
                        </td>

                        {/* Fecha Creación */}
                        <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">
                          {log.created_at ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {new Date(log.created_at).toLocaleDateString("es-BO")}
                              </span>
                              <span>{new Date(log.created_at).toLocaleTimeString("es-BO", { hour12: true })}</span>
                            </div>
                          ) : (
                            "—"
                          )}
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
    </div>
  );
}
