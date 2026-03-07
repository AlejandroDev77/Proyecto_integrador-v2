<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MuebleMaterial;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Illuminate\Support\Str;

class MuebleMaterialController extends Controller
{
     public function index(\Illuminate\Http\Request $request)
     {
         return QueryBuilder::for(MuebleMaterial::class)
             ->with(['mueble', 'material'])
             ->join('muebles', 'muebles.id_mue', '=', 'mueble_material.id_mue')
             ->join('materiales', 'materiales.id_mat', '=', 'mueble_material.id_mat')
             ->select('mueble_material.*')
             ->allowedFilters([
                 AllowedFilter::callback('cod_mue_mat', function ($query, $value) {
                     $normalizedValue = Str::slug($value, '');
                     $query->whereRaw("translate(lower(mueble_material.cod_mue_mat), 'àáâãäåèéêëìíîïòóôõöùúûü', 'aaaaaaeeeeiiiiooooouuuu') LIKE ?", ["%{$normalizedValue}%"]);
                 }),
                 AllowedFilter::callback('nom_mue', function ($query, $value) {
                     $normalizedValue = Str::slug($value, '');
                     $query->whereRaw("translate(lower(muebles.nom_mue), 'àáâãäåèéêëìíîïòóôõöùúûü', 'aaaaaaeeeeiiiiooooouuuu') LIKE ?", ["%{$normalizedValue}%"]);
                 }),
                 AllowedFilter::callback('nom_mat', function ($query, $value) {
                     $normalizedValue = Str::slug($value, '');
                     $query->whereRaw("translate(lower(materiales.nom_mat), 'àáâãäåèéêëìíîïòóôõöùúûü', 'aaaaaaeeeeiiiiooooouuuu') LIKE ?", ["%{$normalizedValue}%"]);
                 }),
                 AllowedFilter::callback('cantidad_min', function ($query, $value) {
                     if ($value) $query->where('mueble_material.cantidad', '>=', $value);
                 }),
                 AllowedFilter::callback('cantidad_max', function ($query, $value) {
                     if ($value) $query->where('mueble_material.cantidad', '<=', $value);
                 }),
                 AllowedFilter::callback('precio_venta_min', function ($query, $value) {
                     if ($value) $query->where('muebles.precio_venta', '>=', $value);
                 }),
                 AllowedFilter::callback('precio_venta_max', function ($query, $value) {
                     if ($value) $query->where('muebles.precio_venta', '<=', $value);
                 }),
                 AllowedFilter::callback('precio_costo_min', function ($query, $value) {
                     if ($value) $query->where('muebles.precio_costo', '>=', $value);
                 }),
                 AllowedFilter::callback('precio_costo_max', function ($query, $value) {
                     if ($value) $query->where('muebles.precio_costo', '<=', $value);
                 }),
                 AllowedFilter::callback('stock_mue_min', function ($query, $value) {
                     if ($value) $query->where('muebles.stock', '>=', $value);
                 }),
                 AllowedFilter::callback('stock_mue_max', function ($query, $value) {
                     if ($value) $query->where('muebles.stock', '<=', $value);
                 }),
                 AllowedFilter::callback('stock_mat_min', function ($query, $value) {
                     if ($value) $query->where('materiales.stock_mat', '>=', $value);
                 }),
                 AllowedFilter::callback('stock_mat_max', function ($query, $value) {
                     if ($value) $query->where('materiales.stock_mat', '<=', $value);
                 }),
                 AllowedFilter::callback('costo_mat_min', function ($query, $value) {
                     if ($value) $query->where('materiales.costo_mat', '>=', $value);
                 }),
                 AllowedFilter::callback('costo_mat_max', function ($query, $value) {
                     if ($value) $query->where('materiales.costo_mat', '<=', $value);
                 }),
                 AllowedFilter::callback('unidad_medida', function ($query, $value) {
                     $normalizedValue = Str::slug($value, '');
                     $query->whereRaw("translate(lower(materiales.unidad_medida), 'àáâãäåèéêëìíîïòóôõöùúûü', 'aaaaaaeeeeiiiiooooouuuu') LIKE ?", ["%{$normalizedValue}%"]);
                 }),
             ])
             ->allowedSorts(['mueble_material.cod_mue_mat', 'mueble_material.cantidad', 'muebles.nom_mue', 'muebles.precio_venta', 'muebles.precio_costo', 'muebles.stock', 'materiales.nom_mat', 'materiales.stock_mat', 'materiales.costo_mat', 'materiales.unidad_medida'])
             ->paginate($request->input('per_page', 20));
     }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_mue' => 'required|integer|exists:muebles,id_mue',
            'id_mat' => 'required|integer|exists:materiales,id_mat',
            'cantidad' => 'required|numeric|min:0.01',
        ], [
            'id_mue.required' => 'El mueble es obligatorio.',
            'id_mue.integer' => 'El mueble debe ser un identificador válido.',
            'id_mue.exists' => 'El mueble seleccionado no existe.',
            'id_mat.required' => 'El material es obligatorio.',
            'id_mat.integer' => 'El material debe ser un identificador válido.',
            'id_mat.exists' => 'El material seleccionado no existe.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.numeric' => 'La cantidad debe ser un número.',
            'cantidad.min' => 'La cantidad debe ser mayor a 0.',
        ]);
        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_mue_mat = 'MMT-' . $nextId;
            $nextId++;
        } while (MuebleMaterial::where('cod_mue_mat', $cod_mue_mat)->exists());
        $validatedData['cod_mue_mat'] = $cod_mue_mat;
        $muebleMaterial = MuebleMaterial::create($validatedData);

        return response()->json($muebleMaterial, 201);
    }

    public function show($id)
    {
        $muebleMaterial = MuebleMaterial::findOrFail($id);
        return response()->json($muebleMaterial);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'id_mue' => 'sometimes|required|integer|exists:muebles,id_mue',
            'id_mat' => 'sometimes|required|integer|exists:materiales,id_mat',
            'cantidad' => 'sometimes|required|numeric|min:0.01',
        ], [
            'id_mue.required' => 'El mueble es obligatorio.',
            'id_mue.integer' => 'El mueble debe ser un identificador válido.',
            'id_mue.exists' => 'El mueble seleccionado no existe.',
            'id_mat.required' => 'El material es obligatorio.',
            'id_mat.integer' => 'El material debe ser un identificador válido.',
            'id_mat.exists' => 'El material seleccionado no existe.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.numeric' => 'La cantidad debe ser un número.',
            'cantidad.min' => 'La cantidad debe ser mayor a 0.',
        ]);

        $muebleMaterial = MuebleMaterial::findOrFail($id);
        $muebleMaterial->update($validatedData);

        return response()->json($muebleMaterial);
    }

    public function destroy($id)
    {
        $muebleMaterial = MuebleMaterial::findOrFail($id);
        $muebleMaterial->delete();

        return response()->json(null, 204);
    }

    public function reporteMuebleMateriales(Request $request)
    {
        // Obtiene los parámetros de filtrado
        $idMueble = $request->input('id_mue');
        $idMaterial = $request->input('id_mat');

        // Construye la consulta base
        $query = MuebleMaterial::with(['mueble', 'material']);

        // Aplica filtro por ID de mueble si se proporciona
        if (!is_null($idMueble)) {
            $query->where('id_mue', $idMueble);
        }

        // Aplica filtro por ID de material si se proporciona
        if (!is_null($idMaterial)) {
            $query->where('id_mat', $idMaterial);
        }

        // Ejecuta la consulta y obtiene los resultados
        $muebleMateriales = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'muebleMateriales.reporte')
        $pdf = Pdf::loadView('muebleMateriales.reporte', compact('muebleMateriales'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_mueble_materiales.pdf'); // Vista previa en otra pestaña
    }

    public function exportarSQL()
    {
        $table = 'muebles_materiales';
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

        $mueblesMateriales = MuebleMaterial::all();
        $insertSQL = "";

        foreach ($mueblesMateriales as $muebleMaterial) {
            $attrs = $muebleMaterial->getAttributes();
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
            ->header('Content-Disposition', 'attachment; filename=backup_muebles_materiales.sql');
    }
}