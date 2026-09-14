import { useState } from "react";
import { useProveedores } from "../../../hooks/proveedores/useProveedores";
import ModalAgregarProveedor from "../../ui/modal/proveedor/AgregarModal";
import ModalEditarProveedor from "../../ui/modal/proveedor/EditarModal";
import ModalVerProveedor from "../../ui/modal/proveedor/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import SortableTableHeader from "../../ui/SortableTableHeader";
import ProveedoresAdvancedFilters from "../../filters/ProveedoresAdvancedFilters";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Truck, ChevronLeft, ChevronRight, Mail, Phone, MapPin } from "lucide-react";

export default function Proveedores() {
  const {
    setProveedores,
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
  const [showModalVer, setShowModalVer] = useState(false);
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
      const res = await fetch(`http://localhost:8080/api/proveedor/${id_prov}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar Proveedor");

      setProveedores((prev) => prev.filter((prov) => prov.id_prov !== id_prov));
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      alert("No se pudo eliminar el proveedor.");
    }
  };

  return (
    <div className="space-y-4">
      <ProveedoresAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Truck size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Proveedores</p>
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
          Nuevo proveedor
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Código",    field: "cod_prov" },
                  { label: "Proveedor", field: "nom_prov" },
                  { label: "Contacto",  field: null       },
                  { label: "Ubicación", field: null       },
                  { label: "NIT",       field: "nit_prov" },
                  { label: "Acciones",  field: null       },
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
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <Truck size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin proveedores</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron proveedores con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((proveedor, idx) => (
                    <motion.tr
                      key={proveedor.id_prov || proveedor.id || `prov-${idx}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, delay: idx * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                    >
                      {/* Código */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                          {proveedor.cod_prov || "—"}
                        </span>
                      </td>

                      {/* Proveedor */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white leading-tight">
                            {proveedor.nom_prov}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                            {proveedor.contacto_prov || "Sin contacto"}
                          </p>
                        </div>
                      </td>

                      {/* Info de Contacto Compactada */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-gray-400" />
                            <span>{proveedor.tel_prov || "—"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail size={12} className="text-gray-400" />
                            <span className="truncate max-w-[150px]">{proveedor.email_prov || "—"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Ubicación */}
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                          <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
                          <span className="truncate max-w-[150px] whitespace-normal">
                            {proveedor.dir_prov || "—"}
                          </span>
                        </div>
                      </td>

                      {/* NIT */}
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                        {proveedor.nit_prov || "—"}
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4">
                        <TableActionButtons
                          actions={[
                            {
                              type: "view",
                              onClick: () => { setProveedorSeleccionado(proveedor); setShowModalVer(true); },
                            },
                            {
                              type: "toggle",
                              onClick: () => abrirModalEstado(proveedor.id_prov || proveedor.id, proveedor.est_prov),
                              isActive: proveedor.est_prov,
                              activeLabel: "Baja",
                              inactiveLabel: "Alta",
                            },
                            {
                              type: "edit",
                              onClick: () => { setProveedorSeleccionado(proveedor); setShowModalEditar(true); },
                            },
                            {
                              type: "delete",
                              onClick: () => handleEliminar(proveedor.id_prov || proveedor.id),
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

      {/* Modal de Confirmación Estado */}
      {showModalEstado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-white">
              ¿Estás seguro de cambiar el estado del Proveedor?
            </h2>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowModalEstado(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCambioEstado}
                disabled={loadingCambioEstado}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
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
