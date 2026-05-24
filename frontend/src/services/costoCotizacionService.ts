import axiosClient from "../api/axios";

const API_URL = "/api/costo-cotizaciones";

export async function getCostosCotizacion(
  page = 1,
  perPage = 20,
  params: Record<string, any> = {}
) {
  const response = await axiosClient.get(API_URL, {
    params: { page, per_page: perPage, ...params },
  });
  return response.data;
}

export async function getCostoCotizacion(id: number) {
  const response = await axiosClient.get(`${API_URL}/${id}`);
  return response.data;
}

export async function createCostoCotizacion(data: any) {
  const response = await axiosClient.post(API_URL, data);
  return response.data;
}

export async function updateCostoCotizacion(id: number, data: any) {
  const response = await axiosClient.put(`${API_URL}/${id}`, data);
  return response.data;
}

export async function deleteCostoCotizacion(id: number) {
  const response = await axiosClient.delete(`${API_URL}/${id}`);
  return response.data;
}
