export interface GeneracionIA {
    id?: number;
    nom_mue: string;
    imgs_ref: string[];
    modelo_3d_url?: string;
    estado: "procesando" | "completado" | "error";
    fecha_creacion?: string;
    id_mue?: number;
}
