import { useState } from "react";
import { useUsuarios } from "../../../hooks/usuarios/useUsuarios";
import ModalAgregar from "../../ui/modal/usuario/AgregarModal";
import ModalEditar from "../../ui/modal/usuario/EditarModal";
import ModalVerUsuario from "../../ui/modal/usuario/VerDatos";
import UsuariosAdvancedFilters from "../../filters/UsuariosAdvancedFilters";
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
import Badge from "../../ui/badge/Badge";
import { FaFileDownload } from "react-icons/fa";

const textColor = "text-gray-800 dark:text-white/90";

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
    setFilters,
    setSort,
  } = useUsuarios();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false); // Nuevo estado para ver
  /*   const [filtroRol, setFiltroRol] = useState(""); // Estado para el filtro de rol
  const [filtroEstado, setFiltroEstado] = useState(""); // Estado para el filtro de estado */
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  /* const descargarBackup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/usuarios/exportar-sql`
      );
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "usuarios-backup.sql";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el respaldo:", error);
    }
  }; */
  const descargarBackupCompleto = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/backup`);
      if (!response.ok) throw new Error("Error al descargar el respaldo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
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

  return (
    <div>
      {/* Filtros avanzados */}

      <UsuariosAdvancedFilters onFiltersChange={setFilters} />

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

      {/* Table with container */}
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
                    label="Codigo"
                    sortField="cod_usu"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Nombre Usuario"
                    sortField="nom_usu"
                    currentSort={currentSort}
                    onSort={handleSort}
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  Rol
                </TableCell>
                <TableCell
                  isHeader
                  className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}
                >
                  <SortableTableHeader
                    label="Estado"
                    sortField="est_usu"
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
              {paginatedData.map((usuario) => (
                <TableRow key={usuario.id_usu}>
                  <TableCell className={`px-5 py-4 ${textColor}`}>
                    {usuario.cod_usu || "sin codigo"}
                  </TableCell>
                  <TableCell className={`px-5 py-4 text-start ${textColor}`}>
                    <div>
                      <span className="block font-medium">
                        {usuario.nom_usu}
                      </span>
                      <span className="block text-xs">{usuario.email_usu}</span>
                    </div>
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-sm ${textColor}`}
                  >
                    {usuario.id_rol === 1
                      ? "Administrador"
                      : usuario.id_rol === 2
                      ? "Cliente"
                      : usuario.id_rol === 3
                      ? "Empleado"
                      : "Desconocido"}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-sm ${textColor}`}
                  >
                    <Badge
                      size="sm"
                      color={usuario.est_usu ? "success" : "error"}
                    >
                      {usuario.est_usu ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-sm">
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
                          onClick: () =>
                            abrirModalEstado(usuario.id_usu, usuario.est_usu),
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

      {/* Botón para descargar respaldo completo */}
      <div className="flex justify-center mt-4">
        <button
          onClick={descargarBackupCompleto}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md text-sm"
        >
          <FaFileDownload /> Descargar Respaldo Completo
        </button>
      </div>

      {/* Modal de Confirmación */}
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

      {/* Modal Agregar Usuario */}
      <ModalAgregar
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setUsuarios={setUsuarios}
      />

      {/* Modal Editar Usuario */}
      <ModalEditar
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        usuarioSeleccionado={usuarioSeleccionado}
        setUsuarios={setUsuarios}
      />
      {/* Modal Ver Usuario */}
      <ModalVerUsuario
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        usuarioSeleccionado={usuarioSeleccionado}
      />
    </div>
  );
}
