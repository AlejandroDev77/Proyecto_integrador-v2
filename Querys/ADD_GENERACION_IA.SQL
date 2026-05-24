-- Tabla para Generación IA
CREATE TABLE IF NOT EXISTS public.generaciones_ia
(
    id_gen bigserial NOT NULL,
    nom_mue character varying(255) COLLATE pg_catalog."default" NOT NULL,
    modelo_3d character varying(500) COLLATE pg_catalog."default",
    estado character varying(50) COLLATE pg_catalog."default" DEFAULT 'procesando',
    fec_crea timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_mue bigint,
    CONSTRAINT generaciones_ia_pkey PRIMARY KEY (id_gen),
    CONSTRAINT fk_gen_ia_mueble FOREIGN KEY (id_mue)
        REFERENCES public.muebles (id_mue) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- Tabla para las imágenes de referencia (colección)
CREATE TABLE IF NOT EXISTS public.generacion_ia_imagenes
(
    id_gen bigint NOT NULL,
    img_url character varying(500) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT fk_gen_ia_img_parent FOREIGN KEY (id_gen)
        REFERENCES public.generaciones_ia (id_gen) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
