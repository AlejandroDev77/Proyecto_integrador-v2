import axios from "axios";

const API_URL = "http://localhost:8000/api/venta";

export async function getVentas(
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
        if (typeof value === 'object' && 'min' in value) {
          const fieldKey = key.startsWith('filter[') ? key.replace('filter[', '').replace(']', '') : key;
          if (value.min !== undefined) params[`filter[${fieldKey}_min]`] = value.min;
          if (value.max !== undefined) params[`filter[${fieldKey}_max]`] = value.max;
        } else {
          const paramKey = key.startsWith('filter[') ? key : `filter[${key}]`;
          params[paramKey] = value;
        }
      }
    });
  }

  if (sort) {
    params.sort = sort;
  }

  const response = await axios.get(API_URL, { params });
  return response.data;
}
