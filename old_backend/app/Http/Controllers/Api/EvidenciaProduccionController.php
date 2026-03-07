<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvidenciaProduccion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class EvidenciaProduccionController extends Controller
{
    private $r2_base_url = 'https://pub-6754bd9df8644a73aa7462b6f3042f84.r2.dev';

    public function index(Request $request)
    {
        return QueryBuilder::for(EvidenciaProduccion::class)
            ->with(['produccionEtapa', 'produccionEtapa.etapa', 'empleado'])
            ->allowedFilters([
                'id_pro_eta',
                'tipo_evi',
                AllowedFilter::callback('id_pro', function ($query, $value) {
                    $query->whereHas('produccionEtapa', function ($q) use ($value) {
                        $q->where('id_pro', $value);
                    });
                }),
            ])
            ->allowedSorts(['fec_evi', 'tipo_evi'])
            ->paginate($request->input('per_page', 20));
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'id_pro_eta' => 'required|exists:produccion_etapas,id_pro_eta',
                'tipo_evi' => 'required|string|in:foto,video,documento',
                'archivo' => 'required|file|max:51200', // Max 50MB
                'descripcion' => 'nullable|string|max:500',
                'id_emp' => 'required|exists:empleados,id_emp',
            ], [
                'id_pro_eta.required' => 'La etapa de producción es obligatoria.',
                'id_pro_eta.exists' => 'La etapa de producción no existe.',
                'tipo_evi.required' => 'El tipo de evidencia es obligatorio.',
                'tipo_evi.in' => 'El tipo debe ser: foto, video o documento.',
                'archivo.required' => 'El archivo es obligatorio.',
                'archivo.max' => 'El archivo no debe superar 50MB.',
                'id_emp.required' => 'El empleado es obligatorio.',
            ]);

            // === Subir archivo a Cloudflare R2 ===
            $file = $request->file('archivo');
            $extension = $file->getClientOriginalExtension();
            $folder = $validated['tipo_evi'] === 'foto' ? 'images' : ($validated['tipo_evi'] === 'video' ? 'videos' : 'documents');
            $path = "evidencias/{$folder}/" . uniqid() . '.' . $extension;
            Storage::disk('s3')->put($path, file_get_contents($file), 'public');
            $archivoUrl = $this->r2_base_url . '/' . $path;

            // Generar código
            $nextId = 1;
            do {
                $codEvi = 'EVI-' . $nextId;
                $nextId++;
            } while (EvidenciaProduccion::where('cod_evi', $codEvi)->exists());

            $evidencia = EvidenciaProduccion::create([
                'id_pro_eta' => $validated['id_pro_eta'],
                'tipo_evi' => $validated['tipo_evi'],
                'archivo_evi' => $archivoUrl,
                'descripcion' => $validated['descripcion'] ?? null,
                'fec_evi' => now(),
                'id_emp' => $validated['id_emp'],
                'cod_evi' => $codEvi,
            ]);

            return EvidenciaProduccion::with(['produccionEtapa', 'produccionEtapa.etapa', 'empleado'])->find($evidencia->id_evi);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Los datos enviados no son válidos.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al crear evidencia: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        return EvidenciaProduccion::with(['produccionEtapa', 'produccionEtapa.etapa', 'produccionEtapa.produccion', 'empleado'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $evidencia = EvidenciaProduccion::findOrFail($id);

        try {
            $validated = $request->validate([
                'id_pro_eta' => 'sometimes|exists:produccion_etapas,id_pro_eta',
                'tipo_evi' => 'sometimes|string|in:foto,video,documento',
                'descripcion' => 'nullable|string|max:500',
                'archivo' => 'nullable|file|max:51200',
                'id_emp' => 'sometimes|exists:empleados,id_emp',
            ]);

            // Si hay nuevo archivo, subirlo a Cloudflare R2
            if ($request->hasFile('archivo')) {
                $file = $request->file('archivo');
                $extension = $file->getClientOriginalExtension();
                $tipoEvi = $validated['tipo_evi'] ?? $evidencia->tipo_evi;
                $folder = $tipoEvi === 'foto' ? 'images' : ($tipoEvi === 'video' ? 'videos' : 'documents');
                $path = "evidencias/{$folder}/" . uniqid() . '.' . $extension;
                Storage::disk('s3')->put($path, file_get_contents($file), 'public');
                $validated['archivo_evi'] = $this->r2_base_url . '/' . $path;
            }

            $evidencia->update($validated);
            return EvidenciaProduccion::with(['produccionEtapa', 'produccionEtapa.etapa', 'empleado'])->find($evidencia->id_evi);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Los datos enviados no son válidos.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar evidencia: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $evidencia = EvidenciaProduccion::findOrFail($id);
        
        // Nota: Los archivos en R2 no se eliminan automáticamente
        // Se podría implementar eliminación si es necesario
        
        $evidencia->delete();
        return response()->json(['message' => 'Evidencia eliminada correctamente']);
    }

    // Obtener todas las evidencias de una produccion
    public function porProduccion($id_pro)
    {
        return EvidenciaProduccion::with(['produccionEtapa', 'produccionEtapa.etapa', 'empleado'])
            ->whereHas('produccionEtapa', function ($q) use ($id_pro) {
                $q->where('id_pro', $id_pro);
            })
            ->orderBy('fec_evi', 'desc')
            ->get();
    }
}
