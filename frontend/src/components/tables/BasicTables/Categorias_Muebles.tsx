import { useState } from "react";
import { useCategoriasMuebles } from "../../../hooks/categorias_muebles/useCategorias_Muebles";
import ModalAgregarCategoriaMueble from "../../ui/modal/categoria_mueble/AgregarModal";
import ModalEditarCategoriaMueble from "../../ui/modal/categoria_mueble/EditarModal";
import ModalVerCategoriaMueble from "../../ui/modal/categoria_mueble/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus } from "lucide-react";
import {} from "../../../icons";

import SortableTableHeader from "../../ui/SortableTableHeader";
import CategoriaMueblesAdvancedFilters from "../../filters/CategoriaMueblesAdvancedFilters";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

const textColor = "text-gray-800 dark:text-white/90";

export default function CategoriasMuebles() {
  const {
    setCategoriasMuebles,
    /*    searchTerm,
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
  } = useCategoriasMuebles();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [categoriamuebleSeleccionado, setCategoriaMuebleSeleccionado] =
    useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false); // Nuevo estado para ver
  /*   const [filtroNombre, setFiltroNombre] = useState(""); // Estado para el filtro de nombre */
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };
  const handleEliminar = async (id_cat: number) => {
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
        `http://localhost:8000/api/categoria-mueble/${id_cat}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error("Error al eliminar material");

      setCategoriasMuebles((prev) =>
        prev.filter((mat) => mat.id_cat !== id_cat)
      );
    } catch (error) {
      console.error("Error al eliminar material:", error);
      alert("No se pudo eliminar el material.");
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/categoria-mueble/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "categorias_muebles-backup.sql";
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
      <CategoriaMueblesAdvancedFilters onFiltersChange={setFilters} />

      {/* Filtros para el reporte */}
      {/* <div className="flex flex-wrap justify-between items-center p-4 gap-4">
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <button
            onClick={generarReporte}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-md text-sm w-full md:w-auto"
          >
            <FaFileAlt /> Generar Reporte
          </button>
        </div>
      </div> */}

      {/* Search and Add Button */}
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

      {/* Table Container */}
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
                    label="Código"
                    sortField="cod_cat"
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
                    sortField="nom_cat"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Descripción"
                    sortField="desc_cat"
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
              {paginatedData.map((categoriamueble) => (
                <TableRow key={categoriamueble.id_cat}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {categoriamueble.cod_cat || "sin codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {categoriamueble.nom_cat}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {categoriamueble.desc_cat}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setCategoriaMuebleSeleccionado(categoriamueble);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setCategoriaMuebleSeleccionado(categoriamueble);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () => handleEliminar(categoriamueble.id_cat),
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

      {/* Modals */}
      <ModalAgregarCategoriaMueble
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setCategoriasMuebles={setCategoriasMuebles}
      />

      <ModalEditarCategoriaMueble
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        categoriamuebleSeleccionado={categoriamuebleSeleccionado}
        setCategoriasMuebles={setCategoriasMuebles}
      />
      <ModalVerCategoriaMueble
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        categoriamuebleSeleccionado={categoriamuebleSeleccionado}
      />
    </div>
  );
}
