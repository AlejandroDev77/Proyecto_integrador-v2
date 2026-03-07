<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\DetalleCotizacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class DetalleCotizacionController extends Controller
{
    public function index(Request $request)
    {
        return QueryBuilder::for(DetalleCotizacion::class)
            ->with(['cotizacion', 'mueble'])
            ->allowedFilters([
                AllowedFilter::callback('cod_det_cot', function ($query, $value) {
                    $query->where('cod_det_cot', 'like', "%{$value}%");
                }),
                AllowedFilter::callback('cantidad_min', function ($query, $value) {
                    $query->where('cantidad', '>=', $value);
                }),
                AllowedFilter::callback('cantidad_max', function ($query, $value) {
                    $query->where('cantidad', '<=', $value);
                }),
                AllowedFilter::callback('precio_unitario_min', function ($query, $value) {
                    $query->where('precio_unitario', '>=', $value);
                }),
                AllowedFilter::callback('precio_unitario_max', function ($query, $value) {
                    $query->where('precio_unitario', '<=', $value);
                }),
                AllowedFilter::callback('tipo_mueble', function ($query, $value) {
                    $query->where('tipo_mueble', 'ilike', "%{$value}%");
                }),
                AllowedFilter::callback('nombre_mueble', function ($query, $value) {
                    $query->where('nombre_mueble', 'ilike', "%{$value}%");
                }),
                AllowedFilter::callback('id_cot', function ($query, $value) {
                    $query->where('id_cot', $value);
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('cod_det_cot', 'ilike', "%{$value}%")
                          ->orWhere('nombre_mueble', 'ilike', "%{$value}%")
                          ->orWhere('tipo_mueble', 'ilike', "%{$value}%")
                          ->orWhere('desc_personalizacion', 'ilike', "%{$value}%");
                    });
                }),
            ])
            ->allowedSorts(['id_det_cot', 'cantidad', 'precio_unitario', 'subtotal', 'tipo_mueble', 'nombre_mueble'])
            ->paginate($request->input('per_page', 20));
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'desc_personalizacion' => 'nullable|string|max:1000',
            'cantidad' => 'required|integer|min:1',
            'precio_unitario' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'id_cot' => 'required|exists:cotizaciones,id_cot',
            // id_mue ahora es opcional para muebles personalizados
            'id_mue' => 'nullable|exists:muebles,id_mue',
            // Campos para muebles personalizados
            'nombre_mueble' => 'nullable|string|max:200',
            'tipo_mueble' => 'nullable|string|max:100',
            'dimensiones' => 'nullable|string|max:100',
            'material_principal' => 'nullable|string|max:100',
            'color_acabado' => 'nullable|string|max:100',
            'img_referencia' => 'nullable|string|max:500',
            'herrajes' => 'nullable|string|max:500',
        ], [
            'desc_personalizacion.string' => 'La descripción debe ser texto.',
            'desc_personalizacion.max' => 'La descripción no puede exceder 1000 caracteres.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.integer' => 'La cantidad debe ser un número entero.',
            'cantidad.min' => 'La cantidad debe ser al menos 1.',
            'precio_unitario.required' => 'El precio unitario es obligatorio.',
            'precio_unitario.numeric' => 'El precio unitario debe ser un número.',
            'precio_unitario.min' => 'El precio unitario no puede ser negativo.',
            'subtotal.required' => 'El subtotal es obligatorio.',
            'subtotal.numeric' => 'El subtotal debe ser un número.',
            'subtotal.min' => 'El subtotal no puede ser negativo.',
            'id_cot.required' => 'La cotización es obligatoria.',
            'id_cot.exists' => 'La cotización seleccionada no existe.',
            'id_mue.exists' => 'El mueble seleccionado no existe.',
            'nombre_mueble.max' => 'El nombre del mueble no puede exceder 200 caracteres.',
            'tipo_mueble.max' => 'El tipo de mueble no puede exceder 100 caracteres.',
        ]);

        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_det_cot = 'DTC-' . $nextId;
            $nextId++;
        } while (DetalleCotizacion::where('cod_det_cot', $cod_det_cot)->exists());
        $validated['cod_det_cot'] = $cod_det_cot;

        $detalle = DetalleCotizacion::create($validated);
        return DetalleCotizacion::with(['cotizacion', 'mueble'])->find($detalle->id_det_cot);
    }

    public function show($id)
    {
        return DetalleCotizacion::with(['cotizacion', 'mueble'])->findOrFail($id);
    }
    

    public function update(Request $request, $id)
    {
        $detalleCotizacion = DetalleCotizacion::findOrFail($id);

        $validated = $request->validate([
            'desc_personalizacion' => 'nullable|string|max:1000',
            'cantidad' => 'sometimes|required|integer|min:1',
            'precio_unitario' => 'sometimes|required|numeric|min:0',
            'subtotal' => 'sometimes|required|numeric|min:0',
            'id_cot' => 'sometimes|required|exists:cotizaciones,id_cot',
            'id_mue' => 'nullable|exists:muebles,id_mue',
            // Campos para muebles personalizados
            'nombre_mueble' => 'nullable|string|max:200',
            'tipo_mueble' => 'nullable|string|max:100',
            'dimensiones' => 'nullable|string|max:100',
            'material_principal' => 'nullable|string|max:100',
            'color_acabado' => 'nullable|string|max:100',
            'img_referencia' => 'nullable|string|max:500',
            'herrajes' => 'nullable|string|max:500',
        ], [
            'desc_personalizacion.string' => 'La descripción debe ser texto.',
            'desc_personalizacion.max' => 'La descripción no puede exceder 1000 caracteres.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.integer' => 'La cantidad debe ser un número entero.',
            'cantidad.min' => 'La cantidad debe ser al menos 1.',
            'precio_unitario.required' => 'El precio unitario es obligatorio.',
            'precio_unitario.numeric' => 'El precio unitario debe ser un número.',
            'precio_unitario.min' => 'El precio unitario no puede ser negativo.',
            'subtotal.required' => 'El subtotal es obligatorio.',
            'subtotal.numeric' => 'El subtotal debe ser un número.',
            'subtotal.min' => 'El subtotal no puede ser negativo.',
            'id_cot.required' => 'La cotización es obligatoria.',
            'id_cot.exists' => 'La cotización seleccionada no existe.',
            'id_mue.exists' => 'El mueble seleccionado no existe.',
        ]);
        
        $detalleCotizacion->update($validated);
        return DetalleCotizacion::with(['cotizacion', 'mueble'])->find($detalleCotizacion->id_det_cot);
    }
    

    public function destroy($id)
    {
        $detalleCotizacion = DetalleCotizacion::findOrFail($id);
        $detalleCotizacion->delete();
        return response()->json(['message' => 'Detalle de cotización eliminado correctamente.'], 204);
    }

    public function reporteDetallesCotizaciones(Request $request)
    {
        $query = DetalleCotizacion::with(['cotizacion', 'mueble']);
        $detallesCotizaciones = $query->get();
        $pdf = Pdf::loadView('detallescotizaciones.reporte', compact('detallesCotizaciones'));
        return $pdf->stream('reporte_detallescotizaciones.pdf');
    }

    public function exportarSQL()
    {
        $table = 'detalles_cotizacion';
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

        $detallesCotizacion = DetalleCotizacion::all();
        $insertSQL = "";

        foreach ($detallesCotizacion as $detalleCotizacion) {
            $attrs = $detalleCotizacion->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_detallescotizaciones.sql');
    }
}