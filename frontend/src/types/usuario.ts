import { Rol } from "./rol";

export interface Usuario {
  id_usu: number;
  nom_usu: string;
  email_usu: string;
  est_usu: boolean;
  id_rol: number;
  cod_usu?: string;
  pas_usu?: string;
  img_cli?: string;
  rol?: Partial<Rol>;
}

export interface CrearUsuarioDTO {
  nom_usu: string;
  email_usu: string;
  est_usu: boolean;
  id_rol: number;
}

export interface ActualizarUsuarioDTO {
  nom_usu: string;
  email_usu: string;
  est_usu: boolean;
  id_rol: number;
}
