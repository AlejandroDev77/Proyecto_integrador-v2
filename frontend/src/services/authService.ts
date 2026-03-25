import axiosClient from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { 
  UserTokenPayload, 
  LoginResponse, 
  RegisterRequest, 
  AuthRedirectResponse,
  Requires2FAResponse
} from "../types/auth";

export async function login(username: string, password: string): Promise<LoginResponse | Requires2FAResponse> {
  try {
    const response = await axiosClient.post("/api/login", {
      nom_usu: username,
      password,
    });

    if (response.data.requires_2fa) {
      return response.data as Requires2FAResponse;
    }

    const { access_token } = response.data;

    // Guardar el token
    localStorage.setItem("token", access_token);

    // Decodificar el token para obtener el usuario y sus permisos
    const decoded = jwtDecode<UserTokenPayload>(access_token);
    
    return { 
      token: access_token, 
      id_usu: decoded.id_usu, 
      id_rol: decoded.id_rol, 
      permisos: decoded.permisos || [] 
    } as LoginResponse;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Credenciales inválidas");
    }
    throw new Error("Error inesperado al iniciar sesión");
  }
}

export async function loginWith2fa(tempToken: string, code: string): Promise<LoginResponse> {
  try {
    const response = await axiosClient.post("/api/login/2fa", {
      temp_token: tempToken,
      code: code
    });

    const { access_token } = response.data;
    localStorage.setItem("token", access_token);

    const decoded = jwtDecode<UserTokenPayload>(access_token);
    
    return { 
      token: access_token, 
      id_usu: decoded.id_usu, 
      id_rol: decoded.id_rol, 
      permisos: decoded.permisos || [] 
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Código incorrecto o token expirado.");
  }
}

export async function loginWithGoogle(credential: string): Promise<LoginResponse | Requires2FAResponse> {
  try {
    const response = await axiosClient.post("/api/login/oauth2/google", {
      credential
    });

    if (response.data.requires_2fa) {
      return response.data as Requires2FAResponse;
    }

    const { access_token } = response.data;
    localStorage.setItem("token", access_token);

    const decoded = jwtDecode<UserTokenPayload>(access_token);
    
    return { 
      token: access_token, 
      id_usu: decoded.id_usu, 
      id_rol: decoded.id_rol, 
      permisos: decoded.permisos || [] 
    } as LoginResponse;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al iniciar sesión con Google");
  }
}

/**
 * Obtiene la ruta de redirección desde el backend según el rol del usuario
 */
export async function getRedirectRoute(id_rol: number): Promise<string> {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosClient.get<AuthRedirectResponse>(
      `/api/roles/${id_rol}/redirect-route`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.route || "/signin";
  } catch (error) {
    console.error("Error obteniendo ruta de redirección", error);
    return "/signin";
  }
}

export async function register(userData: RegisterRequest) {
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
    const decoded = jwtDecode<UserTokenPayload>(token);
    // Verificar si el token ya expiró
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }
    return decoded;
  } catch {
    localStorage.removeItem("token");
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
    // Silently proceed to remove token
  }
  localStorage.removeItem("token");
}

/**
 * Solicita el envío del correo de recuperación de contraseña.
 */
export async function forgotPassword(email: string) {
  try {
    const response = await axiosClient.post("/api/forgot-password", { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Ocurrió un error procesando tu solicitud.");
  }
}

/**
 * Envía la nueva contraseña junto con el token para ser guardada.
 */
export async function resetPassword(token: string, password: string) {
  try {
    const response = await axiosClient.post("/api/reset-password", { token, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Ocurrió un error reestableciendo la contraseña.");
  }
}

