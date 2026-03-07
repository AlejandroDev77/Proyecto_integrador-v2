<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ClienteController extends Controller
{
    
    public function index(Request $request)
    {
        return QueryBuilder::for(Cliente::class)
            ->with('usuario')
            ->allowedFilters([
                AllowedFilter::callback('cod_cli', function ($query, $value) {
                    // Búsqueda exacta de código, no parcial
                    $query->where('cod_cli', '=', $value);
                }),
                AllowedFilter::callback('nom_cli', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_cli) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('ap_pat_cli', function ($query, $value) {
                    $query->whereRaw('LOWER(ap_pat_cli) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('ap_mat_cli', function ($query, $value) {
                    $query->whereRaw('LOWER(ap_mat_cli) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('cel_cli', function ($query, $value) {
                    // Convertir a string para buscar en números
                    $query->where(DB::raw('CAST(cel_cli AS TEXT)'), 'like', "%{$value}%");
                }),
                AllowedFilter::callback('ci_cli', function ($query, $value) {
                    $query->where('ci_cli', 'like', "%{$value}%");
                }),
                AllowedFilter::callback('dir_cli', function ($query, $value) {
                    // Búsqueda exacta por palabra completa (no parcial)
                    $query->whereRaw("LOWER(dir_cli) LIKE LOWER(?)", ["%{$value}%"]);
                }),
                AllowedFilter::callback('fec_nac_cli_exact', function ($query, $value) {
                    // Búsqueda exacta por fecha (YYYY-MM-DD)
                    if ($value) {
                        try {
                            $date = \Carbon\Carbon::createFromFormat('Y-m-d', $value);
                            // Usar whereRaw para PostgreSQL
                            $query->whereRaw("DATE(fec_nac_cli) = ?", [$date->format('Y-m-d')]);
                        } catch (\Exception $e) {
                            $query->whereRaw("DATE(fec_nac_cli) = ?", [$value]);
                        }
                    }
                }),
                AllowedFilter::callback('fec_nac_cli_min', function ($query, $value) {
                    // Rango mínimo de fecha de nacimiento
                    if ($value) {
                        try {
                            $date = \Carbon\Carbon::createFromFormat('Y-m-d', $value);
                            $query->whereRaw("DATE(fec_nac_cli) >= ?", [$date->format('Y-m-d')]);
                        } catch (\Exception $e) {
                            $query->whereRaw("DATE(fec_nac_cli) >= ?", [$value]);
                        }
                    }
                }),
                AllowedFilter::callback('fec_nac_cli_max', function ($query, $value) {
                    // Rango máximo de fecha de nacimiento
                    if ($value) {
                        try {
                            $date = \Carbon\Carbon::createFromFormat('Y-m-d', $value);
                            $query->whereRaw("DATE(fec_nac_cli) <= ?", [$date->format('Y-m-d')]);
                        } catch (\Exception $e) {
                            $query->whereRaw("DATE(fec_nac_cli) <= ?", [$value]);
                        }
                    }
                }),
                AllowedFilter::callback('nom_usu', function ($query, $value) {
                    // Filtrar por nombre de usuario en la relación
                    $query->whereHas('usuario', function ($subQuery) use ($value) {
                        $subQuery->whereRaw('LOWER(nom_usu) LIKE LOWER(?)', ["%{$value}%"]);
                    });
                }),
                AllowedFilter::callback('est_cli', function ($query, $value) {
                    if ($value !== null) {
                        $boolValue = $value === 'true' || $value === '1' || $value === 1 || $value === true;
                        $query->where('est_cli', $boolValue);
                    }
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_cli) LIKE LOWER(?)', ["%{$value}%"])
                          ->orWhereRaw('LOWER(ap_pat_cli) LIKE LOWER(?)', ["%{$value}%"])
                          ->orWhere('ci_cli', 'like', "%{$value}%")
                          ->orWhere('cod_cli', 'like', "%{$value}%");
                }),
            ])
            ->allowedSorts(['id_cli', 'nom_cli', 'cel_cli', 'est_cli', 'fec_nac_cli', 'cod_cli'])
            ->paginate($request->input('per_page', 20));
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom_cli' => 'required|string|max:200|regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/',
                'ap_pat_cli' => 'required|string|max:200|regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/',
                'ap_mat_cli' => 'nullable|string|max:200|regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/',
                'cel_cli' => 'required|numeric|digits:8',
                'dir_cli' => 'required|string|max:200',
                'fec_nac_cli' => 'required|date',
                // CI: 7-10 números + espacio + 2 letras mayúsculas (ej: 1234567 LP)
                'ci_cli' => [
                    'required',
                    'string',
                    'max:40',
                    'unique:clientes,ci_cli',
                    'regex:/^\\d{7,10} [A-Z]{2}$/'
                ],
                'img_cli' => 'nullable|string|max:200',
                'id_usu' => 'required|exists:usuarios,id_usu',
            ], [
                'nom_cli.regex' => 'El nombre solo debe contener letras y espacios.',
                'ap_pat_cli.regex' => 'El apellido paterno solo debe contener letras y espacios.',
                'ap_mat_cli.regex' => 'El apellido materno solo debe contener letras y espacios.',
                'cel_cli.numeric' => 'El celular solo debe contener números.',
                'cel_cli.digits' => 'El celular debe tener exactamente 8 dígitos.',
                'ci_cli.regex' => 'El CI debe tener entre 7 y 10 números seguido de un espacio y la extensión del departamento en mayúsculas (ej: 1234567 LP).',
            ]);

            // Generar código automáticamente
            $nextId = 1;
            do {
                $cod_cli = 'CLI-' . $nextId;
                $nextId++;
            } while (Cliente::where('cod_cli', $cod_cli)->exists());
            $validated['cod_cli'] = $cod_cli;

            return Cliente::create($validated);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar cliente: ' . $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        return Cliente::with('usuario')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        try {
            $cliente = Cliente::findOrFail($id);
            $validated = $request->validate([
                'nom_cli' => 'required|string|max:200|regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/',
                'ap_pat_cli' => 'required|string|max:200|regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/',
                'ap_mat_cli' => 'nullable|string|max:200|regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/',
                'cel_cli' => 'required|numeric|digits:8',
                'dir_cli' => 'required|string|max:200',
                'fec_nac_cli' => 'required|date',
                // CI: 7-10 números + espacio + 2 letras mayúsculas (ej: 1234567 LP)
                'ci_cli' => [
                    'required',
                    'string',
                    'max:40',
                    // Cambia a unique:clientes,ci_cli,{id},id_cli
                    'unique:clientes,ci_cli,' . $id . ',id_cli',
                    'regex:/^\d{7,10} [A-Z]{2}$/'
                ],
                'img_cli' => 'nullable|string|max:200',
                'id_usu' => 'required|exists:usuarios,id_usu',
            ], [
                'nom_cli.regex' => 'El nombre solo debe contener letras y espacios.',
                'ap_pat_cli.regex' => 'El apellido paterno solo debe contener letras y espacios.',
                'ap_mat_cli.regex' => 'El apellido materno solo debe contener letras y espacios.',
                'cel_cli.numeric' => 'El celular solo debe contener números.',
                'cel_cli.digits' => 'El celular debe tener exactamente 8 dígitos.',
                'ci_cli.regex' => 'El CI debe tener entre 7 y 10 números seguido de un espacio y la extensión del departamento en mayúsculas (ej: 1234567 LP).',
            ]);

            $cliente->update($validated);
            return $cliente;
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar cliente: ' . $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->delete();

        return response()->json(['message' => 'Cliente eliminado']);
    }

    public function reporteClientes(Request $request)
    {
        // Obtiene los parámetros de filtrado
        $nombre = $request->input('nom_cli');
        $ci = $request->input('ci_cli');

        // Construye la consulta base
        $query = Cliente::with('usuario');

        // Aplica filtro por nombre si se proporciona
        if (!is_null($nombre)) {
            $query->where('nom_cli', 'like', "%$nombre%");
        }

        // Aplica filtro por CI si se proporciona
        if (!is_null($ci)) {
            $query->where('ci_cli', $ci);
        }

        // Ejecuta la consulta y obtiene los resultados
        $clientes = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'clientes.reporte')
        $pdf = Pdf::loadView('clientes.reporte', compact('clientes'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_clientes.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'clientes';
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

        $clientes = Cliente::all();
        $insertSQL = "";

        foreach ($clientes as $cliente) {
            $attrs = $cliente->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_clientes.sql');
    }
}
