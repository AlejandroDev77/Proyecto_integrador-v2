<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\EtapaProduccion;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class EtapaProduccionController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20);

        $qb = QueryBuilder::for(EtapaProduccion::class)
            ->with('etapaproduccion')
            ->allowedFilters([
                AllowedFilter::callback('cod_etapa', function ($query, $value) {
                    $query->where('cod_eta', 'like', "%{$value}%");
                }),
                AllowedFilter::callback('nom_eta', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_eta) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where('nom_eta', 'like', "%{$value}%");
                }),
            ])
            ->allowedSorts(['nom_eta', 'orden_secuencia', 'id_eta', 'cod_eta']);

        if (!$request->has('page') && !$request->has('per_page')) {
            $items = $qb->get();
            return response()->json($items);
        }

        $paginator = $qb->paginate($perPage);
        return response()->json($paginator);
    }
    

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_eta' => 'required|string|max:255',
            'desc_eta' => 'nullable|string|max:500',
            'duracion_estimada' => 'required|integer', 
            'orden_secuencia' => 'required|integer',
        ], [
            'nom_eta.required' => 'El nombre de la etapa es obligatorio.',
            'nom_eta.string' => 'El nombre de la etapa debe ser texto.',
            'nom_eta.max' => 'El nombre de la etapa no puede exceder 255 caracteres.',
            'desc_eta.string' => 'La descripción debe ser texto.',
            'desc_eta.max' => 'La descripción no puede exceder 500 caracteres.',
            'duracion_estimada.required' => 'La duración estimada es obligatoria.',
            'duracion_estimada.integer' => 'La duración estimada debe ser un número entero.',
            'orden_secuencia.required' => 'El orden de secuencia es obligatorio.',
            'orden_secuencia.integer' => 'El orden de secuencia debe ser un número entero.',
        ]);
        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_eta = 'ETA-' . $nextId;
            $nextId++;
        } while (EtapaProduccion::where('cod_eta', $cod_eta)->exists());
        $validated['cod_eta'] = $cod_eta;
        return EtapaProduccion::create($validated);
    }

    public function show($id)
    {
        return EtapaProduccion::with('etapaproduccion')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $etapaProduccion = EtapaProduccion::findOrFail($id);

        $validated = $request->validate([
            'nom_eta' => 'sometimes|required|string|max:255',
            'desc_eta' => 'nullable|string|max:500',
            'duracion_estimada' => 'sometimes|required|integer', 
            'orden_secuencia' => 'sometimes|required|integer',
        ], [
            'nom_eta.required' => 'El nombre de la etapa es obligatorio.',
            'nom_eta.string' => 'El nombre de la etapa debe ser texto.',
            'nom_eta.max' => 'El nombre de la etapa no puede exceder 255 caracteres.',
            'desc_eta.string' => 'La descripción debe ser texto.',
            'desc_eta.max' => 'La descripción no puede exceder 500 caracteres.',
            'duracion_estimada.required' => 'La duración estimada es obligatoria.',
            'duracion_estimada.integer' => 'La duración estimada debe ser un número entero.',
            'orden_secuencia.required' => 'El orden de secuencia es obligatorio.',
            'orden_secuencia.integer' => 'El orden de secuencia debe ser un número entero.',
        ]);

        $etapaProduccion->update($validated);
        return $etapaProduccion;
    }

    public function destroy($id)
    {
        $etapaProduccion = EtapaProduccion::findOrFail($id);
        $etapaProduccion->delete();
        return response()->json(['message' => 'Etapa de producción eliminada correctamente.'], 204);
    }

    public function reporteEtapasProducciones(Request $request)
    {
        // Obtiene los parámetros de filtrado
        $nombre = $request->input('nom_eta');

        // Construye la consulta base
        $query = EtapaProduccion::query();

        // Aplica filtro por nombre si se proporciona
        if (!is_null($nombre)) {
            $query->where('nom_eta', 'like', "%$nombre%");
        }        // Ejecuta la consulta y obtiene los resultados
        $etapasproducciones = $query->get();

        // Genera el PDF usando una vista Blade
        $pdf = Pdf::loadView('etapasproducciones.reporte', compact('etapasproducciones'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_etapasproducciones.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'etapas_produccion';
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

        $etapasProduccion = EtapaProduccion::all();
        $insertSQL = "";

        foreach ($etapasProduccion as $etapaProduccion) {
            $attrs = $etapaProduccion->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_etapasproduccion.sql');
    }
}