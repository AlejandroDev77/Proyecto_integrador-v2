import axiosClient from "../api/axios";
import { jwtDecode } from "jwt-decode";


export const API_URL = "/api/permisos";

const getIdUsuarioFromToken = (): string | null => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const p: any = jwtDecode(token);
      return p.id_usu || null;
    }
  } catch {
    return null;
  }
  return null;
};

export const getPermisos = async (
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
// POST - Crear nuevo permiso
export const crearPermiso = async (nomPermiso: string, desc: string) => {
  const idUsuario = getIdUsuarioFromToken();
  const headers: any = { "Content-Type": "application/json" };
  
  if (idUsuario) {
    headers["X-USER-ID"] = idUsuario;
  }

  const response = await axiosClient.post(
    API_URL,
    { nom_permiso: nomPermiso.trim(), descripcion: desc.trim() },
    { headers }
  );
  return response.data;
};

// PUT - Actualizar permiso
export const actualizarPermiso = async (idPermiso: number, nomPermiso: string, desc: string) => {
  const idUsuario = getIdUsuarioFromToken();
  const headers: any = { "Content-Type": "application/json" };
  
  if (idUsuario) {
    headers["X-USER-ID"] = idUsuario;
  }

  const response = await axiosClient.put(
    `${API_URL}/${idPermiso}`,
    { nom_permiso: nomPermiso.trim(), descripcion: desc.trim() },
    { headers }
  );
  return response.data;
};

// DELETE - Eliminar permiso
export const eliminarPermiso = async (idPermiso: number) => {
  const idUsuario = getIdUsuarioFromToken();
  const headers: any = { "Content-Type": "application/json" };
  
  if (idUsuario) {
    headers["X-USER-ID"] = idUsuario;
  }

  const response = await axiosClient.delete(
    `${API_URL}/${idPermiso}`,
    { headers }
  );
  return response.data;
};


