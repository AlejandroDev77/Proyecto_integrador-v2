<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use App\Models\Permisos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RolesPermisosController extends Controller
{
    /**
     * Obtener todos los datos de la tabla rol_permiso con información completa
     * GET /api/roles-permisos
     */
    public function index(\Illuminate\Http\Request $request)
    {
        $perPage = (int) $request->input('per_page', 20);

        $query = DB::table('rol_permiso')
            ->join('roles', 'rol_permiso.id_rol', '=', 'roles.id_rol')
            ->join('permisos', 'rol_permiso.id_permiso', '=', 'permisos.id_permiso')
            ->select(
                'rol_permiso.id_rol',
                'rol_permiso.id_permiso',
                'roles.nom_rol',
                'permisos.nombre as nom_permiso',
                'permisos.descripcion'
            );

        // Aplicar filtros si existen
        if ($request->has('filter')) {
            $filters = $request->input('filter');
            
            if (isset($filters['nom_rol'])) {
                $query->whereRaw('LOWER(roles.nom_rol) LIKE LOWER(?)', ["%{$filters['nom_rol']}%"]);
            }
            
            if (isset($filters['nombre'])) {
                $query->whereRaw('LOWER(permisos.nombre) LIKE LOWER(?)', ["%{$filters['nombre']}%"]);
            }
            
            if (isset($filters['descripcion'])) {
                $query->whereRaw('LOWER(permisos.descripcion) LIKE LOWER(?)', ["%{$filters['descripcion']}%"]);
            }
        }

        // Aplicar ordenamiento si existe
        if ($request->has('sort')) {
            $sort = $request->input('sort');
            $isDesc = strpos($sort, '-') === 0;
            $sortField = $isDesc ? substr($sort, 1) : $sort;
            $direction = $isDesc ? 'desc' : 'asc';
            
            // Map sort fields to actual columns
            $fieldMap = [
                'nom_rol' => 'roles.nom_rol',
                'nombre' => 'permisos.nombre',
                'id_rol' => 'rol_permiso.id_rol',
                'id_permiso' => 'rol_permiso.id_permiso',
            ];
            
            $column = $fieldMap[$sortField] ?? $sortField;
            $query->orderBy($column, $direction);
        } else {
            $query->orderBy('rol_permiso.id_rol')
                  ->orderBy('rol_permiso.id_permiso');
        }

        $rolPermisos = $query->paginate($perPage);

        return response()->json($rolPermisos);
    }

    /**
     * Obtener datos de rol_permiso con filtro opcional por rol
     * GET /api/roles-permisos?id_rol=1
     */
    public function obtenerRolPermiso(Request $request)
    {
        $query = DB::table('rol_permiso')
            ->join('roles', 'rol_permiso.id_rol', '=', 'roles.id_rol')
            ->join('permisos', 'rol_permiso.id_permiso', '=', 'permisos.id_permiso')
            ->select(
                'rol_permiso.id_rol',
                'rol_permiso.id_permiso',
                'roles.nom_rol',
                'permisos.nombre as nom_permiso',
                'permisos.descripcion'
            );

        // Filtrar por rol si se proporciona
        if ($request->has('id_rol')) {
            $query->where('rol_permiso.id_rol', $request->id_rol);
        }

        // Filtrar por permiso si se proporciona
        if ($request->has('id_permiso')) {
            $query->where('rol_permiso.id_permiso', $request->id_permiso);
        }

        $rolPermisos = $query->orderBy('rol_permiso.id_rol')
            ->orderBy('rol_permiso.id_permiso')
            ->get();

        return response()->json($rolPermisos);
    }

    /**
     * Asignar un permiso a un rol
     * POST /api/roles/{id_rol}/permisos/{id_permiso}
     */
    public function asignarPermiso($id_rol, $id_permiso)
    {
        $rol = Rol::find($id_rol);
        $permiso = Permisos::find($id_permiso);

        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        if (!$permiso) {
            return response()->json(['message' => 'Permiso no encontrado'], 404);
        }

        try {
            // Intentar asignar el permiso directamente
            $rol->permisos()->attach($id_permiso);

            return response()->json([
                'message' => 'Permiso asignado correctamente',
                'rol_id' => $id_rol,
                'permiso_id' => $id_permiso
            ], 201);
        } catch (\Illuminate\Database\QueryException $e) {
            // Si ya existe la relación (violación de constraint único)
            if ($e->getCode() == '23505' || strpos($e->getMessage(), 'Duplicate') !== false || strpos($e->getMessage(), 'unique') !== false) {
                return response()->json(['message' => 'El permiso ya está asignado a este rol'], 409);
            }
            // Otros errores de base de datos
            return response()->json(['message' => 'Error al asignar el permiso'], 500);
        }
    }

    /**
     * Revocar un permiso de un rol
     * DELETE /api/roles/{id_rol}/permisos/{id_permiso}
     */
    public function revocarPermiso($id_rol, $id_permiso)
    {
        $rol = Rol::find($id_rol);
        $permiso = Permisos::find($id_permiso);

        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        if (!$permiso) {
            return response()->json(['message' => 'Permiso no encontrado'], 404);
        }

        try {
            // Detach retorna el número de registros eliminados
            $deleted = $rol->permisos()->detach($id_permiso);

            if ($deleted === 0) {
                return response()->json(['message' => 'El permiso no está asignado a este rol'], 404);
            }

            return response()->json([
                'message' => 'Permiso revocado correctamente',
                'rol_id' => $id_rol,
                'permiso_id' => $id_permiso
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json(['message' => 'Error al revocar el permiso'], 500);
        }
    }

    /**
     * Asignar múltiples permisos a un rol (usando request body)
     * POST /api/roles/{id_rol}/permisos-batch
     */
    public function asignarPermisosLote(Request $request, $id_rol)
    {
        $rol = Rol::find($id_rol);

        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        $request->validate([
            'id_permisos' => 'required|array',
            'id_permisos.*' => 'integer|exists:permisos,id_permiso',
        ]);

        $permisosAñadidos = [];
        $permisosExistentes = [];

        foreach ($request->id_permisos as $id_permiso) {
            if ($rol->permisos()->where('id_permiso', $id_permiso)->exists()) {
                $permisosExistentes[] = $id_permiso;
            } else {
                $rol->permisos()->attach($id_permiso);
                $permisosAñadidos[] = $id_permiso;
            }
        }

        return response()->json([
            'message' => 'Operación completada',
            'permisos_añadidos' => $permisosAñadidos,
            'permisos_existentes' => $permisosExistentes,
        ], 201);
    }

    /**
     * Revocar múltiples permisos de un rol
     * DELETE /api/roles/{id_rol}/permisos-batch
     */
    public function revocarPermisosLote(Request $request, $id_rol)
    {
        $rol = Rol::find($id_rol);

        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        $request->validate([
            'id_permisos' => 'required|array',
            'id_permisos.*' => 'integer|exists:permisos,id_permiso',
        ]);

        $permisosRevocados = [];
        $permisosNoEncontrados = [];

        foreach ($request->id_permisos as $id_permiso) {
            if ($rol->permisos()->where('id_permiso', $id_permiso)->exists()) {
                $rol->permisos()->detach($id_permiso);
                $permisosRevocados[] = $id_permiso;
            } else {
                $permisosNoEncontrados[] = $id_permiso;
            }
        }

        return response()->json([
            'message' => 'Operación completada',
            'permisos_revocados' => $permisosRevocados,
            'permisos_no_encontrados' => $permisosNoEncontrados,
        ]);
    }

    /**
     * Reemplazar todos los permisos de un rol (sync)
     * PUT /api/roles/{id_rol}/permisos
     */
    public function sincronizarPermisos(Request $request, $id_rol)
    {
        $rol = Rol::find($id_rol);

        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        $request->validate([
            'id_permisos' => 'required|array',
            'id_permisos.*' => 'integer|exists:permisos,id_permiso',
        ]);

        // Sync reemplaza todos los permisos con los nuevos
        $rol->permisos()->sync($request->id_permisos);

        $permisos = $rol->permisos()->get();

        return response()->json([
            'message' => 'Permisos sincronizados correctamente',
            'rol_id' => $id_rol,
            'permisos' => $permisos,
        ]);
    }

    /**
     * Obtener todos los permisos disponibles para asignar a un rol
     * GET /api/roles/{id_rol}/permisos-disponibles
     */
    public function permisosDisponibles($id_rol)
    {
        $rol = Rol::find($id_rol);

        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        // Obtener permisos ya asignados usando query directo
        $permisosAsignados = DB::table('permisos')
            ->join('rol_permiso', 'permisos.id_permiso', '=', 'rol_permiso.id_permiso')
            ->where('rol_permiso.id_rol', $id_rol)
            ->select('permisos.*')
            ->get();

        // Obtener todos los permisos disponibles (no asignados) usando query directo
        $permisosNoAsignados = DB::table('permisos')
            ->whereNotIn('id_permiso', function ($query) use ($id_rol) {
                $query->select('rol_permiso.id_permiso')
                    ->from('rol_permiso')
                    ->where('rol_permiso.id_rol', $id_rol);
            })
            ->get();

        return response()->json([
            'permisos_asignados' => $permisosAsignados,
            'permisos_disponibles' => $permisosNoAsignados,
        ]);
    }
}
