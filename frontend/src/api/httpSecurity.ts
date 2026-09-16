const isInternalApi = (url: string) => {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === window.location.origin && parsed.pathname.startsWith("/api/");
  } catch {
    return false;
  }
};

const csrfToken = () => document.cookie.split("; ").find((item) => item.startsWith("XSRF-TOKEN="))?.split("=")[1];
const safeMethod = (method: string) => ["GET", "HEAD", "OPTIONS", "TRACE"].includes(method.toUpperCase());

const nativeFetch = window.fetch.bind(window);
window.fetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (!isInternalApi(url)) return nativeFetch(input, init);
  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  const method = init.method || (input instanceof Request ? input.method : "GET");
  const token = csrfToken();
  if (!safeMethod(method) && token && !headers.has("X-XSRF-TOKEN")) {
    headers.set("X-XSRF-TOKEN", decodeURIComponent(token));
  }
  return nativeFetch(input, { ...init, headers, credentials: init.credentials || "same-origin" });
};
