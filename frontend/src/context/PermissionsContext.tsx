import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getUser } from "../services/authService";
import { getUserPermissionsFromApi } from "../services/permissionsService";

interface PermissionsContextType {
  permissions: string[];
  loading: boolean;
  error: string | null;
  hasPermission: (name: string) => boolean;
  hasAny: (names: string[]) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPermissions() {
      try {
        const user = getUser();
        if (!user?.id_usu) {
          setPermissions([]);
          setLoading(false);
          return;
        }

        // Si el token ya contiene los permisos del rol, úsalos directamente
        if (Array.isArray(user.permisos) && user.permisos.length > 0) {
          setPermissions(user.permisos);
          setError(null);
          setLoading(false);
          return;
        }

        // Fallback: obtener permisos desde la API si el token no los trae
        const perms = await getUserPermissionsFromApi(user.id_usu);
        const names = (perms || []).map((p: any) =>
          typeof p === "string" ? p : p.nombre || p.name || p
        );
        setPermissions(names);
        setError(null);
      } catch (err: any) {
        setError("Error cargando permisos");
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    }

    loadPermissions();
  }, []);

  const hasPermission = (name: string) => {
    if (!name) return false;
    return permissions.includes(name);
  };

  const hasAny = (names: string[]) => {
    if (!Array.isArray(names) || names.length === 0) return false;
    return names.some((n) => permissions.includes(n));
  };

  return (
    <PermissionsContext.Provider
      value={{ permissions, loading, error, hasPermission, hasAny }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissionsContext() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error(
      "usePermissionsContext debe usarse dentro de PermissionsProvider"
    );
  }
  return context;
}
