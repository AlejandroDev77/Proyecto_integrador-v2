<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Cliente;
use App\Observers\ClienteObserver;
use App\Models\Produccion;
use App\Observers\ProduccionObserver;
use App\Models\Pago;
use App\Observers\PagoObserver;
use App\Models\Mueble;
use App\Observers\MuebleObserver;
use App\Models\Empleado;
use App\Observers\EmpleadoObserver;
use App\Models\Material;
use App\Observers\MaterialObserver;
use App\Models\DetalleVenta;
use App\Observers\DetalleVentaObserver;
use App\Models\DetalleCompra;
use App\Observers\DetalleCompraObserver;
use App\Models\Proveedor;
use App\Observers\ProveedorObserver;
use App\Models\MovimientoInventario;
use App\Observers\MovimientoInventarioObserver;
use App\Models\DetalleProduccion;
use App\Observers\DetalleProduccionObserver;
use App\Models\DetalleCotizacion;
use App\Observers\DetalleCotizacionObserver;
use App\Models\Devolucion;
use App\Observers\DevolucionObserver;
use App\Models\DetalleDevolucion;
use App\Observers\DetalleDevolucionObserver;
use App\Models\EtapaProduccion;
use App\Observers\EtapaProduccionObserver;
use App\Models\Diseño;
use App\Observers\DisenoObserver;
use App\Models\ProduccionEtapa;
use App\Observers\ProduccionEtapaObserver;
use App\Models\CategoriaMueble;
use App\Observers\CategoriaMuebleObserver;
use App\Models\CompraMaterial;
use App\Observers\CompraMaterialObserver;
use App\Models\Cotizacion;
use App\Observers\CotizacionObserver;
use App\Models\MuebleMaterial;
use App\Observers\MuebleMaterialObserver;
use App\Models\Rol;
use App\Observers\RolObserver;
use App\Models\Usuario;
use App\Observers\UsuarioObserver;
use App\Models\Venta;
use App\Observers\VentaObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Cliente::observe(ClienteObserver::class);
        Produccion::observe(ProduccionObserver::class);
        Pago::observe(PagoObserver::class);
        Mueble::observe(MuebleObserver::class);
        Empleado::observe(EmpleadoObserver::class);
        Material::observe(MaterialObserver::class);
        DetalleVenta::observe(DetalleVentaObserver::class);
        DetalleCompra::observe(DetalleCompraObserver::class);
        Proveedor::observe(ProveedorObserver::class);
        MovimientoInventario::observe(MovimientoInventarioObserver::class);
        DetalleProduccion::observe(DetalleProduccionObserver::class);
        DetalleCotizacion::observe(DetalleCotizacionObserver::class);
        Devolucion::observe(DevolucionObserver::class);
        DetalleDevolucion::observe(DetalleDevolucionObserver::class);
        EtapaProduccion::observe(EtapaProduccionObserver::class);
        Diseño::observe(DisenoObserver::class);
        ProduccionEtapa::observe(ProduccionEtapaObserver::class);
        CategoriaMueble::observe(CategoriaMuebleObserver::class);
        CompraMaterial::observe(CompraMaterialObserver::class);
        Cotizacion::observe(CotizacionObserver::class);
        MuebleMaterial::observe(MuebleMaterialObserver::class);
        Rol::observe(RolObserver::class);
        Usuario::observe(UsuarioObserver::class);
        Venta::observe(VentaObserver::class);
        //
    }
}
