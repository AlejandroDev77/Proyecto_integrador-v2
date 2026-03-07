export interface Cliente {
    id_cli: number;
    nom_cli: string;
    ap_pat_cli: string;
    ap_mat_cli: string;
    ci_cli: string;
    cod_cli?: string;
}

export interface Empleado {
    id_emp: number;
    nom_emp: string;
    ap_pat_emp?: string;
    ap_mat_emp?: string;
    cod_emp?: string;
}

export interface Venta {
    id_ven: number;
    cod_ven?: string;
    fec_ven: string;
    est_ven: string;
    total_ven: number;
    descuento: number;
    notas: string;
    id_cli: number;
    cliente?: Cliente;
    id_emp: number;
    empleado?: Empleado;
}
