import axiosClient from "../api/axios";

export async function getCategoriasMuebles(page: number = 1, perPage: number = 20, extraParams?: Record<string, any>) {
  const params = { page, per_page: perPage, ...extraParams };
  const response = await axiosClient.get("/api/categorias", { params });
  return response.data;
}
