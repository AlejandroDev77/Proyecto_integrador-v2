import axiosClient from "../api/axios";
import { jwtDecode } from "jwt-decode";

export const API_URL = "/api/roles";

// Utility para obtener el ID del usuario del token
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

// GET - Obtener roles con paginación y filtros
export const getRoles = async (
  page: number = 1, 
  perPage: number = 20,
  filters: Record<string, any>={}, 
  sort: string= "",
) => { 
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
};

// POST - Crear nuevo rol
export const crearRol = async (nomRol: string) => {
  const idUsuario = getIdUsuarioFromToken();
  const headers: any = { "Content-Type": "application/json" };
  
  if (idUsuario) {
    headers["X-USER-ID"] = idUsuario;
  }

  const response = await axiosClient.post(
    API_URL,
    { nom_rol: nomRol.trim() },
    { headers }
  );
  return response.data;
};

// PUT - Actualizar rol
export const actualizarRol = async (idRol: number, nomRol: string) => {
  const idUsuario = getIdUsuarioFromToken();
  const headers: any = { "Content-Type": "application/json" };
  
  if (idUsuario) {
    headers["X-USER-ID"] = idUsuario;
  }

  const response = await axiosClient.put(
    `${API_URL}/${idRol}`,
    { nom_rol: nomRol.trim() },
    { headers }
  );
  return response.data;
};

// DELETE - Eliminar rol
export const eliminarRol = async (idRol: number) => {
  const idUsuario = getIdUsuarioFromToken();
  const headers: any = { "Content-Type": "application/json" };
  
  if (idUsuario) {
    headers["X-USER-ID"] = idUsuario;
  }

  const response = await axiosClient.delete(
    `${API_URL}/${idRol}`,
    { headers }
  );
  return response.data;
};
