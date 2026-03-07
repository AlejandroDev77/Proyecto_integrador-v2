<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Diseño;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class DiseñoController extends Controller
{
    private $r2_base_url = 'https://pub-6754bd9df8644a73aa7462b6f3042f84.r2.dev'; // Public URL de tu bucket R2

    public function index(Request $request)
    {
        return QueryBuilder::for(Diseño::class)
            ->with('cotizacion')
            ->allowedFilters([
                AllowedFilter::callback('cod_dis', function ($query, $value) {
                    $query->where('cod_dis', '=', $value);
                }),
                AllowedFilter::callback('nom_dis', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_dis) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('desc_dis', function ($query, $value) {
                    $query->whereRaw('LOWER(desc_dis) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where('nom_dis', 'like', "%{$value}%")
                          ->orWhere('cod_dis', 'like', "%{$value}%");
                }),
            ])
            ->allowedSorts(['id_dis', 'nom_dis', 'cod_dis'])
            ->paginate($request->input('per_page', 20));
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom_dis' => ['required', 'string', 'max:200'],
                'desc_dis' => 'nullable|string|max:300',
                'archivo_3d' => 'nullable|file|extensions:glb,obj,gltf|max:51200', // Máx 50MB
                'img_dis' => 'nullable|image|max:5120', // Máx 5MB
                'id_cot' => 'required|exists:cotizaciones,id_cot',
            ]);

            // Generar código automáticamente
            $nextId = 1;
            do {
                $cod_dis = 'DIS-' . $nextId;
                $nextId++;
            } while (Diseño::where('cod_dis', $cod_dis)->exists());
            $validated['cod_dis'] = $cod_dis;

            // === Subir imagen a Cloudflare R2 ===
            if ($request->hasFile('img_dis')) {
                $file = $request->file('img_dis');
                $path = 'diseños/images/' . uniqid() . '.' . $file->getClientOriginalExtension();
                Storage::disk('s3')->put($path, file_get_contents($file), 'public');
                $validated['img_dis'] = $this->r2_base_url . '/' . $path;
            }

            // === Subir modelo 3D a Cloudflare R2 ===
            if ($request->hasFile('archivo_3d')) {
                $file3d = $request->file('archivo_3d');
                $path3d = 'diseños/models/' . uniqid() . '.' . $file3d->getClientOriginalExtension();
                Storage::disk('s3')->put($path3d, file_get_contents($file3d), 'public');
                $validated['archivo_3d'] = $this->r2_base_url . '/' . $path3d;
            }

            $diseño = Diseño::create($validated);
            $diseño->load('cotizacion'); // Cargar la relación cotizacion
            return response()->json($diseño, 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Los datos enviados no son válidos.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar diseño: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        return Diseño::with('cotizacion')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $diseño = Diseño::findOrFail($id);

        try {
            $validated = $request->validate([
                'nom_dis' => 'sometimes|required|string|max:200',
                'desc_dis' => 'nullable|string|max:300',
                'archivo_3d' => 'nullable|file|extensions:glb,obj,gltf|max:51200', // Máx 50MB
                'img_dis' => 'nullable|image|max:5120', // Máx 5MB
                'id_cot' => 'sometimes|required|exists:cotizaciones,id_cot',
            ]);

            // === Nueva imagen a Cloudflare R2 ===
            if ($request->hasFile('img_dis')) {
                $file = $request->file('img_dis');
                $path = 'diseños/images/' . uniqid() . '.' . $file->getClientOriginalExtension();
                Storage::disk('s3')->put($path, file_get_contents($file), 'public');
                $validated['img_dis'] = $this->r2_base_url . '/' . $path;
            }

            // === Nuevo modelo 3D a Cloudflare R2 ===
            if ($request->hasFile('archivo_3d')) {
                $file3d = $request->file('archivo_3d');
                $path3d = 'diseños/models/' . uniqid() . '.' . $file3d->getClientOriginalExtension();
                Storage::disk('s3')->put($path3d, file_get_contents($file3d), 'public');
                $validated['archivo_3d'] = $this->r2_base_url . '/' . $path3d;
            }

            $diseño->update($validated);
            $diseño->load('cotizacion'); // Cargar la relación cotizacion
            return response()->json($diseño, 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Los datos enviados no son válidos.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar diseño: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $diseño = Diseño::findOrFail($id);
        $diseño->delete();
        return response()->json(['message' => 'Diseño eliminado correctamente.']);
    }

    public function reporteDiseños(Request $request)
    {
        $nombre = $request->input('nom_dis');
        $query = Diseño::with('cotizacion');

        if (!is_null($nombre)) {
            $query->where('nom_dis', 'like', "%$nombre%");
        }

        $diseños = $query->get();
        $pdf = Pdf::loadView('diseños.reporte', compact('diseños'));
        return $pdf->stream('reporte_diseños.pdf');
    }

    public function exportarSQL()
    {
        $table = 'diseños';
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

        $diseños = Diseño::all();
        $insertSQL = "";

        foreach ($diseños as $diseño) {
            $attrs = $diseño->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_diseños.sql');
    }
}