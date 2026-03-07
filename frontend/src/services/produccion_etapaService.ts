import axios from "axios";

const API_URL = "http://localhost:8000/api/produccion-etapa";

export async function getProduccionesEtapas(page: number = 1, perPage: number = 20, extraParams?: Record<string, any>) {
  const params = { page, per_page: perPage, ...extraParams };
  const response = await axios.get(API_URL, { params });
  return response.data;
}
