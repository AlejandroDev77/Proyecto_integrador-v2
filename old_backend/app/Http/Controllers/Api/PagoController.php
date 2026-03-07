<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Pago;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Importar Storage
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB; // Importar DB
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Helpers\StringHelper;

class PagoController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        return QueryBuilder::for(Pago::class)
            ->with(['venta'])
            ->leftJoin('ventas', 'pagos.id_ven', '=', 'ventas.id_ven')
            ->select('pagos.*')
            ->allowedFilters([
                AllowedFilter::callback('cod_pag', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(cod_pag), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),
                AllowedFilter::callback('fec_pag_exacta', function ($query, $value) {
                    $query->whereRaw("DATE(fec_pag) = ?", [$value]);
                }),
                AllowedFilter::callback('fec_pag_desde', function ($query, $value) {
                    $query->whereRaw("DATE(fec_pag) >= ?", [$value]);
                }),
                AllowedFilter::callback('fec_pag_hasta', function ($query, $value) {
                    $query->whereRaw("DATE(fec_pag) <= ?", [$value]);
                }),
                AllowedFilter::callback('monto_min', function ($query, $value) {
                    if ($value) $query->where('monto', '>=', $value);
                }),
                AllowedFilter::callback('monto_max', function ($query, $value) {
                    if ($value) $query->where('monto', '<=', $value);
                }),
                AllowedFilter::callback('total_ven_min', function ($query, $value) {
                    if ($value) {
                        $query->whereHas('venta', function ($q) use ($value) {
                            $q->where('total_ven', '>=', $value);
                        });
                    }
                }),
                AllowedFilter::callback('total_ven_max', function ($query, $value) {
                    if ($value) {
                        $query->whereHas('venta', function ($q) use ($value) {
                            $q->where('total_ven', '<=', $value);
                        });
                    }
                }),
                AllowedFilter::callback('metodo_pago', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(metodo_pag), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),
                AllowedFilter::callback('est_ven', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereHas('venta', function ($q) use ($normalizedValue) {
                        $q->whereRaw(
                            "translate(lower(est_ven), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                            ["%{$normalizedValue}%"]
                        );
                    });
                }),

                AllowedFilter::callback('referencia_pag', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(referencia_pag), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),

                'metodo_pag',
                AllowedFilter::callback('search', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(cod_pag), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    )->orWhereRaw(
                        "translate(lower(metodo_pag), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),

            ])
            ->allowedSorts(['referencia_pag', 'fec_pag', 'monto', 'metodo_pag', 'cod_pag', 'ventas.total_ven', 'ventas.est_ven'])
            ->paginate($request->input('per_page', 20));
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'monto' => 'required|numeric|min:0.01',
            'fec_pag' => 'required|date',
            'metodo_pag' => 'required|string|max:50',
            'referencia_pag' => 'nullable|string|max:100',
            'id_ven' => 'required|exists:ventas,id_ven',
        ], [
            'monto.required' => 'El monto es obligatorio.',
            'monto.numeric' => 'El monto debe ser un número.',
            'monto.min' => 'El monto debe ser mayor a 0.',
            'fec_pag.required' => 'La fecha de pago es obligatoria.',
            'fec_pag.date' => 'La fecha debe tener un formato válido.',
            'metodo_pag.required' => 'El método de pago es obligatorio.',
            'metodo_pag.string' => 'El método de pago debe ser texto.',
            'metodo_pag.max' => 'El método de pago no puede exceder 50 caracteres.',
            'referencia_pag.string' => 'La referencia debe ser texto.',
            'referencia_pag.max' => 'La referencia no puede exceder 100 caracteres.',
            'id_ven.required' => 'La venta es obligatoria.',
            'id_ven.exists' => 'La venta seleccionada no existe.',
        ]);
        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_pag = 'PAG-' . $nextId;
            $nextId++;
        } while (Pago::where('cod_pag', $cod_pag)->exists());
        $validated['cod_pag'] = $cod_pag;
        $pago = Pago::create($validated);
        return Pago::with(['venta'])->find($pago->id_pag);
    }

    public function show($id)
    {
        return Pago::with('venta')->findOrFail($id);

    
    }
    

    public function update(Request $request, $id)
    {
        $pagos = Pago::findOrFail($id);

        $validated = $request->validate([
            'monto' => 'sometimes|required|numeric|min:0.01',
            'fec_pag' => 'sometimes|required|date',
            'metodo_pag' => 'sometimes|required|string|max:50',
            'referencia_pag' => 'nullable|string|max:100',
            'id_ven' => 'sometimes|required|exists:ventas,id_ven',
        ], [
            'monto.required' => 'El monto es obligatorio.',
            'monto.numeric' => 'El monto debe ser un número.',
            'monto.min' => 'El monto debe ser mayor a 0.',
            'fec_pag.required' => 'La fecha de pago es obligatoria.',
            'fec_pag.date' => 'La fecha debe tener un formato válido.',
            'metodo_pag.required' => 'El método de pago es obligatorio.',
            'metodo_pag.string' => 'El método de pago debe ser texto.',
            'metodo_pag.max' => 'El método de pago no puede exceder 50 caracteres.',
            'referencia_pag.string' => 'La referencia debe ser texto.',
            'referencia_pag.max' => 'La referencia no puede exceder 100 caracteres.',
            'id_ven.required' => 'La venta es obligatoria.',
            'id_ven.exists' => 'La venta seleccionada no existe.',
        ]);
        
        $pagos->update($validated);

        return Pago::with(['venta'])->find($pagos->id_pag);
    }
    

    public function destroy($id)
    {
        $pago = Pago::findOrFail($id);
        $pago->delete();
        return response()->json(['message' => 'Pago eliminado correctamente.']);
    }

    public function reportePagos(Request $request)
    {        // Obtiene los parámetros de filtrado
        $metodo = $request->input('metodo_pag');
        

        // Construye la consulta base con las relaciones necesarias
        $query = Pago::with(['venta.cliente', 'venta.empleado']);

        // Aplica filtro por fecha si se proporciona
        if (!is_null($metodo)) {
            $query->where('metodo_pag', $metodo);
            
        }

        // Ejecuta la consulta y obtiene los resultados
        $pagos = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'ventas.reporte')
        $pdf = Pdf::loadView('pagos.reporte', compact('pagos'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_pagos.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'pagos';
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

        $pagos = Pago::all();
        $insertSQL = "";

        foreach ($pagos as $pago) {
            $attrs = $pago->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_pagos.sql');
    }
}