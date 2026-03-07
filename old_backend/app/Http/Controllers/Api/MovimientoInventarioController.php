<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Importar Storage
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB; // Importar DB
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class MovimientoInventarioController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        return QueryBuilder::for(MovimientoInventario::class)
            ->with(['material','mueble','venta','produccion','compraMaterial','devolucion','empleado'])
            ->allowedFilters([
                AllowedFilter::callback('cod_mov', function ($query, $value) {
                    $query->where('cod_mov', 'like', "%{$value}%");
                }),
                'tipo_mov',
                AllowedFilter::callback('fecha_mov_exact', function ($query, $value) {
                    $query->whereRaw("DATE(fecha_mov) = ?", [$value]);
                }),
                AllowedFilter::callback('fecha_mov_min', function ($query, $value) {
                    $query->whereRaw("DATE(fecha_mov) >= ?", [$value]);
                }),
                AllowedFilter::callback('fecha_mov_max', function ($query, $value) {
                    $query->whereRaw("DATE(fecha_mov) <= ?", [$value]);
                }),
                AllowedFilter::callback('cantidad_min', function ($query, $value) {
                    if ($value) $query->where('cantidad', '>=', $value);
                }),
                AllowedFilter::callback('cantidad_max', function ($query, $value) {
                    if ($value) $query->where('cantidad', '<=', $value);
                }),
            ])
            ->allowedSorts(['id_mov', 'fecha_mov', 'tipo_mov', 'cantidad', 'cod_mov'])
            ->paginate($request->input('per_page', 20));
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo_mov' => 'required|string',
            'fecha_mov' => 'required|date',
            'cantidad' => 'required|numeric|min:0.01',
            'stock_anterior' => 'required|numeric|min:0',
            'stock_posterior' => 'required|numeric|min:0',
            'motivo' => 'nullable|string',
            'id_mat' => 'nullable|exists:materiales,id_mat',
            'id_mue' => 'nullable|exists:muebles,id_mue',
            'id_ven' => 'nullable|exists:ventas,id_ven',
            'id_pro' => 'nullable|exists:produccion,id_pro',
            'id_comp' => 'nullable|exists:compra_materiales,id_comp',
            'id_dev' => 'nullable|exists:devoluciones,id_dev',
            'id_emp' => 'required|exists:empleados,id_emp',
        ], [
            'tipo_mov.required' => 'El tipo de movimiento es obligatorio.',
            'tipo_mov.string' => 'El tipo de movimiento debe ser texto.',
            'fecha_mov.required' => 'La fecha del movimiento es obligatoria.',
            'fecha_mov.date' => 'La fecha del movimiento debe ser una fecha válida.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.numeric' => 'La cantidad debe ser un número.',
            'cantidad.min' => 'La cantidad debe ser mayor a 0.',
            'stock_anterior.required' => 'El stock anterior es obligatorio.',
            'stock_anterior.numeric' => 'El stock anterior debe ser un número.',
            'stock_posterior.required' => 'El stock posterior es obligatorio.',
            'stock_posterior.numeric' => 'El stock posterior debe ser un número.',
            'id_mat.exists' => 'El material seleccionado no existe.',
            'id_mue.exists' => 'El mueble seleccionado no existe.',
            'id_ven.exists' => 'La venta seleccionada no existe.',
            'id_pro.exists' => 'La producción seleccionada no existe.',
            'id_comp.exists' => 'La compra seleccionada no existe.',
            'id_dev.exists' => 'La devolución seleccionada no existe.',
            'id_emp.required' => 'El empleado es obligatorio.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
        ]);
        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_mov = 'MOV-' . $nextId;
            $nextId++;
        } while (MovimientoInventario::where('cod_mov', $cod_mov)->exists());
        $validated['cod_mov'] = $cod_mov;
        return MovimientoInventario::create($validated);
    }

    public function show($id)
    {
        return MovimientoInventario::with(['material','mueble','venta',
        'produccion','compraMaterial','devolucion','empleado'])->findOrFail($id);
    
    }
    

    public function update(Request $request, $id)
    {
        $movimientosinventarios = MovimientoInventario::findOrFail($id);

        $validated = $request->validate([
            'tipo_mov' => 'sometimes|required|string',
            'fecha_mov' => 'sometimes|required|date',
            'cantidad' => 'sometimes|required|numeric|min:0.01',
            'stock_anterior' => 'sometimes|required|numeric|min:0',
            'stock_posterior' => 'sometimes|required|numeric|min:0',
            'motivo' => 'nullable|string',
            'id_mat' => 'nullable|exists:materiales,id_mat',
            'id_mue' => 'nullable|exists:muebles,id_mue',
            'id_ven' => 'nullable|exists:ventas,id_ven',
            'id_pro' => 'nullable|exists:produccion,id_pro',
            'id_comp' => 'nullable|exists:compra_materiales,id_comp',
            'id_dev' => 'nullable|exists:devoluciones,id_dev',
            'id_emp' => 'sometimes|required|exists:empleados,id_emp',
        ], [
            'tipo_mov.required' => 'El tipo de movimiento es obligatorio.',
            'tipo_mov.string' => 'El tipo de movimiento debe ser texto.',
            'fecha_mov.required' => 'La fecha del movimiento es obligatoria.',
            'fecha_mov.date' => 'La fecha del movimiento debe ser una fecha válida.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.numeric' => 'La cantidad debe ser un número.',
            'cantidad.min' => 'La cantidad debe ser mayor a 0.',
            'stock_anterior.required' => 'El stock anterior es obligatorio.',
            'stock_anterior.numeric' => 'El stock anterior debe ser un número.',
            'stock_posterior.required' => 'El stock posterior es obligatorio.',
            'stock_posterior.numeric' => 'El stock posterior debe ser un número.',
            'id_mat.exists' => 'El material seleccionado no existe.',
            'id_mue.exists' => 'El mueble seleccionado no existe.',
            'id_ven.exists' => 'La venta seleccionada no existe.',
            'id_pro.exists' => 'La producción seleccionada no existe.',
            'id_comp.exists' => 'La compra seleccionada no existe.',
            'id_dev.exists' => 'La devolución seleccionada no existe.',
            'id_emp.required' => 'El empleado es obligatorio.',
            'id_emp.exists' => 'El empleado seleccionado no existe.',
        ]);
        $movimientosinventarios->update($validated);
        return $movimientosinventarios;
    }
    

    public function destroy($id)
    {
        $movimientosinventarios = MovimientoInventario::findOrFail($id);
        $movimientosinventarios->delete();
        return response()->json(['message' => 'Movimiento de inventario eliminado correctamente.'], 204);
    }

    public function reporteMovimientosInventarios(Request $request)
    {
       
        
        $query = MovimientoInventario::with(['material', 'mueble', 'venta',
        'produccion', 'compraMaterial', 'devolucion', 'empleado']);

        

        // Ejecuta la consulta y obtiene los resultados
        $ventas = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'ventas.reporte')
        $pdf = Pdf::loadView('movimientosinventarios.reporte', compact('movimientosinventarios'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_movimientosinventarios.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'movimientos_inventario';
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

        $movimientosinventarios = MovimientoInventario::all();
        $insertSQL = "";

        foreach ($movimientosinventarios as $MovimientoInventario) {
            $attrs = $MovimientoInventario->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_movimientosinventarios.sql');
    }
}

