
import { useLogs } from "../../../hooks/logss/useLogs";
import ComponentCard from "../../common/ComponentCard";



import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

const textColor = "text-gray-800 dark:text-white/90";

function renderValues(values: string | null) {
  if (!values) return <span>-</span>;
  let parsed: Record<string, any>;
  try {
    parsed = JSON.parse(values);
    if (!parsed || typeof parsed !== 'object') return <span>-</span>;
  } catch {
    return <span>-</span>;
  }
  return (
    <ul className="list-disc pl-4">
      {Object.entries(parsed).map(([key, value]) => (
        <li key={key}>
          <span className="font-semibold">{key}:</span> {String(value)}
        </li>
      ))}
    </ul>
  );
}

function renderChangedValues(oldValues: string | null, newValues: string | null) {
  let oldParsed: Record<string, any> = {};
  let newParsed: Record<string, any> = {};
  try {
    if (oldValues) oldParsed = JSON.parse(oldValues);
  } catch {}
  try {
    if (newValues) newParsed = JSON.parse(newValues);
  } catch {}

  const allKeys = Array.from(new Set([
    ...Object.keys(oldParsed || {}),
    ...Object.keys(newParsed || {})
  ]));

  const changedKeys = allKeys.filter(
    key => oldParsed[key] !== newParsed[key]
  );

  if (changedKeys.length === 0) return <span>-</span>;

  return (
    <ul className="space-y-2">
      {changedKeys.map((key) => (
        <li key={key}>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 flex flex-col md:flex-row md:items-center gap-2 border border-gray-200 dark:border-gray-700">
            <span className="font-bold text-blue-700 dark:text-blue-300 min-w-[90px]">{key}:</span>
            <span className="inline-block text-xs bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 px-2 py-1 rounded-md line-through mr-2">
              {oldParsed[key] !== undefined ? String(oldParsed[key]) : '-'}
            </span>
            <span className="inline-block text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-1 rounded-md font-bold">
              {newParsed[key] !== undefined ? String(newParsed[key]) : '-'}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function LogsTable() {
  const {
    setLogs,
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
    <ComponentCard title="Logs">
      <div>
        {/* Buscador y botón agregar */}
        <div className="flex flex-wrap justify-between items-center p-4 gap-4">
          <input
            type="text"
            placeholder="Buscar por usuario (cod_usu)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full md:w-1/2 px-4 py-2 border rounded-md text-sm ${textColor}`}
          />
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            
          </div>
        </div>

        {/* Items por página */}
        <div className="p-4 flex flex-wrap gap-4 items-center">
          <label htmlFor="itemsPerPage" className={`mr-2 ${textColor} w-full md:w-auto`}>
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

        {/* Tabla de Logs */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow>
                  
                  <TableCell isHeader className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}>Código Usuario</TableCell>
                  
                  <TableCell isHeader className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}>Tabla</TableCell>
                  <TableCell isHeader className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}>Acción</TableCell>
                  
                  <TableCell isHeader className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}>Cambios</TableCell>
                  <TableCell isHeader className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}>Fecha Creacion</TableCell>
                  <TableCell isHeader className={`px-5 py-3 font-medium text-start text-theme-xs ${textColor}`}>Fecha Actualizacion</TableCell>

                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                {paginatedData
                  .slice() // Copia para no mutar el original
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((log) => (
                    <TableRow key={log.id}>
                      
                      <TableCell className={`px-5 py-4 ${textColor}`}>{log.cod_usu}</TableCell>
                 
                      <TableCell className={`px-5 py-4 ${textColor}`}>{log.table_name}</TableCell>
                      <TableCell className={`px-5 py-4 ${textColor}`}>{log.action}</TableCell>
                     
                      <TableCell className={`px-5 py-4 ${textColor}`}>{renderChangedValues(log.old_values, log.new_values)}</TableCell>
                      <TableCell className={`px-5 py-4 ${textColor}`}>
                        {log.created_at ? new Date(log.created_at).toLocaleString('es-BO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        }) : ''}
                      </TableCell>
                      <TableCell className={`px-5 py-4 ${textColor}`}>
                        {log.updated_at ? new Date(log.updated_at).toLocaleString('es-BO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        }) : ''}
                      </TableCell>

                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
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
      </div>
    </ComponentCard>
  );
}
