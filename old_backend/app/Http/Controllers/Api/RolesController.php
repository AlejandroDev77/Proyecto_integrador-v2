<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use App\Models\Permisos;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class RolesController extends Controller
{
    /**
     * Obtener todos los roles con sus permisos
     */
    /*    public function index()
    {
        $roles = Rol::with('permisos', 'usuarios')->get();
        return response()->json($roles);
    } */

    public function index(\Illuminate\Http\Request $request)
    {
        return QueryBuilder::for(Rol::class)
            ->with('permisos', 'usuarios')
            ->allowedFilters([
                AllowedFilter::callback('nom_rol', function ($query, $value) {
                    $query->whereRaw('LOWER(nom_rol) LIKE LOWER(?)', ["%{$value}%"]);
                }),
                AllowedFilter::callback('cod_rol', function ($query, $value) {
                    $query->where('cod_rol', 'like', "%{$value}%");
                }),
                AllowedFilter::callback('nom_per', function ($query, $value) {
                    // Filtrar por nombre de permiso en la relación
                    $query->whereHas('permisos', function ($subQuery) use ($value) {
                        $subQuery->whereRaw('LOWER(nombre) LIKE LOWER(?)', ["%{$value}%"]);
                    });
                }),
            ])
            ->allowedSorts(['id_rol', 'nom_rol'])
            ->paginate($request->input('per_page', 20));
    }



    /**
     * Crear un nuevo rol
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom_rol' => 'required|string|max:100|unique:roles,nom_rol',
        ]);

        $rol = Rol::create([
            'nom_rol' => $request->nom_rol,
        ]);

        return response()->json($rol, 201);
    }

    /**
     * Obtener un rol específico con sus permisos
     */
    public function show($id_rol)
    {
        $rol = Rol::with('permisos', 'usuarios')->find($id_rol);

        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        return response()->json($rol);
    }

    /**
     * Actualizar un rol
     */
    public function update(Request $request, $id_rol)
    {
        $rol = Rol::find($id_rol);

        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        $request->validate([
            'nom_rol' => 'sometimes|required|string|max:100|unique:roles,nom_rol,' . $id_rol . ',id_rol',
        ]);

        $rol->update($request->all());

        return response()->json($rol);
    }

    /**
     * Eliminar un rol
     */
    public function destroy($id_rol)
    {
        $rol = Rol::find($id_rol);

        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        // Verificar si hay usuarios con este rol
        if ($rol->usuarios()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el rol porque hay usuarios asignados a él'
            ], 409);
        }

        $rol->delete();

        return response()->json(['message' => 'Rol eliminado correctamente'], 200);
    }

    /**
     * Obtener todos los permisos de un rol
     */
    public function getPermisos($id_rol)
    {
        $rol = Rol::find($id_rol);

        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        $permisos = $rol->permisos()->get();

        return response()->json($permisos);
    }

    /**
     * Obtener todos los usuarios que tienen un rol específico
     */
    public function getUsuarios($id_rol)
    {
        $rol = Rol::find($id_rol);

        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        $usuarios = $rol->usuarios()->get();

        return response()->json($usuarios);
    }

    /**
     * Obtener la ruta de redirección según el rol
     * GET /api/roles/{id_rol}/redirect-route
     */
    public function getRedirectRoute($id_rol)
    {
        $rol = Rol::find($id_rol);

        if (!$rol) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        // Mapeo de rutas por rol (configurable)
        $routeMap = [
            1 => '/dashboard',      // Administrador
            2 => '/negocio',      // Empleado
            3 => '/products',   //cliente
            5=> '/dashboard',    // 
        ];

        $route = $routeMap[$id_rol] ?? '/signin';

        return response()->json([
            'route' => $route,
           // 'id_rol' => $id_rol,
            'nom_rol' => $rol->nom_rol
        ]);
    }
}
