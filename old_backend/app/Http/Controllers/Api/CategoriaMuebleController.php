<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CategoriaMueble;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class CategoriaMuebleController extends Controller
{
    public function index(Request $request)
    {
        return QueryBuilder::for(CategoriaMueble::class)
            ->allowedFilters([
                AllowedFilter::callback('cod_cat', function ($query, $value) {
                    $query->where('cod_cat', '=', $value);
                }),
                AllowedFilter::callback('nom_cat', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_cat) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('desc_cat', function ($query, $value) {
                    $query->whereRaw('LOWER(desc_cat) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where('nom_cat', 'like', "%{$value}%")
                        ->orWhere('desc_cat', 'like', "%{$value}%");
                }),
            ])
            ->allowedSorts(['desc_cat', 'nom_cat', 'cod_cat'])
            ->paginate($request->input('per_page', 20));
    }


    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom_cat' => ['required', 'string', 'max:100', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/u'],
                'desc_cat' => 'nullable|string|max:255',
            ], [
                'nom_cat.required' => 'El nombre de la categoría es obligatorio.',
                'nom_cat.string' => 'El nombre de la categoría debe ser texto.',
                'nom_cat.max' => 'El nombre de la categoría no puede exceder 100 caracteres.',
                'nom_cat.regex' => 'El nombre de la categoría solo debe contener letras y espacios.',
                'desc_cat.string' => 'La descripción debe ser texto.',
                'desc_cat.max' => 'La descripción no puede exceder 255 caracteres.',
            ]);
            $nextId = 1;
            do {
                $cod_cat = 'CAT-' . $nextId;
                $nextId++;
            } while (CategoriaMueble::where('cod_cat', $cod_cat)->exists());
            $validated['cod_cat'] = $cod_cat;
            return CategoriaMueble::create($validated);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Los datos proporcionados no son válidos.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar categoría: ' . $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        return CategoriaMueble::with('categoriamueble')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $categoriamueble = CategoriaMueble::findOrFail($id);
        try {
            $validated = $request->validate([
                'nom_cat' => ['sometimes', 'required', 'string', 'max:100', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/u'],
                'desc_cat' => 'nullable|string|max:255',
            ], [
                'nom_cat.required' => 'El nombre de la categoría es obligatorio.',
                'nom_cat.string' => 'El nombre de la categoría debe ser texto.',
                'nom_cat.max' => 'El nombre de la categoría no puede exceder 100 caracteres.',
                'nom_cat.regex' => 'El nombre de la categoría solo debe contener letras y espacios.',
                'desc_cat.string' => 'La descripción debe ser texto.',
                'desc_cat.max' => 'La descripción no puede exceder 255 caracteres.',
            ]);
            $categoriamueble->update($validated);
            return $categoriamueble;
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Los datos proporcionados no son válidos.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar categoría: ' . $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $categoriamueble = CategoriaMueble::findOrFail($id);
        $categoriamueble->delete();

        return response()->json(['message' => 'Material eliminado']);
    }

    public function reporteCategorias(Request $request)
    {
        // Obtiene los parámetros de filtrado
        $nombre = $request->input('nom_cat');

        // Construye la consulta base
        $query = CategoriaMueble::query();

        // Aplica filtro por nombre si se proporciona
        if (!is_null($nombre)) {
            $query->where('nom_cat', 'like', "%$nombre%");
        }

        // Ejecuta la consulta y obtiene los resultados
        $categorias = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'categorias.reporte')
        $pdf = Pdf::loadView('categorias.reporte', compact('categorias'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_categorias.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'categorias_muebles';
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

        $categoriasMuebles = CategoriaMueble::all();
        $insertSQL = "";

        foreach ($categoriasMuebles as $categoriaMueble) {
            $attrs = $categoriaMueble->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_categorias_muebles.sql');
    }
}
