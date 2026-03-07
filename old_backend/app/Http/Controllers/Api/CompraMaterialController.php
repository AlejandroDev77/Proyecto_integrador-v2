<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\CompraMaterial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Importar Storage
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB; // Importar DB
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class CompraMaterialController extends Controller
{
    public function index(Request $request)
    {
        return QueryBuilder::for(CompraMaterial::class)
            ->with(['empleado', 'proveedor'])
            ->allowedFilters([
                AllowedFilter::callback('cod_comp', function ($query, $value) {
                    $query->where('cod_comp', '=', $value);
                }),
                AllowedFilter::callback('fec_comp_exact', function ($query, $value) {
                    $query->whereRaw("DATE(fec_comp) = ?", [$value]);
                }),
                AllowedFilter::callback('fec_comp_min', function ($query, $value) {
                    $query->whereRaw("DATE(fec_comp) >= ?", [$value]);
                }),
                AllowedFilter::callback('fec_comp_max', function ($query, $value) {
                    $query->whereRaw("DATE(fec_comp) <= ?", [$value]);
                }),
                AllowedFilter::callback('total_comp_min', function ($query, $value) {
                    if ($value) $query->where('total_comp', '>=', $value);
                }),
                AllowedFilter::callback('nom_prov', function ($query, $value) {
                    $query->whereHas('proveedor', function ($q) use ($value) {
                        $q->where('nom_prov', 'like', "%{$value}%");
                    });
                }),
                AllowedFilter::callback('total_comp_max', function ($query, $value) {
                    if ($value) $query->where('total_comp', '<=', $value);
                }),
                'est_comp',
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where('cod_comp', '=', $value)
                          ->orWhere('est_comp', 'like', "%{$value}%");
                }),
            ])
            ->allowedSorts([ 'fec_comp', 'total_comp', 'est_comp', 'cod_comp', 'empleado.nom_emp', 'proveedor.nom_prov'])
            ->paginate($request->input('per_page', 20));
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fec_comp' => 'required|date',
            'est_comp' => 'required|string|max:50',
            'total_comp' => 'required|numeric|min:0',
            'id_prov' => 'required|exists:proveedores,id_prov',
            'id_emp' => 'required|exists:empleados,id_emp',
        ], [
            'fec_comp.required' => 'La fecha de compra es obligatoria.',
            'fec_comp.date' => 'La fecha debe tener un formato válido.',
            'est_comp.required' => 'El estado es obligatorio.',
            'est_comp.string' => 'El estado debe ser texto.',
            'est_comp.max' => 'El estado no puede exceder 50 caracteres.',
            'total_comp.required' => 'El total es obligatorio.',
            'total_comp.numeric' => 'El total debe ser un número.',
            'total_comp.min' => 'El total no puede ser negativo.',
            'id_prov.required' => 'El proveedor es obligatorio.',
            'id_prov.exists' => 'El proveedor seleccionado no existe.',
            'id_emp.required' => 'El empleado es obligatorio.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
        ]);

        $nextId = 1;
        do {
            $cod_comp = 'COMP-' . $nextId;
            $nextId++;
        } while (CompraMaterial::where('cod_comp', $cod_comp)->exists());
        $validated['cod_comp'] = $cod_comp;

        return CompraMaterial::create($validated);
    }

    public function show($id)
    {
        return CompraMaterial::with(['empleado', 'proveedor'])->findOrFail($id);
    
    }
    

    public function update(Request $request, $id)
    {
        $comprasmateriales = CompraMaterial::findOrFail($id);

        $validated = $request->validate([
            'fec_comp' => 'sometimes|required|date',
            'est_comp' => 'sometimes|required|string|max:50',
            'total_comp' => 'sometimes|required|numeric|min:0',
            'id_prov' => 'sometimes|required|exists:proveedores,id_prov',
            'id_emp' => 'sometimes|required|exists:empleados,id_emp',
        ], [
            'fec_comp.required' => 'La fecha de compra es obligatoria.',
            'fec_comp.date' => 'La fecha debe tener un formato válido.',
            'est_comp.required' => 'El estado es obligatorio.',
            'est_comp.string' => 'El estado debe ser texto.',
            'est_comp.max' => 'El estado no puede exceder 50 caracteres.',
            'total_comp.required' => 'El total es obligatorio.',
            'total_comp.numeric' => 'El total debe ser un número.',
            'total_comp.min' => 'El total no puede ser negativo.',
            'id_prov.required' => 'El proveedor es obligatorio.',
            'id_prov.exists' => 'El proveedor seleccionado no existe.',
            'id_emp.required' => 'El empleado es obligatorio.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
        ]);


        $comprasmateriales->update($validated);

        return $comprasmateriales;
    }
    

    public function destroy($id)
    {
        $comprasmateriales  = CompraMaterial::findOrFail($id);
        $comprasmateriales ->delete();

        return response()->json(['message' => 'Empleado eliminado']);
    }

    public function reporteComprasMateriales(Request $request)
    {
        // Obtiene los parámetros de filtrado
        $fecha = $request->input('fec_comp');
        $estado = $request->input('est_comp');

        // Construye la consulta base
        $query = CompraMaterial::with(['empleado', 'proveedor']);

        // Aplica filtro por fecha si se proporciona
        if (!is_null($fecha)) {
            $query->whereDate('fec_comp', $fecha);
        }

        // Aplica filtro por estado si se proporciona
        if (!is_null($estado)) {
            $query->where('est_comp', $estado);
        }

        // Ejecuta la consulta y obtiene los resultados
        $comprasMateriales = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'comprasMateriales.reporte')
        $pdf = Pdf::loadView('comprasMateriales.reporte', compact('comprasMateriales'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_compras_materiales.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'compras_materiales';
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

        $comprasMateriales = CompraMaterial::all();
        $insertSQL = "";

        foreach ($comprasMateriales as $compraMaterial) {
            $attrs = $compraMaterial->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_compras_materiales.sql');
    }
}