<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\DetalleCompra;
use App\Models\CompraMaterial;
use App\Helpers\StringHelper;
use App\Services\InventarioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class DetalleCompraController extends Controller
{
    protected $inventarioService;

    public function __construct(InventarioService $inventarioService)
    {
        $this->inventarioService = $inventarioService;
    }

    public function index(Request $request)
    {
        $query = QueryBuilder::for(DetalleCompra::class)
            ->with(['compramaterial', 'material'])
            ->leftJoin('compras_materiales', 'detalles_compra.id_comp', '=', 'compras_materiales.id_comp')
            ->leftJoin('materiales', 'detalles_compra.id_mat', '=', 'materiales.id_mat')
            ->select('detalles_compra.*')
            ->allowedFilters([
                AllowedFilter::callback('cod_det_com', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(cod_det_comp), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
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
                AllowedFilter::callback('subtotal_min', function ($query, $value) {
                    $query->where('subtotal', '>=', $value);
                }),
                AllowedFilter::callback('subtotal_max', function ($query, $value) {
                    $query->where('subtotal', '<=', $value);
                }),
                AllowedFilter::callback('compra_fecha_desde', function ($query, $value) {
                    $query->whereRaw("DATE(compras_materiales.fec_comp) >= ?", [$value]);
                }),
                AllowedFilter::callback('compra_fecha_hasta', function ($query, $value) {
                    $query->whereRaw("DATE(compras_materiales.fec_comp) <= ?", [$value]);
                }),
                AllowedFilter::callback('nom_mat', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(materiales.nom_mat), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),     

                AllowedFilter::callback('search', function ($query, $value) {
                    $normalizedValue = StringHelper::removeAccents(strtolower($value));
                    $query->whereRaw(
                        "translate(lower(cod_det_comp), 'àáâãäåèéêëìíîïòóôõöùúûüýÿæœçñ', 'aaaaaaeeeeiiiioooooouuuuyyaocn') LIKE ?",
                        ["%{$normalizedValue}%"]
                    );
                }),
            ])
            ->allowedSorts(['cantidad', 'precio_unitario', 'subtotal', 'cod_det_comp', 'compras_materiales.fec_comp', 'materiales.nom_mat'])
            ->paginate($request->input('per_page', 20));

        return $query;
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'cantidad' => 'required|numeric|min:0.01',
            'precio_unitario' => 'required|numeric|min:0.01',
            'subtotal' => 'required|numeric|min:0',
            'id_comp' => 'required|exists:compras_materiales,id_comp',
            'id_mat' => 'required|exists:materiales,id_mat',
        ], [
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.numeric' => 'La cantidad debe ser un número.',
            'cantidad.min' => 'La cantidad debe ser mayor a 0.',
            'precio_unitario.required' => 'El precio unitario es obligatorio.',
            'precio_unitario.numeric' => 'El precio unitario debe ser un número.',
            'precio_unitario.min' => 'El precio unitario debe ser mayor a 0.',
            'subtotal.required' => 'El subtotal es obligatorio.',
            'subtotal.min' => 'El subtotal no puede ser negativo.',
            'id_comp.required' => 'Debe seleccionar una compra.',
            'id_comp.exists' => 'La compra seleccionada no existe.',
            'id_mat.required' => 'Debe seleccionar un material.',
            'id_mat.exists' => 'El material seleccionado no existe.',
        ]);

        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_det_comp = 'DCP-' . $nextId;
            $nextId++;
        } while (DetalleCompra::where('cod_det_comp', $cod_det_comp)->exists());
        $validated['cod_det_comp'] = $cod_det_comp;

        // Usar transacción para garantizar consistencia
        return DB::transaction(function () use ($validated) {
            // Crear el detalle de compra
            $detalleCompra = DetalleCompra::create($validated);

            // Obtener el empleado de la compra para registrar el movimiento
            $compra = CompraMaterial::find($validated['id_comp']);
            
            // Incrementar stock del material (compra = entrada)
            $this->inventarioService->incrementarStockMaterial(
                idMaterial: $validated['id_mat'],
                cantidad: $validated['cantidad'],
                idEmpleado: $compra->id_emp,
                idCompra: $validated['id_comp'],
                motivo: 'Compra de material - Detalle ' . $validated['cod_det_comp']
            );

            return $detalleCompra->load(['compramaterial', 'material']);
        });
    }

    public function show($id)
    {
        return DetalleCompra::with(['compramaterial', 'material'])->findOrFail($id);
    }
    

    public function update(Request $request, $id)
    {
        $detalleCompra = DetalleCompra::findOrFail($id);

        $validated = $request->validate([
            'cantidad' => 'sometimes|required|numeric|min:0.01',
            'precio_unitario' => 'sometimes|required|numeric|min:0.01',
            'subtotal' => 'sometimes|required|numeric|min:0',
            'id_comp' => 'sometimes|required|exists:compras_materiales,id_comp',
            'id_mat' => 'sometimes|required|exists:materiales,id_mat',
        ], [
            'cantidad.numeric' => 'La cantidad debe ser un número.',
            'cantidad.min' => 'La cantidad debe ser mayor a 0.',
            'precio_unitario.numeric' => 'El precio unitario debe ser un número.',
            'precio_unitario.min' => 'El precio unitario debe ser mayor a 0.',
            'subtotal.min' => 'El subtotal no puede ser negativo.',
            'id_comp.exists' => 'La compra seleccionada no existe.',
            'id_mat.exists' => 'El material seleccionado no existe.',
        ]);

        $detalleCompra->update($validated);

        return $detalleCompra->load(['compramaterial', 'material']);
    }
    

    public function destroy($id)
    {
        $detalleCompra = DetalleCompra::findOrFail($id);
        
        return DB::transaction(function () use ($detalleCompra) {
            // Obtener la compra para el empleado
            $compra = CompraMaterial::find($detalleCompra->id_comp);
            
            // Revertir el incremento de stock (salida por reversión)
            $this->inventarioService->descontarStockMaterial(
                idMaterial: $detalleCompra->id_mat,
                cantidad: $detalleCompra->cantidad,
                idEmpleado: $compra->id_emp,
                motivo: 'Reversión - Eliminación de detalle de compra ' . $detalleCompra->cod_det_comp
            );

            $detalleCompra->delete();

            return response()->json(['message' => 'Detalle de compra eliminado y stock revertido.']);
        });
    }
    
    public function reporteDetallesCompra(Request $request)
    {
        // Obtiene los parámetros de filtrado
        $idCompra = $request->input('id_comp');
        $idMaterial = $request->input('id_mat');

        // Construye la consulta base
        $query = DetalleCompra::with(['compramaterial', 'material']);

        // Aplica filtro por ID de compra si se proporciona
        if (!is_null($idCompra)) {
            $query->where('id_comp', $idCompra);
        }

        // Aplica filtro por ID de material si se proporciona
        if (!is_null($idMaterial)) {
            $query->where('id_mat', $idMaterial);
        }

        // Ejecuta la consulta y obtiene los resultados
        $detallesCompra = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'detallesCompra.reporte')
        $pdf = Pdf::loadView('detallesCompra.reporte', compact('detallesCompra'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_detalles_compra.pdf'); // Vista previa en otra pestaña
    }
    
    public function exportarSQL()
    {
        $table = 'detalles_compras';
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

        $detallesCompras = DetalleCompra::all();
        $insertSQL = "";

        foreach ($detallesCompras as $detalleCompra) {
            $attrs = $detalleCompra->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_detalles_compras.sql');
    }
}