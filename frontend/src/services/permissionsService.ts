import axiosClient from "../api/axios";
import { getUser } from "./authService";

export async function getUserPermissionsFromApi(userId?: number) {
  try {
    const id = userId || getUser()?.id_usu;
    if (!id) return [];
    const response = await axiosClient.get(`/api/usuarios/${id}/permisos`);
   
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.permisos)) return data.permisos;
    return [];
  } catch (error) {
    console.error("Error getting user permissions", error);
    return [];
  }
}
