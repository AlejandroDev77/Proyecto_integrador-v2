import { useState } from "react";
import { useMuebles } from "../../../hooks/muebles/useMuebles";
import MueblesAdvancedFilters from "../../filters/MueblesAdvancedFilters";
import ModalAgregarMueble from "../../ui/modal/mueble/AgregarModal";
import ModalEditarMueble from "../../ui/modal/mueble/EditarModal";
import ModalVerMueble from "../../ui/modal/mueble/VerDatos";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus } from "lucide-react";
import { Mueble } from "../../ui/modal/mueble/AgregarModal";
import Badge from "../../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

const textColor = "text-gray-800 dark:text-white/90";

export default function Muebles() {
  const {
    setMuebles,
    /* searchTerm,
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
  } = useMuebles();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [muebleSeleccionado, setMuebleSeleccionado] = useState<Mueble | null>(
    null
  );
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_mue: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este mueble?");
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
      const res = await fetch(`http://localhost:8000/api/mueble/${id_mue}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar mueble");

      setMuebles((prev) => prev.filter((mue) => mue.id_mue !== id_mue));
    } catch (error) {
      console.error("Error al eliminar mueble:", error);
      alert("No se pudo eliminar el mueble.");
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/mueble/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "muebles-backup.sql";
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
      {/* Filtros avanzados */}

      <MueblesAdvancedFilters onFiltersChange={setFilters} />

      {/* Filtros para el reporte */}
      {/*  <div className="flex justify-between items-center p-4 flex-wrap gap-4">
         <div className="flex gap-4 flex-wrap w-full md:w-auto">
          <button
            onClick={generarReporte}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-md text-sm"
          >
            <FaFileAlt /> Generar Reporte
          </button>
        </div> 
      </div> */}

      {/* Búsqueda y botón agregar */}
      <div className="flex flex-wrap justify-between items-center p-4 gap-4">
        <Button
          onClick={() => setShowModalAgregar(true)}
          startIcon={<Plus size={20} />}
          size="sm"
        >
          {""}
        </Button>
      </div>

      {/* Selector de items por página */}
      <div className="p-4 flex flex-wrap items-center gap-4">
        <label htmlFor="itemsPerPage" className={`${textColor}`}>
          Items por página:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="w-24 px-2 py-1 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Contenedor de la tabla y paginación con los estilos específicos */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Codigo"
                    sortField="cod_mue"
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
                    sortField="nom_mue"
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
                  <SortableTableHeader
                    label="Precio venta"
                    sortField="precio_venta"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="precio costo"
                    sortField="precio_costo"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Stock"
                    sortField="stock"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Stock Mínimo
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  dimensiones
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Categoria
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Estado"
                    sortField="est_mue"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Imagen
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Vista 3D
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
              {paginatedData.map((mueble) => (
                <TableRow key={mueble.id_mue}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueble.cod_mue || "Sin Codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueble.nom_mue}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueble.desc_mue}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueble.precio_venta} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueble.precio_costo} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueble.stock} [u]
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueble.stock_min} [u]
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueble.dimensiones}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueble.categoria && mueble.categoria.nom_cat
                      ? mueble.categoria.nom_cat
                      : "Sin categoría"}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-sm ${textColor}`}
                  >
                    <Badge
                      size="sm"
                      color={mueble.est_mue ? "success" : "error"}
                    >
                      {mueble.est_mue ? "Disponible" : "No Disponible"}
                    </Badge>
                  </TableCell>

                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueble.img_mue ? (
                      <img
                        src={mueble.img_mue}
                        alt="Imagen del mueble"
                        className="w-16 h-16 border border-gray-300 rounded-md"
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </TableCell>

                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueble.modelo_3d ? (
                      <a
                        href={mueble.modelo_3d}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Ver modelo 3D
                      </a>
                    ) : (
                      "Sin modelo"
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setMuebleSeleccionado(mueble);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "toggle",
                          onClick: () =>
                            abrirModalEstado(mueble.id_mue, mueble.est_mue),
                          isActive: mueble.est_mue,
                          activeLabel: "No Disponible",
                          inactiveLabel: "Disponible",
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setMuebleSeleccionado(mueble);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () => handleEliminar(mueble.id_mue),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center p-4 flex-wrap gap-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-full sm:w-auto px-4 py-2 border rounded-md disabled:opacity-50 ${textColor}`}
          >
            Anterior
          </button>
          <span className={`w-full text-center sm:w-auto ${textColor}`}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-full sm:w-auto px-4 py-2 border rounded-md disabled:opacity-50 ${textColor}`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modales */}
      {showModalEstado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-white">
              ¿Estás seguro de cambiar el estado del usuario?
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

      <ModalAgregarMueble
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setMuebles={setMuebles as any}
      />
      <ModalEditarMueble
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        muebleSeleccionado={muebleSeleccionado as any}
        setMuebles={setMuebles as any}
      />
      <ModalVerMueble
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        muebleSeleccionado={muebleSeleccionado as any}
      />
    </div>
  );
}
