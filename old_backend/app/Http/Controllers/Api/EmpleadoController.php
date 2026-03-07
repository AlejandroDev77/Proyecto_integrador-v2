<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class EmpleadoController extends Controller
{
    public function index(Request $request)
    {
        return QueryBuilder::for(Empleado::class)
            ->with('usuario')
            ->allowedFilters([
                AllowedFilter::callback('cod_emp', function ($query, $value) {
                    $query->where('cod_emp', '=', $value);
                }),
                AllowedFilter::callback('nom_emp', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_emp) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('ap_pat_emp', function ($query, $value) {
                    $query->whereRaw('LOWER(ap_pat_emp) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('ap_mat_emp', function ($query, $value) {
                    $query->whereRaw('LOWER(ap_mat_emp) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('cel_emp', function ($query, $value) {
                    $query->where(DB::raw('CAST(cel_emp AS TEXT)'), 'like', "%{$value}%");
                }),
                AllowedFilter::callback('ci_emp', function ($query, $value) {
                    $query->where('ci_emp', 'like', "%{$value}%");
                }),
                AllowedFilter::callback('car_emp', function ($query, $value) {
                    $query->whereRaw('LOWER(car_emp) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('nom_usu', function ($query, $value) {
                    $query->whereHas('usuario', function ($subQuery) use ($value) {
                        $subQuery->whereRaw('LOWER(nom_usu) LIKE LOWER(?)', ["%{$value}%"]);
                    });
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_emp) LIKE LOWER(?)', ["%{$value}%"])
                          ->orWhereRaw('LOWER(ap_pat_emp) LIKE LOWER(?)', ["%{$value}%"])
                          ->orWhere('ci_emp', 'like', "%{$value}%")
                          ->orWhere('cod_emp', '=', $value);
                }),
            ])
            ->allowedSorts(['id_emp', 'nom_emp', 'car_emp', 'cod_emp'])
            ->paginate($request->input('per_page', 20));
    }

    public function store(Request $request)
    {
        try{
        $validated = $request->validate([
            
            'nom_emp' => ['required', 'string', 'max:200', 'regex:/^[^\d]+$/'],
            'ap_pat_emp' => ['required', 'string', 'max:200', 'regex:/^[^\d]+$/'],
            'ap_mat_emp' => ['nullable', 'string', 'max:200', 'regex:/^[^\d]+$/'],
            'cel_emp' => ['required', 'digits:8'],
            'dir_emp' => 'required|string|max:200',
            'fec_nac_emp' => 'required|date',
            'ci_emp' => [
                    'required',
                    'string',
                    'max:40',
                    'unique:empleados,ci_emp',
                    'regex:/^\\d{7,10} [A-Z]{2}$/'
                ],
            'img_emp' => 'nullable|string|max:200',
            'car_emp' => ['required', 'string', 'max:200', 'regex:/^[^\d]+$/'],
            'id_usu' => 'required|exists:usuarios,id_usu',
        ], [
            'nom_emp.regex' => 'El nombre no debe contener números.',
            'ap_pat_emp.regex' => 'El apellido paterno no debe contener números.',
            'ap_mat_emp.regex' => 'El apellido materno no debe contener números.',
            'car_emp.regex' => 'El cargo no debe contener números.',
            'cel_emp.digits' => 'El celular debe tener exactamente 8 dígitos.',
            'ci_emp.regex' => 'El CI debe tener entre 7 y 10 dígitos seguidos de la extensión departamental (ej: 1234567LP).',
        ]);
        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_emp = 'EMP-' . $nextId;
            $nextId++;
        } while (Empleado::where('cod_emp', $cod_emp)->exists());
        $validated['cod_emp'] = $cod_emp;
        return Empleado::create($validated);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar empleado: ' . $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        return Empleado::with('usuario')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $empleado = Empleado::findOrFail($id);
        try {
        $validated = $request->validate([
            'nom_emp' => ['sometimes', 'string', 'max:200', 'regex:/^[^\d]+$/'],
            'ap_pat_emp' => ['sometimes', 'string', 'max:200', 'regex:/^[^\d]+$/'],
            'ap_mat_emp' => ['nullable', 'string', 'max:200', 'regex:/^[^\d]+$/'],
            'cel_emp' => ['sometimes', 'digits:8'],
            'dir_emp' => 'sometimes|string|max:200',
            'fec_nac_emp' => 'sometimes|date',
            'ci_emp' => [
                    'required',
                    'string',
                    'max:40',
                    // Cambia a unique:clientes,ci_cli,{id},id_cli
                    'unique:empleados,ci_emp,' . $id . ',id_emp',
                    'regex:/^\d{7,10} [A-Z]{2}$/'
                ],
            'img_emp' => 'nullable|string|max:200',
            'car_emp' => ['sometimes', 'string', 'max:200', 'regex:/^[^\d]+$/'],
            'id_usu' => 'sometimes|exists:usuarios,id_usu',
        ], [
            'nom_emp.regex' => 'El nombre no debe contener números.',
            'ap_pat_emp.regex' => 'El apellido paterno no debe contener números.',
            'ap_mat_emp.regex' => 'El apellido materno no debe contener números.',
            'car_emp.regex' => 'El cargo no debe contener números.',
            'cel_emp.digits' => 'El celular debe tener exactamente 8 dígitos.',
            'ci_emp.regex' => 'El CI debe tener entre 7 y 10 dígitos seguidos de la extensión departamental (ej: 1234567LP).',
        ]);

        $empleado->update($validated);

        return $empleado;
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar empleado: ' . $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $empleado = Empleado::findOrFail($id);
        $empleado->delete();

        return response()->json(['message' => 'Empleado eliminado']);
    }

    public function reporteEmpleados(Request $request)
    {
        // Obtiene los parámetros de filtrado
        $nombre = $request->input('nom_emp');
        $ci = $request->input('ci_emp');

        // Construye la consulta base
        $query = Empleado::with('usuario');

        // Aplica filtro por nombre si se proporciona
        if (!is_null($nombre)) {
            $query->where('nom_emp', 'like', "%$nombre%");
        }

        
        if (!is_null($ci)) {
            $query->where('ci_emp', $ci);
        }

        
        $empleados = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'empleados.reporte')
        $pdf = Pdf::loadView('empleados.reporte', compact('empleados'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_empleados.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'empleados';
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

        $empleados = Empleado::all();
        $insertSQL = "";

        foreach ($empleados as $empleado) {
            $attrs = $empleado->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_empleados.sql');
    }
}