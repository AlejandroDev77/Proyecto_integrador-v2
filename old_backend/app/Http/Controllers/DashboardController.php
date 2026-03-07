<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Empleado;
use Illuminate\Http\JsonResponse;
use App\Models\Usuario;
use App\Models\Venta;
use App\Models\Cotizacion;
use App\Models\CompraMaterial;
use App\Models\DetalleVenta;
use App\Models\Material;
use App\Models\Mueble;
use App\Models\Produccion;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getAllDashboardData(Request $request): JsonResponse
    {
        $yearActual = $request->query('year', now()->year);
        $mesActual = $request->query('month', now()->month);
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // === MÉTRICAS BÁSICAS ===
        $totalClientes = Cliente::where('est_cli', 1)->count();
        $totalEmpleados = Empleado::where('est_emp', 1)->count();

        // Usuarios activos/inactivos
        $totalUsuariosActivos = Usuario::where('est_usu', 1)->count();
        $totalUsuariosInactivos = Usuario::where('est_usu', 0)->count();
        $porcentajeActivos = ($totalUsuariosActivos + $totalUsuariosInactivos) > 0
            ? round(($totalUsuariosActivos / ($totalUsuariosActivos + $totalUsuariosInactivos)) * 100, 1)
            : 0;

        // === MÉTRICAS ADICIONALES ===
        // Check if a specific month was requested by the frontend
        $monthFilter = $request->query('month_filter'); // 'specific' or 'all'
        
        // Ventas del mes seleccionado (incluyendo pendientes)
        $ventasDelMes = Venta::whereYear('fec_ven', $yearActual)
            ->whereMonth('fec_ven', $mesActual)
            ->whereIn(DB::raw('LOWER(est_ven)'), ['completado', 'pendiente'])
            ->sum('total_ven');

        // Ventas del año completo
        $ventasDelAno = Venta::whereYear('fec_ven', $yearActual)
            ->whereIn(DB::raw('LOWER(est_ven)'), ['completado', 'pendiente'])
            ->sum('total_ven');

        // Ventas del período (dependiendo de los filtros)
        $ventasDelPeriodo = 0;
        if ($startDate && $endDate) {
            // Custom date range
            $ventasDelPeriodo = Venta::whereBetween('fec_ven', [$startDate, $endDate])
                ->whereIn(DB::raw('LOWER(est_ven)'), ['completado', 'pendiente'])
                ->sum('total_ven');
        } elseif ($monthFilter === 'specific') {
            // Specific month selected
            $ventasDelPeriodo = $ventasDelMes;
        } else {
            // Full year (no specific month selected)
            $ventasDelPeriodo = $ventasDelAno;
        }

        $cotizacionesPendientes = Cotizacion::where('est_cot', 'ilike', 'pendiente')->count();
        $produccionesActivas = Produccion::whereIn(DB::raw('LOWER(est_pro)'), ['en proceso', 'en_proceso', 'pendiente'])->count();

        // Stock bajo
        $materialesStockBajo = Material::whereRaw('stock_mat <= stock_min')->where('est_mat', 1)->count();
        $mueblesStockBajo = Mueble::whereRaw('stock <= stock_min')->where('est_mue', 1)->count();
        $totalStockBajo = $materialesStockBajo + $mueblesStockBajo;

        // Helper closure to apply date filters to queries
        $applyDateFilter = function ($query, $dateColumn) use ($yearActual, $mesActual, $startDate, $endDate, $monthFilter) {
            if ($startDate && $endDate) {
                // Custom date range
                return $query->whereBetween($dateColumn, [$startDate, $endDate]);
            } elseif ($monthFilter === 'specific') {
                // Specific month selected
                return $query->whereYear($dateColumn, $yearActual)->whereMonth($dateColumn, $mesActual);
            } else {
                // Full year
                return $query->whereYear($dateColumn, $yearActual);
            }
        };

        // === GANANCIAS MENSUALES ===
        $gananciasQuery = Venta::selectRaw('EXTRACT(MONTH FROM fec_ven) as mes, SUM(total_ven) as total')
            ->where('est_ven', 'ilike', 'completado')
            ->groupBy('mes')
            ->orderBy('mes');
        $gananciasporMes = $applyDateFilter($gananciasQuery, 'fec_ven')->get();

        $ganancias = array_fill(0, 12, 0);
        foreach ($gananciasporMes as $venta) {
            $mesIndex = $venta->mes - 1;
            $ganancias[$mesIndex] = (float) $venta->total;
        }

        // Ganancias año anterior para comparación
        $gananciasAnoAnterior = Venta::selectRaw('EXTRACT(MONTH FROM fec_ven) as mes, SUM(total_ven) as total')
            ->whereYear('fec_ven', $yearActual - 1)
            ->where('est_ven', 'ilike', 'completado')
            ->groupBy('mes')
            ->orderBy('mes')
            ->get();

        $gananciasAnterior = array_fill(0, 12, 0);
        foreach ($gananciasAnoAnterior as $venta) {
            $mesIndex = $venta->mes - 1;
            $gananciasAnterior[$mesIndex] = (float) $venta->total;
        }

        // === COTIZACIONES MENSUALES ===
        $cotizacionesQuery = Cotizacion::selectRaw('EXTRACT(MONTH FROM fec_cot) as mes, LOWER(est_cot) as tipo, COUNT(*) as total')
            ->groupByRaw('EXTRACT(MONTH FROM fec_cot), LOWER(est_cot)')
            ->orderByRaw('EXTRACT(MONTH FROM fec_cot)');
        $cotizacionesPorMes = $applyDateFilter($cotizacionesQuery, 'fec_cot')->get();

        $cotizaciones = [
            'aprobado' => array_fill(0, 12, 0),
            'rechazado' => array_fill(0, 12, 0),
            'pendiente' => array_fill(0, 12, 0),
        ];

        foreach ($cotizacionesPorMes as $cotizacion) {
            $mesIndex = $cotizacion->mes - 1;
            $tipo = $cotizacion->tipo;
            if (isset($cotizaciones[$tipo])) {
                $cotizaciones[$tipo][$mesIndex] = $cotizacion->total;
            }
        }

        // === VENTAS VS COMPRAS ===
        $ventasVsComprasQuery = Venta::selectRaw('EXTRACT(MONTH FROM fec_ven) as mes, SUM(total_ven) as total')
            ->where('est_ven', 'ilike', 'completado')
            ->groupBy('mes')
            ->orderBy('mes');
        $ventasPorMes = $applyDateFilter($ventasVsComprasQuery, 'fec_ven')->get();

        $comprasQuery = CompraMaterial::selectRaw('EXTRACT(MONTH FROM fec_comp) as mes, SUM(total_comp) as total')
            ->groupBy('mes')
            ->orderBy('mes');
        $comprasPorMes = $applyDateFilter($comprasQuery, 'fec_comp')->get();

        $ventasArray = array_fill(0, 12, 0);
        $comprasArray = array_fill(0, 12, 0);
        
        foreach ($ventasPorMes as $v) {
            $ventasArray[$v->mes - 1] = (float) $v->total;
        }
        foreach ($comprasPorMes as $c) {
            $comprasArray[$c->mes - 1] = (float) $c->total;
        }

        // === VENTAS POR CATEGORÍA ===
        $ventasCategoriaQuery = DetalleVenta::join('muebles', 'detalles_venta.id_mue', '=', 'muebles.id_mue')
            ->join('categorias_muebles', 'muebles.id_cat', '=', 'categorias_muebles.id_cat')
            ->join('ventas', 'detalles_venta.id_ven', '=', 'ventas.id_ven')
            ->where('ventas.est_ven', 'ilike', 'completado')
            ->selectRaw('categorias_muebles.nom_cat as categoria, SUM(detalles_venta.subtotal) as total')
            ->groupBy('categorias_muebles.nom_cat')
            ->orderByDesc('total');
        $ventasPorCategoria = $applyDateFilter($ventasCategoriaQuery, 'ventas.fec_ven')->get();

        // === ESTADO DE PRODUCCIONES ===
        $estadoProduccionesQuery = Produccion::selectRaw('LOWER(est_pro) as estado, COUNT(*) as total')
            ->groupByRaw('LOWER(est_pro)');
        $estadoProducciones = $applyDateFilter($estadoProduccionesQuery, 'fec_ini')->get();

        // === TOP 5 MUEBLES MÁS VENDIDOS ===
        $topMueblesQuery = DetalleVenta::join('muebles', 'detalles_venta.id_mue', '=', 'muebles.id_mue')
            ->join('ventas', 'detalles_venta.id_ven', '=', 'ventas.id_ven')
            ->where('ventas.est_ven', 'ilike', 'completado')
            ->selectRaw('muebles.nom_mue as nombre, SUM(detalles_venta.cantidad) as cantidad, SUM(detalles_venta.subtotal) as total')
            ->groupBy('muebles.nom_mue')
            ->orderByDesc('total')
            ->limit(5);
        $topMuebles = $applyDateFilter($topMueblesQuery, 'ventas.fec_ven')->get();

        // === ALERTAS DE STOCK ===
        $alertasMateriales = Material::whereRaw('stock_mat <= stock_min')
            ->where('est_mat', 1)
            ->select('nom_mat as nombre', 'stock_mat as stock', 'stock_min', 'unidad_medida')
            ->orderByRaw('stock_mat - stock_min ASC')
            ->limit(10)
            ->get();

        $alertasMuebles = Mueble::whereRaw('stock <= stock_min')
            ->where('est_mue', 1)
            ->select('nom_mue as nombre', 'stock', 'stock_min')
            ->orderByRaw('stock - stock_min ASC')
            ->limit(10)
            ->get();

        // === PRODUCCIONES MENSUALES ===
        $produccionesQuery = Produccion::selectRaw('EXTRACT(MONTH FROM fec_ini) as mes, COUNT(*) as total')
            ->groupBy('mes')
            ->orderBy('mes');
        $produccionesPorMes = $applyDateFilter($produccionesQuery, 'fec_ini')->get();

        $produccionesArray = array_fill(0, 12, 0);
        foreach ($produccionesPorMes as $p) {
            $produccionesArray[$p->mes - 1] = (int) $p->total;
        }

        // === COMPRAS POR PROVEEDOR ===
        $comprasProveedorQuery = CompraMaterial::join('proveedores', 'compras_materiales.id_prov', '=', 'proveedores.id_prov')
            ->selectRaw('proveedores.nom_prov as proveedor, SUM(total_comp) as total, COUNT(*) as cantidad')
            ->groupBy('proveedores.nom_prov')
            ->orderByDesc('total')
            ->limit(5);
        $comprasPorProveedor = $applyDateFilter($comprasProveedorQuery, 'fec_comp')->get();

        // === STOCK DE MUEBLES ===
        $stockMuebles = Mueble::where('est_mue', 1)
            ->select('nom_mue as nombre', 'stock', 'stock_min')
            ->orderByDesc('stock')
            ->limit(8)
            ->get();

        // === VENTAS POR MES (cantidad de ventas) ===
        $ventasCantidadQuery = Venta::selectRaw('EXTRACT(MONTH FROM fec_ven) as mes, COUNT(*) as cantidad')
            ->where('est_ven', 'ilike', 'completado')
            ->groupBy('mes')
            ->orderBy('mes');
        $ventasCantidadPorMes = $applyDateFilter($ventasCantidadQuery, 'fec_ven')->get();

        $ventasCantidad = array_fill(0, 12, 0);
        foreach ($ventasCantidadPorMes as $v) {
            $ventasCantidad[$v->mes - 1] = (int) $v->cantidad;
        }

        // === CONVERSIÓN COTIZACIONES ===
        $totalCotizacionesQuery = Cotizacion::query();
        $totalCotizacionesPeriodo = $applyDateFilter($totalCotizacionesQuery, 'fec_cot')->count();
        $cotizacionesAprobadasQuery = Cotizacion::where('est_cot', 'ilike', 'aprobado');
        $cotizacionesAprobadas = $applyDateFilter($cotizacionesAprobadasQuery, 'fec_cot')->count();
        $tasaConversion = $totalCotizacionesPeriodo > 0 
            ? round(($cotizacionesAprobadas / $totalCotizacionesPeriodo) * 100, 1) 
            : 0;

        return response()->json([
            'metrics' => [
                'customers' => [
                    'total' => $totalClientes,
                    'percentage' => 0
                ],
                'employees' => [
                    'total' => $totalEmpleados,
                    'percentage' => 0
                ],
                'ventasDelMes' => $ventasDelMes,
                'ventasDelPeriodo' => $ventasDelPeriodo,
                'cotizacionesPendientes' => $cotizacionesPendientes,
                'produccionesActivas' => $produccionesActivas,
                'stockBajo' => $totalStockBajo,
            ],
            'usuarios' => [
                'percentage' => $porcentajeActivos,
                'activeUsers' => $totalUsuariosActivos,
                'inactiveUsers' => $totalUsuariosInactivos
            ],
            'ganancias_mensuales' => $ganancias,
            'ganancias_ano_anterior' => $gananciasAnterior,
            'cotizaciones_mensuales' => $cotizaciones,
            'ventas_vs_compras' => [
                'ventas' => $ventasArray,
                'compras' => $comprasArray,
            ],
            'ventas_por_categoria' => $ventasPorCategoria,
            'estado_producciones' => $estadoProducciones,
            'top_muebles' => $topMuebles,
            'alertas_stock' => [
                'materiales' => $alertasMateriales,
                'muebles' => $alertasMuebles,
            ],
            'conversion_cotizaciones' => [
                'tasa' => $tasaConversion,
                'total' => $totalCotizacionesPeriodo,
                'aprobadas' => $cotizacionesAprobadas,
            ],
            'producciones_mensuales' => $produccionesArray,
            'compras_por_proveedor' => $comprasPorProveedor,
            'stock_muebles' => $stockMuebles,
            'ventas_cantidad' => $ventasCantidad,
        ]);
    }

    public function getMetrics(): JsonResponse
    {
        $totalClientes = Cliente::where('est_cli', 1)->count();
        $totalEmpleados = Empleado::where('est_emp', 1)->count();

        return response()->json([
            'metrics' => [
                'customers' => [
                    'total' => $totalClientes,
                    'percentage' => 0
                ],
                'employees' => [
                    'total' => $totalEmpleados,
                    'percentage' => 0
                ]
            ]
        ]);
    }

    public function porcentajeUsuarios(): JsonResponse
    {
        $totalUsuariosActivos = Usuario::where('est_usu', 1)->count();
        $totalUsuariosInactivos = Usuario::where('est_usu', 0)->count();

        $porcentajeActivos = ($totalUsuariosActivos + $totalUsuariosInactivos) > 0
            ? round(($totalUsuariosActivos / ($totalUsuariosActivos + $totalUsuariosInactivos)) * 100, 1)
            : 0;

        return response()->json([
            'percentage' => $porcentajeActivos,
            'activeUsers' => $totalUsuariosActivos,
            'inactiveUsers' => $totalUsuariosInactivos
        ]);
    }

    public function cotizacionesMes(): JsonResponse
    {
        $currentYear = now()->year;

        $cotizacionesPorMes = Cotizacion::selectRaw('EXTRACT(MONTH FROM fec_cot) as mes, LOWER(est_cot) as tipo, COUNT(*) as total')
            ->whereYear('fec_cot', $currentYear)
            ->groupByRaw('EXTRACT(MONTH FROM fec_cot), LOWER(est_cot)')
            ->orderByRaw('EXTRACT(MONTH FROM fec_cot)')
            ->get();

        $resultado = [
            'aprobado' => array_fill(0, 12, 0),
            'rechazado' => array_fill(0, 12, 0),
            'pendiente' => array_fill(0, 12, 0),
        ];

        foreach ($cotizacionesPorMes as $cotizacion) {
            $mesIndex = $cotizacion->mes - 1; 
            $tipo = $cotizacion->tipo;

            if (isset($resultado[$tipo])) {
                $resultado[$tipo][$mesIndex] = $cotizacion->total;
            }
        }

        return response()->json($resultado);
    }

    public function gananciasVentasMes(): JsonResponse
    {
        $yearActual = now()->year;

        $gananciasporMes = Venta::selectRaw('EXTRACT(MONTH FROM fec_ven) as mes, SUM(total_ven) as total')
            ->whereYear('fec_ven', $yearActual)
            ->where('est_ven', 'ilike', 'completado')
            ->groupBy('mes')
            ->orderBy('mes')
            ->get();

        $ganancias = array_fill(0, 12, 0);
        
        foreach ($gananciasporMes as $venta) {
            $mesIndex = $venta->mes - 1;
            $ganancias[$mesIndex] = (float) $venta->total;
        }

        return response()->json([
            'ganancias_mensuales' => $ganancias
        ]);
    }
}

