import { useState } from "react";
import { useEtapasProducciones } from "../../../hooks/etapas_producciones/useEtapas_Producciones";
import EtapasProduccionAdvancedFilters from "../../filters/EtapasProduccionAdvancedFilters";
import ModalAgregarEtapaProduccion from "../../ui/modal/etapa_produccion/AgregarModal";
import ModalEditarEtapaProduccion from "../../ui/modal/etapa_produccion/EditarModal";
import ModalVerEtapaProduccion from "../../ui/modal/etapa_produccion/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import Button from "../../ui/button/Button";
import { Plus } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

const textColor = "text-gray-800 dark:text-white/90";

export default function EtapaProduccion() {
  const {
    setEtapasProducciones,
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
  } = useEtapasProducciones();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [etapaproduccionSeleccionado, setEtapaProduccionSeleccionado] =
    useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const handleEliminar = async (id_eta: number) => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar esta etapa de producción?"
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
        `http://localhost:8000/api/etapa-produccion/${id_eta}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error("Error al eliminar etapa de producción");

      setEtapasProducciones((prev) =>
        prev.filter((eta) => eta.id_eta !== id_eta)
      );
    } catch (error) {
      console.error("Error al eliminar etapa de producción:", error);
      alert("No se pudo eliminar la etapa de producción.");
    }
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/etapa-produccion/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "etapa-produccion-backup.sql";
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
      <EtapasProduccionAdvancedFilters onFiltersChange={setFilters} />

      {/* Filtros para el reporte */}
      {/* <div className="flex flex-wrap justify-between items-center p-4 gap-4">
        <div className="flex flex-wrap gap-4 w-full md:w-auto"></div>

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
                  Codigo
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Nombre Etapa
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
                  Duracion Estimada
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Orden Secuencia
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
              {paginatedData.map((etapasproducciones) => (
                <TableRow key={etapasproducciones.id_eta}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {etapasproducciones.cod_eta || "Sin Codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {etapasproducciones.nom_eta || "Sin Nombre"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {etapasproducciones.desc_eta || "Sin Descripción"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {etapasproducciones.duracion_estimada ||
                      "Sin Duración Estimada"}{" "}
                    Dias
                  </TableCell>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {etapasproducciones.orden_secuencia || "Sin Orden"} Capas
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start text-sm">
                    <TableActionButtons
                      actions={[
                        {
                          type: "view",
                          onClick: () => {
                            setEtapaProduccionSeleccionado(etapasproducciones);
                            setShowModalVer(true);
                          },
                        },
                        {
                          type: "edit",
                          onClick: () => {
                            setEtapaProduccionSeleccionado(etapasproducciones);
                            setShowModalEditar(true);
                          },
                        },
                        {
                          type: "delete",
                          onClick: () =>
                            handleEliminar(etapasproducciones.id_eta),
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
      <ModalAgregarEtapaProduccion
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setEtapasProducciones={setEtapasProducciones}
      />

      <ModalEditarEtapaProduccion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        etapaproduccionSeleccionado={etapaproduccionSeleccionado}
        setEtapasProducciones={setEtapasProducciones}
      />
      <ModalVerEtapaProduccion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        etapaproduccionSeleccionado={etapaproduccionSeleccionado}
      />
    </div>
  );
}
