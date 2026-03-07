<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cotizacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Importar Storage
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB; // Importar DB
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Helpers\StringHelper;

class CotizacionController extends Controller
{
    public function index(Request $request)
    {
        return QueryBuilder::for(Cotizacion::class)
            ->with(['empleado', 'cliente'])
            ->leftJoin('empleados', 'cotizaciones.id_emp', '=', 'empleados.id_emp')
            ->leftJoin('clientes', 'cotizaciones.id_cli', '=', 'clientes.id_cli')
            ->select('cotizaciones.*')
            ->allowedFilters([
                AllowedFilter::callback('cod_cot', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(cod_cot), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),
                AllowedFilter::callback('fec_cot_exact', function ($query, $value) {
                    $query->whereRaw("DATE(fec_cot) = ?", [$value]);
                }),
                AllowedFilter::callback('fec_cot_min', function ($query, $value) {
                    $query->whereRaw("DATE(fec_cot) >= ?", [$value]);
                }),
                AllowedFilter::callback('fec_cot_max', function ($query, $value) {
                    $query->whereRaw("DATE(fec_cot) <= ?", [$value]);
                }),
                AllowedFilter::callback('total_cot_min', function ($query, $value) {
                    if ($value) $query->where('total_cot', '>=', $value);
                }),
                AllowedFilter::callback('total_cot_max', function ($query, $value) {
                    if ($value) $query->where('total_cot', '<=', $value);
                }),
                AllowedFilter::callback('nom_cli', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(clientes.nom_cli), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),
                AllowedFilter::callback('nom_emp', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(empleados.nom_emp), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]                    );
                }),
                AllowedFilter::callback('est_cot', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(est_cot), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(cod_cot), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    )->orWhereRaw(
                        "translate(lower(est_cot), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),
                // Filtro para excluir cotizaciones que ya tienen producción
                AllowedFilter::callback('sin_produccion', function ($query, $value) {
                    if ($value === 'true' || $value === '1' || $value === true) {
                        $query->whereNotExists(function ($subquery) {
                            $subquery->select(DB::raw(1))
                                ->from('produccion')
                                ->whereColumn('produccion.id_cot', 'cotizaciones.id_cot');
                        });
                    }
                }),
            ])
            ->allowedSorts(['fec_cot', 'est_cot', 'total_cot', 'cod_cot', 'empleados.nom_emp', 'clientes.nom_cli', 'notas', 'descuento', 'validez_dias'])
            ->paginate($request->input('per_page', 20));
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'fec_cot' => 'required|date',
            'est_cot' => 'required|string|max:50',
            'validez_dias' => 'required|integer|min:1',
            'total_cot' => 'required|numeric|min:0',
            'descuento' => 'required|numeric|min:0',
            'id_cli' => 'required|exists:clientes,id_cli',
            'id_emp' => 'required|exists:empleados,id_emp',
            'notas' => 'nullable|string|max:500',
        ], [
            'fec_cot.required' => 'La fecha de cotización es obligatoria.',
            'fec_cot.date' => 'La fecha debe tener un formato válido.',
            'est_cot.required' => 'El estado es obligatorio.',
            'est_cot.string' => 'El estado debe ser texto.',
            'est_cot.max' => 'El estado no puede exceder 50 caracteres.',
            'validez_dias.required' => 'La validez en días es obligatoria.',
            'validez_dias.integer' => 'La validez debe ser un número entero.',
            'validez_dias.min' => 'La validez debe ser al menos 1 día.',
            'total_cot.required' => 'El total es obligatorio.',
            'total_cot.numeric' => 'El total debe ser un número.',
            'total_cot.min' => 'El total no puede ser negativo.',
            'descuento.required' => 'El descuento es obligatorio.',
            'descuento.numeric' => 'El descuento debe ser un número.',
            'descuento.min' => 'El descuento no puede ser negativo.',
            'id_cli.required' => 'El cliente es obligatorio.',
            'id_cli.exists' => 'El cliente seleccionado no existe.',
            'id_emp.required' => 'El empleado es obligatorio.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
            'notas.string' => 'Las notas deben ser texto.',
            'notas.max' => 'Las notas no pueden exceder 500 caracteres.',
        ]);

        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_cot = 'COT-' . $nextId;
            $nextId++;
        } while (Cotizacion::where('cod_cot', $cod_cot)->exists());
        $validated['cod_cot'] = $cod_cot;

        $cotizacion = Cotizacion::create($validated);
        return Cotizacion::with(['empleado', 'cliente'])->find($cotizacion->id_cot);
    }

    public function show($id)
    {
        return Cotizacion::with(['empleado', 'cliente', 'detalles.mueble', 'costos'])->findOrFail($id);
    }


    public function update(Request $request, $id)
    {
        $cotizacion = Cotizacion::findOrFail($id);

        $validated = $request->validate([
            'cod_cot' => 'sometimes|required|string|max:50|unique:cotizaciones,cod_cot,' . $id . ',id_cot',
            'fec_cot' => 'sometimes|required|date',
            'est_cot' => 'sometimes|required|string|max:50',
            'validez_dias' => 'sometimes|required|integer|min:1',
            'total_cot' => 'sometimes|required|numeric|min:0',
            'descuento' => 'sometimes|required|numeric|min:0',
            'id_cli' => 'sometimes|required|exists:clientes,id_cli',
            'id_emp' => 'sometimes|required|exists:empleados,id_emp',
            'notas' => 'nullable|string|max:500',
        ], [
            'cod_cot.unique' => 'El código de cotización ya existe.',
            'fec_cot.required' => 'La fecha de cotización es obligatoria.',
            'fec_cot.date' => 'La fecha debe tener un formato válido.',
            'est_cot.required' => 'El estado es obligatorio.',
            'est_cot.string' => 'El estado debe ser texto.',
            'est_cot.max' => 'El estado no puede exceder 50 caracteres.',
            'validez_dias.required' => 'La validez en días es obligatoria.',
            'validez_dias.integer' => 'La validez debe ser un número entero.',
            'validez_dias.min' => 'La validez debe ser al menos 1 día.',
            'total_cot.required' => 'El total es obligatorio.',
            'total_cot.numeric' => 'El total debe ser un número.',
            'total_cot.min' => 'El total no puede ser negativo.',
            'descuento.required' => 'El descuento es obligatorio.',
            'descuento.numeric' => 'El descuento debe ser un número.',
            'descuento.min' => 'El descuento no puede ser negativo.',
            'id_cli.required' => 'El cliente es obligatorio.',
            'id_cli.exists' => 'El cliente seleccionado no existe.',
            'id_emp.required' => 'El empleado es obligatorio.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
            'notas.string' => 'Las notas deben ser texto.',
            'notas.max' => 'Las notas no pueden exceder 500 caracteres.',
        ]);
        $cotizacion->update($validated);
        return $cotizacion;
    }


    public function destroy($id)
    {
        $cotizacion = Cotizacion::findOrFail($id);
        $cotizacion->delete();
        return response()->json(['message' => 'Cotización eliminada correctamente.']);
    }

    public function reporteCotizaciones(Request $request)
    {
        // Obtiene el parámetro de estado
        $estado = $request->input('est_cot');

        // Construye la consulta base
        $query = Cotizacion::with(['empleado', 'cliente']);

        // Aplica filtro por estado si se proporciona
        if (!is_null($estado)) {
            $query->where('est_cot', $estado);
        }

        // Ejecuta la consulta y obtiene los resultados
        $cotizaciones = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'cotizaciones.reporte')
        $pdf = Pdf::loadView('cotizaciones.reporte', compact('cotizaciones'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_cotizaciones.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'cotizaciones';
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

        $cotizaciones = Cotizacion::all();
        $insertSQL = "";

        foreach ($cotizaciones as $cotizacion) {
            $attrs = $cotizacion->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_cotizaciones.sql');
    }
}
