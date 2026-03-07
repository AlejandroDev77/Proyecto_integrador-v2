<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mueble;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class MuebleController extends Controller
{
    private $r2_base_url = 'https://pub-6754bd9df8644a73aa7462b6f3042f84.r2.dev'; // Public URL de tu bucket R2

    /**
     * Mostrar todos los muebles con paginación usando QueryBuilder
     */
    public function index(Request $request)
    {
        $muebles = QueryBuilder::for(Mueble::class)
            ->with('categoria')
            ->allowedFilters([
                AllowedFilter::callback('cod_mue', function ($query, $value) {
                    $query->where('cod_mue', '=', $value);
                }),
                AllowedFilter::callback('nom_mue', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_mue) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('desc_mue', function ($query, $value) {
                    $query->whereRaw('LOWER(desc_mue) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('precio_venta_min', function ($query, $value) {
                    if ($value) $query->where('precio_venta', '>=', $value);
                }),
                AllowedFilter::callback('precio_venta_max', function ($query, $value) {
                    if ($value) $query->where('precio_venta', '<=', $value);
                }),
                AllowedFilter::callback('precio_costo_min', function ($query, $value) {
                    if ($value) $query->where('precio_costo', '>=', $value);
                }),
                AllowedFilter::callback('precio_costo_max', function ($query, $value) {
                    if ($value) $query->where('precio_costo', '<=', $value);
                }),
                AllowedFilter::callback('stock_min', function ($query, $value) {
                    if ($value) $query->where('stock', '>=', $value);
                }),
                AllowedFilter::callback('stock_max', function ($query, $value) {
                    if ($value) $query->where('stock', '<=', $value);
                }),
                AllowedFilter::callback('nom_cat', function ($query, $value) {
                    // Filtrar por nombre de categoría en la relación
                    $query->whereHas('categoria', function ($subQuery) use ($value) {
                        $subQuery->whereRaw('LOWER(nom_cat) LIKE LOWER(?)', ["%{$value}%"]);
                    });
                }),
                AllowedFilter::callback('est_mue', function ($query, $value) {
                    if ($value !== null) {
                        $boolValue = $value === 'true' || $value === '1' || $value === 1 || $value === true;
                        $query->where('est_mue', $boolValue);
                    }
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_mue) LIKE LOWER(?)', ["%{$value}%"])
                          ->orWhere('cod_mue', '=', $value)
                          ->orWhereRaw('LOWER(desc_mue) LIKE LOWER(?)', ["%{$value}%"]);
                }),
            ])
            ->allowedSorts(['id_mue', 'nom_mue', 'precio_venta', 'precio_costo', 'stock', 'est_mue', 'cod_mue'])
            ->paginate($request->input('per_page', 20));
        
        return response()->json($muebles);
    }

    /**
     * Registrar un nuevo mueble
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom_mue' => ['required', 'string', 'max:200', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/u'],
                'desc_mue' => 'required|string|max:300',
                'img_mue' => 'nullable|image|max:5120', // Máx 5MB
                'precio_venta' => 'required|numeric',
                'stock' => 'required|numeric',
                'modelo_3d' => 'nullable|file|extensions:glb,obj,gltf|max:51200', // Máx 50MB
                'dimensiones' => 'required|string|max:200',
                'est_mue' => 'required|boolean',
                'stock_min' => 'required|numeric',
                'precio_costo' => 'required|numeric',
                'id_cat' => 'required|exists:categorias_muebles,id_cat',
            ], [
                'nom_mue.regex' => 'El nombre del mueble solo debe contener letras y espacios.',
            ]);

            // Generar código único
            $nextId = 1;
            do {
                $cod_mue = 'MUE-' . $nextId;
                $nextId++;
            } while (Mueble::where('cod_mue', $cod_mue)->exists());
            $validated['cod_mue'] = $cod_mue;

            // === Subir imagen a Cloudflare R2 ===
            if ($request->hasFile('img_mue')) {
                $file = $request->file('img_mue');
                $path = 'images/' . uniqid() . '.' . $file->getClientOriginalExtension();
                Storage::disk('s3')->put($path, file_get_contents($file), 'public');
                $validated['img_mue'] = $this->r2_base_url . '/' . $path;
            }

            // === Subir modelo 3D a Cloudflare R2 ===
            if ($request->hasFile('modelo_3d')) {
                $file3d = $request->file('modelo_3d');
                $path3d = 'models/' . uniqid() . '.' . $file3d->getClientOriginalExtension();
                Storage::disk('s3')->put($path3d, file_get_contents($file3d), 'public');
                $validated['modelo_3d'] = $this->r2_base_url . '/' . $path3d;
            }

            $mueble = Mueble::create($validated);
            return response()->json($mueble, 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Los datos enviados no son válidos.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar mueble: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Mostrar un mueble específico
     */
    public function show($id)
    {
        $mueble = Mueble::with('categoria')->findOrFail($id);
        return response()->json($mueble);
    }

    /**
     * Actualizar mueble
     */
    public function update(Request $request, $id)
    {
        $mueble = Mueble::findOrFail($id);

        try {
            $validated = $request->validate([
                'nom_mue' => ['sometimes', 'required', 'string', 'max:200', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/u'],
                'desc_mue' => 'sometimes|required|string|max:300',
                'img_mue' => 'nullable|image|max:5120',
                'precio_venta' => 'sometimes|required|numeric',
                'stock' => 'sometimes|required|numeric',
                'modelo_3d' => 'nullable|file|extensions:glb,obj,gltf|max:51200',
                'dimensiones' => 'sometimes|required|string|max:200',
                'est_mue' => 'sometimes|required|boolean',
                'stock_min' => 'sometimes|required|numeric',
                'precio_costo' => 'sometimes|required|numeric',
                'id_cat' => 'sometimes|required|exists:categorias_muebles,id_cat',
            ]);

            // Nueva imagen
            if ($request->hasFile('img_mue')) {
                $file = $request->file('img_mue');
                $path = 'images/' . uniqid() . '.' . $file->getClientOriginalExtension();
                Storage::disk('s3')->put($path, file_get_contents($file), 'public');
                $validated['img_mue'] = $this->r2_base_url . '/' . $path;
            }

            // Nuevo modelo 3D
            if ($request->hasFile('modelo_3d')) {
                $file3d = $request->file('modelo_3d');
                $path3d = 'models/' . uniqid() . '.' . $file3d->getClientOriginalExtension();
                Storage::disk('s3')->put($path3d, file_get_contents($file3d), 'public');
                $validated['modelo_3d'] = $this->r2_base_url . '/' . $path3d;
            }

            $mueble->update($validated);
            return response()->json($mueble, 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Los datos enviados no son válidos.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar mueble: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Cambiar estado de mueble (activo/inactivo)
     */
    public function cambiarEstado(Request $request, $id)
    {
        $request->validate(['est_mue' => 'required|boolean']);
        $mueble = Mueble::findOrFail($id);
        $mueble->est_mue = $request->est_mue;
        $mueble->save();

        return response()->json($mueble);
    }

    /**
     * Eliminar un mueble
     */
    public function destroy($id)
    {
        $mueble = Mueble::findOrFail($id);
        $mueble->delete();
        return response()->json(['message' => 'Mueble eliminado correctamente.']);
    }

    /**
     * Generar PDF con reporte de muebles
     */
    public function reporteMuebles(Request $request)
    {
        $nombre = $request->input('nom_mue');
        $estado = $request->input('est_mue');

        $query = Mueble::with('categoria');
        if ($nombre) $query->where('nom_mue', 'like', "%$nombre%");
        if (!is_null($estado)) $query->where('est_mue', $estado);

        $muebles = $query->get();
        $pdf = Pdf::loadView('muebles.reporte', compact('muebles'));
        return $pdf->stream('reporte_muebles.pdf');
    }

    /**
     * Exportar respaldo SQL de la tabla muebles
     */
    public function exportarSQL()
    {
        $table = 'muebles';
        $schema = DB::select("SELECT column_name, data_type, character_maximum_length, is_nullable 
                              FROM information_schema.columns 
                              WHERE table_name = '$table' ORDER BY ordinal_position");

        $createTableSQL = "DROP TABLE IF EXISTS \"$table\";\nCREATE TABLE \"$table\" (\n";
        $columns = [];

        foreach ($schema as $column) {
            $line = "  \"$column->column_name\" " . strtoupper($column->data_type);
            if ($column->character_maximum_length) $line .= "({$column->character_maximum_length})";
            if ($column->is_nullable === 'NO') $line .= " NOT NULL";
            $columns[] = $line;
        }

        $createTableSQL .= implode(",\n", $columns) . "\n);\n\n";

        $muebles = Mueble::all();
        $insertSQL = "";
        foreach ($muebles as $mueble) {
            $attrs = $mueble->getAttributes();
            $colNames = '"' . implode('", "', array_keys($attrs)) . '"';
            $colValues = collect(array_values($attrs))
                ->map(fn($val) => is_null($val) ? 'NULL' : "'" . addslashes($val) . "'")
                ->implode(', ');
            $insertSQL .= "INSERT INTO \"$table\" ($colNames) VALUES ($colValues);\n";
        }

        $finalSQL = $createTableSQL . $insertSQL;
        return response($finalSQL)
            ->header('Content-Type', 'text/plain')
            ->header('Content-Disposition', 'attachment; filename=backup_muebles.sql');
    }
}
