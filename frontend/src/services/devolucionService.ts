import axios from "axios";

const API_URL = "http://localhost:8000/api/devolucion";

export async function getDevolucion(
  page: number = 1,
  perPage: number = 20,
  filters: Record<string, any> = {},
  sort: string = ""
) {
  const params: Record<string, any> = { page, per_page: perPage };

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      if (key.startsWith("filter[")) {
        params[key] = value;
      } else {
        params[`filter[${key}]`] = value;
      }
    }
  });

  if (sort && typeof sort === "string" && sort.trim() !== "") {
    params.sort = sort;
  }

  const response = await axios.get(API_URL, { params });
  return response.data;
}
