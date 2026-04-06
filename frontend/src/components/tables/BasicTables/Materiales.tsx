import { useState } from "react";
import { useMateriales } from "../../../hooks/materiales/useMateriales";
import MaterialesAdvancedFilters from "../../filters/MaterialesAdvancedFilters";
import ModalAgregarMaterial from "../../ui/modal/material/AgregarModal";
import ModalEditarMaterial from "../../ui/modal/material/EditarModal";
import ModalVerMaterial from "../../ui/modal/material/VerDatos";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus } from "lucide-react";
import Badge from "../../ui/badge/Badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

const textColor = "text-gray-800 dark:text-white/90";

export default function Materiales() {
  const {
    setMateriales,
    /*     searchTerm,
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
  } = useMateriales();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false); // Nuevo estado para ver
  /*   const [filtroNombre, setFiltroNombre] = useState(""); // Estado para el filtro de nombre
  const [filtroEstado, setFiltroEstado] = useState(""); // Estado para el filtro de estado */
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_mat: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este material?");
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
      const res = await fetch(
        `http://localhost:8080/api/materiales/${id_mat}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error("Error al eliminar material");

      setMateriales((prev) => prev.filter((mat) => mat.id_mat !== id_mat));
    } catch (error) {
      console.error("Error al eliminar material:", error);
      alert("No se pudo eliminar el material.");
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/materiales/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "materiales-backup.sql";
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
      {/* Advanced Filters */}
      <MaterialesAdvancedFilters onFiltersChange={setFilters} />

      {/* Filtros y controles superiores */}
      {/* <div className="flex justify-between items-center p-4 flex-wrap gap-4">
        <div className="flex gap-4 flex-wrap w-full md:w-auto">
          <button
            onClick={generarReporte}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-md text-sm"
          >
            <FaFileAlt /> Generar Reporte
          </button>
        </div>
      </div> */}

      {/* Search and Add Button */}
      <div className="flex justify-between items-center p-4 flex-wrap gap-4">
        <Button
          onClick={() => setShowModalAgregar(true)}
          startIcon={<Plus size={20} />}
          size="sm"
        >
          {""}
        </Button>
      </div>

      {/* Items per page */}
      <div className="p-4">
        <label htmlFor="itemsPerPage" className={`mr-2 ${textColor}`}>
          Items por página:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-2 py-1 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Table Container */}
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
                    sortField="cod_mat"
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
                    sortField="nom_mat"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Descripcion
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Stock"
                    sortField="stock_mat"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Stock min
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Unidad Medida
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Costo"
                    sortField="costo_mat"
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
                  <SortableTableHeader
                    label="Estado"
                    sortField="est_mat"
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
              {paginatedData.map((material) => (
                <TableRow key={material.id_mat}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {material.cod_mat || "Sin Codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {material.nom_mat}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {material.desc_mat}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {material.stock_mat} [u]
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {material.stock_min} [u]
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {material.unidad_medida}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {material.costo_mat} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {material.img_mat ? (
                      <img
                        src={material.img_mat}
                        alt="Imagen del mueble"
                        className="w-16 h-16 border border-gray-300 rounded-md"
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-sm ${textColor}`}
                  >
                    <Badge
                      size="sm"
                      color={material.est_mat ? "success" : "error"}
                    >
                      {material.est_mat ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setMaterialSeleccionado(material);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "toggle",
                          onClick: () =>
                            abrirModalEstado(material.id_mat, material.est_mat),
                          isActive: material.est_mat,
                          activeLabel: "Baja",
                          inactiveLabel: "Alta",
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setMaterialSeleccionado(material);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () => handleEliminar(material.id_mat),
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

      {/* Modals */}
      <ModalAgregarMaterial
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setMateriales={setMateriales}
      />

      <ModalEditarMaterial
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        materialSeleccionado={materialSeleccionado}
        setMateriales={setMateriales}
      />

      <ModalVerMaterial
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        materialSeleccionado={materialSeleccionado}
      />

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
    </div>
  );
}
