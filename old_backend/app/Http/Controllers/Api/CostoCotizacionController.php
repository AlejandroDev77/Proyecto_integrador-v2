<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CostoCotizacion;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class CostoCotizacionController extends Controller
{
    public function index(Request $request)
    {
        return QueryBuilder::for(CostoCotizacion::class)
            ->with(['cotizacion'])
            ->allowedFilters([
                'id_cot',
                AllowedFilter::callback('margen_min', function ($query, $value) {
                    $query->where('margen_ganancia', '>=', $value);
                }),
            ])
            ->allowedSorts(['costo_total', 'precio_sugerido', 'margen_ganancia'])
            ->paginate($request->input('per_page', 20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_cot' => 'required|exists:cotizaciones,id_cot',
            'costo_materiales' => 'nullable|numeric|min:0',
            'costo_mano_obra' => 'nullable|numeric|min:0',
            'costos_indirectos' => 'nullable|numeric|min:0',
            'margen_ganancia' => 'nullable|numeric|min:0|max:100',
            'costo_total' => 'nullable|numeric|min:0',
            'precio_sugerido' => 'nullable|numeric|min:0',
        ], [
            'id_cot.required' => 'La cotización es obligatoria.',
            'id_cot.exists' => 'La cotización no existe.',
        ]);

        // Calcular totales si no vienen
        $costoMat = $validated['costo_materiales'] ?? 0;
        $costoMO = $validated['costo_mano_obra'] ?? 0;
        $costosInd = $validated['costos_indirectos'] ?? 0;
        $margen = $validated['margen_ganancia'] ?? 0;

        $costoTotal = $costoMat + $costoMO + $costosInd;
        $precioSugerido = $costoTotal * (1 + ($margen / 100));

        $validated['costo_total'] = $validated['costo_total'] ?? $costoTotal;
        $validated['precio_sugerido'] = $validated['precio_sugerido'] ?? $precioSugerido;

        $costo = CostoCotizacion::create($validated);
        return CostoCotizacion::with(['cotizacion'])->find($costo->id_costo);
    }

    public function show($id)
    {
        return CostoCotizacion::with(['cotizacion'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $costo = CostoCotizacion::findOrFail($id);

        $validated = $request->validate([
            'costo_materiales' => 'nullable|numeric|min:0',
            'costo_mano_obra' => 'nullable|numeric|min:0',
            'costos_indirectos' => 'nullable|numeric|min:0',
            'margen_ganancia' => 'nullable|numeric|min:0|max:100',
            'costo_total' => 'nullable|numeric|min:0',
            'precio_sugerido' => 'nullable|numeric|min:0',
        ]);

        // Recalcular si hay cambios en componentes
        if (isset($validated['costo_materiales']) || isset($validated['costo_mano_obra']) || isset($validated['costos_indirectos'])) {
            $costoMat = $validated['costo_materiales'] ?? $costo->costo_materiales;
            $costoMO = $validated['costo_mano_obra'] ?? $costo->costo_mano_obra;
            $costosInd = $validated['costos_indirectos'] ?? $costo->costos_indirectos;
            $margen = $validated['margen_ganancia'] ?? $costo->margen_ganancia;

            $costoTotal = $costoMat + $costoMO + $costosInd;
            $precioSugerido = $costoTotal * (1 + ($margen / 100));

            $validated['costo_total'] = $costoTotal;
            $validated['precio_sugerido'] = $precioSugerido;
        }

        $costo->update($validated);
        return CostoCotizacion::with(['cotizacion'])->find($costo->id_costo);
    }

    public function destroy($id)
    {
        $costo = CostoCotizacion::findOrFail($id);
        $costo->delete();
        return response()->json(['message' => 'Costo eliminado correctamente']);
    }
}
