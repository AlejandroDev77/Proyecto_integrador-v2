import axios from "axios";

const API_URL = "http://localhost:8000/api/roles-permisos";

export async function RolesPermisos(
  page: number = 1,
  perPage: number = 20,
  filters?: Record<string, any>,
  sort?: string
) {
  const params: any = {
    page,
    per_page: perPage,
  };

  if (filters) {
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== '' && value !== null) {
        const paramKey = key.startsWith('filter[') ? key : `filter[${key}]`;
        params[paramKey] = value;
      }
    });
  }

  if (sort) {
    params.sort = sort;
  }

  const response = await axios.get(API_URL, { params });
  return response.data;
}