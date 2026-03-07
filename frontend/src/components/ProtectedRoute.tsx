import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "../api/axios";

export default function ProtectedRoute() {
  const [isValid, setIsValid] = useState<null | boolean>(null);

  useEffect(() => {
    async function validateToken() {
      try {
        await axiosClient.get("/api/me");
        setIsValid(true);
      } catch {
        setIsValid(false);
      }
    }
    validateToken();
  }, []);

  if (isValid === false) {
    return <Navigate to="/" replace />;
  }
  if (isValid === null) {
    return null;
  }
  return <Outlet />;
}
