<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegistroController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\TestMailController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\EmpleadoController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\CategoriaMuebleController;
use App\Http\Controllers\Api\MuebleController;
use App\Http\Controllers\Api\MuebleMaterialController;
use App\Http\Controllers\Api\ProveedorController;
use App\Http\Controllers\Api\CompraMaterialController;
use App\Http\Controllers\Api\VentaController;
use App\Http\Controllers\Api\DetalleCompraController;
use App\Http\Controllers\Api\DetalleVentaController;
use App\Http\Controllers\Api\CotizacionController;
use App\Http\Controllers\Api\DetalleCotizacionController;
use App\Http\Controllers\Api\DetalleDevolucionController;
use App\Http\Controllers\Api\DetalleProduccionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\DevolucionController;
use App\Http\Controllers\Api\DiseñoController;
use App\Http\Controllers\Api\ProduccionController;
use App\Http\Controllers\Api\PagoController;
use App\Http\Controllers\Api\MovimientoInventarioController;
use App\Http\Controllers\Api\EtapaProduccionController;
use App\Http\Controllers\Api\ProduccionEtapaController;
use App\Http\Controllers\Api\LogController;

use App\Http\Controllers\BackupController;
use App\Http\Controllers\Auth\UserController;
use App\Models\EtapaProduccion;
use App\Models\MuebleMaterial;
use App\Models\Proveedor;
use App\Models\Usuario;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\PermisosController;
use App\Http\Controllers\Api\RolesController;
use App\Http\Controllers\Api\RolesPermisosController;
use App\Http\Controllers\Api\NegocioController;
use App\Http\Controllers\Api\CostoCotizacionController;
use App\Http\Controllers\Api\EvidenciaProduccionController;


/*
|---------------------------------------------------------------------------
| API Routes
|---------------------------------------------------------------------------
*/


//CONSULTAS

Route::get('usuarios/{id_usu}', [UsuarioController::class, 'getUsuarioById']);
Route::get('usuarios/simple/{id_usu}', [UsuarioController::class, 'getUsuarioSimple']);
Route::get('usuarios/{id_usu}/perfil', [UsuarioController::class, 'GetUsuariosPerfil']);
// Dashboard metrics
Route::get('/dashboard/all', [DashboardController::class, 'getAllDashboardData']);
Route::get('/dashboard/metrics', [DashboardController::class, 'getMetrics']);
Route::get('/dashboard/usuarios/porcentaje-activos', [DashboardController::class, 'porcentajeUsuarios']);
Route::get('/dashboard/cotizaciones-mes', [DashboardController::class, 'cotizacionesMes']);
Route::get('/dashboard/ventas-mes', [DashboardController::class, 'gananciasVentasMes']);


//backup por tablas
Route::get('/backup', [BackupController::class, 'backup']);
Route::get('usuarios/exportar-sql', [UsuarioController::class, 'exportarSQL']);
Route::get('clientes/exportar-sql', [ClienteController::class, 'exportarSQL']);
Route::get('empleados/exportar-sql', [EmpleadoController::class, 'exportarSQL']);
Route::get('materiales/exportar-sql', [MaterialController::class, 'exportarSQL']);
Route::get('categoria-mueble/exportar-sql', [CategoriaMuebleController::class, 'exportarSQL']);
Route::get('mueble/exportar-sql', [MuebleController::class, 'exportarSQL']);
Route::get('mueble-material/exportar-sql', [MuebleMaterialController::class, 'exportarSQL']);
Route::get('proveedor/exportar-sql', [ProveedorController::class, 'exportarSQL']);
Route::get('compra-material/exportar-sql', [CompraMaterialController::class, 'exportarSQL']);
Route::get('venta/exportar-sql', [VentaController::class, 'exportarSQL']);
Route::get('detalle-compra/exportar-sql', [DetalleCompraController::class, 'exportarSQL']);
Route::get('detalle-venta/exportar-sql', [DetalleVentaController::class, 'exportarSQL']);
Route::get('cotizacion/exportar-sql', [CotizacionController::class, 'exportarSQL']);
Route::get('detalle-cotizacion/exportar-sql', [DetalleCotizacionController::class, 'exportarSQL']);
Route::get('devolucion/exportar-sql', [DevolucionController::class, 'exportarSQL']);
Route::get('detalle-devolucion/exportar-sql', [DetalleDevolucionController::class, 'exportarSQL']);
Route::get('produccion/exportar-sql', [ProduccionController::class, 'exportarSQL']);
Route::get('detalle-produccion/exportar-sql', [DetalleProduccionController::class, 'exportarSQL']);
Route::get('diseno/exportar-sql', [DiseñoController::class, 'exportarSQL']);
Route::get('pago/exportar-sql', [PagoController::class, 'exportarSQL']);
Route::get('movimiento-inventario/exportar-sql', [MovimientoInventarioController::class, 'exportarSQL']);
Route::get('etapa-produccion/exportar-sql', [EtapaProduccionController::class, 'exportarSQL']);
Route::get('produccion-etapa/exportar-sql', [ProduccionEtapaController::class, 'exportarSQL']);



Route::post('/login', [LoginController::class, 'login']);
Route::middleware('auth:api')->get('me', [LoginController::class, 'me']);
Route::middleware('auth:api')->post('/logout', [LoginController::class, 'logout']);

Route::post('/register', [RegistroController::class, 'register']);

// Ruta de prueba para correo electrónico
Route::get('/test-mail', [TestMailController::class, 'testMail']);


Route::get('/usuarios-sin-relaciones', [UsuarioController::class, 'obtenerUsuariosSinRelaciones']);
Route::put('usuarios/{id}/estado', [UsuarioController::class, 'cambiarEstado']);
Route::put('materiales/{id}/estado', [MaterialController::class, 'cambiarEstado']);
Route::put('mueble/{id}/estado', [MuebleController::class, 'cambiarEstado']);
Route::put('proveedor/{id}/estado', [ProveedorController::class, 'cambiarEstado']);


Route::post('/contacto', [ContactController::class, 'enviarContacto']);
//tablas

Route::apiResource('clientes', ClienteController::class);
Route::apiResource('usuarios', UsuarioController::class);
Route::apiResource('empleados', EmpleadoController::class);
Route::apiResource('materiales', MaterialController::class);
Route::apiResource('categoria-mueble', CategoriaMuebleController::class);
Route::apiResource('mueble', MuebleController::class);
Route::apiResource('mueble-material', MuebleMaterialController::class);
Route::apiResource('proveedor', ProveedorController::class);
Route::apiResource('compra-material', CompraMaterialController::class);
Route::apiResource('venta', VentaController::class);
Route::apiResource('detalle-compra', DetalleCompraController::class);
Route::apiResource('detalle-venta', DetalleVentaController::class);
Route::apiResource('cotizacion', CotizacionController::class);
Route::apiResource('detalle-cotizacion', DetalleCotizacionController::class);
Route::apiResource('devolucion', DevolucionController::class);
Route::apiResource('detalle-devolucion', DetalleDevolucionController::class);
Route::apiResource('produccion', ProduccionController::class);
Route::apiResource('detalle-produccion', DetalleProduccionController::class);
// Ruta especial para completar producción (descuenta materiales y aumenta stock de muebles)
Route::post('detalle-produccion/{id}/completar', [DetalleProduccionController::class, 'completar']);

Route::apiResource('diseño', DiseñoController::class);
Route::apiResource('pago', PagoController::class);

Route::apiResource('movimiento-inventario', MovimientoInventarioController::class);
Route::apiResource('etapa-produccion', EtapaProduccionController::class);
Route::apiResource('produccion-etapa', ProduccionEtapaController::class);
Route::apiResource('logs', LogController::class); {
}

// Nuevas rutas para tablas agregadas
Route::apiResource('costo-cotizacion', CostoCotizacionController::class);
Route::apiResource('evidencia-produccion', EvidenciaProduccionController::class);
Route::get('evidencia-produccion/por-produccion/{id_pro}', [EvidenciaProduccionController::class, 'porProduccion']);

// ===============================
//      RUTAS PROCESOS DE NEGOCIO
// ===============================
Route::prefix('negocio')->group(function () {
    Route::post('/venta-completa', [NegocioController::class, 'procesarVentaCompleta']);
    Route::post('/cotizacion-completa', [NegocioController::class, 'procesarCotizacionCompleta']);
    Route::post('/cotizacion-a-venta/{id}', [NegocioController::class, 'cotizacionAVenta']);
    Route::post('/devolucion-completa', [NegocioController::class, 'procesarDevolucion']);
    Route::post('/compra-completa', [NegocioController::class, 'procesarCompraCompleta']);
    Route::post('/produccion-completa', [NegocioController::class, 'procesarProduccionCompleta']);
    Route::get('/resumen', [NegocioController::class, 'resumenProcesos']);
});






Route::post('/materiales', [MaterialController::class, 'store']);
Route::post('/categoria-mueble', [CategoriaMuebleController::class, 'store']);
Route::post('/mueble', [MuebleController::class, 'store']);
Route::post('/mueble-material', [MuebleMaterialController::class, 'store']);
Route::post('/proveedor', [ProveedorController::class, 'store']);
Route::post('/compra-material', [CompraMaterialController::class, 'store']);
Route::post('/venta', [VentaController::class, 'store']);
Route::post('/detalle-compra', [DetalleCompraController::class, 'store']);
Route::post('/detalle-venta', [DetalleVentaController::class, 'store']);
Route::post('/cotizacion', [CotizacionController::class, 'store']);
Route::post('/detalle-cotizacion', [DetalleCotizacionController::class, 'store']);
Route::post('/devolucion', [DevolucionController::class, 'store']);
Route::post('/detalle-devolucion', [DetalleDevolucionController::class, 'store']);
Route::post('/produccion', [ProduccionController::class, 'store']);
Route::post('/detalle-produccion', [DetalleProduccionController::class, 'store']);
Route::post('/diseño', [DiseñoController::class, 'store']);
Route::post('/pago', [PagoController::class, 'store']);
Route::post('/movimiento-inventario', [MovimientoInventarioController::class, 'store']);
Route::post('/etapa-produccion', [EtapaProduccionController::class, 'store']);
Route::post('/produccion-etapa', [ProduccionEtapaController::class, 'store']);







//Reportes

Route::get('/reporte-Usuarios', [UsuarioController::class, 'reporteUsuarios']);

// Rutas para reportes
Route::get('/reporte-Clientes', [ClienteController::class, 'reporteClientes']);
Route::get('/reporte-Empleados', [EmpleadoController::class, 'reporteEmpleados']);
Route::get('/reporte-Materiales', [MaterialController::class, 'reporteMateriales']);
Route::get('/reporte-Proveedores', [ProveedorController::class, 'reporteProveedores']);
Route::get('/reporte-Muebles', [MuebleController::class, 'reporteMuebles']);
Route::get('/reporte-Categorias', [CategoriaMuebleController::class, 'reporteCategorias']);
Route::get('/reporte-ComprasMateriales', [CompraMaterialController::class, 'reporteComprasMateriales']);
Route::get('/reporte-DetallesCompra', [DetalleCompraController::class, 'reporteDetallesCompra']);
Route::get('/reporte-DetallesVenta', [DetalleVentaController::class, 'reporteDetallesVenta']);
Route::get('/reporte-MuebleMateriales', [MuebleMaterialController::class, 'reporteMuebleMateriales']);
Route::get('/reporte-Ventas', [VentaController::class, 'reporteVentas']);
Route::get('/reporte-Cotizaciones', [CotizacionController::class, 'reporteCotizaciones']);
Route::get('/reporte-DetalleCotizaciones', [DetalleCotizacionController::class, 'reporteDetallesCotizaciones']);
Route::get('/reporte-Devoluciones', [DevolucionController::class, 'reporteDevoluciones']);
Route::get('/reporte-DetalleDevoluciones', [DetalleDevolucionController::class, 'reporteDetallesDevoluciones']);
Route::get('/reporte-Producciones', [ProduccionController::class, 'reporteProducciones']);
Route::get('/reporte-DetalleProducciones', [DetalleProduccionController::class, 'reporteDetallesProducciones']);
Route::get('/reporte-Diseños', [DiseñoController::class, 'reporteDiseños']);
Route::get('/reporte-Pagos', [PagoController::class, 'reportePagos']);
Route::get('/reporte-MovimientosInventario', [MovimientoInventarioController::class, 'reporteMovimientosInventarios']);
Route::get('/reporte-ProduccionEtapa', [ProduccionEtapaController::class, 'reporteProduccionEtapa']);
Route::get('/reporte-EtapaProduccion', [EtapaProduccionController::class, 'reporteEtapasProducciones']);










// Rutas para exportar SQL de las tablas


// Ruta en routes/api.php
//Route::get('/usuarios-sin-cliente', [UsuarioController::class, 'sinCliente']);
//Route::get('/usuarios-sin-empleado', [UsuarioController::class, 'sinEmpleado']);




// Rutas sugeridas para los controladores de Permisos, Roles y Usuarios
// Añade estas rutas a tu archivo routes/api.php




// ===============================
//      RUTAS PERMISOS
// ===============================
Route::prefix('permisos')->group(function () {
    // CRUD básico de permisos
    Route::get('/', [PermisosController::class, 'index']);                              // Obtener todos
    Route::post('/', [PermisosController::class, 'store']);                            // Crear
    Route::get('/{id_permiso}', [PermisosController::class, 'show']);                  // Obtener uno
    Route::put('/{id_permiso}', [PermisosController::class, 'update']);                // Actualizar
    Route::delete('/{id_permiso}', [PermisosController::class, 'destroy']);            // Eliminar

    // Obtener permisos de un rol específico
    Route::get('/rol/{id_rol}', [PermisosController::class, 'getPermisosByRol']);
});

// ===============================
//      RUTAS ROLES
// ===============================
Route::prefix('roles')->group(function () {
    // CRUD básico de roles
    Route::get('/', [RolesController::class, 'index']);                                // Obtener todos con permisos
    Route::post('/', [RolesController::class, 'store']);                               // Crear
    Route::get('/{id_rol}', [RolesController::class, 'show']);                         // Obtener uno con permisos y usuarios
    Route::put('/{id_rol}', [RolesController::class, 'update']);                       // Actualizar
    Route::delete('/{id_rol}', [RolesController::class, 'destroy']);                   // Eliminar

    // Obtener información relacionada al rol
    Route::get('/{id_rol}/permisos', [RolesController::class, 'getPermisos']);         // Permisos del rol
    Route::get('/{id_rol}/usuarios', [RolesController::class, 'getUsuarios']);         // Usuarios con este rol
    Route::get('/{id_rol}/redirect-route', [RolesController::class, 'getRedirectRoute']); // Obtener ruta de redirección

    // Asignar/revocar permisos individuales
    Route::post('/{id_rol}/permisos/{id_permiso}', [RolesPermisosController::class, 'asignarPermiso']);
    Route::delete('/{id_rol}/permisos/{id_permiso}', [RolesPermisosController::class, 'revocarPermiso']);

    // Operaciones en lote
    Route::post('/{id_rol}/permisos-batch', [RolesPermisosController::class, 'asignarPermisosLote']);
    Route::delete('/{id_rol}/permisos-batch', [RolesPermisosController::class, 'revocarPermisosLote']);

    // Sincronizar permisos
    Route::put('/{id_rol}/permisos', [RolesPermisosController::class, 'sincronizarPermisos']);

    // Ver permisos disponibles vs asignados
    Route::get('/{id_rol}/permisos-disponibles', [RolesPermisosController::class, 'permisosDisponibles']);
});

// ===============================
//      RUTAS ROLES-PERMISOS (Relación Many-to-Many)
// ===============================
Route::prefix('RolesPermisos')->group(function () {
    Route::get('/', [RolesPermisosController::class, 'index']); // Listar todos los roles con sus permisos
    // Asignar/revocar permisos individuales
    Route::post('/{id_rol}/RolesPermisos/{id_permiso}', [RolesPermisosController::class, 'asignarPermiso']);
    Route::delete('/{id_rol}/RolesPermisos/{id_permiso}', [RolesPermisosController::class, 'revocarPermiso']);

    // Operaciones en lote
    Route::post('/{id_rol}/RolesPermisos-batch', [RolesPermisosController::class, 'asignarPermisosLote']);
    Route::delete('/{id_rol}/RolesPermisos-batch', [RolesPermisosController::class, 'revocarPermisosLote']);

    // Sincronizar (reemplazar) todos los permisos
    Route::put('/{id_rol}/permisos', [RolesPermisosController::class, 'sincronizarPermisos']);

    // Ver permisos disponibles vs asignados
    Route::get('/{id_rol}/permisos-disponibles', [RolesPermisosController::class, 'permisosDisponibles']);
});

// ===============================
//      RUTAS USUARIOS (Métodos adicionales para permisos)
// ===============================
Route::prefix('usuarios')->group(function () {
    // Métodos existentes (index, store, show, update, destroy, etc.)

    // Métodos nuevos para permisos
    Route::get('/{id_usu}/permisos', [UsuarioController::class, 'obtenerMisPermisos']);                    // Obtener permisos del usuario
    Route::get('/{id_usu}/verificar-permiso', [UsuarioController::class, 'verificarPermiso']);             // Verificar un permiso
    Route::post('/{id_usu}/verificar-permisos', [UsuarioController::class, 'verificarMultiplesPermisos']); // Verificar múltiples
});
Route::prefix('roles-permisos')->group(function () {
    // Obtener todos los datos de la tabla rol_permiso con joins
    Route::get('/', [RolesPermisosController::class, 'index']);                        // Obtener todos
    Route::get('/filtrar', [RolesPermisosController::class, 'obtenerRolPermiso']);     // Obtener con filtros opcionales
});

// ===============================
//      RUTAS PORTAL CLIENTE
// ===============================
use App\Http\Controllers\Api\ClientePortalController;

Route::middleware('auth:api')->prefix('cliente')->group(function () {
    Route::get('/me', [ClientePortalController::class, 'getClienteActual']);
    Route::get('/cotizaciones', [ClientePortalController::class, 'getMisCotizaciones']);
    Route::get('/cotizaciones/{id}', [ClientePortalController::class, 'verCotizacion']);
    Route::post('/cotizaciones/solicitar', [ClientePortalController::class, 'solicitarCotizacion']);
    Route::post('/cotizaciones/{id}/cancelar', [ClientePortalController::class, 'cancelarCotizacion']);
    Route::get('/pedidos', [ClientePortalController::class, 'getMisPedidos']);
    Route::get('/pedidos/{id}', [ClientePortalController::class, 'verPedido']);
    Route::get('/producciones', [ClientePortalController::class, 'getMisProducciones']);
    Route::get('/producciones/{id}', [ClientePortalController::class, 'verProduccion']);
});

// Rutas públicas del cliente (validación via X-USER-ID header)
Route::prefix('cliente')->group(function () {
    Route::post('/compra-directa', [ClientePortalController::class, 'compraDirecta']);
    Route::get('/por-usuario/{id_usu}', [ClientePortalController::class, 'getClienteByUsuario']);
    
    // Favoritos
    Route::get('/favoritos', [ClientePortalController::class, 'getFavoritos']);
    Route::post('/favoritos/toggle', [ClientePortalController::class, 'toggleFavorito']);
    Route::get('/favoritos/ids', [ClientePortalController::class, 'getFavoritoIds']);
});

// ===============================
//      RUTAS NEGOCIO (ADMIN)
// ===============================
Route::prefix('negocio')->group(function () {
    // Venta completa
    Route::post('/venta-completa', [\App\Http\Controllers\Api\NegocioController::class, 'procesarVentaCompleta']);
    
    // Cotización a Venta
    Route::post('/cotizacion-a-venta/{id_cot}', [\App\Http\Controllers\Api\NegocioController::class, 'cotizacionAVenta']);
    
    // Cotización Completa
    Route::post('/cotizacion-completa', [\App\Http\Controllers\Api\NegocioController::class, 'procesarCotizacionCompleta']);
    
    // Aprobar/Rechazar Cotización
    Route::post('/cotizacion/{id_cot}/aprobar', [\App\Http\Controllers\Api\NegocioController::class, 'aprobarCotizacion']);
    Route::post('/cotizacion/{id_cot}/rechazar', [\App\Http\Controllers\Api\NegocioController::class, 'rechazarCotizacion']);
    
    // Devolución
    Route::post('/devolucion', [\App\Http\Controllers\Api\NegocioController::class, 'procesarDevolucion']);
    
    // Compra de materiales
    Route::post('/compra-completa', [\App\Http\Controllers\Api\NegocioController::class, 'procesarCompraCompleta']);
    
    // Producción
    Route::post('/produccion-completa', [\App\Http\Controllers\Api\NegocioController::class, 'procesarProduccionCompleta']);
    
    // Resumen
    Route::get('/resumen', [\App\Http\Controllers\Api\NegocioController::class, 'resumenProcesos']);
});
