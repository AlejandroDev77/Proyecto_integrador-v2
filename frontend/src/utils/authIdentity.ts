import { UserTokenPayload } from "../types/auth";

const KEY = "auth_identity";

// Es información de interfaz, no una credencial: el backend solo autentica la cookie HttpOnly.

export function setAuthIdentity(user: Pick<UserTokenPayload, "id_usu" | "id_rol" | "permisos">): string {
  const now = Math.floor(Date.now() / 1000);
  const identity = JSON.stringify({ ...user, iat: now, exp: now + 3600 });
  sessionStorage.setItem(KEY, identity);
  return identity;
}

export function getAuthIdentity(): UserTokenPayload | null {
  const identity = sessionStorage.getItem(KEY);
  if (!identity) return null;
  try {
    const user = JSON.parse(identity) as UserTokenPayload;
    return !user.exp || user.exp * 1000 >= Date.now() ? user : null;
  } catch {
    return null;
  }
}

export function getAuthIdentityValue(): string | null {
  return sessionStorage.getItem(KEY);
}

export function clearAuthIdentity() {
  sessionStorage.removeItem(KEY);
}
