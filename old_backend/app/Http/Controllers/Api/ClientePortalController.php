<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Cotizacion;
use App\Models\Venta;
use App\Models\DetalleCotizacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ClientePortalController extends Controller
{
    /**
     * Get client data for the authenticated user
     * GET /api/cliente/me
     */
    public function getClienteActual()
    {
        $usuario = Auth::user();
        
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $cliente = Cliente::where('id_usu', $usuario->id_usu)->first();

        if (!$cliente) {
            return response()->json(['message' => 'No se encontró perfil de cliente asociado'], 404);
        }

        return response()->json([
            'id_cli' => $cliente->id_cli,
            'nom_cli' => $cliente->nom_cli,
            'ap_pat_cli' => $cliente->ap_pat_cli,
            'ap_mat_cli' => $cliente->ap_mat_cli,
            'cel_cli' => $cliente->cel_cli,
            'dir_cli' => $cliente->dir_cli,
            'email_usu' => $usuario->email_usu,
            'img_cli' => $cliente->img_cli,
            'cod_cli' => $cliente->cod_cli,
        ]);
    }

    /**
     * Get client data by user ID (public endpoint)
     * GET /api/cliente/por-usuario/{id_usu}
     */
    public function getClienteByUsuario($id_usu)
    {
        $cliente = Cliente::where('id_usu', $id_usu)->first();

        if (!$cliente) {
            return response()->json(['message' => 'No se encontró perfil de cliente asociado'], 404);
        }

        return response()->json([
            'id_cli' => $cliente->id_cli,
            'nom_cli' => $cliente->nom_cli,
            'ap_pat_cli' => $cliente->ap_pat_cli,
            'ap_mat_cli' => $cliente->ap_mat_cli,
            'cel_cli' => $cliente->cel_cli,
            'dir_cli' => $cliente->dir_cli,
            'img_cli' => $cliente->img_cli,
            'cod_cli' => $cliente->cod_cli,
        ]);
    }

    /**
     * Get client's quotations
     * GET /api/cliente/cotizaciones
     */
    public function getMisCotizaciones(Request $request)
    {
        $usuario = Auth::user();
        
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $cliente = Cliente::where('id_usu', $usuario->id_usu)->first();

        if (!$cliente) {
            return response()->json(['message' => 'No se encontró perfil de cliente asociado'], 404);
        }

        $cotizaciones = Cotizacion::with(['detalles.mueble', 'empleado', 'disenos'])
            ->where('id_cli', $cliente->id_cli)
            ->orderBy('fec_cot', 'desc')
            ->paginate($request->input('per_page', 10));

        return response()->json($cotizaciones);
    }

    /**
     * Get client's orders (ventas)
     * GET /api/cliente/pedidos
     */
    public function getMisPedidos(Request $request)
    {
        $usuario = Auth::user();
        
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $cliente = Cliente::where('id_usu', $usuario->id_usu)->first();

        if (!$cliente) {
            return response()->json(['message' => 'No se encontró perfil de cliente asociado'], 404);
        }

        $ventas = Venta::with(['detalles.mueble', 'empleado'])
            ->where('id_cli', $cliente->id_cli)
            ->orderBy('fec_ven', 'desc')
            ->paginate($request->input('per_page', 10));

        return response()->json($ventas);
    }

    /**
     * Request a new quotation
     * POST /api/cliente/cotizaciones/solicitar
     */
    public function solicitarCotizacion(Request $request)
    {
        $usuario = Auth::user();
        
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $cliente = Cliente::where('id_usu', $usuario->id_usu)->first();

        if (!$cliente) {
            return response()->json(['message' => 'No se encontró perfil de cliente asociado'], 404);
        }

        $validated = $request->validate([
            'tipo_proyecto' => 'required|string|max:50',
            'presupuesto_cliente' => 'nullable|numeric|min:0',
            'plazo_esperado' => 'nullable|integer|min:1',
            'direccion_instalacion' => 'nullable|string|max:500',
            'notas' => 'nullable|string|max:1000',
            'productos' => 'required|array|min:1',
            'productos.*.id_mue' => 'nullable|integer', // Now optional for custom items
            'productos.*.cantidad' => 'required|integer|min:1',
            'productos.*.personalizacion' => 'nullable|string|max:1000',
        ], [
            'tipo_proyecto.required' => 'El tipo de proyecto es obligatorio.',
            'productos.required' => 'Debe incluir al menos un producto.',
            'productos.min' => 'Debe incluir al menos un producto.',
            'productos.*.cantidad.required' => 'La cantidad es obligatoria.',
            'productos.*.cantidad.min' => 'La cantidad debe ser al menos 1.',
        ]);

        // Create the quotation
        $nextId = 1;
        do {
            $cod_cot = 'COT-' . $nextId;
            $nextId++;
        } while (Cotizacion::where('cod_cot', $cod_cot)->exists());

        $cotizacion = Cotizacion::create([
            'cod_cot' => $cod_cot,
            'fec_cot' => now()->toDateString(),
            'est_cot' => 'Pendiente',
            'validez_dias' => 15,
            'total_cot' => 0, // Will be calculated by admin
            'descuento' => 0,
            'id_cli' => $cliente->id_cli,
            'id_emp' => 1, // Default employee, admin will assign
            'notas' => $validated['notas'] ?? null,
            'tipo_proyecto' => $validated['tipo_proyecto'],
            'presupuesto_cliente' => $validated['presupuesto_cliente'] ?? null,
            'plazo_esperado' => $validated['plazo_esperado'] ?? null,
            'direccion_instalacion' => $validated['direccion_instalacion'] ?? null,
        ]);

        // Add products to the quotation
        foreach ($validated['productos'] as $producto) {
            $id_mue = $producto['id_mue'] ?? null;
            $mueble = $id_mue && $id_mue > 0 ? \App\Models\Mueble::find($id_mue) : null;
            
            // Extract custom product name from personalization if present
            $personalizacion = $producto['personalizacion'] ?? '';
            $nombreMueble = $mueble ? $mueble->nom_mue : 'Mueble Personalizado';
            if (str_contains($personalizacion, '[PERSONALIZADO]')) {
                preg_match('/\[PERSONALIZADO\]\s*([^|]+)/', $personalizacion, $matches);
                if (!empty($matches[1])) {
                    $nombreMueble = trim($matches[1]);
                }
            }
            
            DetalleCotizacion::create([
                'id_cot' => $cotizacion->id_cot,
                'id_mue' => $mueble ? $mueble->id_mue : null,
                'cantidad' => $producto['cantidad'],
                'precio_unitario' => $mueble->precio_venta ?? 0,
                'subtotal' => ($mueble->precio_venta ?? 0) * $producto['cantidad'],
                'desc_personalizacion' => $personalizacion,
                'nombre_mueble' => $nombreMueble,
            ]);
        }

        // Update total
        $total = DetalleCotizacion::where('id_cot', $cotizacion->id_cot)->sum('subtotal');
        $cotizacion->update(['total_cot' => $total]);

        return response()->json([
            'message' => 'Solicitud de cotización enviada correctamente',
            'cotizacion' => Cotizacion::with('detalles.mueble')->find($cotizacion->id_cot)
        ], 201);
    }

    /**
     * Cancel a pending quotation
     * POST /api/cliente/cotizaciones/{id}/cancelar
     */
    public function cancelarCotizacion($id)
    {
        $usuario = Auth::user();
        
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $cliente = Cliente::where('id_usu', $usuario->id_usu)->first();

        if (!$cliente) {
            return response()->json(['message' => 'No se encontró perfil de cliente asociado'], 404);
        }

        $cotizacion = Cotizacion::where('id_cli', $cliente->id_cli)
            ->where('id_cot', $id)
            ->first();

        if (!$cotizacion) {
            return response()->json(['message' => 'Cotización no encontrada'], 404);
        }

        if (strtolower($cotizacion->est_cot) !== 'pendiente') {
            return response()->json(['message' => 'Solo se pueden cancelar cotizaciones pendientes'], 400);
        }

        $cotizacion->update(['est_cot' => 'Cancelado']);

        return response()->json([
            'message' => 'Cotización cancelada correctamente',
            'cotizacion' => $cotizacion
        ]);
    }

    /**
     * Get single quotation details for client
     * GET /api/cliente/cotizaciones/{id}
     */
    public function verCotizacion($id)
    {
        $usuario = Auth::user();
        
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $cliente = Cliente::where('id_usu', $usuario->id_usu)->first();

        if (!$cliente) {
            return response()->json(['message' => 'No se encontró perfil de cliente asociado'], 404);
        }

        $cotizacion = Cotizacion::with(['detalles.mueble', 'empleado', 'disenos', 'costos'])
            ->where('id_cot', $id)
            ->where('id_cli', $cliente->id_cli) // Security: only own quotations
            ->first();

        if (!$cotizacion) {
            return response()->json(['message' => 'Cotización no encontrada'], 404);
        }

        return response()->json($cotizacion);
    }

    /**
     * Get single order details for client
     * GET /api/cliente/pedidos/{id}
     */
    public function verPedido($id)
    {
        $usuario = Auth::user();
        
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $cliente = Cliente::where('id_usu', $usuario->id_usu)->first();

        if (!$cliente) {
            return response()->json(['message' => 'No se encontró perfil de cliente asociado'], 404);
        }

        $venta = Venta::with(['detalles.mueble', 'empleado'])
            ->where('id_ven', $id)
            ->where('id_cli', $cliente->id_cli) // Security: only own orders
            ->first();

        if (!$venta) {
            return response()->json(['message' => 'Pedido no encontrado'], 404);
        }

        return response()->json($venta);
    }

    /**
     * Get client's productions (furniture being manufactured)
     * GET /api/cliente/producciones
     */
    public function getMisProducciones(Request $request)
    {
        $usuario = Auth::user();
        
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $cliente = Cliente::where('id_usu', $usuario->id_usu)->first();

        if (!$cliente) {
            return response()->json(['message' => 'No se encontró perfil de cliente asociado'], 404);
        }

        // Get productions linked to client's quotations or sales
        $producciones = \App\Models\Produccion::with([
                'cotizacion.detalles.mueble',
                'venta.detalles.mueble',
                'empleado',
                'produccionEtapas.etapa',
                'produccionEtapas.evidencias'
            ])
            ->where(function($query) use ($cliente) {
                $query->whereHas('cotizacion', function($q) use ($cliente) {
                    $q->where('id_cli', $cliente->id_cli);
                })
                ->orWhereHas('venta', function($q) use ($cliente) {
                    $q->where('id_cli', $cliente->id_cli);
                });
            })
            ->orderBy('fec_ini', 'desc')
            ->paginate($request->input('per_page', 10));

        // Add progress calculation
        $producciones->getCollection()->transform(function($produccion) {
            $etapas = $produccion->produccionEtapas;
            $total = $etapas->count();
            $completadas = $etapas->where('est_eta', 'Completado')->count();
            
            $produccion->etapas_total = $total;
            $produccion->etapas_completadas = $completadas;
            $produccion->progreso = $total > 0 ? round(($completadas / $total) * 100) : 0;
            
            return $produccion;
        });

        return response()->json($producciones);
    }

    /**
     * Get single production details for client
     * GET /api/cliente/producciones/{id}
     */
    public function verProduccion($id)
    {
        $usuario = Auth::user();
        
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $cliente = Cliente::where('id_usu', $usuario->id_usu)->first();

        if (!$cliente) {
            return response()->json(['message' => 'No se encontró perfil de cliente asociado'], 404);
        }

        $produccion = \App\Models\Produccion::with([
                'cotizacion.detalles.mueble',
                'venta.detalles.mueble',
                'empleado',
                'produccionEtapas.etapa',
                'produccionEtapas.empleado',
                'produccionEtapas.evidencias'
            ])
            ->where('id_pro', $id)
            ->where(function($query) use ($cliente) {
                $query->whereHas('cotizacion', function($q) use ($cliente) {
                    $q->where('id_cli', $cliente->id_cli);
                })
                ->orWhereHas('venta', function($q) use ($cliente) {
                    $q->where('id_cli', $cliente->id_cli);
                });
            })
            ->first();

        if (!$produccion) {
            return response()->json(['message' => 'Producción no encontrada'], 404);
        }

        // Add progress calculation
        $etapas = $produccion->produccionEtapas;
        $total = $etapas->count();
        $completadas = $etapas->where('est_eta', 'Completado')->count();
        
        $produccion->etapas_total = $total;
        $produccion->etapas_completadas = $completadas;
        $produccion->progreso = $total > 0 ? round(($completadas / $total) * 100) : 0;

        return response()->json($produccion);
    }

    /**
     * Compra Directa - Client purchases items from cart
     * POST /api/cliente/compra-directa
     */
    public function compraDirecta(Request $request)
    {
        $validated = $request->validate([
            'id_cli' => 'required|exists:clientes,id_cli',
            'metodo_pago' => 'required|string|in:efectivo,transferencia,qr',
            'direccion_entrega' => 'required|string|min:5',
            'detalles' => 'required|array|min:1',
            'detalles.*.id_mue' => 'required|exists:muebles,id_mue',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
        ], [
            'id_cli.required' => 'Cliente es requerido.',
            'metodo_pago.required' => 'Método de pago es requerido.',
            'direccion_entrega.required' => 'Dirección de entrega es requerida.',
            'detalles.required' => 'Debe incluir al menos un producto.',
        ]);

        DB::beginTransaction();
        try {
            $cliente = \App\Models\Cliente::findOrFail($validated['id_cli']);
            
            // Verify stock for all items
            foreach ($validated['detalles'] as $detalle) {
                $mueble = \App\Models\Mueble::findOrFail($detalle['id_mue']);
                if ($mueble->stock < $detalle['cantidad']) {
                    throw new \Exception("Stock insuficiente para {$mueble->nom_mue}. Disponible: {$mueble->stock}");
                }
            }

            // Calculate total
            $total = 0;
            foreach ($validated['detalles'] as $detalle) {
                $total += $detalle['precio_unitario'] * $detalle['cantidad'];
            }

            // Generate code
            $lastVenta = Venta::orderBy('id_ven', 'desc')->first();
            $nextId = $lastVenta ? $lastVenta->id_ven + 1 : 1;
            $codVen = 'VEN-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

            // Create Venta
            $venta = Venta::create([
                'cod_ven' => $codVen,
                'fec_ven' => now()->setTimezone('America/La_Paz'),
                'total_ven' => $total,
                'est_ven' => 'Pendiente',
                'descripcion_ven' => 'Compra directa desde portal cliente. Entrega: ' . $validated['direccion_entrega'],
                'id_cli' => $cliente->id_cli,
                'id_emp' => null, // No employee for client purchases
            ]);

            // Create DetalleVenta
            foreach ($validated['detalles'] as $detalle) {
                $subtotal = $detalle['precio_unitario'] * $detalle['cantidad'];
                
                \App\Models\DetalleVenta::create([
                    'cod_det_ven' => 'DV-' . $venta->id_ven . '-' . $detalle['id_mue'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'descuento' => 0,
                    'subtotal' => $subtotal,
                    'id_ven' => $venta->id_ven,
                    'id_mue' => $detalle['id_mue'],
                ]);

                // Decrease stock
                $mueble = \App\Models\Mueble::find($detalle['id_mue']);
                $mueble->stock -= $detalle['cantidad'];
                $mueble->save();
            }

            // Create Pago
            $metodoPago = match($validated['metodo_pago']) {
                'efectivo' => 'Efectivo',
                'transferencia' => 'Transferencia',
                'qr' => 'QR',
                default => 'Efectivo'
            };

            \App\Models\Pago::create([
                'cod_pag' => 'PAG-' . str_pad($venta->id_ven, 4, '0', STR_PAD_LEFT),
                'fec_pag' => now()->setTimezone('America/La_Paz'),
                'monto' => $total,
                'metodo_pag' => $metodoPago,
                'referencia_pag' => 'Compra portal cliente - ' . $validated['direccion_entrega'],
                'id_ven' => $venta->id_ven,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Compra registrada exitosamente',
                'id_ven' => $venta->id_ven,
                'cod_ven' => $venta->cod_ven,
                'total' => $total,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get client's favorites
     * GET /api/cliente/favoritos
     */
    public function getFavoritos(Request $request)
    {
        $userId = $request->header('X-USER-ID');
        
        if (!$userId) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $cliente = Cliente::where('id_usu', $userId)->first();

        if (!$cliente) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }

        $favoritos = \App\Models\Favorito::where('id_cli', $cliente->id_cli)
            ->with(['mueble.categoria'])
            ->get()
            ->map(function ($fav) {
                return [
                    'id_fav' => $fav->id_fav,
                    'id_mue' => $fav->id_mue,
                    'mueble' => $fav->mueble ? [
                        'id_mue' => $fav->mueble->id_mue,
                        'nom_mue' => $fav->mueble->nom_mue,
                        'cod_mue' => $fav->mueble->cod_mue,
                        'desc_mue' => $fav->mueble->desc_mue,
                        'img_mue' => $fav->mueble->img_mue,
                        'precio_venta' => $fav->mueble->precio_venta,
                        'stock' => $fav->mueble->stock,
                        'modelo_3d' => $fav->mueble->modelo_3d,
                        'categoria' => $fav->mueble->categoria?->nom_cat,
                    ] : null,
                    'created_at' => $fav->created_at,
                ];
            });

        return response()->json($favoritos);
    }

    /**
     * Toggle favorite (add or remove)
     * POST /api/cliente/favoritos/toggle
     */
    public function toggleFavorito(Request $request)
    {
        $userId = $request->header('X-USER-ID');
        
        if (!$userId) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        // Find cliente by id_usu
        $cliente = Cliente::where('id_usu', $userId)->first();
        
        if (!$cliente) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }

        $validated = $request->validate([
            'id_mue' => 'required|exists:muebles,id_mue',
        ]);

        $existingFav = \App\Models\Favorito::where('id_cli', $cliente->id_cli)
            ->where('id_mue', $validated['id_mue'])
            ->first();

        if ($existingFav) {
            $existingFav->delete();
            return response()->json([
                'success' => true,
                'action' => 'removed',
                'message' => 'Eliminado de favoritos',
            ]);
        } else {
            $fav = \App\Models\Favorito::create([
                'id_cli' => $cliente->id_cli,
                'id_mue' => $validated['id_mue'],
            ]);
            return response()->json([
                'success' => true,
                'action' => 'added',
                'message' => 'Agregado a favoritos',
                'id_fav' => $fav->id_fav,
            ]);
        }
    }

    /**
     * Get list of favorite IDs for a client
     * GET /api/cliente/favoritos/ids
     */
    public function getFavoritoIds(Request $request)
    {
        $userId = $request->header('X-USER-ID');
        
        if (!$userId) {
            return response()->json([]);
        }

        // Find cliente by id_usu
        $cliente = Cliente::where('id_usu', $userId)->first();
        
        if (!$cliente) {
            return response()->json([]);
        }

        $ids = \App\Models\Favorito::where('id_cli', $cliente->id_cli)
            ->pluck('id_mue')
            ->toArray();

        return response()->json($ids);
    }
}

