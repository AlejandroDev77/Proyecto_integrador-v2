import { useState } from "react";
import { useDiseños } from "../../../hooks/diseños/useDiseños";
import DiseñosAdvancedFilters from "../../filters/DiseñosAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus } from "lucide-react";
import ModalAgregarDiseño from "../../ui/modal/diseño/AgregarModal";
import ModalEditarDiseño from "../../ui/modal/diseño/EditarModal";
import ModalVerDiseño from "../../ui/modal/diseño/VerDatos";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

const textColor = "text-gray-800 dark:text-white/90";

export default function Diseños() {
  const {
    setDiseños,
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
  } = useDiseños();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [diseñoSeleccionado, setDiseñoSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_dis: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este diseño?");
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
      const res = await fetch(`http://localhost:8000/api/diseño/${id_dis}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar diseño");

      setDiseños((prev) => prev.filter((dis) => dis.id_dis !== id_dis));
    } catch (error) {
      console.error("Error al eliminar diseño:", error);
      alert("No se pudo eliminar el diseño.");
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/diseño/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diseños-backup.sql";
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

      <DiseñosAdvancedFilters onFiltersChange={setFilters} />

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
        <Button
          onClick={() => setShowModalAgregar(true)}
          startIcon={<Plus size={20} />}
          size="sm"
        >
          {""}
        </Button>
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
                    sortField="cod_dis"
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
                    sortField="nom_dis"
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
                  Archivo 3D
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
                  Cotización
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
              {paginatedData.map((diseño) => (
                <TableRow key={diseño.id_dis}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {diseño.cod_dis || "sin codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {diseño.nom_dis}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {diseño.desc_dis}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {diseño.archivo_3d ? (
                      <a
                        href={
                          diseño.archivo_3d.startsWith("http")
                            ? diseño.archivo_3d
                            : `http://localhost:8000/storage/${diseño.archivo_3d.replace(
                                "public/",
                                ""
                              )}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Ver archivo
                      </a>
                    ) : (
                      "Sin archivo"
                    )}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {diseño.img_dis ? (
                      <img
                        src={
                          diseño.img_dis.startsWith("http")
                            ? diseño.img_dis
                            : `http://localhost:8000/storage/${diseño.img_dis.replace(
                                "public/",
                                ""
                              )}`
                        }
                        alt={diseño.nom_dis}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {diseño.cotizacion?.fec_cot
                      ? new Date(diseño.cotizacion.fec_cot).toLocaleDateString(
                          "es-BO",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : ""}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setDiseñoSeleccionado(diseño);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setDiseñoSeleccionado(diseño);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () => handleEliminar(diseño.id_dis),
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
      <ModalAgregarDiseño
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setDiseños={setDiseños}
      />

      <ModalEditarDiseño
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        diseñoSeleccionado={diseñoSeleccionado}
        setDiseños={setDiseños}
      />
      <ModalVerDiseño
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        diseñoSeleccionado={diseñoSeleccionado}
      />
    </div>
  );
}
