import React from "react";
import { Navigate } from "react-router-dom";
import usePermissions from "../hooks/usePermissions";

type PermissionRouteProps = {
  permiso?: string | string[]; 
  fallback?: React.ReactNode; 
  children?: React.ReactNode;
};

export default function PermissionRoute({ permiso, fallback, children }: PermissionRouteProps) {
  const { loading, hasPermission, hasAny } = usePermissions();

  if (loading) return null; 

  if (!permiso) {
    return <>{children}</>;
  }

  const allowed = Array.isArray(permiso) ? hasAny(permiso) : hasPermission(permiso);

  if (!allowed) {
    if (fallback) return <>{fallback}</>;
    return <Navigate to="/dashboard" replace />; 
  }

  return <>{children}</>;
}
