<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Helpers\StringHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Importar Storage
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB; // Importar DB
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class VentaController extends Controller
{
    public function index(Request $request)
    {
        return QueryBuilder::for(Venta::class)
            ->with(['empleado', 'cliente'])
            ->leftJoin('clientes', 'ventas.id_cli', '=', 'clientes.id_cli')
            ->leftJoin('empleados', 'ventas.id_emp', '=', 'empleados.id_emp')
            ->select('ventas.*')
            ->allowedFilters([
                AllowedFilter::callback('cod_ven', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(cod_ven), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),
                AllowedFilter::callback('fec_ven_exacta', function ($query, $value) {
                    $query->whereRaw("DATE(fec_ven) = ?", [$value]);
                }),
                AllowedFilter::callback('fec_ven_desde', function ($query, $value) {
                    $query->whereRaw("DATE(fec_ven) >= ?", [$value]);
                }),
                AllowedFilter::callback('fec_ven_hasta', function ($query, $value) {
                    $query->whereRaw("DATE(fec_ven) <= ?", [$value]);
                }),
                AllowedFilter::callback('total_ven_min', function ($query, $value) {
                    if ($value) $query->where('total_ven', '>=', $value);
                }),
                AllowedFilter::callback('total_ven_max', function ($query, $value) {
                    if ($value) $query->where('total_ven', '<=', $value);
                }),
                AllowedFilter::callback('nom_emp', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereHas('empleado', function ($q) use ($normalizedValue) {
                        $q->whereRaw(
                            "translate(lower(nom_emp), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                            ["%{$normalizedValue}%"]
                        );
                    });
                }),
                AllowedFilter::callback('ci_cli', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereHas('cliente', function ($q) use ($normalizedValue) {
                        $q->whereRaw(
                            "translate(lower(ci_cli), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                            ["%{$normalizedValue}%"]
                        );
                    });
                }),
                AllowedFilter::callback('nom_cli', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereHas('cliente', function ($q) use ($normalizedValue) {
                        $q->whereRaw(
                            "translate(lower(nom_cli), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                            ["%{$normalizedValue}%"]
                        );
                    });
                }),
                'est_ven',
                AllowedFilter::callback('search', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(cod_ven), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    )->orWhere('est_ven', 'like', "%{$value}%");
                }),
                // Filtro para excluir ventas que ya tienen producción
                AllowedFilter::callback('sin_produccion', function ($query, $value) {
                    if ($value === 'true' || $value === '1' || $value === true) {
                        $query->whereNotExists(function ($subquery) {
                            $subquery->select(DB::raw(1))
                                ->from('produccion')
                                ->whereColumn('produccion.id_ven', 'ventas.id_ven');
                        });
                    }
                }),
            ])
            ->allowedSorts(['fec_ven', 'est_ven', 'total_ven', 'cod_ven', 'empleados.nom_emp', 'clientes.nom_cli', 'clientes.ci_cli', 'descuento', 'notas'])
            ->paginate($request->input('per_page', 20));
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'fec_ven' => 'required|date',
            'est_ven' => 'required|string',
            'total_ven' => 'required|numeric|min:0',
            'descuento' => 'required|numeric|min:0',
            'id_cli' => 'required|exists:clientes,id_cli',
            'id_emp' => 'required|exists:empleados,id_emp',
            'notas' => 'nullable|string|max:500',
        ], [
            'fec_ven.required' => 'La fecha de venta es obligatoria.',
            'fec_ven.date' => 'La fecha de venta debe ser una fecha válida.',
            'est_ven.required' => 'El estado de la venta es obligatorio.',
            'total_ven.required' => 'El total de la venta es obligatorio.',
            'total_ven.numeric' => 'El total debe ser un número.',
            'total_ven.min' => 'El total no puede ser negativo.',
            'descuento.required' => 'El descuento es obligatorio.',
            'descuento.numeric' => 'El descuento debe ser un número.',
            'descuento.min' => 'El descuento no puede ser negativo.',
            'id_cli.required' => 'Debe seleccionar un cliente.',
            'id_cli.exists' => 'El cliente seleccionado no existe.',
            'id_emp.required' => 'Debe seleccionar un empleado.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
            'notas.max' => 'Las notas no pueden exceder 500 caracteres.',
        ]);


        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_ven = 'VEN-' . $nextId;
            $nextId++;
        } while (Venta::where('cod_ven', $cod_ven)->exists());
        $validated['cod_ven'] = $cod_ven;

        return Venta::create($validated);
    }

    public function show($id)
    {
        return Venta::with(['empleado', 'cliente', 'detalles.mueble'])->findOrFail($id);
    }


    public function update(Request $request, $id)
    {
        $venta = Venta::findOrFail($id);

        $validated = $request->validate([
            'fec_ven' => 'sometimes|required|date',
            'est_ven' => 'sometimes|required|string',
            'total_ven' => 'sometimes|required|numeric|min:0',
            'descuento' => 'sometimes|required|numeric|min:0',
            'id_cli' => 'sometimes|required|exists:clientes,id_cli',
            'id_emp' => 'sometimes|required|exists:empleados,id_emp',
            'notas' => 'nullable|string|max:500',
        ], [
            'fec_ven.date' => 'La fecha de venta debe ser una fecha válida.',
            'total_ven.numeric' => 'El total debe ser un número.',
            'total_ven.min' => 'El total no puede ser negativo.',
            'descuento.numeric' => 'El descuento debe ser un número.',
            'descuento.min' => 'El descuento no puede ser negativo.',
            'id_cli.exists' => 'El cliente seleccionado no existe.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
            'notas.max' => 'Las notas no pueden exceder 500 caracteres.',
        ]);

        $venta->update($validated);

        return $venta->load(['empleado', 'cliente']);
    }



    public function destroy($id)
    {
        $ventas  = Venta::findOrFail($id);
        $ventas->delete();

        return response()->json(['message' => 'Venta eliminado']);
    }

    public function reporteVentas(Request $request)
    {
        // Obtiene los parámetros de filtrado
        $fecha = $request->input('fec_ven');
        $estado = $request->input('est_ven');

        // Construye la consulta base
        $query = Venta::with(['empleado', 'cliente']);

        // Aplica filtro por fecha si se proporciona
        if (!is_null($fecha)) {
            $query->whereDate('fec_ven', $fecha);
        }

        // Aplica filtro por estado si se proporciona
        if (!is_null($estado)) {
            $query->where('est_ven', $estado);
        }

        // Ejecuta la consulta y obtiene los resultados
        $ventas = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'ventas.reporte')
        $pdf = Pdf::loadView('ventas.reporte', compact('ventas'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_ventas.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'ventas';
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

        $ventas = Venta::all();
        $insertSQL = "";

        foreach ($ventas as $venta) {
            $attrs = $venta->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_ventas.sql');
    }
}
