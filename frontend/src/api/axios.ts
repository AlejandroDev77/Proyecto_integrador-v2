import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Interceptor para agregar el Bearer Token automáticamente
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Interceptor para manejar respuestas y errores
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Eliminar token y redirigir al login ante cualquier 401
      localStorage.removeItem("token");

      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
