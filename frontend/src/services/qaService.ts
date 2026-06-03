import api from "../api/axios";

export const qaService = {
  crearSuite: (data: {
    nombre: string;
    descripcion: string;
    tipo: string;
    emailDestino: string;
  }) => api.post("/api/qa/suites", data),

  listarSuites: () => api.get("/api/qa/suites"),

  crearEjecucion: (suiteId: string) =>
    api.post("/api/qa/executions", { suiteId }),

  ejecutarSuite: (executionId: string, baseUrl: string, credenciales?: object) =>
  api.post(`/api/qa/executions/${executionId}/run`, { credenciales }, {
    params: { baseUrl }
  }),

  listarEjecuciones: (suiteId: string) =>
    api.get(`/api/qa/executions/suite/${suiteId}`),

  listarSteps: (executionId: string) =>
    api.get(`/api/qa/executions/${executionId}/steps`),
};