export interface Rol {
  id_rol: number;
  nom_rol: string;
  desc_rol?: string;
  est_rol?: boolean | number;
  permisos?: any[];
  usuarios?: {
    total: number;
    activos: number;
    inactivos: number;
  };
}
