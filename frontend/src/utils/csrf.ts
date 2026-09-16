let csrfRequest: Promise<void> | null = null;

function readCsrfCookie(): string | null {
  return document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)?.[1] ?? null;
}

/** Obtiene el token CSRF y devuelve el encabezado requerido por Spring Security. */
export async function csrfHeaders(): Promise<Record<string, string>> {
  if (!readCsrfCookie()) {
    if (!csrfRequest) {
      csrfRequest = fetch("/api/csrf", { credentials: "same-origin" })
        .then(() => undefined)
        .finally(() => { csrfRequest = null; });
    }
    await csrfRequest;
  }
  const token = readCsrfCookie();
  return token ? { "X-XSRF-TOKEN": decodeURIComponent(token) } : {};
}
