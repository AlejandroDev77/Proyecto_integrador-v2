
CREATE TABLE IF NOT EXISTS public.audit_logs
(
    id bigserial NOT NULL,
    user_id bigint,
    table_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    action character varying(255) COLLATE pg_catalog."default" NOT NULL,
    record_id bigint,
    old_values json,
    new_values json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    cod_usu character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS public.categorias_muebles
(
    id_cat serial NOT NULL,
    nom_cat character varying(100) COLLATE pg_catalog."default" NOT NULL,
    desc_cat text COLLATE pg_catalog."default",
    est_cat boolean DEFAULT true,
    cod_cat character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT categorias_muebles_pkey PRIMARY KEY (id_cat)
);

CREATE TABLE IF NOT EXISTS public.clientes
(
    id_cli serial NOT NULL,
    nom_cli character varying(200) COLLATE pg_catalog."default",
    ap_pat_cli character varying(200) COLLATE pg_catalog."default",
    ap_mat_cli character varying(200) COLLATE pg_catalog."default",
    cel_cli integer,
    dir_cli character varying(200) COLLATE pg_catalog."default",
    fec_nac_cli date,
    img_cli character varying(300) COLLATE pg_catalog."default",
    ci_cli character varying(30) COLLATE pg_catalog."default",
    id_usu integer,
    cod_cli character varying(50) COLLATE pg_catalog."default",
    est_cli boolean DEFAULT true,
    CONSTRAINT clientes_pkey PRIMARY KEY (id_cli)
);

CREATE TABLE IF NOT EXISTS public.compras_materiales
(
    id_comp serial NOT NULL,
    fec_comp date NOT NULL,
    est_comp character varying(50) COLLATE pg_catalog."default" DEFAULT 'Pendiente'::character varying,
    total_comp numeric(10, 2) NOT NULL,
    id_prov integer NOT NULL,
    id_emp integer NOT NULL,
    cod_comp character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT compras_materiales_pkey PRIMARY KEY (id_comp)
);

CREATE TABLE IF NOT EXISTS public.costos_cotizacion
(
    id_costo serial NOT NULL,
    id_cot integer NOT NULL,
    costo_materiales numeric(10, 2) DEFAULT 0,
    costo_mano_obra numeric(10, 2) DEFAULT 0,
    costos_indirectos numeric(10, 2) DEFAULT 0,
    margen_ganancia numeric(5, 2) DEFAULT 0,
    costo_total numeric(10, 2) DEFAULT 0,
    precio_sugerido numeric(10, 2) DEFAULT 0,
    CONSTRAINT costos_cotizacion_pkey PRIMARY KEY (id_costo)
);

CREATE TABLE IF NOT EXISTS public.cotizaciones
(
    id_cot serial NOT NULL,
    fec_cot date NOT NULL,
    est_cot character varying(50) COLLATE pg_catalog."default" DEFAULT 'Pendiente'::character varying,
    validez_dias integer DEFAULT 15,
    total_cot numeric(10, 2) NOT NULL,
    descuento numeric(10, 2) DEFAULT 0,
    id_cli integer NOT NULL,
    id_emp integer NOT NULL,
    notas text COLLATE pg_catalog."default",
    cod_cot character varying(50) COLLATE pg_catalog."default",
    presupuesto_cliente numeric(10, 2),
    plazo_esperado integer,
    tiempo_entrega integer,
    direccion_instalacion character varying(500) COLLATE pg_catalog."default",
    tipo_proyecto character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT cotizaciones_pkey PRIMARY KEY (id_cot)
);

CREATE TABLE IF NOT EXISTS public.detalles_compra
(
    id_det_comp serial NOT NULL,
    id_comp integer NOT NULL,
    id_mat integer NOT NULL,
    cantidad numeric(10, 2) NOT NULL,
    precio_unitario numeric(10, 2) NOT NULL,
    subtotal numeric(10, 2) NOT NULL,
    cod_det_comp character varying(50) COLLATE pg_catalog."default",
    est_det_comp boolean DEFAULT true,
    CONSTRAINT detalles_compra_pkey PRIMARY KEY (id_det_comp)
);

CREATE TABLE IF NOT EXISTS public.detalles_cotizacion
(
    id_det_cot serial NOT NULL,
    id_cot integer NOT NULL,
    id_mue integer,
    desc_personalizacion text COLLATE pg_catalog."default",
    cantidad integer NOT NULL,
    precio_unitario numeric(10, 2) NOT NULL,
    subtotal numeric(10, 2) NOT NULL,
    cod_det_cot character varying(50) COLLATE pg_catalog."default",
    nombre_mueble character varying(200) COLLATE pg_catalog."default",
    tipo_mueble character varying(100) COLLATE pg_catalog."default",
    dimensiones character varying(100) COLLATE pg_catalog."default",
    material_principal character varying(100) COLLATE pg_catalog."default",
    color_acabado character varying(100) COLLATE pg_catalog."default",
    img_referencia character varying(500) COLLATE pg_catalog."default",
    herrajes text COLLATE pg_catalog."default",
    CONSTRAINT detalles_cotizacion_pkey PRIMARY KEY (id_det_cot)
);

CREATE TABLE IF NOT EXISTS public.detalles_devolucion
(
    id_det_dev serial NOT NULL,
    id_dev integer NOT NULL,
    id_mue integer NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric(10, 2) NOT NULL,
    subtotal numeric(10, 2) NOT NULL,
    cod_det_dev character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT detalles_devolucion_pkey PRIMARY KEY (id_det_dev)
);

CREATE TABLE IF NOT EXISTS public.detalles_produccion
(
    id_det_pro serial NOT NULL,
    id_pro integer NOT NULL,
    id_mue integer,
    cantidad integer NOT NULL,
    est_det_pro character varying(50) COLLATE pg_catalog."default" DEFAULT 'Pendiente'::character varying,
    cod_det_pro character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT detalles_produccion_pkey PRIMARY KEY (id_det_pro)
);

CREATE TABLE IF NOT EXISTS public.detalles_venta
(
    id_det_ven serial NOT NULL,
    id_ven integer NOT NULL,
    id_mue integer NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric(10, 2) NOT NULL,
    descuento_item numeric(10, 2) DEFAULT 0,
    subtotal numeric(10, 2) NOT NULL,
    cod_det_ven character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT detalles_venta_pkey PRIMARY KEY (id_det_ven)
);

CREATE TABLE IF NOT EXISTS public.devoluciones
(
    id_dev serial NOT NULL,
    fec_dev date NOT NULL,
    motivo_dev text COLLATE pg_catalog."default" NOT NULL,
    id_ven integer NOT NULL,
    total_dev numeric(10, 2) NOT NULL,
    est_dev character varying(50) COLLATE pg_catalog."default" DEFAULT 'Pendiente'::character varying,
    id_emp integer NOT NULL,
    cod_dev character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT devoluciones_pkey PRIMARY KEY (id_dev)
);

CREATE TABLE IF NOT EXISTS public."diseños"
(
    id_dis serial NOT NULL,
    nom_dis character varying(200) COLLATE pg_catalog."default" NOT NULL,
    desc_dis text COLLATE pg_catalog."default",
    archivo_3d character varying(300) COLLATE pg_catalog."default",
    img_dis character varying(300) COLLATE pg_catalog."default",
    id_cot integer NOT NULL,
    cod_dis character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT "diseños_pkey" PRIMARY KEY (id_dis)
);

CREATE TABLE IF NOT EXISTS public.empleados
(
    id_emp serial NOT NULL,
    nom_emp character varying(200) COLLATE pg_catalog."default",
    ap_pat_emp character varying(200) COLLATE pg_catalog."default",
    ap_mat_emp character varying(200) COLLATE pg_catalog."default",
    cel_emp integer,
    dir_emp character varying(200) COLLATE pg_catalog."default",
    fec_nac_emp date,
    img_emp character varying(300) COLLATE pg_catalog."default",
    car_emp character varying(300) COLLATE pg_catalog."default",
    ci_emp character varying(30) COLLATE pg_catalog."default",
    id_usu integer,
    cod_emp character varying(50) COLLATE pg_catalog."default",
    est_emp boolean DEFAULT true,
    CONSTRAINT empleados_pkey PRIMARY KEY (id_emp)
);

CREATE TABLE IF NOT EXISTS public.etapas_produccion
(
    id_eta serial NOT NULL,
    nom_eta character varying(100) COLLATE pg_catalog."default" NOT NULL,
    desc_eta text COLLATE pg_catalog."default",
    duracion_estimada integer,
    orden_secuencia integer NOT NULL,
    cod_eta character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT etapas_produccion_pkey PRIMARY KEY (id_eta)
);

CREATE TABLE IF NOT EXISTS public.evidencias_produccion
(
    id_evi serial NOT NULL,
    id_pro_eta integer NOT NULL,
    tipo_evi character varying(50) COLLATE pg_catalog."default",
    archivo_evi character varying(500) COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default",
    fec_evi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_emp integer,
    cod_evi character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT evidencias_produccion_pkey PRIMARY KEY (id_evi)
);


CREATE TABLE IF NOT EXISTS public.favoritos
(
    id_fav serial NOT NULL,
    id_cli integer NOT NULL,
    id_mue integer NOT NULL,
    CONSTRAINT favoritos_pkey PRIMARY KEY (id_fav),
    CONSTRAINT uk_favoritos_cliente_mueble UNIQUE (id_cli, id_mue)
);





CREATE TABLE IF NOT EXISTS public.materiales
(
    id_mat serial NOT NULL,
    nom_mat character varying(100) COLLATE pg_catalog."default" NOT NULL,
    desc_mat text COLLATE pg_catalog."default",
    stock_mat numeric(10, 2) DEFAULT 0,
    stock_min numeric(10, 2) DEFAULT 0,
    unidad_medida character varying(20) COLLATE pg_catalog."default" NOT NULL,
    costo_mat numeric(10, 2) NOT NULL,
    img_mat character varying(500) COLLATE pg_catalog."default",
    est_mat boolean DEFAULT true,
    cod_mat character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT materiales_pkey PRIMARY KEY (id_mat)
);


CREATE TABLE IF NOT EXISTS public.movimientos_inventario
(
    id_mov serial NOT NULL,
    tipo_mov character varying(10) COLLATE pg_catalog."default" NOT NULL,
    fecha_mov timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_mat integer,
    id_mue integer,
    cantidad numeric(10, 2) NOT NULL,
    stock_anterior numeric(10, 2) NOT NULL,
    stock_posterior numeric(10, 2) NOT NULL,
    id_ven integer,
    id_pro integer,
    id_comp integer,
    id_dev integer,
    motivo character varying(500) COLLATE pg_catalog."default",
    id_emp integer NOT NULL,
    cod_mov character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT movimientos_inventario_pkey PRIMARY KEY (id_mov)
);

CREATE TABLE IF NOT EXISTS public.mueble_material
(
    id_mue_mat serial NOT NULL,
    id_mue integer NOT NULL,
    id_mat integer NOT NULL,
    cantidad numeric(10, 2) NOT NULL,
    cod_mue_mat character varying(50) COLLATE pg_catalog."default",
    est_mue_mat boolean DEFAULT true,
    CONSTRAINT mueble_material_pkey PRIMARY KEY (id_mue_mat)
);

CREATE TABLE IF NOT EXISTS public.muebles
(
    id_mue serial NOT NULL,
    nom_mue character varying(200) COLLATE pg_catalog."default" NOT NULL,
    desc_mue text COLLATE pg_catalog."default",
    img_mue character varying(300) COLLATE pg_catalog."default",
    precio_venta numeric(10, 2) NOT NULL,
    precio_costo numeric(10, 2) NOT NULL,
    stock integer DEFAULT 0,
    stock_min integer DEFAULT 0,
    modelo_3d character varying(2000) COLLATE pg_catalog."default",
    dimensiones character varying(100) COLLATE pg_catalog."default",
    est_mue boolean DEFAULT true,
    id_cat integer NOT NULL,
    cod_mue character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT muebles_pkey PRIMARY KEY (id_mue)
);

CREATE TABLE IF NOT EXISTS public.pagos
(
    id_pag serial NOT NULL,
    monto numeric(10, 2) NOT NULL,
    fec_pag date NOT NULL,
    metodo_pag character varying(50) COLLATE pg_catalog."default" NOT NULL,
    referencia_pag character varying(100) COLLATE pg_catalog."default",
    id_ven integer NOT NULL,
    cod_pag character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT pagos_pkey PRIMARY KEY (id_pag)
);

CREATE TABLE IF NOT EXISTS public.permisos
(
    id_permiso bigserial NOT NULL,
    nombre character varying(255) COLLATE pg_catalog."default" NOT NULL,
    descripcion character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT permisos_pkey PRIMARY KEY (id_permiso),
    CONSTRAINT permisos_nombre_key UNIQUE (nombre)
);



CREATE TABLE IF NOT EXISTS public.produccion
(
    id_pro serial NOT NULL,
    fec_ini date NOT NULL,
    fec_fin_estimada date NOT NULL,
    fec_fin date,
    est_pro character varying(50) COLLATE pg_catalog."default" DEFAULT 'Pendiente'::character varying,
    prioridad character varying(20) COLLATE pg_catalog."default" DEFAULT 5,
    id_ven integer,
    id_cot integer,
    id_emp integer NOT NULL,
    notas text COLLATE pg_catalog."default",
    cod_pro character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT produccion_pkey PRIMARY KEY (id_pro)
);

CREATE TABLE IF NOT EXISTS public.produccion_etapas
(
    id_pro_eta serial NOT NULL,
    id_pro integer NOT NULL,
    id_eta integer NOT NULL,
    fec_ini date,
    fec_fin date,
    est_eta character varying(50) COLLATE pg_catalog."default" DEFAULT 'Pendiente'::character varying,
    id_emp integer,
    notas text COLLATE pg_catalog."default",
    cod_pro_eta character varying(50) COLLATE pg_catalog."default",
    fotos_progreso character varying(2000) COLLATE pg_catalog."default",
    CONSTRAINT produccion_etapas_pkey PRIMARY KEY (id_pro_eta)
);

CREATE TABLE IF NOT EXISTS public.proveedores
(
    id_prov serial NOT NULL,
    nom_prov character varying(200) COLLATE pg_catalog."default" NOT NULL,
    contacto_prov character varying(200) COLLATE pg_catalog."default",
    tel_prov character varying(20) COLLATE pg_catalog."default",
    email_prov character varying(200) COLLATE pg_catalog."default",
    dir_prov character varying(300) COLLATE pg_catalog."default",
    nit_prov character varying(50) COLLATE pg_catalog."default",
    est_prov boolean DEFAULT true,
    cod_prov character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT proveedores_pkey PRIMARY KEY (id_prov)
);

CREATE TABLE IF NOT EXISTS public.rol_permiso
(
    id_rol_permiso serial NOT NULL,
    id_rol bigint NOT NULL,
    id_permiso bigint NOT NULL,
    CONSTRAINT rol_permiso_pkey PRIMARY KEY (id_rol_permiso),
    CONSTRAINT rol_permiso_id_rol_id_permiso_key UNIQUE (id_rol, id_permiso)
);

CREATE TABLE IF NOT EXISTS public.roles
(
    id_rol bigserial NOT NULL,
    nom_rol character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT roles_pkey PRIMARY KEY (id_rol)
);

CREATE TABLE IF NOT EXISTS public.usuarios
(
    id_usu bigserial NOT NULL,
    nom_usu character varying(100) COLLATE pg_catalog."default",
    email_usu character varying(200) COLLATE pg_catalog."default",
    pas_usu character varying(255) COLLATE pg_catalog."default",
    est_usu boolean,
    id_rol bigint,
    cod_usu character varying(50) COLLATE pg_catalog."default",
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    is_2fa_enabled boolean,
    secret_2fa character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT usuarios_pkey PRIMARY KEY (id_usu)
);

CREATE TABLE IF NOT EXISTS public.ventas
(
    id_ven serial NOT NULL,
    fec_ven date NOT NULL,
    est_ven character varying(50) COLLATE pg_catalog."default" DEFAULT 'Pendiente'::character varying,
    total_ven numeric(10, 2) NOT NULL,
    descuento numeric(10, 2) DEFAULT 0,
    id_cli integer NOT NULL,
    id_emp integer,
    notas text COLLATE pg_catalog."default",
    cod_ven character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT ventas_pkey PRIMARY KEY (id_ven)
);

CREATE TABLE IF NOT EXISTS public.verification_tokens
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    expiry_date timestamp(6) without time zone NOT NULL,
    token character varying(255) COLLATE pg_catalog."default" NOT NULL,
    token_type character varying(30) COLLATE pg_catalog."default" NOT NULL,
    id_usu bigint NOT NULL,
    CONSTRAINT verification_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT uk6q9nsb665s9f8qajm3j07kd1e UNIQUE (token)
);

ALTER TABLE IF EXISTS public.clientes
    ADD CONSTRAINT fk_usuario_cliente FOREIGN KEY (id_usu)
    REFERENCES public.usuarios (id_usu) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.compras_materiales
    ADD CONSTRAINT fk_empleado FOREIGN KEY (id_emp)
    REFERENCES public.empleados (id_emp) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.compras_materiales
    ADD CONSTRAINT fk_proveedor FOREIGN KEY (id_prov)
    REFERENCES public.proveedores (id_prov) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.costos_cotizacion
    ADD CONSTRAINT costos_cotizacion_id_cot_fkey FOREIGN KEY (id_cot)
    REFERENCES public.cotizaciones (id_cot) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.cotizaciones
    ADD CONSTRAINT fk_cliente_cot FOREIGN KEY (id_cli)
    REFERENCES public.clientes (id_cli) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.cotizaciones
    ADD CONSTRAINT fk_empleado_cot FOREIGN KEY (id_emp)
    REFERENCES public.empleados (id_emp) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.detalles_compra
    ADD CONSTRAINT fk_compra FOREIGN KEY (id_comp)
    REFERENCES public.compras_materiales (id_comp) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.detalles_compra
    ADD CONSTRAINT fk_material_compra FOREIGN KEY (id_mat)
    REFERENCES public.materiales (id_mat) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.detalles_cotizacion
    ADD CONSTRAINT fk_cotizacion_det FOREIGN KEY (id_cot)
    REFERENCES public.cotizaciones (id_cot) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.detalles_cotizacion
    ADD CONSTRAINT fk_mueble_cot FOREIGN KEY (id_mue)
    REFERENCES public.muebles (id_mue) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.detalles_devolucion
    ADD CONSTRAINT fk_devolucion FOREIGN KEY (id_dev)
    REFERENCES public.devoluciones (id_dev) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.detalles_devolucion
    ADD CONSTRAINT fk_mueble_devolucion FOREIGN KEY (id_mue)
    REFERENCES public.muebles (id_mue) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.detalles_produccion
    ADD CONSTRAINT fk_mueble_produccion FOREIGN KEY (id_mue)
    REFERENCES public.muebles (id_mue) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.detalles_produccion
    ADD CONSTRAINT fk_produccion_det FOREIGN KEY (id_pro)
    REFERENCES public.produccion (id_pro) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.detalles_venta
    ADD CONSTRAINT fk_mueble_venta FOREIGN KEY (id_mue)
    REFERENCES public.muebles (id_mue) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.detalles_venta
    ADD CONSTRAINT fk_venta FOREIGN KEY (id_ven)
    REFERENCES public.ventas (id_ven) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.devoluciones
    ADD CONSTRAINT fk_empleado_devolucion FOREIGN KEY (id_emp)
    REFERENCES public.empleados (id_emp) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.devoluciones
    ADD CONSTRAINT fk_venta_devolucion FOREIGN KEY (id_ven)
    REFERENCES public.ventas (id_ven) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."diseños"
    ADD CONSTRAINT fk_cotizacion FOREIGN KEY (id_cot)
    REFERENCES public.cotizaciones (id_cot) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.empleados
    ADD CONSTRAINT fk_usuario_empleado FOREIGN KEY (id_usu)
    REFERENCES public.usuarios (id_usu) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.evidencias_produccion
    ADD CONSTRAINT evidencias_produccion_id_emp_fkey FOREIGN KEY (id_emp)
    REFERENCES public.empleados (id_emp) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.evidencias_produccion
    ADD CONSTRAINT evidencias_produccion_id_pro_eta_fkey FOREIGN KEY (id_pro_eta)
    REFERENCES public.produccion_etapas (id_pro_eta) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.favoritos
    ADD CONSTRAINT fk_favoritos_cliente FOREIGN KEY (id_cli)
    REFERENCES public.clientes (id_cli) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.favoritos
    ADD CONSTRAINT fk_favoritos_mueble FOREIGN KEY (id_mue)
    REFERENCES public.muebles (id_mue) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.movimientos_inventario
    ADD CONSTRAINT fk_mov_comp FOREIGN KEY (id_comp)
    REFERENCES public.compras_materiales (id_comp) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.movimientos_inventario
    ADD CONSTRAINT fk_mov_dev FOREIGN KEY (id_dev)
    REFERENCES public.devoluciones (id_dev) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.movimientos_inventario
    ADD CONSTRAINT fk_mov_emp FOREIGN KEY (id_emp)
    REFERENCES public.empleados (id_emp) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.movimientos_inventario
    ADD CONSTRAINT fk_mov_mat FOREIGN KEY (id_mat)
    REFERENCES public.materiales (id_mat) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.movimientos_inventario
    ADD CONSTRAINT fk_mov_mue FOREIGN KEY (id_mue)
    REFERENCES public.muebles (id_mue) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.movimientos_inventario
    ADD CONSTRAINT fk_mov_pro FOREIGN KEY (id_pro)
    REFERENCES public.produccion (id_pro) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.movimientos_inventario
    ADD CONSTRAINT fk_mov_ven FOREIGN KEY (id_ven)
    REFERENCES public.ventas (id_ven) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.mueble_material
    ADD CONSTRAINT fk_material FOREIGN KEY (id_mat)
    REFERENCES public.materiales (id_mat) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.mueble_material
    ADD CONSTRAINT fk_mueble FOREIGN KEY (id_mue)
    REFERENCES public.muebles (id_mue) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.muebles
    ADD CONSTRAINT fk_categoria FOREIGN KEY (id_cat)
    REFERENCES public.categorias_muebles (id_cat) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.pagos
    ADD CONSTRAINT fk_pago_venta FOREIGN KEY (id_ven)
    REFERENCES public.ventas (id_ven) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.produccion
    ADD CONSTRAINT fk_pro_cotizacion FOREIGN KEY (id_cot)
    REFERENCES public.cotizaciones (id_cot) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.produccion
    ADD CONSTRAINT fk_pro_empleado FOREIGN KEY (id_emp)
    REFERENCES public.empleados (id_emp) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.produccion
    ADD CONSTRAINT fk_pro_venta FOREIGN KEY (id_ven)
    REFERENCES public.ventas (id_ven) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.produccion_etapas
    ADD CONSTRAINT fk_empleado FOREIGN KEY (id_emp)
    REFERENCES public.empleados (id_emp) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.produccion_etapas
    ADD CONSTRAINT fk_etapa FOREIGN KEY (id_eta)
    REFERENCES public.etapas_produccion (id_eta) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.produccion_etapas
    ADD CONSTRAINT fk_produccion FOREIGN KEY (id_pro)
    REFERENCES public.produccion (id_pro) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.rol_permiso
    ADD CONSTRAINT rol_permiso_id_permiso_fkey FOREIGN KEY (id_permiso)
    REFERENCES public.permisos (id_permiso) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.rol_permiso
    ADD CONSTRAINT rol_permiso_id_rol_fkey FOREIGN KEY (id_rol)
    REFERENCES public.roles (id_rol) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.usuarios
    ADD CONSTRAINT fk_rol FOREIGN KEY (id_rol)
    REFERENCES public.roles (id_rol) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.ventas
    ADD CONSTRAINT fk_cliente FOREIGN KEY (id_cli)
    REFERENCES public.clientes (id_cli) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.ventas
    ADD CONSTRAINT fk_empleado FOREIGN KEY (id_emp)
    REFERENCES public.empleados (id_emp) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.verification_tokens
    ADD CONSTRAINT fk80kh447ds63tuoxgkliu1ck6r FOREIGN KEY (id_usu)
    REFERENCES public.usuarios (id_usu) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

END;