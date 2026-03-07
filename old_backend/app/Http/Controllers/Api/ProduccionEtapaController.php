<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Produccion;
use App\Models\ProduccionEtapa;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Importar Storage
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB; // Importar DB
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ProduccionEtapaController extends Controller
{
    public function index(Request $request)
    {
        return QueryBuilder::for(ProduccionEtapa::class)
                ->with(['empleado', 'produccion', 'etapa'])
                ->allowedFilters([
                    'cod_pro_eta', 'fec_ini', 'fec_fin', 'est_eta',
                    AllowedFilter::callback('search', function ($query, $value) {
                        $query->where('cod_pro_eta', 'like', "%{$value}%")
                              ->orWhere('est_eta', 'like', "%{$value}%");
                    }),
                ])
                ->allowedSorts(['id_pro_eta', 'fec_ini', 'fec_fin', 'est_eta'])
                ->paginate($request->input('per_page', 20));

    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'fec_ini' => 'required|date',
            'fec_fin' => 'required|date',
            'est_eta' => 'required|string',
            'notas' => 'nullable|string',
            'id_pro' => 'required|exists:produccion,id_pro',
            'id_emp' => 'required|exists:empleados,id_emp',
            'id_eta' => 'required|exists:etapas_produccion,id_eta',
        ], [
            'fec_ini.required' => 'La fecha de inicio es obligatoria.',
            'fec_ini.date' => 'La fecha de inicio debe ser una fecha válida.',
            'fec_fin.required' => 'La fecha de fin es obligatoria.',
            'fec_fin.date' => 'La fecha de fin debe ser una fecha válida.',
            'est_eta.required' => 'El estado de la etapa es obligatorio.',
            'est_eta.string' => 'El estado de la etapa debe ser texto.',
            'notas.string' => 'Las notas deben ser texto.',
            'id_pro.required' => 'La producción es obligatoria.',
            'id_pro.exists' => 'La producción seleccionada no existe.',
            'id_emp.required' => 'El empleado es obligatorio.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
            'id_eta.required' => 'La etapa es obligatoria.',
            'id_eta.exists' => 'La etapa seleccionada no existe.',
        ]);
        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_pro_eta = 'PET-' . $nextId;
            $nextId++;
        } while (ProduccionEtapa::where('cod_pro_eta', $cod_pro_eta)->exists());
        $validated['cod_pro_eta'] = $cod_pro_eta;
        return ProduccionEtapa::create($validated);
    }

    public function show($id)
    {
        return ProduccionEtapa::with(['empleado', 'produccion','etapa'])->findOrFail($id);
       
    
    }
    

    public function update(Request $request, $id)
    {
        $produccionesetapas = ProduccionEtapa::findOrFail($id);

        $validated = $request->validate([
            'fec_ini' => 'sometimes|required|date',
            'fec_fin' => 'sometimes|required|date',
            'est_eta' => 'sometimes|required|string',
            'notas' => 'nullable|string',
            'id_pro' => 'sometimes|required|exists:produccion,id_pro',
            'id_emp' => 'sometimes|required|exists:empleados,id_emp',
            'id_eta' => 'sometimes|required|exists:etapas_produccion,id_eta',
        ], [
            'fec_ini.required' => 'La fecha de inicio es obligatoria.',
            'fec_ini.date' => 'La fecha de inicio debe ser una fecha válida.',
            'fec_fin.required' => 'La fecha de fin es obligatoria.',
            'fec_fin.date' => 'La fecha de fin debe ser una fecha válida.',
            'est_eta.required' => 'El estado de la etapa es obligatorio.',
            'est_eta.string' => 'El estado de la etapa debe ser texto.',
            'notas.string' => 'Las notas deben ser texto.',
            'id_pro.required' => 'La producción es obligatoria.',
            'id_pro.exists' => 'La producción seleccionada no existe.',
            'id_emp.required' => 'El empleado es obligatorio.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
            'id_eta.required' => 'La etapa es obligatoria.',
            'id_eta.exists' => 'La etapa seleccionada no existe.',
        ]);

        $produccionesetapas->update($validated);

        // Si la etapa se marcó como En Proceso, iniciar la producción si estaba Pendiente
        if (isset($validated['est_eta']) && $validated['est_eta'] === 'En Proceso') {
            $produccion = Produccion::find($produccionesetapas->id_pro);
            
            if ($produccion && $produccion->est_pro === 'Pendiente') {
                $produccion->update([
                    'est_pro' => 'En Proceso'
                ]);
            }
        }

        // Si la etapa se marcó como Completado, verificar si todas las etapas están completas
        if (isset($validated['est_eta']) && $validated['est_eta'] === 'Completado') {
            $produccion = Produccion::find($produccionesetapas->id_pro);
            
            if ($produccion) {
                $todasEtapas = ProduccionEtapa::where('id_pro', $produccion->id_pro)->count();
                $etapasCompletadas = ProduccionEtapa::where('id_pro', $produccion->id_pro)
                    ->where('est_eta', 'Completado')
                    ->count();
                
                // Si todas las etapas están completadas, actualizar la producción
                if ($todasEtapas > 0 && $todasEtapas === $etapasCompletadas) {
                    $produccion->update([
                        'est_pro' => 'Completado',
                        'fec_fin' => now()->format('Y-m-d')
                    ]);
                }
            }
        }

        return $produccionesetapas;
    }
    

    public function destroy($id)
    {
        $produccionesetapas = ProduccionEtapa::findOrFail($id);
        $produccionesetapas->delete();

        return response()->json(['message' => 'Produccion Etapa eliminado']);
    }

    public function reporteProduccionEtapa(Request $request)
    {
        
       

        // Construye la consulta base
        $query = ProduccionEtapa::with(['empleado', 'produccion', 'etapa']);

       

        // Ejecuta la consulta y obtiene los resultados
        $produccionesetapas = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'ventas.reporte')
        $pdf = Pdf::loadView('produccionesetapas.reporte', compact('produccionesetapas'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_produccionesetapas.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'produccion_etapas';
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

        $produccionesetapas = ProduccionEtapa::all();
        $insertSQL = "";

        foreach ($produccionesetapas as $ProduccionEtapa) {
            $attrs = $ProduccionEtapa->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_produccionesetapas.sql');
    }
}