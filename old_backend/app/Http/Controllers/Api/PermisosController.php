<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permisos;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class PermisosController extends Controller
{
    /**
     * Obtener todos los permisos
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20);

        $qb = QueryBuilder::for(Permisos::class)
            ->allowedFilters([
                AllowedFilter::callback('nombre', function ($query, $value) {
                    $query->whereRaw('LOWER(nombre) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('descripcion', function ($query, $value) {
                    $query->whereRaw('LOWER(descripcion) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where('nombre', 'like', "%{$value}%");
                }),
            ])
            ->allowedSorts(['nombre', 'descripcion']);

        // Backwards compatibility: if no pagination params provided, return all as array
        if (!$request->has('page') && !$request->has('per_page')) {
            $items = $qb->get();
            return response()->json($items);
        }

        $paginator = $qb->paginate($perPage);
        return response()->json($paginator);
    }

    /**
     * Crear un nuevo permiso
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:150|unique:permisos,nombre',
            'descripcion' => 'nullable|string',
        ]);

        $permiso = Permisos::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
        ]);

        return response()->json($permiso, 201);
    }

    /**
     * Obtener un permiso específico
     */
    public function show($id_permiso)
    {
        $permiso = Permisos::find($id_permiso);

        if (!$permiso) {
            return response()->json(['message' => 'Permiso no encontrado'], 404);
        }

        return response()->json($permiso);
    }

    /**
     * Actualizar un permiso
     */
    public function update(Request $request, $id_permiso)
    {
        $permiso = Permisos::find($id_permiso);

        if (!$permiso) {
            return response()->json(['message' => 'Permiso no encontrado'], 404);
        }

        $request->validate([
            'nombre' => 'sometimes|required|string|max:150|unique:permisos,nombre,' . $id_permiso . ',id_permiso',
            'descripcion' => 'nullable|string',
        ]);

        $permiso->update($request->all());

        return response()->json($permiso);
    }

    /**
     * Eliminar un permiso
     */
    public function destroy($id_permiso)
    {
        $permiso = Permisos::find($id_permiso);

        if (!$permiso) {
            return response()->json(['message' => 'Permiso no encontrado'], 404);
        }

        $permiso->delete();

        return response()->json(['message' => 'Permiso eliminado correctamente'], 200);
    }

    /**
     * Obtener todos los permisos de un rol específico
     */
    public function getPermisosByRol($id_rol)
    {
        $permisos = Permisos::whereHas('roles', function ($query) use ($id_rol) {
            $query->where('id_rol', $id_rol);
        })->get();

        return response()->json($permisos);
    }
}
