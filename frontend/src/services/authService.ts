import axiosClient from "../api/axios";
import {jwtDecode} from "jwt-decode";

// Interfaz para el payload del token
export interface UserTokenPayload {
  id_usu: number;
  id_rol: number;
  permisos?: string[];
  [key: string]: any;
}

export async function login(username: string, password: string) {
  try {
    const response = await axiosClient.post("/api/login", {
      nom_usu: username,
      password,
    });

    const { access_token } = response.data;

    // Guardar el token
    localStorage.setItem("token", access_token);

    // Decodificar el token para obtener el usuario y sus permisos
    const decoded: any = jwtDecode(access_token);
    const id_usu = decoded.id_usu;
    const id_rol = decoded.id_rol;
    const permisos: string[] = decoded.permisos || [];

    return { token: access_token, id_usu, id_rol, permisos };
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Credenciales inválidas");
    }
    throw new Error("Error inesperado al iniciar sesión");
  }
}

/**
 * Obtiene la ruta de redirección desde el backend según el rol del usuario
 * Esto evita exponer los IDs de roles en el frontend
 */
export async function getRedirectRoute(id_rol: number): Promise<string> {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosClient.get(
      `/api/roles/${id_rol}/redirect-route`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.route || "/signin";
  } catch (error) {
    // Fallback seguro
    console.error("Error obteniendo ruta de redirección", error);
    return "/signin";
  }
}

export async function register(userData: {
  nom_usu: string;
  email_usu: string;
  pas_usu: string;
  id_rol: number;
}) {
  try {
    const response = await axiosClient.post("/api/register", userData);
    return response.data;
  } catch (error: any) {
    const errors = error.response?.data?.errors;
    if (errors?.nom_usu?.[0]) {
      throw new Error("Nombre de usuario no disponible.");
    } else if (errors?.email_usu?.[0]) {
      throw new Error("Email no disponible.");
    } else {
      throw new Error("Error al registrar el usuario.");
    }
  }
}

export function getUser(): UserTokenPayload | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwtDecode<UserTokenPayload>(token);
  } catch {
    return null;
  }
}

export async function logout() {
  const token = localStorage.getItem("token");
  try {
    if (token) {
      await axiosClient.post(
        "/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  } catch (error) {
    // Puedes mostrar un mensaje si lo deseas
  }
  localStorage.removeItem("token");
}
