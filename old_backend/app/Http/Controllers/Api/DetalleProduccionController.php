<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\DetalleProduccion;
use App\Models\Produccion;
use App\Models\Mueble;
use App\Services\InventarioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class DetalleProduccionController extends Controller
{
    protected $inventarioService;

    public function __construct(InventarioService $inventarioService)
    {
        $this->inventarioService = $inventarioService;
    }

    public function index(Request $request)
    {
        return QueryBuilder::for(DetalleProduccion::class)
            ->with(['produccion', 'mueble'])
            ->allowedFilters([
                AllowedFilter::callback('cod_det_prod', function ($query, $value) {
                    $query->where('cod_det_pro', 'like', "%{$value}%");
                }),
                AllowedFilter::callback('cantidad_min', function ($query, $value) {
                    $query->where('cantidad', '>=', $value);
                }),
                AllowedFilter::callback('cantidad_max', function ($query, $value) {
                    $query->where('cantidad', '<=', $value);
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where('cod_det_pro', 'like', "%{$value}%");
                }),
            ])
            ->allowedSorts(['id_det_pro', 'cantidad'])
            ->paginate($request->input('per_page', 20));

    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            // 'cod_det_pro' eliminado de la validación porque se generará automáticamente
            'id_pro' => 'required|exists:produccion,id_pro',
            'id_mue' => 'required|exists:muebles,id_mue',
            'cantidad' => 'required|integer|min:1',
            'est_det_pro' => 'required|string|max:50',
        ], [
            'id_pro.required' => 'La producción es obligatoria.',
            'id_pro.exists' => 'La producción seleccionada no existe.',
            'id_mue.required' => 'El mueble es obligatorio.',
            'id_mue.exists' => 'El mueble seleccionado no existe.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.integer' => 'La cantidad debe ser un número entero.',
            'cantidad.min' => 'La cantidad debe ser al menos 1.',
            'est_det_pro.required' => 'El estado es obligatorio.',
            'est_det_pro.string' => 'El estado debe ser texto.',
            'est_det_pro.max' => 'El estado no puede exceder 50 caracteres.',
        ]);
        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_det_pro = 'DTP-' . $nextId;
            $nextId++;
        } while (DetalleProduccion::where('cod_det_pro', $cod_det_pro)->exists());
        $validated['cod_det_pro'] = $cod_det_pro;
        return DetalleProduccion::create($validated);
    }

    public function show($id)
    {
        return DetalleProduccion::with(['produccion', 'mueble'])->findOrFail($id);

    
    }
    

    public function update(Request $request, $id)
    {
        $detalleProduccion = DetalleProduccion::findOrFail($id);
        $estadoAnterior = $detalleProduccion->est_det_pro;

        $validated = $request->validate([
            'id_pro' => 'sometimes|required|exists:produccion,id_pro',
            'id_mue' => 'sometimes|required|exists:muebles,id_mue',
            'cantidad' => 'sometimes|required|integer|min:1',
            'est_det_pro' => 'sometimes|required|string|max:50',
        ], [
            'id_pro.required' => 'La producción es obligatoria.',
            'id_pro.exists' => 'La producción seleccionada no existe.',
            'id_mue.required' => 'El mueble es obligatorio.',
            'id_mue.exists' => 'El mueble seleccionado no existe.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.integer' => 'La cantidad debe ser un número entero.',
            'cantidad.min' => 'La cantidad debe ser al menos 1.',
            'est_det_pro.required' => 'El estado es obligatorio.',
            'est_det_pro.string' => 'El estado debe ser texto.',
            'est_det_pro.max' => 'El estado no puede exceder 50 caracteres.',
        ]);

        // Si el estado cambia a "Completado", ejecutar lógica de producción
        if (isset($validated['est_det_pro']) && 
            $validated['est_det_pro'] === 'Completado' && 
            $estadoAnterior !== 'Completado') {
            
            return $this->completarProduccion($detalleProduccion, $validated);
        }

        $detalleProduccion->update($validated);
        return $detalleProduccion->load(['produccion', 'mueble']);
    }

    /**
     * Completar un detalle de producción
     * Descuenta materiales y aumenta stock de muebles
     */
    public function completar($id)
    {
        $detalleProduccion = DetalleProduccion::findOrFail($id);

        if ($detalleProduccion->est_det_pro === 'Completado') {
            return response()->json([
                'message' => 'Este detalle de producción ya está completado',
                'error' => 'ya_completado'
            ], 422);
        }

        return $this->completarProduccion($detalleProduccion, ['est_det_pro' => 'Completado']);
    }

    /**
     * Lógica interna para completar producción
     */
    private function completarProduccion(DetalleProduccion $detalleProduccion, array $validated)
    {
        // Obtener la producción para el empleado
        $produccion = Produccion::find($detalleProduccion->id_pro);
        
        // Verificar si hay materiales suficientes
        $verificacion = $this->inventarioService->verificarMaterialesParaProduccion(
            $detalleProduccion->id_mue,
            $detalleProduccion->cantidad
        );

        if (!$verificacion['disponible']) {
            return response()->json([
                'message' => 'No hay materiales suficientes para completar la producción',
                'error' => 'materiales_insuficientes',
                'faltantes' => $verificacion['faltantes']
            ], 422);
        }

        return DB::transaction(function () use ($detalleProduccion, $validated, $produccion) {
            // 1. Descontar materiales necesarios
            $materialesUsados = $this->inventarioService->descontarMaterialesParaProduccion(
                idMueble: $detalleProduccion->id_mue,
                cantidadMuebles: $detalleProduccion->cantidad,
                idEmpleado: $produccion->id_emp,
                idProduccion: $detalleProduccion->id_pro
            );

            // 2. Incrementar stock de muebles producidos
            $this->inventarioService->incrementarStockMueble(
                idMueble: $detalleProduccion->id_mue,
                cantidad: $detalleProduccion->cantidad,
                idEmpleado: $produccion->id_emp,
                idProduccion: $detalleProduccion->id_pro,
                motivo: 'Producción completada - ' . $detalleProduccion->cantidad . ' unidades'
            );

            // 3. Actualizar el estado del detalle
            $detalleProduccion->update($validated);

            return response()->json([
                'message' => 'Producción completada exitosamente',
                'detalle' => $detalleProduccion->load(['produccion', 'mueble']),
                'materiales_usados' => $materialesUsados,
                'muebles_producidos' => $detalleProduccion->cantidad
            ]);
        });
    }

    public function destroy($id)
    {
        $detalleProduccion = DetalleProduccion::findOrFail($id);
        
        // Si el detalle estaba completado, revertir los cambios de inventario
        if ($detalleProduccion->est_det_pro === 'Completado') {
            return response()->json([
                'message' => 'No se puede eliminar un detalle de producción completado. Los movimientos de inventario ya fueron registrados.',
                'error' => 'no_reversible'
            ], 422);
        }

        $detalleProduccion->delete();
        return response()->json(['message' => 'Detalle de producción eliminado correctamente.']);
    }

    public function reporteDetallesProducciones(Request $request)
    {
        

        // Construye la consulta base
        $query = DetalleProduccion::with(['mueble', 'produccion']);

        
        
        $detallesproducciones = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'ventas.reporte')
        $pdf = Pdf::loadView('detallesproduccion.reporte', compact('detallesproducciones'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_detallesproducciones.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'detalles_produccion';
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

        $detallesproducciones = DetalleProduccion::all();
        $insertSQL = "";

        foreach ($detallesproducciones as $detalleProduccion) {
            $attrs = $detalleProduccion->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_detallesproducciones.sql');
    }
}