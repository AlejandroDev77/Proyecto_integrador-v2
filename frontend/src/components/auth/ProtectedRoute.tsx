// src/components/auth/ProtectedRoute.tsx
import React, { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router";
import axiosClient from "../../api/axios";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await axiosClient.get("/api/me"); // 
        setIsValid(true);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsValid(false);
      }
    };

    validateToken();
  }, []);

  if (isValid === null) return <p>⏳ Validando sesión...</p>;

  return isValid ? children : <Navigate to="/" replace />;
}
