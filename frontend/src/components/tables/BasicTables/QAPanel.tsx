import { useState } from "react";
import { useQA } from "../../../hooks/qa/useQA";

const TIPOS = [
  { value: "regresion", label: "Regresión" },
  { value: "unitario", label: "Unitario" },
  { value: "integracion", label: "Integración" },
  { value: "e2e", label: "End to End" },
  { value: "sistema", label: "Sistema" },
];

export default function QAPanel() {
  const { loading, resultado, error, ejecutar } = useQA();

  const [nombre, setNombre] = useState("Suite QA");
  const [tipo, setTipo] = useState("regresion");
  const [email, setEmail] = useState("");
  const [baseUrl, setBaseUrl] = useState("http://localhost:5173");
  const [credEmail, setCredEmail] = useState("casodeprueba");
  const [credPassword, setCredPassword] = useState("");

  const handleStart = () => {
    if (!email) return alert("Ingresá un email destino");
    ejecutar(nombre, tipo, email, baseUrl, {
    email: credEmail,
    password: credPassword
    
    }); 


  };

  return (
    <div className="p-6 space-y-6">

      {/* Configuración */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Configuración de pruebas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre de la suite
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL del sistema a testear
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email destino del reporte
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tipo de prueba */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de prueba
          </label>
          <div className="flex flex-wrap gap-2">
            {TIPOS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTipo(t.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  tipo === t.value
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Credenciales de prueba */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Credenciales de prueba
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={credEmail}
              onChange={(e) => setCredEmail(e.target.value)}
              placeholder="Usuario"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={credPassword}
              onChange={(e) => setCredPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Botón Start */}
        <div className="mt-6">
          <button
            onClick={handleStart}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all shadow-md text-sm"
          >
            {loading ? "Ejecutando pruebas..." : "▶ Start"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Resultados */}
      {resultado && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Resultados de ejecución
            </h2>
            <div className="flex gap-3 text-sm font-medium">
              <span className="text-green-600">✔ Pasados: {resultado.pasados}</span>
              <span className="text-red-500">✘ Fallidos: {resultado.fallidos}</span>
              <span className="text-gray-500">Total: {resultado.total}</span>
            </div>
          </div>

          <div className="space-y-6">
            {resultado.resultados.map((caso: any, i: number) => (
              <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {caso.nombre}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    caso.estado_general === "PASA"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {caso.estado_general}
                  </span>
                </div>

                <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 space-y-1">
                  <p><strong>Módulo:</strong> {caso.modulo}</p>
                  <p><strong>Caso de uso:</strong> {caso.caso_uso}</p>
                  <p><strong>Tiempo total:</strong> {caso.tiempo_total_ms}ms</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-xs uppercase">
                        <th className="px-3 py-2 rounded-l-lg">Paso</th>
                        <th className="px-3 py-2">Acción</th>
                        <th className="px-3 py-2">Resultado esperado</th>
                        <th className="px-3 py-2">Resultado obtenido</th>
                        <th className="px-3 py-2">Estado</th>
                        <th className="px-3 py-2 rounded-r-lg">Tiempo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {caso.pasos.map((step: any, j: number) => (
                        <tr key={j} className="hover:bg-white dark:hover:bg-gray-900/50">
                          <td className="px-3 py-2 font-medium text-gray-800 dark:text-white">
                            {step.paso}
                          </td>
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs font-mono">
                            {step.entrada_accion}
                          </td>
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                            {step.resultado_esperado}
                          </td>
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                            {step.resultado_obtenido}
                          </td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              step.estado === "PASA"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {step.estado}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                            {step.tiempo_ms}ms
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            Reportes enviados al correo — también disponibles en la carpeta <code>reportes/</code> del servidor.
          </p>
        </div>
      )}
    </div>
  );
}