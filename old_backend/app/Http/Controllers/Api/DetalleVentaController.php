<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\DetalleVenta;
use App\Models\Venta;
use App\Helpers\StringHelper;
use App\Services\InventarioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Illuminate\Support\Str;

class DetalleVentaController extends Controller
{
    protected $inventarioService;

    public function __construct(InventarioService $inventarioService)
    {
        $this->inventarioService = $inventarioService;
    }

    public function index(Request $request)
    {
        return QueryBuilder::for(DetalleVenta::class)
            ->with(['mueble', 'venta'])
            ->leftJoin('muebles', 'detalles_venta.id_mue', '=', 'muebles.id_mue')
            ->leftJoin('ventas', 'detalles_venta.id_ven', '=', 'ventas.id_ven')
            ->select('detalles_venta.*')
            ->allowedFilters([
                AllowedFilter::callback('cod_det_ven', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(cod_det_ven), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),
                'id_ven',
                'id_mue',
                AllowedFilter::callback('cantidad_min', function ($query, $value) {
                    $query->where('cantidad', '>=', $value);
                }),
                AllowedFilter::callback('cantidad_max', function ($query, $value) {
                    $query->where('cantidad', '<=', $value);
                }),
                AllowedFilter::callback('precio_unitario_min', function ($query, $value) {
                    $query->where('precio_unitario', '>=', $value);
                }),
                AllowedFilter::callback('precio_unitario_max', function ($query, $value) {
                    $query->where('precio_unitario', '<=', $value);
                }),
                AllowedFilter::callback('descuento_min', function ($query, $value) {
                    $query->where('descuento_item', '>=', $value);

                }),
                AllowedFilter::callback('descuento_max', function ($query, $value) {
                    $query->where('descuento_item', '<=', $value);
                }),
                AllowedFilter::callback('subtotal_min', function ($query, $value) {
                    $query->where('subtotal', '>=', $value);
                }),
                AllowedFilter::callback('subtotal_max', function ($query, $value) {
                    $query->where('subtotal', '<=', $value);
                }),
                AllowedFilter::callback('fec_ven_exacta', function ($query, $value) {
                    $query->whereRaw("DATE(ventas.fec_ven) = ?", [$value]);
                }),
                AllowedFilter::callback('fec_ven_desde', function ($query, $value) {
                    $query->whereRaw("DATE(ventas.fec_ven) >= ?", [$value]);
                }),
                AllowedFilter::callback('fec_ven_hasta', function ($query, $value) {
                    $query->whereRaw("DATE(ventas.fec_ven) <= ?", [$value]);
                }),
                AllowedFilter::callback('est_ven', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(ventas.est_ven), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(cod_det_ven), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),
                AllowedFilter::callback('nom_mue', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereHas('mueble', function ($q) use ($normalizedValue) {
                        $q->whereRaw(
                            "translate(lower(nom_mue), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                            ["%{$normalizedValue}%"]
                        );
                    });
                }),
            ])
            ->allowedSorts(['cod_det_ven', 'cantidad', 'precio_unitario', 'subtotal', 'descuento_item', 'muebles.nom_mue', 'ventas.fec_ven', 'ventas.est_ven'])
            ->paginate($request->input('per_page', 20));

    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'cantidad' => 'required|integer|min:1',
            'precio_unitario' => 'required|numeric|min:0.01',
            'subtotal' => 'required|numeric|min:0',
            'descuento_item' => 'nullable|numeric|min:0',
            'id_ven' => 'required|exists:ventas,id_ven',
            'id_mue' => 'required|exists:muebles,id_mue',
        ], [
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.integer' => 'La cantidad debe ser un número entero.',
            'cantidad.min' => 'La cantidad debe ser al menos 1.',
            'precio_unitario.required' => 'El precio unitario es obligatorio.',
            'precio_unitario.numeric' => 'El precio unitario debe ser un número.',
            'precio_unitario.min' => 'El precio unitario debe ser mayor a 0.',
            'subtotal.required' => 'El subtotal es obligatorio.',
            'subtotal.numeric' => 'El subtotal debe ser un número.',
            'subtotal.min' => 'El subtotal no puede ser negativo.',
            'descuento_item.numeric' => 'El descuento debe ser un número.',
            'descuento_item.min' => 'El descuento no puede ser negativo.',
            'id_ven.required' => 'Debe seleccionar una venta.',
            'id_ven.exists' => 'La venta seleccionada no existe.',
            'id_mue.required' => 'Debe seleccionar un mueble.',
            'id_mue.exists' => 'El mueble seleccionado no existe.',
        ]);


        // Validar stock suficiente
        if (!$this->inventarioService->verificarStockMueble($validated['id_mue'], $validated['cantidad'])) {
            return response()->json([
                'message' => 'Stock insuficiente para este mueble',
                'error' => 'stock_insuficiente'
            ], 422);
        }

        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_det_ven = 'DVE-' . $nextId;
            $nextId++;
        } while (DetalleVenta::where('cod_det_ven', $cod_det_ven)->exists());
        $validated['cod_det_ven'] = $cod_det_ven;

        // Usar transacción para garantizar consistencia
        return DB::transaction(function () use ($validated) {
            // Crear el detalle de venta
            $detalleVenta = DetalleVenta::create($validated);

            // Obtener el empleado de la venta para registrar el movimiento
            $venta = Venta::find($validated['id_ven']);
            
            // Descontar stock del mueble y registrar movimiento
            $this->inventarioService->descontarStockMueble(
                idMueble: $validated['id_mue'],
                cantidad: $validated['cantidad'],
                idEmpleado: $venta->id_emp,
                idVenta: $validated['id_ven'],
                motivo: 'Venta - Detalle ' . $validated['cod_det_ven']
            );

            return $detalleVenta->load(['mueble', 'venta']);
        });
    }

    public function show($id)
    {
        return DetalleVenta::with(['mueble', 'venta'])->findOrFail($id);
    }
    

    public function update(Request $request, $id)
    {
        $detalleVenta = DetalleVenta::findOrFail($id);

        $validated = $request->validate([
            'cantidad' => 'required|integer|min:1',
            'precio_unitario' => 'required|numeric|min:0.01',
            'subtotal' => 'required|numeric|min:0',
            'descuento_item' => 'nullable|numeric|min:0',
            'id_ven' => 'required|exists:ventas,id_ven',
            'id_mue' => 'required|exists:muebles,id_mue',
        ], [
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.integer' => 'La cantidad debe ser un número entero.',
            'cantidad.min' => 'La cantidad debe ser al menos 1.',
            'precio_unitario.required' => 'El precio unitario es obligatorio.',
            'precio_unitario.numeric' => 'El precio unitario debe ser un número.',
            'precio_unitario.min' => 'El precio unitario debe ser mayor a 0.',
            'subtotal.required' => 'El subtotal es obligatorio.',
            'subtotal.numeric' => 'El subtotal debe ser un número.',
            'subtotal.min' => 'El subtotal no puede ser negativo.',
            'descuento_item.numeric' => 'El descuento debe ser un número.',
            'descuento_item.min' => 'El descuento no puede ser negativo.',
            'id_ven.required' => 'Debe seleccionar una venta.',
            'id_ven.exists' => 'La venta seleccionada no existe.',
            'id_mue.required' => 'Debe seleccionar un mueble.',
            'id_mue.exists' => 'El mueble seleccionado no existe.',
        ]);

        $detalleVenta->update($validated);

        return $detalleVenta->load(['mueble', 'venta']);
    }

    

    public function destroy($id)
    {
        $detalleVenta = DetalleVenta::findOrFail($id);
        
        return DB::transaction(function () use ($detalleVenta) {
            // Obtener la venta para el empleado
            $venta = Venta::find($detalleVenta->id_ven);
            
            // Restaurar el stock del mueble (entrada por reversión)
            $this->inventarioService->incrementarStockMueble(
                idMueble: $detalleVenta->id_mue,
                cantidad: $detalleVenta->cantidad,
                idEmpleado: $venta->id_emp,
                motivo: 'Reversión - Eliminación de detalle de venta ' . $detalleVenta->cod_det_ven
            );

            $detalleVenta->delete();

            return response()->json(['message' => 'DetalleVenta eliminado y stock restaurado']);
        });
    }

    public function reporteDetallesVenta(Request $request)
    {
        // Obtiene los parámetros de filtrado
        $idVenta = $request->input('id_ven');
        $idMueble = $request->input('id_mue');

        // Construye la consulta base
        $query = DetalleVenta::with(['mueble', 'venta']);

        // Aplica filtro por ID de venta si se proporciona
        if (!is_null($idVenta)) {
            $query->where('id_ven', $idVenta);
        }

        // Aplica filtro por ID de mueble si se proporciona
        if (!is_null($idMueble)) {
            $query->where('id_mue', $idMueble);
        }

        // Ejecuta la consulta y obtiene los resultados
        $detallesVenta = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'detallesVenta.reporte')
        $pdf = Pdf::loadView('detallesVenta.reporte', compact('detallesVenta'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_detalles_venta.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'detalles_ventas';
        $schema = DB::select("SELECT column_name, data_type, character_maximum_length, is_nullable FROM information_schema.columns WHERE table_name = '$table' ORDER BY ordinal_position");

        $createTableSQL = "DROP TABLE IF EXISTS \"$table\";\nCREATE TABLE \"$table\" (\n";
        $columns = [];

        foreach ($schema as $column) {
            $line = "  \"$column->column_name\" " . strtoupper($column->data_type);
            if ($column->character_maximum_length) {
                $line .= "({$column->character_maximum_length})";
            }
            if ($column->is_nullable === 'NO') {
                $line .= " NOT NULL";
            }
            $columns[] = $line;
        }

        $createTableSQL .= implode(",\n", $columns) . "\n);\n\n";

        $detallesVentas = DetalleVenta::all();
        $insertSQL = "";

        foreach ($detallesVentas as $detalleVenta) {
            $attrs = $detalleVenta->getAttributes();
            $colNames = '"' . implode('", "', array_keys($attrs)) . '"';
            $colValues = collect(array_values($attrs))->map(function ($val) {
                if (is_null($val)) return 'NULL';
                return "'" . addslashes($val) . "'";
            })->implode(', ');

            $insertSQL .= "INSERT INTO \"$table\" ($colNames) VALUES ($colValues);\n";
        }

        $finalSQL = $createTableSQL . $insertSQL;

        return response($finalSQL)
            ->header('Content-Type', 'text/plain')
            ->header('Content-Disposition', 'attachment; filename=backup_detalles_ventas.sql');
    }
}