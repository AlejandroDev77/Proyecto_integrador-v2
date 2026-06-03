import { useState } from "react";
import { qaService } from "../../services/qaService";

export const useQA = () => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  

  const ejecutar = async (
    nombre: string,
    tipo: string,
    emailDestino: string,
    baseUrl: string,
    credenciales: { email: string; password: string },
  ) => {
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      
      // 1. Crear suite
      const suiteRes = await qaService.crearSuite({
        nombre,
        descripcion: `Ejecución automática — ${tipo}`,
        tipo,
        emailDestino,
      });
      
      const suiteId = suiteRes.data.data.id;

      // 2. Crear ejecución
      const execRes = await qaService.crearEjecucion(suiteId);
      const executionId = execRes.data.data.id;

      // 3. Disparar run
      const runRes = await qaService.ejecutarSuite(executionId, baseUrl, credenciales);
      setResultado(runRes.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al ejecutar las pruebas");
    } finally {
      setLoading(false);
    }
  };
  

  return { loading, resultado, error, ejecutar };
};
