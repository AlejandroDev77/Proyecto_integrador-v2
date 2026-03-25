import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { UserTokenPayload } from "../types/auth";

interface AuthContextType {
  id_rol: number | null;
  id_usu: number | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (id_usu: number, id_rol: number, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [id_rol, setIdRol] = useState<number | null>(null);
  const [id_usu, setIdUsu] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded: UserTokenPayload = jwtDecode(storedToken);
        
        // Comprobar si expiró
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          throw new Error("Token expirado");
        }

        setToken(storedToken);
        setIdUsu(decoded.id_usu);
        setIdRol(decoded.id_rol);
      } catch (error) {
        // Token inválido o expirado, eliminar
        localStorage.removeItem("token");
        setToken(null);
        setIdUsu(null);
        setIdRol(null);
      }
    }
    setIsLoading(false);
  };

  const setUser = (id_usu: number, id_rol: number, token: string) => {
    setIdUsu(id_usu);
    setIdRol(id_rol);
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setIdRol(null);
    setIdUsu(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value: AuthContextType = {
    id_rol,
    id_usu,
    token,
    isAuthenticated: !!token && !!id_rol,
    isLoading,
    setUser,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
