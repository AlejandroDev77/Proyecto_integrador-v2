<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Cotizacion;
use App\Models\DetalleCotizacion;
use App\Models\Devolucion;
use App\Models\DetalleDevolucion;
use App\Models\Mueble;
use App\Models\Pago;
use App\Models\MovimientoInventario;
use App\Models\CompraMaterial;
use App\Models\DetalleCompra;
use App\Models\Material;
use App\Models\CostoCotizacion;
use App\Models\Produccion;
use App\Models\DetalleProduccion;
use App\Models\ProduccionEtapa;
use App\Models\EtapaProduccion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NegocioController extends Controller
{
    /**
     * Proceso de Venta Completa
     * --------------------
     * 1. Crea la venta (cabecera)
     * 2. Crea los detalles de venta
     * 3. Descuenta el stock de cada mueble
     * 4. Registra movimientos de inventario
     * 5. Registra el pago (opcional)
     */
    public function procesarVentaCompleta(Request $request)
    {
        $validated = $request->validate([
            'venta.fec_ven' => 'required|date',
            'venta.est_ven' => 'required|string|max:50',
            'venta.total_ven' => 'required|numeric|min:0',
            'venta.descuento' => 'nullable|numeric|min:0',
            'venta.id_cli' => 'required|exists:clientes,id_cli',
            'venta.id_emp' => 'required|exists:empleados,id_emp',
            'venta.notas' => 'nullable|string|max:500',
            'detalles' => 'required|array|min:1',
            'detalles.*.id_mue' => 'required|exists:muebles,id_mue',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'detalles.*.descuento_item' => 'nullable|numeric|min:0',
            'pago' => 'nullable|array',
            'pago.monto' => 'required_with:pago|numeric|min:0',
            'pago.metodo_pag' => 'required_with:pago|string|max:50',
            'pago.referencia_pag' => 'nullable|string|max:100',
        ], [
            'venta.fec_ven.required' => 'La fecha de venta es obligatoria.',
            'venta.id_cli.required' => 'El cliente es obligatorio.',
            'venta.id_cli.exists' => 'El cliente seleccionado no existe.',
            'venta.id_emp.required' => 'El empleado es obligatorio.',
            'venta.id_emp.exists' => 'El empleado seleccionado no existe.',
            'detalles.required' => 'Debe agregar al menos un producto.',
            'detalles.*.id_mue.required' => 'Seleccione un mueble.',
            'detalles.*.id_mue.exists' => 'El mueble seleccionado no existe.',
            'detalles.*.cantidad.required' => 'La cantidad es obligatoria.',
            'detalles.*.cantidad.min' => 'La cantidad debe ser al menos 1.',
        ]);

        DB::beginTransaction();
        try {
            // 1. Generar código de venta
            $nextId = 1;
            do {
                $cod_ven = 'VEN-' . $nextId;
                $nextId++;
            } while (Venta::where('cod_ven', $cod_ven)->exists());

            // 2. Crear la venta
            $ventaData = $request->input('venta');
            $ventaData['cod_ven'] = $cod_ven;
            $ventaData['descuento'] = $ventaData['descuento'] ?? 0;
            $venta = Venta::create($ventaData);

            $detallesCreados = [];
            $movimientosCreados = [];

            // 3. Procesar cada detalle
            foreach ($request->input('detalles') as $detalle) {
                $mueble = Mueble::findOrFail($detalle['id_mue']);
                
                // Verificar stock
                if ($mueble->stock < $detalle['cantidad']) {
                    throw new \Exception("Stock insuficiente para '{$mueble->nom_mue}'. Disponible: {$mueble->stock}, Solicitado: {$detalle['cantidad']}");
                }

                // Generar código de detalle
                $nextDetId = 1;
                do {
                    $cod_det_ven = 'DVEN-' . $nextDetId;
                    $nextDetId++;
                } while (DetalleVenta::where('cod_det_ven', $cod_det_ven)->exists());

                // Calcular subtotal
                $descuento_item = $detalle['descuento_item'] ?? 0;
                $subtotal = ($detalle['cantidad'] * $detalle['precio_unitario']) - ($detalle['cantidad'] * $descuento_item);

                // Crear detalle de venta
                $detalleVenta = DetalleVenta::create([
                    'cod_det_ven' => $cod_det_ven,
                    'id_ven' => $venta->id_ven,
                    'id_mue' => $detalle['id_mue'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'descuento_item' => $descuento_item,
                    'subtotal' => $subtotal,
                ]);
                $detallesCreados[] = $detalleVenta;

                // Registrar movimiento de inventario (salida)
                $stockAnterior = $mueble->stock;
                $stockPosterior = $stockAnterior - $detalle['cantidad'];

                $nextMovId = 1;
                do {
                    $cod_mov = 'MOV-' . $nextMovId;
                    $nextMovId++;
                } while (MovimientoInventario::where('cod_mov', $cod_mov)->exists());

                $movimiento = MovimientoInventario::create([
                    'cod_mov' => $cod_mov,
                    'tipo_mov' => 'SALIDA',
                    'cantidad' => $detalle['cantidad'],
                    'fecha_mov' => now(),
                    'id_mue' => $detalle['id_mue'],
                    'id_ven' => $venta->id_ven,
                    'id_emp' => $ventaData['id_emp'],
                    'motivo' => "Venta {$cod_ven} - {$mueble->nom_mue}",
                    'stock_anterior' => $stockAnterior,
                    'stock_posterior' => $stockPosterior,
                ]);
                $movimientosCreados[] = $movimiento;

                // Actualizar stock del mueble
                $mueble->stock = $stockPosterior;
                $mueble->save();
            }

            // 4. Registrar pago (si se proporcionó)
            $pagoCreado = null;
            if ($request->has('pago') && $request->input('pago')) {
                $pagoData = $request->input('pago');
                
                $nextPagId = 1;
                do {
                    $cod_pag = 'PAG-' . $nextPagId;
                    $nextPagId++;
                } while (Pago::where('cod_pag', $cod_pag)->exists());

                $pagoCreado = Pago::create([
                    'cod_pag' => $cod_pag,
                    'monto' => $pagoData['monto'],
                    'fec_pag' => $ventaData['fec_ven'],
                    'metodo_pag' => $pagoData['metodo_pag'],
                    'referencia_pag' => $pagoData['referencia_pag'] ?? null,
                    'id_ven' => $venta->id_ven,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Venta procesada correctamente',
                'data' => [
                    'venta' => $venta->load(['cliente', 'empleado']),
                    'detalles' => $detallesCreados,
                    'movimientos' => count($movimientosCreados),
                    'pago' => $pagoCreado,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la venta: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Convertir Cotización a Venta
     * ----------------------------
     * 1. Verifica que la cotización esté pendiente
     * 2. Crea una venta basada en la cotización
     * 3. Copia los detalles de cotización a detalles de venta
     * 4. Actualiza stocks y registra movimientos
     * 5. Cambia el estado de la cotización a "Aprobada"
     */
    public function cotizacionAVenta($id_cot, Request $request)
    {
        $validated = $request->validate([
            'id_emp' => 'required|exists:empleados,id_emp',
            'registrar_pago' => 'nullable|boolean',
            'pago' => 'nullable|array',
            'pago.monto' => 'required_if:registrar_pago,true|numeric|min:0',
            'pago.metodo_pag' => 'required_if:registrar_pago,true|string|max:50',
        ], [
            'id_emp.required' => 'El empleado es obligatorio.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
        ]);

        DB::beginTransaction();
        try {
            $cotizacion = Cotizacion::with('detalles')->findOrFail($id_cot);

            if ($cotizacion->est_cot === 'Aprobada' || $cotizacion->est_cot === 'Convertida') {
                throw new \Exception('Esta cotización ya fue aprobada o convertida a venta.');
            }

            if (!$cotizacion->detalles || $cotizacion->detalles->isEmpty()) {
                throw new \Exception('La cotización no tiene detalles para convertir.');
            }

            // 1. Generar código de venta
            $nextId = 1;
            do {
                $cod_ven = 'VEN-' . $nextId;
                $nextId++;
            } while (Venta::where('cod_ven', $cod_ven)->exists());

            // 2. Crear la venta
            $venta = Venta::create([
                'cod_ven' => $cod_ven,
                'fec_ven' => now()->toDateString(),
                'est_ven' => 'Completada',
                'total_ven' => $cotizacion->total_cot,
                'descuento' => $cotizacion->descuento ?? 0,
                'id_cli' => $cotizacion->id_cli,
                'id_emp' => $request->input('id_emp'),
                'notas' => "Generada desde cotización {$cotizacion->cod_cot}",
            ]);

            $detallesCreados = [];
            $movimientosCreados = [];

            // 3. Copiar detalles de cotización a venta
            foreach ($cotizacion->detalles as $detalleCot) {
                $mueble = Mueble::findOrFail($detalleCot->id_mue);

                // Verificar stock
                if ($mueble->stock < $detalleCot->cantidad) {
                    throw new \Exception("Stock insuficiente para '{$mueble->nom_mue}'. Disponible: {$mueble->stock}, Solicitado: {$detalleCot->cantidad}");
                }

                // Generar código de detalle
                $nextDetId = 1;
                do {
                    $cod_det_ven = 'DVEN-' . $nextDetId;
                    $nextDetId++;
                } while (DetalleVenta::where('cod_det_ven', $cod_det_ven)->exists());

                // Crear detalle de venta
                $detalleVenta = DetalleVenta::create([
                    'cod_det_ven' => $cod_det_ven,
                    'id_ven' => $venta->id_ven,
                    'id_mue' => $detalleCot->id_mue,
                    'cantidad' => $detalleCot->cantidad,
                    'precio_unitario' => $detalleCot->precio_unitario,
                    'descuento_item' => 0,
                    'subtotal' => $detalleCot->subtotal,
                ]);
                $detallesCreados[] = $detalleVenta;

                // Registrar movimiento de inventario
                $stockAnterior = $mueble->stock;
                $stockPosterior = $stockAnterior - $detalleCot->cantidad;

                $nextMovId = 1;
                do {
                    $cod_mov = 'MOV-' . $nextMovId;
                    $nextMovId++;
                } while (MovimientoInventario::where('cod_mov', $cod_mov)->exists());

                MovimientoInventario::create([
                    'cod_mov' => $cod_mov,
                    'tipo_mov' => 'SALIDA',
                    'cantidad' => $detalleCot->cantidad,
                    'fecha_mov' => now(),
                    'id_mue' => $detalleCot->id_mue,
                    'id_ven' => $venta->id_ven,
                    'id_emp' => $request->input('id_emp'),
                    'motivo' => "Venta {$cod_ven} (desde cotización {$cotizacion->cod_cot})",
                    'stock_anterior' => $stockAnterior,
                    'stock_posterior' => $stockPosterior,
                ]);
                $movimientosCreados[] = $cod_mov;

                // Actualizar stock
                $mueble->stock = $stockPosterior;
                $mueble->save();
            }

            // 4. Registrar pago (si aplica)
            $pagoCreado = null;
            if ($request->input('registrar_pago') && $request->has('pago')) {
                $pagoData = $request->input('pago');
                
                $nextPagId = 1;
                do {
                    $cod_pag = 'PAG-' . $nextPagId;
                    $nextPagId++;
                } while (Pago::where('cod_pag', $cod_pag)->exists());

                $pagoCreado = Pago::create([
                    'cod_pag' => $cod_pag,
                    'monto' => $pagoData['monto'],
                    'fec_pag' => now()->toDateString(),
                    'metodo_pag' => $pagoData['metodo_pag'],
                    'referencia_pag' => $pagoData['referencia_pag'] ?? null,
                    'id_ven' => $venta->id_ven,
                ]);
            }

            // 5. Actualizar estado de la cotización
            $cotizacion->est_cot = 'Aprobada';
            $cotizacion->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Cotización convertida a venta exitosamente',
                'data' => [
                    'venta' => $venta->load(['cliente', 'empleado']),
                    'detalles' => count($detallesCreados),
                    'movimientos' => count($movimientosCreados),
                    'pago' => $pagoCreado,
                    'cotizacion_actualizada' => $cotizacion->only(['id_cot', 'cod_cot', 'est_cot']),
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al convertir cotización: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Proceso de Devolución Completa
     * -------------------------------
     * 1. Crea la devolución (cabecera)
     * 2. Crea los detalles de devolución
     * 3. Restaura el stock de cada mueble
     * 4. Registra movimientos de inventario (entrada)
     */
    public function procesarDevolucion(Request $request)
    {
        $validated = $request->validate([
            'devolucion.fec_dev' => 'required|date',
            'devolucion.motivo_dev' => 'required|string|max:500',
            'devolucion.id_ven' => 'required|exists:ventas,id_ven',
            'devolucion.id_emp' => 'required|exists:empleados,id_emp',
            'detalles' => 'required|array|min:1',
            'detalles.*.id_mue' => 'required|exists:muebles,id_mue',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
        ], [
            'devolucion.fec_dev.required' => 'La fecha es obligatoria.',
            'devolucion.motivo_dev.required' => 'El motivo es obligatorio.',
            'devolucion.id_ven.required' => 'La venta es obligatoria.',
            'devolucion.id_ven.exists' => 'La venta seleccionada no existe.',
            'devolucion.id_emp.required' => 'El empleado es obligatorio.',
            'detalles.required' => 'Debe agregar al menos un producto a devolver.',
        ]);

        DB::beginTransaction();
        try {
            $devolucionData = $request->input('devolucion');

            // Calcular total de devolución
            $totalDev = 0;
            foreach ($request->input('detalles') as $det) {
                $totalDev += $det['cantidad'] * $det['precio_unitario'];
            }

            // 1. Generar código de devolución
            $nextId = 1;
            do {
                $cod_dev = 'DEV-' . $nextId;
                $nextId++;
            } while (Devolucion::where('cod_dev', $cod_dev)->exists());

            // 2. Crear la devolución
            $devolucion = Devolucion::create([
                'cod_dev' => $cod_dev,
                'fec_dev' => $devolucionData['fec_dev'],
                'motivo_dev' => $devolucionData['motivo_dev'],
                'total_dev' => $totalDev,
                'est_dev' => 'Completada',
                'id_ven' => $devolucionData['id_ven'],
                'id_emp' => $devolucionData['id_emp'],
            ]);

            $detallesCreados = [];

            // 3. Procesar cada detalle
            foreach ($request->input('detalles') as $detalle) {
                $mueble = Mueble::findOrFail($detalle['id_mue']);

                // Generar código de detalle
                $nextDetId = 1;
                do {
                    $cod_det_dev = 'DDEV-' . $nextDetId;
                    $nextDetId++;
                } while (DetalleDevolucion::where('cod_det_dev', $cod_det_dev)->exists());

                $subtotal = $detalle['cantidad'] * $detalle['precio_unitario'];

                // Crear detalle de devolución
                $detalleDevolucion = DetalleDevolucion::create([
                    'cod_det_dev' => $cod_det_dev,
                    'id_dev' => $devolucion->id_dev,
                    'id_mue' => $detalle['id_mue'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'subtotal' => $subtotal,
                ]);
                $detallesCreados[] = $detalleDevolucion;

                // Registrar movimiento de inventario (entrada)
                $stockAnterior = $mueble->stock;
                $stockPosterior = $stockAnterior + $detalle['cantidad'];

                $nextMovId = 1;
                do {
                    $cod_mov = 'MOV-' . $nextMovId;
                    $nextMovId++;
                } while (MovimientoInventario::where('cod_mov', $cod_mov)->exists());

                MovimientoInventario::create([
                    'cod_mov' => $cod_mov,
                    'tipo_mov' => 'ENTRADA',
                    'cantidad' => $detalle['cantidad'],
                    'fecha_mov' => now(),
                    'id_mue' => $detalle['id_mue'],
                    'id_dev' => $devolucion->id_dev,
                    'id_emp' => $devolucionData['id_emp'],
                    'motivo' => "Devolución {$cod_dev} - {$mueble->nom_mue}",
                    'stock_anterior' => $stockAnterior,
                    'stock_posterior' => $stockPosterior,
                ]);

                // Actualizar stock del mueble (suma)
                $mueble->stock = $stockPosterior;
                $mueble->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Devolución procesada correctamente',
                'data' => [
                    'devolucion' => $devolucion->load(['venta', 'empleado']),
                    'detalles' => $detallesCreados,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar devolución: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Proceso de Compra de Materiales Completa
     * -----------------------------------------
     * 1. Crea la compra (cabecera)
     * 2. Crea los detalles de compra
     * 3. Aumenta el stock de cada material
     * 4. Registra movimientos de inventario
     */
    public function procesarCompraCompleta(Request $request)
    {
        $validated = $request->validate([
            'compra.fec_comp' => 'required|date',
            'compra.id_prov' => 'required|exists:proveedores,id_prov',
            'compra.id_emp' => 'required|exists:empleados,id_emp',
            'detalles' => 'required|array|min:1',
            'detalles.*.id_mat' => 'required|exists:materiales,id_mat',
            'detalles.*.cantidad' => 'required|numeric|min:0.01',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
        ], [
            'compra.fec_comp.required' => 'La fecha es obligatoria.',
            'compra.id_prov.required' => 'El proveedor es obligatorio.',
            'compra.id_prov.exists' => 'El proveedor seleccionado no existe.',
            'compra.id_emp.required' => 'El empleado es obligatorio.',
            'detalles.required' => 'Debe agregar al menos un material.',
        ]);

        DB::beginTransaction();
        try {
            $compraData = $request->input('compra');

            // Calcular total de compra
            $totalComp = 0;
            foreach ($request->input('detalles') as $det) {
                $totalComp += $det['cantidad'] * $det['precio_unitario'];
            }

            // 1. Generar código de compra
            $nextId = 1;
            do {
                $cod_comp = 'COMP-' . $nextId;
                $nextId++;
            } while (CompraMaterial::where('cod_comp', $cod_comp)->exists());

            // 2. Crear la compra
            $compra = CompraMaterial::create([
                'cod_comp' => $cod_comp,
                'fec_comp' => $compraData['fec_comp'],
                'est_comp' => 'Completada',
                'total_comp' => $totalComp,
                'id_prov' => $compraData['id_prov'],
                'id_emp' => $compraData['id_emp'],
            ]);

            $detallesCreados = [];

            // 3. Procesar cada detalle
            foreach ($request->input('detalles') as $detalle) {
                $material = Material::findOrFail($detalle['id_mat']);

                // Generar código de detalle
                $nextDetId = 1;
                do {
                    $cod_det_comp = 'DCOMP-' . $nextDetId;
                    $nextDetId++;
                } while (DetalleCompra::where('cod_det_comp', $cod_det_comp)->exists());

                $subtotal = $detalle['cantidad'] * $detalle['precio_unitario'];

                // Crear detalle de compra
                $detalleCompra = DetalleCompra::create([
                    'cod_det_comp' => $cod_det_comp,
                    'id_comp' => $compra->id_comp,
                    'id_mat' => $detalle['id_mat'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'subtotal' => $subtotal,
                ]);
                $detallesCreados[] = $detalleCompra;

                // Registrar movimiento de inventario (entrada de material)
                $stockAnterior = $material->stock_mat;
                $stockPosterior = $stockAnterior + $detalle['cantidad'];

                $nextMovId = 1;
                do {
                    $cod_mov = 'MOV-' . $nextMovId;
                    $nextMovId++;
                } while (MovimientoInventario::where('cod_mov', $cod_mov)->exists());

                MovimientoInventario::create([
                    'cod_mov' => $cod_mov,
                    'tipo_mov' => 'ENTRADA',
                    'cantidad' => $detalle['cantidad'],
                    'fecha_mov' => now(),
                    'id_mat' => $detalle['id_mat'],
                    'id_comp' => $compra->id_comp,
                    'id_emp' => $compraData['id_emp'],
                    'motivo' => "Compra {$cod_comp} - {$material->nom_mat}",
                    'stock_anterior' => $stockAnterior,
                    'stock_posterior' => $stockPosterior,
                ]);

                // Actualizar stock del material (suma)
                $material->stock_mat = $stockPosterior;
                $material->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Compra procesada correctamente',
                'data' => [
                    'compra' => $compra->load(['proveedor', 'empleado']),
                    'detalles' => $detallesCreados,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar compra: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Proceso de Cotización Completa
     * --------------------------------
     * 1. Crea la cotización (cabecera) con todos los nuevos campos
     * 2. Crea los detalles de cotización
     * 3. Opcionalmente crea el cálculo de costos
     */
    public function procesarCotizacionCompleta(Request $request)
    {
        $validated = $request->validate([
            'cotizacion.fec_cot' => 'required|date',
            'cotizacion.validez_dias' => 'nullable|integer|min:1',
            'cotizacion.descuento' => 'nullable|numeric|min:0',
            'cotizacion.notas' => 'nullable|string|max:1000',
            'cotizacion.id_cli' => 'required|exists:clientes,id_cli',
            'cotizacion.id_emp' => 'required|exists:empleados,id_emp',
            'cotizacion.presupuesto_cliente' => 'nullable|numeric|min:0',
            'cotizacion.plazo_esperado' => 'nullable|integer|min:1',
            'cotizacion.tiempo_entrega' => 'nullable|integer|min:1',
            'cotizacion.direccion_instalacion' => 'nullable|string|max:500',
            'cotizacion.tipo_proyecto' => 'nullable|string|max:50',
            'detalles' => 'required|array|min:1',
            // id_mue ahora es opcional para muebles personalizados
            'detalles.*.id_mue' => 'nullable|exists:muebles,id_mue',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'detalles.*.desc_personalizacion' => 'nullable|string|max:1000',
            // Nuevos campos para muebles personalizados
            'detalles.*.nombre_mueble' => 'nullable|string|max:200',
            'detalles.*.tipo_mueble' => 'nullable|string|max:100',
            'detalles.*.dimensiones' => 'nullable|string|max:100',
            'detalles.*.material_principal' => 'nullable|string|max:100',
            'detalles.*.color_acabado' => 'nullable|string|max:100',
            'detalles.*.img_referencia' => 'nullable|string|max:500',
            'detalles.*.herrajes' => 'nullable|string|max:500',
            'costos' => 'nullable|array',
            'costos.costo_materiales' => 'nullable|numeric|min:0',
            'costos.costo_mano_obra' => 'nullable|numeric|min:0',
            'costos.costos_indirectos' => 'nullable|numeric|min:0',
            'costos.margen_ganancia' => 'nullable|numeric|min:0|max:100',
        ], [
            'cotizacion.fec_cot.required' => 'La fecha de cotización es obligatoria.',
            'cotizacion.id_cli.required' => 'El cliente es obligatorio.',
            'cotizacion.id_cli.exists' => 'El cliente seleccionado no existe.',
            'cotizacion.id_emp.required' => 'El empleado es obligatorio.',
            'cotizacion.id_emp.exists' => 'El empleado seleccionado no existe.',
            'detalles.required' => 'Debe agregar al menos un mueble.',
            'detalles.min' => 'Debe agregar al menos un mueble.',
            'detalles.*.cantidad.required' => 'La cantidad es obligatoria.',
            'detalles.*.cantidad.min' => 'La cantidad debe ser al menos 1.',
            'detalles.*.precio_unitario.required' => 'El precio es obligatorio.',
        ]);

        DB::beginTransaction();
        try {
            $cotizacionData = $request->input('cotizacion');

            // Calcular total de cotización
            $totalCot = 0;
            foreach ($request->input('detalles') as $det) {
                $totalCot += $det['cantidad'] * $det['precio_unitario'];
            }
            $descuento = $cotizacionData['descuento'] ?? 0;
            $totalCot = $totalCot - $descuento;

            // 1. Generar código de cotización
            $nextId = 1;
            do {
                $cod_cot = 'COT-' . $nextId;
                $nextId++;
            } while (Cotizacion::where('cod_cot', $cod_cot)->exists());

            // 2. Crear la cotización con los nuevos campos
            $cotizacion = Cotizacion::create([
                'cod_cot' => $cod_cot,
                'fec_cot' => $cotizacionData['fec_cot'],
                'est_cot' => 'Pendiente',
                'validez_dias' => $cotizacionData['validez_dias'] ?? 15,
                'total_cot' => $totalCot,
                'descuento' => $descuento,
                'notas' => $cotizacionData['notas'] ?? null,
                'id_cli' => $cotizacionData['id_cli'],
                'id_emp' => $cotizacionData['id_emp'],
                'presupuesto_cliente' => $cotizacionData['presupuesto_cliente'] ?? null,
                'plazo_esperado' => $cotizacionData['plazo_esperado'] ?? null,
                'tiempo_entrega' => $cotizacionData['tiempo_entrega'] ?? null,
                'direccion_instalacion' => $cotizacionData['direccion_instalacion'] ?? null,
                'tipo_proyecto' => $cotizacionData['tipo_proyecto'] ?? null,
            ]);

            $detallesCreados = [];

            // 3. Procesar cada detalle (mueble de catálogo o personalizado)
            foreach ($request->input('detalles') as $detalle) {
                // Generar código de detalle
                $nextDetId = 1;
                do {
                    $cod_det_cot = 'DCOT-' . $nextDetId;
                    $nextDetId++;
                } while (DetalleCotizacion::where('cod_det_cot', $cod_det_cot)->exists());

                $subtotal = $detalle['cantidad'] * $detalle['precio_unitario'];

                // Crear detalle de cotización con campos personalizados
                $detalleCotizacion = DetalleCotizacion::create([
                    'cod_det_cot' => $cod_det_cot,
                    'id_cot' => $cotizacion->id_cot,
                    'id_mue' => $detalle['id_mue'] ?? null, // Opcional ahora
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'subtotal' => $subtotal,
                    'desc_personalizacion' => $detalle['desc_personalizacion'] ?? null,
                    // Campos para mueble personalizado
                    'nombre_mueble' => $detalle['nombre_mueble'] ?? null,
                    'tipo_mueble' => $detalle['tipo_mueble'] ?? null,
                    'dimensiones' => $detalle['dimensiones'] ?? null,
                    'material_principal' => $detalle['material_principal'] ?? null,
                    'color_acabado' => $detalle['color_acabado'] ?? null,
                    'img_referencia' => $detalle['img_referencia'] ?? null,
                    'herrajes' => $detalle['herrajes'] ?? null,
                ]);
                $detallesCreados[] = $detalleCotizacion;
            }

            // 4. Crear cálculo de costos (si se proporcionó)
            $costosCreados = null;
            if ($request->has('costos') && $request->input('costos')) {
                $costosData = $request->input('costos');
                
                $costoMat = $costosData['costo_materiales'] ?? 0;
                $costoMO = $costosData['costo_mano_obra'] ?? 0;
                $costosInd = $costosData['costos_indirectos'] ?? 0;
                $margen = $costosData['margen_ganancia'] ?? 0;

                $costoTotal = $costoMat + $costoMO + $costosInd;
                $precioSugerido = $costoTotal > 0 ? $costoTotal * (1 + ($margen / 100)) : $totalCot;

                $costosCreados = CostoCotizacion::create([
                    'id_cot' => $cotizacion->id_cot,
                    'costo_materiales' => $costoMat,
                    'costo_mano_obra' => $costoMO,
                    'costos_indirectos' => $costosInd,
                    'margen_ganancia' => $margen,
                    'costo_total' => $costoTotal,
                    'precio_sugerido' => $precioSugerido,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Cotización creada correctamente',
                'data' => [
                    'cotizacion' => $cotizacion->load(['cliente', 'empleado']),
                    'detalles' => $detallesCreados,
                    'costos' => $costosCreados,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear cotización: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Obtener resumen de un proceso para mostrar en dashboard
     */
    public function resumenProcesos()
    {
        return response()->json([
            'ventas_hoy' => Venta::whereDate('fec_ven', today())->count(),
            'cotizaciones_pendientes' => Cotizacion::where('est_cot', 'Pendiente')->count(),
            'devoluciones_mes' => Devolucion::whereMonth('fec_dev', now()->month)->count(),
            'compras_mes' => CompraMaterial::whereMonth('fec_comp', now()->month)->count(),
        ]);
    }

    /**
     * Proceso de Producción Completa
     * --------------------------------
     * 1. Crea la orden de producción
     * 2. Crea los detalles de producción (muebles a fabricar)
     * 3. Asigna automáticamente las etapas de producción
     */
    public function procesarProduccionCompleta(Request $request)
    {
        $validated = $request->validate([
            'produccion.fec_ini' => 'required|date',
            'produccion.fec_fin_estimada' => 'required|date|after_or_equal:produccion.fec_ini',
            'produccion.prioridad' => 'nullable|string|max:20',
            'produccion.id_ven' => 'nullable|exists:ventas,id_ven',
            'produccion.id_cot' => 'nullable|exists:cotizaciones,id_cot',
            'produccion.id_emp' => 'required|exists:empleados,id_emp',
            'produccion.notas' => 'nullable|string|max:1000',
            'detalles' => 'required|array|min:1',
            'detalles.*.id_mue' => 'nullable|exists:muebles,id_mue',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.nombre_mueble' => 'nullable|string|max:255',
            'etapas' => 'required|array|min:1',
            'etapas.*' => 'exists:etapas_produccion,id_eta',
        ], [
            'produccion.fec_ini.required' => 'La fecha de inicio es obligatoria.',
            'produccion.fec_fin_estimada.required' => 'La fecha estimada de fin es obligatoria.',
            'produccion.fec_fin_estimada.after_or_equal' => 'La fecha estimada debe ser igual o posterior a la fecha de inicio.',
            'produccion.id_emp.required' => 'El empleado responsable es obligatorio.',
            'produccion.id_emp.exists' => 'El empleado seleccionado no existe.',
            'detalles.required' => 'Debe agregar al menos un mueble a producir.',
            'detalles.*.id_mue.exists' => 'El mueble seleccionado no existe.',
            'detalles.*.cantidad.required' => 'La cantidad es obligatoria.',
            'detalles.*.cantidad.min' => 'La cantidad debe ser al menos 1.',
            'etapas.required' => 'Debe seleccionar al menos una etapa de producción.',
            'etapas.*.exists' => 'La etapa seleccionada no existe.',
        ]);

        DB::beginTransaction();
        try {
            $produccionData = $request->input('produccion');

            // 1. Generar código de producción
            $nextId = 1;
            do {
                $cod_pro = 'PRO-' . $nextId;
                $nextId++;
            } while (Produccion::where('cod_pro', $cod_pro)->exists());

            // 2. Crear la producción
            $produccion = Produccion::create([
                'cod_pro' => $cod_pro,
                'fec_ini' => $produccionData['fec_ini'],
                'fec_fin_estimada' => $produccionData['fec_fin_estimada'],
                'est_pro' => 'Pendiente',
                'prioridad' => $produccionData['prioridad'] ?? '5',
                'id_ven' => $produccionData['id_ven'] ?? null,
                'id_cot' => $produccionData['id_cot'] ?? null,
                'id_emp' => $produccionData['id_emp'],
                'notas' => $produccionData['notas'] ?? null,
            ]);

            $detallesCreados = [];

            // 3. Procesar cada detalle (muebles a producir)
            foreach ($request->input('detalles') as $detalle) {
                // Buscar mueble solo si id_mue existe
                $mueble = null;
                if (!empty($detalle['id_mue'])) {
                    $mueble = Mueble::find($detalle['id_mue']);
                }

                // Generar código de detalle
                $nextDetId = 1;
                do {
                    $cod_det_pro = 'DPRO-' . $nextDetId;
                    $nextDetId++;
                } while (DetalleProduccion::where('cod_det_pro', $cod_det_pro)->exists());

                // Crear detalle de producción
                $detalleProduccion = DetalleProduccion::create([
                    'cod_det_pro' => $cod_det_pro,
                    'id_pro' => $produccion->id_pro,
                    'id_mue' => $mueble ? $mueble->id_mue : null,
                    'cantidad' => $detalle['cantidad'],
                    'est_det_pro' => 'Pendiente',
                ]);
                $detallesCreados[] = $detalleProduccion;
            }

            // 4. Crear etapas de producción seleccionadas
            $etapasCreadas = [];
            
            // Obtener el máximo número de código existente (compatible con PostgreSQL)
            $maxCodNum = ProduccionEtapa::whereRaw("cod_pro_eta LIKE 'PET-%' AND LENGTH(cod_pro_eta) > 4")
                ->selectRaw("MAX(CAST(SUBSTRING(cod_pro_eta FROM 5) AS INTEGER)) as max_num")
                ->value('max_num') ?? 0;
            $nextEtaId = $maxCodNum + 1;
            
            // Fecha de inicio para calcular secuencialmente
            $fechaInicioEtapa = new \DateTime($produccionData['fec_ini']);
            
            // Obtener etapas ordenadas por secuencia para calcular fechas correctamente
            $etapasOrdenadas = EtapaProduccion::whereIn('id_eta', $request->input('etapas'))
                ->orderBy('orden_secuencia', 'asc')
                ->get();
            
            foreach ($etapasOrdenadas as $etapa) {
                $cod_pro_eta = 'PET-' . $nextEtaId;
                $nextEtaId++;
                
                // Calcular fecha fin basada en duración estimada (en días)
                $duracionDias = $etapa->duracion_estimada ?? 1; // Default 1 día si no tiene duración
                $fechaFinEtapa = clone $fechaInicioEtapa;
                $fechaFinEtapa->modify("+{$duracionDias} days");

                $produccionEtapa = ProduccionEtapa::create([
                    'cod_pro_eta' => $cod_pro_eta,
                    'id_pro' => $produccion->id_pro,
                    'id_eta' => $etapa->id_eta,
                    'id_emp' => $produccion->id_emp,
                    'est_eta' => 'Pendiente',
                    'fec_ini' => $fechaInicioEtapa->format('Y-m-d'),
                    'fec_fin' => $fechaFinEtapa->format('Y-m-d'),
                ]);
                $etapasCreadas[] = $produccionEtapa;
                
                // La siguiente etapa empieza cuando termina esta
                $fechaInicioEtapa = clone $fechaFinEtapa;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Orden de producción creada correctamente.',
                'data' => [
                    'produccion' => $produccion->load(['empleado', 'venta', 'cotizacion']),
                    'detalles' => $detallesCreados,
                    'etapas' => count($etapasCreadas),
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear producción: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Aprobar una cotización pendiente
     * --------------------------------
     * 1. Actualiza los precios de los detalles
     * 2. Aplica descuento
     * 3. Recalcula el total
     * 4. Cambia el estado a "Aprobado"
     */
    public function aprobarCotizacion($id_cot, Request $request)
    {
        $validated = $request->validate([
            'detalles' => 'nullable|array',
            'detalles.*.id_det_cot' => 'required|exists:detalles_cotizacion,id_det_cot',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'descuento' => 'nullable|numeric|min:0',
            'notas_admin' => 'nullable|string|max:1000',
        ], [
            'detalles.*.id_det_cot.required' => 'ID de detalle es requerido.',
            'detalles.*.id_det_cot.exists' => 'Detalle no encontrado.',
            'detalles.*.precio_unitario.required' => 'Precio es obligatorio.',
        ]);

        DB::beginTransaction();
        try {
            $cotizacion = Cotizacion::with('detalles')->findOrFail($id_cot);

            if (strtolower($cotizacion->est_cot) !== 'pendiente') {
                throw new \Exception('Solo se pueden aprobar cotizaciones pendientes.');
            }

            // Update detail prices if provided
            if ($request->has('detalles')) {
                foreach ($request->input('detalles') as $detData) {
                    $detalle = DetalleCotizacion::find($detData['id_det_cot']);
                    if ($detalle && $detalle->id_cot == $cotizacion->id_cot) {
                        $detalle->precio_unitario = $detData['precio_unitario'];
                        $detalle->subtotal = $detData['precio_unitario'] * $detalle->cantidad;
                        $detalle->save();
                    }
                }
            }

            // Recalculate total
            $total = DetalleCotizacion::where('id_cot', $cotizacion->id_cot)->sum('subtotal');
            $descuento = $request->input('descuento', $cotizacion->descuento ?? 0);
            
            // Update cotizacion
            $cotizacion->update([
                'est_cot' => 'Aprobado',
                'total_cot' => $total - $descuento,
                'descuento' => $descuento,
            ]);

            // Add admin note if provided
            if ($request->has('notas_admin') && $request->input('notas_admin')) {
                $cotizacion->notas = ($cotizacion->notas ? $cotizacion->notas . "\n\n" : '') 
                    . "[Admin] " . $request->input('notas_admin');
                $cotizacion->save();
            }

            DB::commit();

            // Refresh and load relationships carefully
            $cotizacion->refresh();
            $cotizacion->load(['detalles', 'cliente']);

            return response()->json([
                'success' => true,
                'message' => 'Cotización aprobada correctamente',
                'cotizacion' => $cotizacion,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al aprobar cotización: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Rechazar una cotización pendiente
     */
    public function rechazarCotizacion($id_cot, Request $request)
    {
        $validated = $request->validate([
            'motivo' => 'nullable|string|max:1000',
        ]);

        $cotizacion = Cotizacion::findOrFail($id_cot);

        if (strtolower($cotizacion->est_cot) !== 'pendiente') {
            return response()->json([
                'success' => false,
                'message' => 'Solo se pueden rechazar cotizaciones pendientes.',
            ], 400);
        }

        $cotizacion->update(['est_cot' => 'Rechazado']);

        if ($request->input('motivo')) {
            $cotizacion->notas = ($cotizacion->notas ? $cotizacion->notas . "\n\n" : '') 
                . "[Rechazado] " . $request->input('motivo');
            $cotizacion->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Cotización rechazada',
            'cotizacion' => $cotizacion,
        ]);
    }
}

