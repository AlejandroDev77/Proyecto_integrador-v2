import axiosClient from "../api/axios";

const API_URL = "/api/pagos";

export async function getPagos(
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

  const response = await axiosClient.get(API_URL, { params });
  return response.data;
}
