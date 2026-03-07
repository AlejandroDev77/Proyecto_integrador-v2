<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\DetalleDevolucion;
use App\Models\Devolucion;
use App\Services\InventarioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class DetalleDevolucionController extends Controller
{
    protected $inventarioService;

    public function __construct(InventarioService $inventarioService)
    {
        $this->inventarioService = $inventarioService;
    }


    public function index(Request $request)
    {
        return QueryBuilder::for(DetalleDevolucion::class)
            ->with(['devolucion', 'mueble'])
            ->leftJoin('devoluciones', 'detalles_devolucion.id_dev', '=', 'devoluciones.id_dev')
            ->leftJoin('muebles', 'detalles_devolucion.id_mue', '=', 'muebles.id_mue')
            ->select('detalles_devolucion.*')
            ->allowedFilters([
                AllowedFilter::callback('cod_det_dev', function ($query, $value) {
                    $query->where('cod_det_dev', 'like', "%{$value}%");
                }),
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
                AllowedFilter::callback('subtotal_min', function ($query, $value) {
                    $query->where('subtotal', '>=', $value);
                }),
                AllowedFilter::callback('subtotal_max', function ($query, $value) {
                    $query->where('subtotal', '<=', $value);
                }),
                AllowedFilter::callback('devolucion_fecha_desde', function ($query, $value) {
                    $query->whereHas('devolucion', function ($q) use ($value) {
                        $q->where('fecha_dev', '>=', $value);
                    });
                }),
                AllowedFilter::callback('devolucion_fecha_hasta', function ($query, $value) {
                    $query->whereHas('devolucion', function ($q) use ($value) {
                        $q->where('fecha_dev', '<=', $value);
                    });
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where('cod_det_dev', 'like', "%{$value}%");
                }),
                AllowedFilter::callback('estado_dev' , function ($query, $value) {
                    $query->whereHas('devolucion', function ($q) use ($value) {
                        $q->where('estado_dev', 'ilike', "%{$value}%");
                    });
                }),
                AllowedFilter::callback('nom_mue', function ($query, $value) {
                    $query->whereHas('mueble', function ($q) use ($value) {
                        $q->where('nom_mue', 'ilike', "%{$value}%");
                    });
                }),
            ])
            ->allowedSorts(['id_det_dev', 'cantidad', 'precio_unitario', 'subtotal'])
            ->paginate($request->input('per_page', 20));

    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'cantidad' => 'required|integer|min:1',
            'precio_unitario' => 'required|numeric|min:0.01',
            'subtotal' => 'required|numeric|min:0',
            'id_dev' => 'required|exists:devoluciones,id_dev',
            'id_mue' => 'required|exists:muebles,id_mue',
        ], [
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.integer' => 'La cantidad debe ser un número entero.',
            'cantidad.min' => 'La cantidad debe ser al menos 1.',
            'precio_unitario.required' => 'El precio unitario es obligatorio.',
            'precio_unitario.numeric' => 'El precio unitario debe ser un número.',
            'precio_unitario.min' => 'El precio unitario debe ser mayor a 0.',
            'subtotal.required' => 'El subtotal es obligatorio.',
            'subtotal.min' => 'El subtotal no puede ser negativo.',
            'id_dev.required' => 'Debe seleccionar una devolución.',
            'id_dev.exists' => 'La devolución seleccionada no existe.',
            'id_mue.required' => 'Debe seleccionar un mueble.',
            'id_mue.exists' => 'El mueble seleccionado no existe.',
        ]);

        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_det_dev = 'DTV-' . $nextId;
            $nextId++;
        } while (DetalleDevolucion::where('cod_det_dev', $cod_det_dev)->exists());
        $validated['cod_det_dev'] = $cod_det_dev;

        // Usar transacción para garantizar consistencia
        return DB::transaction(function () use ($validated) {
            // Crear el detalle de devolución
            $detalleDevolucion = DetalleDevolucion::create($validated);

            // Obtener el empleado de la devolución para registrar el movimiento
            $devolucion = Devolucion::find($validated['id_dev']);
            
            // Incrementar stock del mueble (devolución = entrada)
            $this->inventarioService->incrementarStockMueble(
                idMueble: $validated['id_mue'],
                cantidad: $validated['cantidad'],
                idEmpleado: $devolucion->id_emp,
                idDevolucion: $validated['id_dev'],
                motivo: 'Devolución - Detalle ' . $validated['cod_det_dev']
            );

            return $detalleDevolucion->load(['devolucion', 'mueble']);
        });
    }

    public function show($id)
    {
        return DetalleDevolucion::with(['devolucion', 'mueble'])->findOrFail($id);

    
    }
    

    public function update(Request $request, $id)
    {
        $detalleDevolucion = DetalleDevolucion::findOrFail($id);

        $validated = $request->validate([
            'cantidad' => 'sometimes|required|integer|min:1',
            'precio_unitario' => 'sometimes|required|numeric|min:0.01',
            'subtotal' => 'sometimes|required|numeric|min:0',
            'id_dev' => 'sometimes|required|exists:devoluciones,id_dev',
            'id_mue' => 'sometimes|required|exists:muebles,id_mue',
        ], [
            'cantidad.integer' => 'La cantidad debe ser un número entero.',
            'cantidad.min' => 'La cantidad debe ser al menos 1.',
            'precio_unitario.numeric' => 'El precio unitario debe ser un número.',
            'precio_unitario.min' => 'El precio unitario debe ser mayor a 0.',
            'subtotal.min' => 'El subtotal no puede ser negativo.',
            'id_dev.exists' => 'La devolución seleccionada no existe.',
            'id_mue.exists' => 'El mueble seleccionado no existe.',
        ]);
        
        $detalleDevolucion->update($validated);
        return $detalleDevolucion->load(['devolucion', 'mueble']);
    }
    

    public function destroy($id)
    {
        $detalleDevolucion = DetalleDevolucion::findOrFail($id);
        
        return DB::transaction(function () use ($detalleDevolucion) {
            // Obtener la devolución para el empleado
            $devolucion = Devolucion::find($detalleDevolucion->id_dev);
            
            // Revertir el incremento de stock (salida por reversión)
            $this->inventarioService->descontarStockMueble(
                idMueble: $detalleDevolucion->id_mue,
                cantidad: $detalleDevolucion->cantidad,
                idEmpleado: $devolucion->id_emp,
                motivo: 'Reversión - Eliminación de detalle de devolución ' . $detalleDevolucion->cod_det_dev
            );

            $detalleDevolucion->delete();

            return response()->json(['message' => 'Detalle de devolución eliminado y stock revertido.']);
        });
    }

    public function reporteDetallesDevoluciones(Request $request)
    {
        // Obtiene todos los detalles de devoluciones
        $detallesdevoluciones = DetalleDevolucion::with(['devolucion', 'mueble'])->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'detallesdevoluciones.reporte')
        $pdf = Pdf::loadView('detallesdevoluciones.reporte', compact('detallesdevoluciones'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_detallesdevoluciones.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'detalles_devolucion';
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

        $detallesdevoluciones = DetalleDevolucion::all();
        $insertSQL = "";

        foreach ($detallesdevoluciones as $detalle) {
            $attrs = $detalle->getAttributes();
            $colNames = '\"' . implode('\", \"', array_keys($attrs)) . '\"';
            $colValues = collect(array_values($attrs))->map(function ($val) {
                if (is_null($val)) return 'NULL';
                return "'" . addslashes($val) . "'";
            })->implode(', ');

            $insertSQL .= "INSERT INTO \"$table\" ($colNames) VALUES ($colValues);\n";
        }

        $finalSQL = $createTableSQL . $insertSQL;

        return response($finalSQL)
            ->header('Content-Type', 'text/plain')
            ->header('Content-Disposition', 'attachment; filename=backup_detallesdevoluciones.sql');
    }
}