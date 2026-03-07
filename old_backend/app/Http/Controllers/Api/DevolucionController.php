<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Devolucion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Importar Storage
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB; // Importar DB
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class DevolucionController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20);

        $qb = QueryBuilder::for(Devolucion::class)
            ->with(['venta', 'empleado'])
            ->allowedFilters([
                AllowedFilter::callback('cod_dev', function ($query, $value) {
                    $query->where('cod_dev', '=', $value);
                }),
                AllowedFilter::callback('motivo_dev', function ($query, $value) {
                    $query->whereRaw('LOWER(motivo_dev) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('fec_dev_exact', function ($query, $value) {
                    $query->whereRaw("DATE(fec_dev) = ?", [$value]);
                }),
                AllowedFilter::callback('fec_dev_min', function ($query, $value) {
                    $query->whereRaw("DATE(fec_dev) >= ?", [$value]);
                }),
                AllowedFilter::callback('fec_dev_max', function ($query, $value) {
                    $query->whereRaw("DATE(fec_dev) <= ?", [$value]);
                }),
                AllowedFilter::callback('total_dev_min', function ($query, $value) {
                    if ($value) $query->where('total_dev', '>=', $value);
                }),
                AllowedFilter::callback('total_dev_max', function ($query, $value) {
                    if ($value) $query->where('total_dev', '<=', $value);
                }),
                'est_dev',
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where('cod_dev', '=', $value)
                          ->orWhereRaw('LOWER(motivo_dev) LIKE LOWER(?)', ["%{$value}%"]);
                }),
            ])
            ->allowedSorts(['fec_dev', 'total_dev', 'id_dev', 'cod_dev', 'est_dev']);

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
            'fec_dev' => 'required|date',
            'motivo_dev' => 'required|string|max:500',
            'total_dev' => 'required|numeric|min:0',
            'est_dev' => 'required|string|max:50',
            'id_ven' => 'required|exists:ventas,id_ven',
            'id_emp' => 'required|exists:empleados,id_emp',
        ], [
            'fec_dev.required' => 'La fecha de devolución es obligatoria.',
            'fec_dev.date' => 'La fecha debe tener un formato válido.',
            'motivo_dev.required' => 'El motivo de devolución es obligatorio.',
            'motivo_dev.string' => 'El motivo debe ser texto.',
            'motivo_dev.max' => 'El motivo no puede exceder 500 caracteres.',
            'total_dev.required' => 'El total es obligatorio.',
            'total_dev.numeric' => 'El total debe ser un número.',
            'total_dev.min' => 'El total no puede ser negativo.',
            'est_dev.required' => 'El estado es obligatorio.',
            'est_dev.string' => 'El estado debe ser texto.',
            'est_dev.max' => 'El estado no puede exceder 50 caracteres.',
            'id_ven.required' => 'La venta es obligatoria.',
            'id_ven.exists' => 'La venta seleccionada no existe.',
            'id_emp.required' => 'El empleado es obligatorio.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
        ]);
        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_dev = 'DEV-' . $nextId;
            $nextId++;
        } while (Devolucion::where('cod_dev', $cod_dev)->exists());
        $validated['cod_dev'] = $cod_dev;
        return Devolucion::create($validated);
    }

    public function show($id)
    {
        return Devolucion::with(['venta', 'empleado'])->findOrFail($id);
    
    }
    

    public function update(Request $request, $id)
    {
        $devoluciones = Devolucion::findOrFail($id);

        $validated = $request->validate([
            'fec_dev' => 'sometimes|required|date',
            'motivo_dev' => 'sometimes|required|string|max:500',
            'total_dev' => 'sometimes|required|numeric|min:0',
            'est_dev' => 'sometimes|required|string|max:50',
            'id_ven' => 'sometimes|required|exists:ventas,id_ven',
            'id_emp' => 'sometimes|required|exists:empleados,id_emp',
        ], [
            'fec_dev.required' => 'La fecha de devolución es obligatoria.',
            'fec_dev.date' => 'La fecha debe tener un formato válido.',
            'motivo_dev.required' => 'El motivo de devolución es obligatorio.',
            'motivo_dev.string' => 'El motivo debe ser texto.',
            'motivo_dev.max' => 'El motivo no puede exceder 500 caracteres.',
            'total_dev.required' => 'El total es obligatorio.',
            'total_dev.numeric' => 'El total debe ser un número.',
            'total_dev.min' => 'El total no puede ser negativo.',
            'est_dev.required' => 'El estado es obligatorio.',
            'est_dev.string' => 'El estado debe ser texto.',
            'est_dev.max' => 'El estado no puede exceder 50 caracteres.',
            'id_ven.required' => 'La venta es obligatoria.',
            'id_ven.exists' => 'La venta seleccionada no existe.',
            'id_emp.required' => 'El empleado es obligatorio.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
        ]);
        $devoluciones->update($validated);
        return $devoluciones;
    }
    

    public function destroy($id)
    {
        $devolucion = Devolucion::findOrFail($id);
        $devolucion->delete();
        return response()->json(['message' => 'Devolución eliminada correctamente.']);
    }

    public function reporteDevoluciones(Request $request)
    {
        // Obtiene los parámetros de filtrado
        
        $estado = $request->input('est_dev');

        // Construye la consulta base
        $query = Devolucion::with(['empleado', 'venta']);


        

        // Aplica filtro por estado si se proporciona
        if (!is_null($estado)) {
            $query->where('est_dev', $estado);
        }

        // Ejecuta la consulta y obtiene los resultados
        $devoluciones = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'ventas.reporte')
        $pdf = Pdf::loadView('devoluciones.reporte', compact('devoluciones'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_devoluciones.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'devoluciones';
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

        $devoluciones = Devolucion::all();
        $insertSQL = "";

        foreach ($devoluciones as $devolucion) {
            $attrs = $devolucion->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_devoluciones.sql');
    }
}