import { useEffect } from "react";
import axiosClient from "../../api/axios";

export const useAuthValidator = () => {
  useEffect(() => {
    const interceptor = axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const message = error.response.data.error;

          if (message === "El token ha expirado") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            alert(" Tu sesión ha expirado. Vuelve a iniciar sesión.");
            window.location.href = "/signin";
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosClient.interceptors.response.eject(interceptor);
    };
  }, []);
};
