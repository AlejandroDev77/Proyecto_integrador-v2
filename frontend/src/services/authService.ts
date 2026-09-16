import axiosClient from "../api/axios";
import { clearAuthIdentity, getAuthIdentity, setAuthIdentity } from "../utils/authIdentity";
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

    const user = response.data.user;
    const identity = setAuthIdentity(user);
    
    return { 
      token: identity,
      id_usu: user.id_usu,
      id_rol: user.id_rol,
      permisos: user.permisos || []
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

    const user = response.data.user;
    const identity = setAuthIdentity(user);
    
    return { 
      token: identity,
      id_usu: user.id_usu,
      id_rol: user.id_rol,
      permisos: user.permisos || []
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

    const user = response.data.user;
    const identity = setAuthIdentity(user);
    
    return { 
      token: identity,
      id_usu: user.id_usu,
      id_rol: user.id_rol,
      permisos: user.permisos || []
    } as LoginResponse;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al iniciar sesión con Google");
  }
}

/**
 * Obtiene la ruta de redirección desde el backend según el rol del usuario
 */
export async function getRedirectRoute(_id_rol: number): Promise<string> {
  try {
    const response = await axiosClient.get<AuthRedirectResponse>("/api/me/redirect-route");
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
  return getAuthIdentity();
}

export async function logout() {
  try {
    await axiosClient.post("/api/logout", {});
  } catch (error) {
    // Silently proceed to remove token
  }
  clearAuthIdentity();
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

