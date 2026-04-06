import axios from "axios";

export async function getEmpleados(
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
          const minKey = key.startsWith('filter[') ? key.replace('filter[', '').replace(']', '') : key;
          const maxKey = minKey;
          if (value.min !== undefined) params[`filter[${minKey}_min]`] = value.min;
          if (value.max !== undefined) params[`filter[${maxKey}_max]`] = value.max;
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

  const response = await axios.get("http://localhost:8080/api/empleados", {
    params,
  });
  return response.data;
}
