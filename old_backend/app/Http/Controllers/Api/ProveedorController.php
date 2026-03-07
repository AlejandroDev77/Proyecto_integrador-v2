<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ProveedorController extends Controller
{
    public function index(Request $request)
    {
        return QueryBuilder::for(Proveedor::class)
            ->allowedFilters([
                AllowedFilter::callback('cod_prov', function ($query, $value) {
                    $query->where('cod_prov', '=', $value);
                }),
                AllowedFilter::callback('nom_prov', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_prov) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('contacto_prov', function ($query, $value) {
                    $query->whereRaw('LOWER(contacto_prov) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('tel_prov', function ($query, $value) {
                    $query->where(DB::raw('CAST(tel_prov AS TEXT)'), 'like', "%{$value}%");
                }),
                AllowedFilter::callback('email_prov', function ($query, $value) {
                    $query->whereRaw('LOWER(email_prov) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('dir_prov', function ($query, $value) {
                    $query->whereRaw('LOWER(dir_prov) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('nit_prov', function ($query, $value) {
                    $query->where('nit_prov', '=', $value);
                }),
                AllowedFilter::callback('est_prov', function ($query, $value) {
                    if ($value !== null) {
                        $boolValue = $value === 'true' || $value === '1' || $value === 1 || $value === true;
                        $query->where('est_prov', $boolValue);
                    }
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_prov) LIKE LOWER(?)', ["%{$value}%"])
                          ->orWhereRaw('LOWER(contacto_prov) LIKE LOWER(?)', ["%{$value}%"])
                          ->orWhereRaw('LOWER(email_prov) LIKE LOWER(?)', ["%{$value}%"])
                          ->orWhere('cod_prov', '=', $value);
                }),
            ])
            ->allowedSorts(['contacto_prov','nom_prov', 'tel_prov', 'est_prov', 'cod_prov' ,'email_prov' ,'dir_prov', 'nit_prov' , 'est_prov'])
            ->paginate($request->input('per_page', 20));
    }
    

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom_prov' => ['required', 'string', 'max:200', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/u'],
                'contacto_prov' => ['required', 'string', 'max:200', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/u'],
                'tel_prov' => ['required', 'digits:8'],
                'email_prov' => 'required|email|max:100',
                'dir_prov' => 'required|string|max:300',
                'nit_prov' => ['required', 'string', 'max:50', 'regex:/^\d+$/'],
                'est_prov' => 'nullable|boolean',
            ], [
                'nom_prov.regex' => 'El nombre no debe contener números ni caracteres especiales.',
                'contacto_prov.regex' => 'El contacto no debe contener números ni caracteres especiales.',
                'tel_prov.digits' => 'El teléfono debe tener exactamente 8 números.',
                'nit_prov.regex' => 'El NIT solo debe contener números.',
            ]);
            // Generar código automáticamente
            $nextId = 1;
            do {
                $cod_prov = 'PRV-' . $nextId;
                $nextId++;
            } while (Proveedor::where('cod_prov', $cod_prov)->exists());
            $validated['cod_prov'] = $cod_prov;
            return Proveedor::create($validated);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar proveedor: ' . $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        return Proveedor::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $proveedor = Proveedor::findOrFail($id);
        try {
            $validated = $request->validate([
                'nom_prov' => ['sometimes', 'required', 'string', 'max:200', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/u'],
                'contacto_prov' => ['sometimes', 'required', 'string', 'max:200', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/u'],
                'tel_prov' => ['sometimes', 'required', 'digits:8'],
                'email_prov' => 'sometimes|required|email|max:100',
                'dir_prov' => 'sometimes|required|string|max:300',
                'nit_prov' => ['sometimes', 'required', 'string', 'max:50', 'regex:/^\d+$/'],
                'est_prov' => 'nullable|boolean',
            ], [
                'nom_prov.regex' => 'El nombre no debe contener números ni caracteres especiales.',
                'contacto_prov.regex' => 'El contacto no debe contener números ni caracteres especiales.',
                'tel_prov.digits' => 'El teléfono debe tener exactamente 8 números.',
                'nit_prov.regex' => 'El NIT solo debe contener números.',
            ]);
            $proveedor->update($validated);
            return $proveedor;
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar proveedor: ' . $e->getMessage()], 400);
        }
    }
    public function cambiarEstado(Request $request, $id)
    {
        $request->validate([
            'est_prov' => 'required|boolean',
        ]);

        $proveedor = Proveedor::findOrFail($id);
        $proveedor->est_prov = $request->est_prov;
        $proveedor->save();

        return response()->json($proveedor);
    }

    public function destroy($id)
    {
        $proveedor = Proveedor::findOrFail($id);
        $proveedor->delete();

        return response()->json(['message' => 'Proveedor eliminado']);
    }

    public function reporteProveedores(Request $request)
    {
        // Obtiene los parámetros de filtrado
        $nombre = $request->input('nom_prov');
        $estado = $request->input('est_prov');

        // Construye la consulta base
        $query = Proveedor::query();

        // Aplica filtro por nombre si se proporciona
        if (!is_null($nombre)) {
            $query->where('nom_prov', 'like', "%$nombre%");
        }

        // Aplica filtro por estado si se proporciona
        if (!is_null($estado)) {
            $query->where('est_prov', $estado);
        }

        // Ejecuta la consulta y obtiene los resultados
        $proveedores = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'proveedores.reporte')
        $pdf = Pdf::loadView('proveedores.reporte', compact('proveedores'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_proveedores.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'proveedores';
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

        $proveedores = Proveedor::all();
        $insertSQL = "";

        foreach ($proveedores as $proveedor) {
            $attrs = $proveedor->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_proveedores.sql');
    }
}