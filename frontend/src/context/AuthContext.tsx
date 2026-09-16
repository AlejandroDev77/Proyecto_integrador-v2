import React, { createContext, useContext, useState, useEffect } from "react";
import { clearAuthIdentity, getAuthIdentity, getAuthIdentityValue } from "../utils/authIdentity";

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
    // Borra JWT de instalaciones antiguas. La cookie HttpOnly no se puede leer desde JavaScript.
    localStorage.removeItem("token");
    const identity = getAuthIdentity();
    if (identity) {
      setToken(getAuthIdentityValue());
      setIdUsu(identity.id_usu);
      setIdRol(identity.id_rol);
    }
    setIsLoading(false);
  };

  const setUser = (id_usu: number, id_rol: number, token: string) => {
    setIdUsu(id_usu);
    setIdRol(id_rol);
    setToken(token);
  };

  const logout = () => {
    setIdRol(null);
    setIdUsu(null);
    setToken(null);
    clearAuthIdentity();
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
