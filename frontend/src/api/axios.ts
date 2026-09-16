import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

const csrfToken = () => document.cookie
  .match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)?.[1];

const safeMethod = (method?: string) => ["GET", "HEAD", "OPTIONS", "TRACE"].includes((method || "GET").toUpperCase());
let csrfRequest: Promise<void> | null = null;

async function ensureCsrfToken() {
  if (csrfToken()) return;
  if (!csrfRequest) {
    csrfRequest = fetch("/api/csrf", { credentials: "same-origin" })
      .then(() => undefined)
      .finally(() => { csrfRequest = null; });
  }
  await csrfRequest;
}

// Fuerza el encabezado CSRF también en las llamadas Axios; la cookie de sesión permanece HttpOnly.
axiosClient.interceptors.request.use(async (config) => {
  if (!safeMethod(config.method)) await ensureCsrfToken();
  const token = csrfToken();
  if (!safeMethod(config.method) && token && !config.headers["X-XSRF-TOKEN"]) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  }
  return config;
});

// Interceptor para manejar respuestas y errores
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
 
    if (error.response && error.response.status === 401) {
    
      const isLoginRequest = error.config.url?.includes("/api/login");
      
      if (!isLoginRequest) {
       
        localStorage.removeItem("token"); // Limpia JWT heredados de versiones anteriores.
        sessionStorage.removeItem("auth_identity");
        
        if (window.location.pathname !== "/signin") {
          window.location.href = "/signin";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
