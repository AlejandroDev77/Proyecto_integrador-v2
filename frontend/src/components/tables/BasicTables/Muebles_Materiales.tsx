import { useState } from "react";
import { useMueblesMateriales } from "../../../hooks/muebles_materiales/useMuebles_Materiales";
import MueblesMaterialesAdvancedFilters from "../../filters/MueblesMaterialesAdvancedFilters";
import ModalAgregarMuebleMaterial from "../../ui/modal/mueble_material/AgregarModal";
import ModalEditarMuebleMaterial from "../../ui/modal/mueble_material/EditarModal";
import ModalVerMuebleMaterial from "../../ui/modal/mueble_material/VerDatos";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

const textColor = "text-gray-800 dark:text-white/90";

export default function MueblesMateriales() {
  const {
    setMueblesMateriales,
    /* searchTerm,
    setSearchTerm, */
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
  } = useMueblesMateriales();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [mueblematerialSeleccionado, setMuebleMaterialSeleccionado] =
    useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false); // Nuevo estado para ver
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_mue_mat: number) => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar este mueble-material?"
    );
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
        `http://localhost:8000/api/mueble-material/${id_mue_mat}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error("Error al eliminar empleado");

      setMueblesMateriales((prev) =>
        prev.filter((emp) => emp.id_mue_mat !== id_mue_mat)
      );
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      alert("No se pudo eliminar el empleado.");
    }
  };
  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/mueble-material/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "muebles-materiales-backup.sql";
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
      {/* Filtros Avanzados */}
      <MueblesMaterialesAdvancedFilters
        onFiltersChange={setFilters}
        onSortChange={setSort}
      />

      {/* Botones de reporte y backup */}
      {/* <div className="flex justify-end p-4 flex-wrap gap-4">
        <div className="flex gap-4 flex-wrap w-full md:w-auto justify-end">
          <button
            onClick={generarReporte}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-md text-sm"
          >
            <FaFileAlt /> Generar Reporte
          </button>
        </div>
      </div> */}

      {/* Búsqueda y botón agregar */}
      <div className="flex justify-between items-center p-4 flex-wrap gap-4">
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
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Contenedor de la tabla y paginación */}
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
                    sortField="mueble_material.cod_mue_mat"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Mueble"
                    sortField="muebles.nom_mue"
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
                    label="Precio Venta"
                    sortField="muebles.precio_venta"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Precio Costo"
                    sortField="muebles.precio_costo"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Stock Mueble"
                    sortField="muebles.stock"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Material"
                    sortField="materiales.nom_mat"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Stock Material"
                    sortField="materiales.stock_mat"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Costo"
                    sortField="materiales.costo_mat"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Unidad Medida"
                    sortField="materiales.unidad_medida"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  imagen
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Cantidad"
                    sortField="mueble_material.cantidad"
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
              {paginatedData.map((mueblematerial) => (
                <TableRow key={mueblematerial.id_mue_mat}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueblematerial.cod_mue_mat || "Sin Codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueblematerial.mueble?.nom_mue}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    <img
                      src={mueblematerial.mueble?.img_mue}
                      alt="Imagen Mueble"
                      className="w-16 h-16 object-cover"
                    />
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueblematerial.mueble?.precio_venta} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueblematerial.mueble?.precio_costo} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueblematerial.mueble?.stock}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueblematerial.material?.nom_mat}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueblematerial.material?.stock_mat} [u]
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueblematerial.material?.costo_mat} Bs.
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueblematerial.material?.unidad_medida}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    <img
                      src={mueblematerial.material?.img_mat}
                      alt="Imagen Material"
                      className="w-16 h-16 object-cover"
                    />
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {mueblematerial.cantidad}[u]
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setMuebleMaterialSeleccionado(mueblematerial);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setMuebleMaterialSeleccionado(mueblematerial);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () =>
                            handleEliminar(mueblematerial.id_mue_mat),
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
      <ModalAgregarMuebleMaterial
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setMueblesMateriales={setMueblesMateriales}
      />
      <ModalEditarMuebleMaterial
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        mueblematerialSeleccionado={mueblematerialSeleccionado}
        setMueblesMateriales={setMueblesMateriales}
      />
      <ModalVerMuebleMaterial
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        mueblematerial={mueblematerialSeleccionado}
      />
    </div>
  );
}
