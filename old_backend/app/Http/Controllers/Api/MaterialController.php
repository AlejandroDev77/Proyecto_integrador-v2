<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class MaterialController extends Controller
{
    private $r2_base_url = 'https://pub-6754bd9df8644a73aa7462b6f3042f84.r2.dev';

    public function index(Request $request)
    {
        return QueryBuilder::for(Material::class)
            ->allowedFilters([
                AllowedFilter::callback('cod_mat', function ($query, $value) {
                    $query->where('cod_mat', '=', $value);
                }),
                AllowedFilter::callback('nom_mat', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_mat) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('desc_mat', function ($query, $value) {
                    $query->whereRaw('LOWER(desc_mat) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('stock_mat_min', function ($query, $value) {
                    if ($value) $query->where('stock_mat', '>=', $value);
                }),
                AllowedFilter::callback('stock_mat_max', function ($query, $value) {
                    if ($value) $query->where('stock_mat', '<=', $value);
                }),
                AllowedFilter::callback('costo_mat_min', function ($query, $value) {
                    if ($value) $query->where('costo_mat', '>=', $value);
                }),
                AllowedFilter::callback('costo_mat_max', function ($query, $value) {
                    if ($value) $query->where('costo_mat', '<=', $value);
                }),
                'unidad_medida',
                AllowedFilter::callback('est_mat', function ($query, $value) {
                    if ($value !== null) {
                        $boolValue = $value === 'true' || $value === '1' || $value === 1 || $value === true;
                        $query->where('est_mat', $boolValue);
                    }
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_mat) LIKE LOWER(?)', ["%{$value}%"])
                          ->orWhereRaw('LOWER(desc_mat) LIKE LOWER(?)', ["%{$value}%"])
                          ->orWhere('cod_mat', '=', $value);
                }),
            ])
            ->allowedSorts(['id_mat', 'nom_mat', 'stock_mat', 'costo_mat', 'est_mat', 'cod_mat'])
            ->paginate($request->input('per_page', 20));
    }
    

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom_mat' => [
                    'required',
                    'string',
                    'max:200',
                    'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/u',
                    function ($attribute, $value, $fail) {
                        $exists = DB::table('materiales')
                            ->whereRaw('LOWER(nom_mat) = LOWER(?)', [$value])
                            ->exists();
                        if ($exists) {
                            $fail('Ya existe un material con este nombre.');
                        }
                    }
                ],
                'desc_mat' => 'required|string|max:300',
                'stock_mat' => 'required|numeric',
                'unidad_medida' => 'required|string|max:50',
                'costo_mat' => 'required|numeric',
                'img_mat' => 'nullable|image|max:5120', // Archivo de imagen, max 5MB
                'est_mat' => 'nullable|boolean',
                'stock_min' => 'required|numeric',
            ], [
                'nom_mat.regex' => 'El nombre del material solo debe contener letras y espacios.',
                'nom_mat.unique' => 'Ya existe un material con este nombre.',
                'img_mat.image' => 'El archivo debe ser una imagen válida.',
                'img_mat.max' => 'La imagen no debe superar 5MB.',
            ]);

            // Generar código
            $nextId = 1;
            do {
                $cod_mat = 'MAT-' . $nextId;
                $nextId++;
            } while (Material::where('cod_mat', $cod_mat)->exists());
            $validated['cod_mat'] = $cod_mat;

            // === Subir imagen a Cloudflare R2 ===
            if ($request->hasFile('img_mat')) {
                $file = $request->file('img_mat');
                $path = 'materiales/images/' . uniqid() . '.' . $file->getClientOriginalExtension();
                Storage::disk('s3')->put($path, file_get_contents($file), 'public');
                $validated['img_mat'] = $this->r2_base_url . '/' . $path;
            }

            $material = Material::create($validated);
            return response()->json($material, 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Los datos enviados no son válidos.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar material: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        return Material::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $material = Material::findOrFail($id);
        try {
            $validated = $request->validate([
                'nom_mat' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:200',
                    'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/u',
                    function ($attribute, $value, $fail) use ($id) {
                        $exists = DB::table('materiales')
                            ->where('id_mat', '!=', $id)
                            ->whereRaw('LOWER(nom_mat) = LOWER(?)', [$value])
                            ->exists();
                        if ($exists) {
                            $fail('Ya existe un material con este nombre (sin considerar mayúsculas/minúsculas).');
                        }
                    }
                ],
                'desc_mat' => 'sometimes|required|string|max:300',
                'stock_mat' => 'sometimes|required|numeric',
                'unidad_medida' => 'sometimes|required|string|max:50',
                'costo_mat' => 'sometimes|required|numeric',
                'img_mat' => 'nullable|image|max:5120', // Archivo de imagen, max 5MB
                'est_mat' => 'nullable|boolean',
                'stock_min' => 'sometimes|required|numeric',
            ], [
                'nom_mat.regex' => 'El nombre del material solo debe contener letras y espacios.',
                'img_mat.image' => 'El archivo debe ser una imagen válida.',
                'img_mat.max' => 'La imagen no debe superar 5MB.',
            ]);

            // === Nueva imagen a Cloudflare R2 ===
            if ($request->hasFile('img_mat')) {
                $file = $request->file('img_mat');
                $path = 'materiales/images/' . uniqid() . '.' . $file->getClientOriginalExtension();
                Storage::disk('s3')->put($path, file_get_contents($file), 'public');
                $validated['img_mat'] = $this->r2_base_url . '/' . $path;
            }

            $material->update($validated);
            return response()->json($material, 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Los datos enviados no son válidos.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar material: ' . $e->getMessage()], 500);
        }
    }

    public function cambiarEstado(Request $request, $id)
    {
        $request->validate([
            'est_mat' => 'required|boolean',
        ]);

        $material = Material::findOrFail($id);
        $material->est_mat = $request->est_mat;
        $material->save();

        return response()->json($material);
    }

    public function destroy($id)
    {
        $material = Material::findOrFail($id);
        $material->delete();

        return response()->json(['message' => 'Material eliminado']);
    }

    public function reporteMateriales(Request $request)
    {
        // Obtiene los parámetros de filtrado
        $nombre = $request->input('nom_mat');
        $estado = $request->input('est_mat');

        // Construye la consulta base
        $query = Material::query();

        // Aplica filtro por nombre si se proporciona
        if (!is_null($nombre)) {
            $query->where('nom_mat', 'like', "%$nombre%");
        }

        // Aplica filtro por estado si se proporciona
        if (!is_null($estado)) {
            $query->where('est_mat', $estado);
        }

        // Ejecuta la consulta y obtiene los resultados
        $materiales = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'materiales.reporte')
        $pdf = Pdf::loadView('materiales.reporte', compact('materiales'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_materiales.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'materiales';
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

        $materiales = Material::all();
        $insertSQL = "";

        foreach ($materiales as $material) {
            $attrs = $material->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_materiales.sql');
    }
}