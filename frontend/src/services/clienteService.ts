import axios from "axios";

export async function getClientes(
  page: number = 1,
  perPage: number = 20,
  filters?: Record<string, any>,
  sort?: string
) {
  const params: any = {
    page,
    per_page: perPage,
  };

  // Agregar filtros a los parámetros
  if (filters) {
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== '' && value !== null) {
        // Si la clave ya tiene filter[, usarla tal cual
        // Si no, agregarle filter[
        const paramKey = key.startsWith('filter[') ? key : `filter[${key}]`;
        params[paramKey] = value;
      }
    });
  }

  // Agregar ordenamiento
  if (sort) {
    params.sort = sort;
  }

  const response = await axios.get("http://localhost:8000/api/clientes", {
    params,
  });
  return response.data;
}
