import axiosClient from "../api/axios";

const API_URL = "/api/usuarios";

export const getUsuarios = async (
  page: number = 1,
  perPage: number = 20,
  filters: Record<string, any> = {},
  sort: string = "",
) => {
  const params: any = { page, per_page: perPage };

  if (Object.keys(filters).length > 0) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        // Si la clave ya tiene filter[...], usarla tal como está
        // Si no, añadir el prefijo filter[
        const paramKey = key.startsWith("filter[") ? key : `filter[${key}]`;
        params[paramKey] = value;
      }
    });
  }

  if (sort) params.sort = sort;

  const response = await axiosClient.get(API_URL, { params });
  return response.data;
};

export const cambiarEstadoUsuario = async (
  id: number,
  nuevoEstado: boolean,
) => {
  const estadoNumerico = nuevoEstado ? 1 : 0;
  await axiosClient.put(`${API_URL}/${id}/estado`, { est_usu: estadoNumerico });
};
