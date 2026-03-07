import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id_usu: number;
  id_rol: number;
  nom_usu: string;
  email_usu: string;
  // Agrega más campos si necesitas
}

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasRole: (roleId: number) => boolean; // Método para verificar el rol
}


const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      setUserState(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  const login = (token: string, user: User) => {
    setToken(token);
    setUserState(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const hasRole = (roleId: number) => {
    return user?.id_rol === roleId;
  };

  return (
    <UserContext.Provider value={{ user, token, login, setUser, logout, hasRole }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};
