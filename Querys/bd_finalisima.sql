-- ======================================
--      ROLES Y USUARIOS
-- ======================================
CREATE TABLE PERMISOS (
    id_per SERIAL PRIMARY KEY,
    nom_per VARCHAR(100)
);
CREATE TABLE rol_permiso (
    id_rol_permiso SERIAL PRIMARY KEY,
    id_per INTEGER NOT NULL,
    id_rol INTEGER NOT NULL,
    FOREIGN KEY (id_per) REFERENCES PERMISOS(id_per),
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
    
);
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nom_rol VARCHAR(100)
);

CREATE TABLE usuarios (
    id_usu SERIAL PRIMARY KEY,
    nom_usu VARCHAR(100),
    email_usu VARCHAR(200),
    pas_usu VARCHAR(500),
    est_usu BOOLEAN,
    id_rol INTEGER,
    cod_usu VARCHAR(50),
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- ======================================
--      CATEGORÍAS Y MUEBLES
-- ======================================
CREATE TABLE categorias_muebles (
    id_cat SERIAL PRIMARY KEY,
    nom_cat VARCHAR(100) NOT NULL,
    desc_cat TEXT,
    est_cat BOOLEAN DEFAULT TRUE,
    cod_cat VARCHAR(50)
);

CREATE TABLE muebles (
    id_mue SERIAL PRIMARY KEY,
    nom_mue VARCHAR(200) NOT NULL,
    desc_mue TEXT,
    img_mue VARCHAR(300),
    precio_venta NUMERIC(10,2) NOT NULL,
    precio_costo NUMERIC(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    stock_min INTEGER DEFAULT 0,
    modelo_3d VARCHAR(2000),
    dimensiones VARCHAR(100),
    est_mue BOOLEAN DEFAULT TRUE,
    id_cat INTEGER NOT NULL,
    cod_mue VARCHAR(50),
    FOREIGN KEY (id_cat) REFERENCES categorias_muebles(id_cat)
);

-- ======================================
--      EMPLEADOS, CLIENTES, PROVEEDORES
-- ======================================
CREATE TABLE empleados (
    id_emp SERIAL PRIMARY KEY,
    nom_emp VARCHAR(200),
    ap_pat_emp VARCHAR(200),
    ap_mat_emp VARCHAR(200),
    cel_emp INTEGER,
    dir_emp VARCHAR(200),
    fec_nac_emp DATE,
    img_emp VARCHAR(300),
    car_emp VARCHAR(300),
    ci_emp VARCHAR(30),
    id_usu INTEGER,
    cod_emp VARCHAR(50),
    est_emp BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usu) REFERENCES usuarios(id_usu)
);

CREATE TABLE clientes (
    id_cli SERIAL PRIMARY KEY,
    nom_cli VARCHAR(200),
    ap_pat_cli VARCHAR(200),
    ap_mat_cli VARCHAR(200),
    cel_cli INTEGER,
    dir_cli VARCHAR(200),
    fec_nac_cli DATE,
    img_cli VARCHAR(300),
    ci_cli VARCHAR(30),
    id_usu INTEGER,
    cod_cli VARCHAR(50),
    est_cli BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usu) REFERENCES usuarios(id_usu)
);

CREATE TABLE proveedores (
    id_prov SERIAL PRIMARY KEY,
    nom_prov VARCHAR(200) NOT NULL,
    contacto_prov VARCHAR(200),
    tel_prov VARCHAR(20),
    email_prov VARCHAR(200),
    dir_prov VARCHAR(300),
    nit_prov VARCHAR(50),
    est_prov BOOLEAN DEFAULT TRUE,
    cod_prov VARCHAR(50)
);

-- ======================================
--      MATERIALES y MUEBLE-MATERIAL
-- ======================================
CREATE TABLE materiales (
    id_mat SERIAL PRIMARY KEY,
    nom_mat VARCHAR(100) NOT NULL,
    desc_mat TEXT,
    stock_mat NUMERIC(10,2) DEFAULT 0,
    stock_min NUMERIC(10,2) DEFAULT 0,
    unidad_medida VARCHAR(20) NOT NULL,
    costo_mat NUMERIC(10,2) NOT NULL,
    img_mat VARCHAR(500),
    est_mat BOOLEAN DEFAULT TRUE,
    cod_mat VARCHAR(50)
);

CREATE TABLE mueble_material (
    id_mue_mat SERIAL PRIMARY KEY,
    id_mue INTEGER NOT NULL,
    id_mat INTEGER NOT NULL,
    cantidad NUMERIC(10,2) NOT NULL,
    cod_mue_mat VARCHAR(50),
    est_mue_mat BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_mue) REFERENCES muebles(id_mue),
    FOREIGN KEY (id_mat) REFERENCES materiales(id_mat)
);

-- ======================================
--      COMPRAS Y DETALLES
-- ======================================
CREATE TABLE compras_materiales (
    id_comp SERIAL PRIMARY KEY,
    fec_comp DATE NOT NULL,
    est_comp VARCHAR(50) DEFAULT 'Pendiente',
    total_comp NUMERIC(10,2) NOT NULL,
    id_prov INTEGER NOT NULL,
    id_emp INTEGER NOT NULL,
    cod_comp VARCHAR(50),
    FOREIGN KEY (id_prov) REFERENCES proveedores(id_prov),
    FOREIGN KEY (id_emp) REFERENCES empleados(id_emp)
);

CREATE TABLE detalles_compra (
    id_det_comp SERIAL PRIMARY KEY,
    id_comp INTEGER NOT NULL,
    id_mat INTEGER NOT NULL,
    cantidad NUMERIC(10,2) NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    cod_det_comp VARCHAR(50),
    est_det_comp BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_comp) REFERENCES compras_materiales(id_comp),
    FOREIGN KEY (id_mat) REFERENCES materiales(id_mat)
);

-- ======================================
--      COTIZACIONES Y DETALLES
-- ======================================
CREATE TABLE cotizaciones (
    id_cot SERIAL PRIMARY KEY,
    fec_cot DATE NOT NULL,
    est_cot VARCHAR(50) DEFAULT 'Pendiente',
    validez_dias INTEGER DEFAULT 15,
    total_cot NUMERIC(10,2) NOT NULL,
    descuento NUMERIC(10,2) DEFAULT 0,
    id_cli INTEGER NOT NULL,
    id_emp INTEGER NOT NULL,
    notas TEXT,
    cod_cot VARCHAR(50),
    presupuesto_cliente NUMERIC(10,2),
    plazo_esperado INTEGER,
    tiempo_entrega INTEGER,
    direccion_instalacion VARCHAR(500),
    tipo_proyecto VARCHAR(50),

    FOREIGN KEY (id_cli) REFERENCES clientes(id_cli),
    FOREIGN KEY (id_emp) REFERENCES empleados(id_emp)
);

CREATE TABLE evidencias_produccion (
    id_evi SERIAL PRIMARY KEY,
    id_pro_eta INTEGER NOT NULL, -- etapa de producción
    tipo_evi VARCHAR(50), -- 'foto', 'video', 'documento'
    archivo_evi VARCHAR(500) NOT NULL,
    descripcion TEXT,
    fec_evi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_emp INTEGER,
    cod_evi VARCHAR(50),
    FOREIGN KEY (id_pro_eta) REFERENCES produccion_etapas(id_pro_eta),
    FOREIGN KEY (id_emp) REFERENCES empleados(id_emp)
);

CREATE TABLE costos_cotizacion (
    id_costo SERIAL PRIMARY KEY,
    id_cot INTEGER NOT NULL,
    costo_materiales NUMERIC(10,2) DEFAULT 0,
    costo_mano_obra NUMERIC(10,2) DEFAULT 0,
    costos_indirectos NUMERIC(10,2) DEFAULT 0,
    margen_ganancia NUMERIC(5,2) DEFAULT 0, -- porcentaje
    costo_total NUMERIC(10,2) DEFAULT 0,
    precio_sugerido NUMERIC(10,2) DEFAULT 0,
    FOREIGN KEY (id_cot) REFERENCES cotizaciones(id_cot)
);

CREATE TABLE detalles_cotizacion (
    id_det_cot SERIAL PRIMARY KEY,
    id_cot INTEGER NOT NULL,
    id_mue INTEGER NOT NULL,
    desc_personalizacion TEXT,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    cod_det_cot VARCHAR(50),
    nombre_mueble VARCHAR(200),
    tipo_mueble VARCHAR(100),
    dimensiones VARCHAR(100),
    material_principal VARCHAR(100),
    color_acabado VARCHAR(100),
    img_referencia VARCHAR(500),
    herrajes TEXT,
    FOREIGN KEY (id_cot) REFERENCES cotizaciones(id_cot),
    FOREIGN KEY (id_mue) REFERENCES muebles(id_mue)

);

-- ======================================
--      DISEÑOS
-- ======================================
CREATE TABLE diseños (
    id_dis SERIAL PRIMARY KEY,
    nom_dis VARCHAR(200) NOT NULL,
    desc_dis TEXT,
    archivo_3d VARCHAR(300),
    img_dis VARCHAR(300),
    id_cot INTEGER NOT NULL,
    cod_dis VARCHAR(50),
    FOREIGN KEY (id_cot) REFERENCES cotizaciones(id_cot)
);

-- ======================================
--      VENTAS Y DETALLES
-- ======================================
CREATE TABLE ventas (
    id_ven SERIAL PRIMARY KEY,
    fec_ven DATE NOT NULL,
    est_ven VARCHAR(50) DEFAULT 'Pendiente',
    total_ven NUMERIC(10,2) NOT NULL,
    descuento NUMERIC(10,2) DEFAULT 0,
    id_cli INTEGER NOT NULL,
    id_emp INTEGER NOT NULL,
    notas TEXT,
    cod_ven VARCHAR(50),
    FOREIGN KEY (id_cli) REFERENCES clientes(id_cli),
    FOREIGN KEY (id_emp) REFERENCES empleados(id_emp)
);

CREATE TABLE detalles_venta (
    id_det_ven SERIAL PRIMARY KEY,
    id_ven INTEGER NOT NULL,
    id_mue INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    descuento_item NUMERIC(10,2) DEFAULT 0,
    subtotal NUMERIC(10,2) NOT NULL,
    cod_det_ven VARCHAR(50),
    FOREIGN KEY (id_ven) REFERENCES ventas(id_ven),
    FOREIGN KEY (id_mue) REFERENCES muebles(id_mue)
);

-- ======================================
--      PAGOS
-- ======================================
CREATE TABLE pagos (
    id_pag SERIAL PRIMARY KEY,
    monto NUMERIC(10,2) NOT NULL,
    fec_pag DATE NOT NULL,
    metodo_pag VARCHAR(50) NOT NULL,
    referencia_pag VARCHAR(100),
    id_ven INTEGER NOT NULL,
    cod_pag VARCHAR(50),
    FOREIGN KEY (id_ven) REFERENCES ventas(id_ven)
);

-- ======================================
--      DEVOLUCIONES Y DETALLES
-- ======================================
CREATE TABLE devoluciones (
    id_dev SERIAL PRIMARY KEY,
    fec_dev DATE NOT NULL,
    motivo_dev TEXT NOT NULL,
    id_ven INTEGER NOT NULL,
    total_dev NUMERIC(10,2) NOT NULL,
    est_dev VARCHAR(50) DEFAULT 'Pendiente',
    id_emp INTEGER NOT NULL,
    cod_dev VARCHAR(50),
    FOREIGN KEY (id_ven) REFERENCES ventas(id_ven),
    FOREIGN KEY (id_emp) REFERENCES empleados(id_emp)
);

CREATE TABLE detalles_devolucion (
    id_det_dev SERIAL PRIMARY KEY,
    id_dev INTEGER NOT NULL,
    id_mue INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    cod_det_dev VARCHAR(50),
    FOREIGN KEY (id_dev) REFERENCES devoluciones(id_dev),
    FOREIGN KEY (id_mue) REFERENCES muebles(id_mue)
);

-- ======================================
--      PRODUCCIÓN
-- ======================================
CREATE TABLE produccion (
    id_pro SERIAL PRIMARY KEY,
    fec_ini DATE NOT NULL,
    fec_fin_estimada DATE NOT NULL,
    fec_fin DATE,
    est_pro VARCHAR(50) DEFAULT 'Pendiente',
    prioridad VARCHAR(20) DEFAULT '5',
    id_ven INTEGER,
    id_cot INTEGER,
    id_emp INTEGER NOT NULL,
    notas TEXT,
    cod_pro VARCHAR(50),
    FOREIGN KEY (id_emp) REFERENCES empleados(id_emp),
    FOREIGN KEY (id_ven) REFERENCES ventas(id_ven),
    FOREIGN KEY (id_cot) REFERENCES cotizaciones(id_cot)
);

CREATE TABLE detalles_produccion (
    id_det_pro SERIAL PRIMARY KEY,
    id_pro INTEGER NOT NULL,
    id_mue INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    est_det_pro VARCHAR(50) DEFAULT 'Pendiente',
    cod_det_pro VARCHAR(50),
    FOREIGN KEY (id_pro) REFERENCES produccion(id_pro),
    FOREIGN KEY (id_mue) REFERENCES muebles(id_mue)
);

-- ======================================
--      ETAPAS DE PRODUCCIÓN
-- ======================================
CREATE TABLE etapas_produccion (
    id_eta SERIAL PRIMARY KEY,
    nom_eta VARCHAR(100) NOT NULL,
    desc_eta TEXT,
    duracion_estimada INTEGER,
    orden_secuencia INTEGER NOT NULL,
    cod_eta VARCHAR(50)
);

CREATE TABLE produccion_etapas (
    id_pro_eta SERIAL PRIMARY KEY,
    id_pro INTEGER NOT NULL,
    id_eta INTEGER NOT NULL,
    fec_ini DATE,
    fec_fin DATE,
    est_eta VARCHAR(50) DEFAULT 'Pendiente',
    id_emp INTEGER,
    notas TEXT,
    cod_pro_eta VARCHAR(50),
    fotos_progreso VARCHAR(2000),
    FOREIGN KEY (id_pro) REFERENCES produccion(id_pro),
    FOREIGN KEY (id_eta) REFERENCES etapas_produccion(id_eta),
    FOREIGN KEY (id_emp) REFERENCES empleados(id_emp)
);

-- ======================================
--      MOVIMIENTOS INVENTARIO
-- ======================================
CREATE TABLE movimientos_inventario (
    id_mov SERIAL PRIMARY KEY,
    tipo_mov VARCHAR(10) NOT NULL,
    fecha_mov TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_mat INTEGER,
    id_mue INTEGER,
    cantidad NUMERIC(10,2) NOT NULL,
    stock_anterior NUMERIC(10,2) NOT NULL,
    stock_posterior NUMERIC(10,2) NOT NULL,
    id_ven INTEGER,
    id_pro INTEGER,
    id_comp INTEGER,
    id_dev INTEGER,
    motivo VARCHAR(500),
    id_emp INTEGER NOT NULL,
    cod_mov VARCHAR(50),
    FOREIGN KEY (id_mat) REFERENCES materiales(id_mat),
    FOREIGN KEY (id_mue) REFERENCES muebles(id_mue),
    FOREIGN KEY (id_ven) REFERENCES ventas(id_ven),
    FOREIGN KEY (id_pro) REFERENCES produccion(id_pro),
    FOREIGN KEY (id_comp) REFERENCES compras_materiales(id_comp),
    FOREIGN KEY (id_dev) REFERENCES devoluciones(id_dev),
    FOREIGN KEY (id_emp) REFERENCES empleados(id_emp)
);
