import axiosClient from "../api/axios";

const API_URL = "/api/evidencias-produccion";

export async function getEvidenciasProduccion(
  page = 1,
  perPage = 20,
  params: Record<string, any> = {}
) {
  const response = await axiosClient.get(API_URL, {
    params: { page, per_page: perPage, ...params },
  });
  return response.data;
}

export async function getEvidenciaProduccion(id: number) {
  const response = await axiosClient.get(`${API_URL}/${id}`);
  return response.data;
}

export async function createEvidenciaProduccion(formData: FormData) {
  const response = await axiosClient.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updateEvidenciaProduccion(
  id: number,
  formData: FormData
) {
  const response = await axiosClient.put(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteEvidenciaProduccion(id: number) {
  const response = await axiosClient.delete(`${API_URL}/${id}`);
  return response.data;
}

export async function getEvidenciasPorProduccion(idPro: number) {
  const response = await axiosClient.get(`${API_URL}/por-produccion/${idPro}`);
  return response.data;
}
