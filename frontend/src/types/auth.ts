/*
 * Interfaces relacionadas con la autenticación
 */

export interface UserTokenPayload {
  id_usu: number;
  id_rol: number;
  nom_usu: string;
  email_usu: string;
  cod_usu: string;
  img_cli?: string;
  permisos?: string[];
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  token: string;
  id_usu: number;
  id_rol: number;
  permisos: string[];
}

export interface Requires2FAResponse {
  requires_2fa: boolean;
  temp_token: string;
  message: string;
}

export interface RegisterRequest {
  nom_usu: string;
  email_usu: string;
  pas_usu: string;
  id_rol: number;
}

export interface AuthRedirectResponse {
  route: string;
  nom_rol: string;
}
