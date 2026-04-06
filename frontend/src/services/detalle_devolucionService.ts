import axios from "axios";

const API_URL = "http://localhost:8080/api/detalle-devolucion";

export async function getDetallesDevoluciones(page: number = 1, perPage: number = 20, extraParams?: Record<string, any>) {
  const params = { page, per_page: perPage, ...extraParams };
  const response = await axios.get(API_URL, { params });
  return response.data;
}
