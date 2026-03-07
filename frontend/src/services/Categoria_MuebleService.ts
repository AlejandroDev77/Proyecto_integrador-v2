import axios from "axios";

export async function getCategoriasMuebles(page: number = 1, perPage: number = 20, extraParams?: Record<string, any>) {
  const params = { page, per_page: perPage, ...extraParams };
  const response = await axios.get("http://localhost:8000/api/categoria-mueble", { params });
  return response.data;
}
