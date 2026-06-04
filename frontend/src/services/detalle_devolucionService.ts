import axiosClient from "../api/axios";

const API_URL = "/api/detalle-devoluciones";

export async function getDetallesDevoluciones(page: number = 1, perPage: number = 20, extraParams?: Record<string, any>) {
  const params = { page, per_page: perPage, ...extraParams };
  const response = await axiosClient.get(API_URL, { params });
  return response.data;
}
