<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Produccion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Importar Storage
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB; // Importar DB
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ProduccionController extends Controller
{
    public function index(Request $request)
    {
        return QueryBuilder::for(Produccion::class)
            ->with(['venta', 'cotizacion', 'empleado'])
            ->allowedFilters([
                AllowedFilter::callback('cod_pro', function ($query, $value) {
                    $query->where('cod_pro', '=', $value);
                }),
                AllowedFilter::callback('fec_ini_exact', function ($query, $value) {
                    $query->whereRaw("DATE(fec_ini) = ?", [$value]);
                }),
                AllowedFilter::callback('fec_ini_min', function ($query, $value) {
                    $query->whereRaw("DATE(fec_ini) >= ?", [$value]);
                }),
                AllowedFilter::callback('fec_ini_max', function ($query, $value) {
                    $query->whereRaw("DATE(fec_ini) <= ?", [$value]);
                }),
                AllowedFilter::callback('fec_fin_exact', function ($query, $value) {
                    $query->whereRaw("DATE(fec_fin) = ?", [$value]);
                }),
                AllowedFilter::callback('fec_fin_min', function ($query, $value) {
                    $query->whereRaw("DATE(fec_fin) >= ?", [$value]);
                }),
                AllowedFilter::callback('fec_fin_max', function ($query, $value) {
                    $query->whereRaw("DATE(fec_fin) <= ?", [$value]);
                }),
                'est_pro',
                'prioridad',
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where('cod_pro', '=', $value)
                          ->orWhere('est_pro', 'like', "%{$value}%")
                          ->orWhere('prioridad', 'like', "%{$value}%");
                }),
            ])
            ->allowedSorts(['id_pro', 'fec_ini', 'fec_fin_estimada', 'fec_fin', 'est_pro', 'prioridad', 'cod_pro'])
            ->paginate($request->input('per_page', 20));

    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fec_ini' => 'required|date',
            'fec_fin_estimada' => 'required|date|after_or_equal:fec_ini',
            'fec_fin' => 'nullable|date',
            'est_pro' => 'required|string|max:50',
            'prioridad' => 'required|string|max:50',
            'id_ven' => 'required|exists:ventas,id_ven',
            'id_cot' => 'required|exists:cotizaciones,id_cot',
            'id_emp' => 'required|exists:empleados,id_emp',
            'notas' => 'nullable|string|max:500',
        ], [
            'fec_ini.required' => 'La fecha de inicio es obligatoria.',
            'fec_ini.date' => 'La fecha de inicio debe tener un formato válido.',
            'fec_fin_estimada.required' => 'La fecha estimada de fin es obligatoria.',
            'fec_fin_estimada.date' => 'La fecha estimada debe tener un formato válido.',
            'fec_fin_estimada.after_or_equal' => 'La fecha estimada debe ser igual o posterior a la fecha de inicio.',
            'fec_fin.date' => 'La fecha de fin debe tener un formato válido.',
            'est_pro.required' => 'El estado es obligatorio.',
            'est_pro.string' => 'El estado debe ser texto.',
            'est_pro.max' => 'El estado no puede exceder 50 caracteres.',
            'prioridad.required' => 'La prioridad es obligatoria.',
            'prioridad.string' => 'La prioridad debe ser texto.',
            'prioridad.max' => 'La prioridad no puede exceder 50 caracteres.',
            'id_ven.required' => 'La venta es obligatoria.',
            'id_ven.exists' => 'La venta seleccionada no existe.',
            'id_cot.required' => 'La cotización es obligatoria.',
            'id_cot.exists' => 'La cotización seleccionada no existe.',
            'id_emp.required' => 'El empleado es obligatorio.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
            'notas.string' => 'Las notas deben ser texto.',
            'notas.max' => 'Las notas no pueden exceder 500 caracteres.',
        ]);
        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_pro = 'POD-' . $nextId;
            $nextId++;
        } while (Produccion::where('cod_pro', $cod_pro)->exists());
        $validated['cod_pro'] = $cod_pro;
        return Produccion::create($validated);
    }

    public function show($id)
    {
        $produccion = Produccion::with([
            'venta.cliente', 
            'cotizacion.cliente', 
            'empleado',
            'produccionEtapas.etapa',
            'produccionEtapas.empleado',
            'produccionEtapas.evidencias'
        ])->findOrFail($id);
        
        // Calcular progreso basado en etapas completadas
        $totalEtapas = $produccion->produccionEtapas->count();
        $etapasCompletadas = $produccion->produccionEtapas->where('est_eta', 'Completado')->count();
        $progreso = $totalEtapas > 0 ? round(($etapasCompletadas / $totalEtapas) * 100) : 0;
        
        $produccion->etapas_total = $totalEtapas;
        $produccion->etapas_completadas = $etapasCompletadas;
        $produccion->progreso = $progreso;
        
        return $produccion;
    }
    

    public function update(Request $request, $id)
    {
        $producciones = Produccion::findOrFail($id);

        $validated = $request->validate([
            'fec_ini' => 'sometimes|required|date',
            'fec_fin_estimada' => 'sometimes|required|date',
            'fec_fin' => 'nullable|date',
            'est_pro' => 'sometimes|required|string|max:50',
            'prioridad' => 'sometimes|required|string|max:50',
            'id_ven' => 'sometimes|required|exists:ventas,id_ven',
            'id_cot' => 'sometimes|required|exists:cotizaciones,id_cot',
            'id_emp' => 'sometimes|required|exists:empleados,id_emp',
            'notas' => 'nullable|string|max:500',
        ], [
            'fec_ini.required' => 'La fecha de inicio es obligatoria.',
            'fec_ini.date' => 'La fecha de inicio debe tener un formato válido.',
            'fec_fin_estimada.required' => 'La fecha estimada de fin es obligatoria.',
            'fec_fin_estimada.date' => 'La fecha estimada debe tener un formato válido.',
            'fec_fin.date' => 'La fecha de fin debe tener un formato válido.',
            'est_pro.required' => 'El estado es obligatorio.',
            'est_pro.string' => 'El estado debe ser texto.',
            'est_pro.max' => 'El estado no puede exceder 50 caracteres.',
            'prioridad.required' => 'La prioridad es obligatoria.',
            'prioridad.string' => 'La prioridad debe ser texto.',
            'prioridad.max' => 'La prioridad no puede exceder 50 caracteres.',
            'id_ven.required' => 'La venta es obligatoria.',
            'id_ven.exists' => 'La venta seleccionada no existe.',
            'id_cot.required' => 'La cotización es obligatoria.',
            'id_cot.exists' => 'La cotización seleccionada no existe.',
            'id_emp.required' => 'El empleado es obligatorio.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
            'notas.string' => 'Las notas deben ser texto.',
            'notas.max' => 'Las notas no pueden exceder 500 caracteres.',
        ]);


        $producciones->update($validated);

        return $producciones;
    }
    

    public function destroy($id)
    {
        $producciones  = Produccion::findOrFail($id);
        $producciones ->delete();

        return response()->json(['message' => 'Venta eliminado']);
    }

    public function reporteProducciones(Request $request)
    {
        
          $query = Produccion::with(['empleado', 'venta', 'cotizacion']);

        // Ejecuta la consulta y obtiene los resultados
        $producciones = $query->get();

        // Genera el PDF usando una vista Blade
        $pdf = Pdf::loadView('producciones.reporte', compact('producciones'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_producciones.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'produccion';
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

        $producciones = Produccion::all();
        $insertSQL = "";

        foreach ($producciones as $produccion) {
            $attrs = $produccion->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_producciones.sql');
    }
}