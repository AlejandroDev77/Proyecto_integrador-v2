import axios from "axios";

const API_URL = "http://localhost:8000/api/cotizacion";

export async function getCotizaciones(
  page: number = 1,
  perPage: number = 20,
  filters: Record<string, any> = {},
  sort: string = ""
) {
  const params: any = { page, per_page: perPage };

  if (Object.keys(filters).length > 0) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const paramKey = key.startsWith("filter[") ? key : `filter[${key}]`;
        params[paramKey] = value;
      }
    });
  }

  if (sort) params.sort = sort;

  const response = await axios.get(API_URL, { params });
  return response.data;
}
