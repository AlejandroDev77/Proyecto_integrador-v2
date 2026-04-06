import axios from "axios";

const API_URL = "http://localhost:8080/api/proveedor";

export async function getProveedores(
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
export const cambiarEstadoProveedor = async (id: number, nuevoEstado: boolean) => {
  const estadoNumerico = nuevoEstado ? 1 : 0;
  await axios.put(`${API_URL}/${id}/estado`, { est_prov: estadoNumerico });
};
