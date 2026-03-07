<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

//'ing_usu' => 'nullable|date',
class UsuarioController extends Controller
{

    public function GetUsuariosPerfil($id_usu)
    {
        // Obtener el usuario y la relación cliente
        $usuario = Usuario::with('cliente')->find($id_usu);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Campos obligatorios desde la tabla usuarios
        $response = [
            'nom_usu' => $usuario->nom_usu,
            'email_usu' => $usuario->email_usu,
            'est_usu' => $usuario->est_usu,
            'cod_usu' => $usuario->cod_usu,
        ];

        // Si existe cliente relacionado, añadimos los campos solicitados de clientes
        if ($usuario->cliente) {
            $cliente = $usuario->cliente;
            $clienteFields = [
                'nom_cli' => $cliente->nom_cli,
                'ap_pat_cli' => $cliente->ap_pat_cli,
                'ap_mat_cli' => $cliente->ap_mat_cli,
                'cel_cli' => $cliente->cel_cli,
                'dir_cli' => $cliente->dir_cli,
                'fec_nac_cli' => $cliente->fec_nac_cli,
                'ci_cli' => $cliente->ci_cli,
                'img_cli' => $cliente->img_cli ?? null,
                'est_cli' => $cliente->est_cli,
                'cod_cli' => $cliente->cod_cli ?? null,
            ];

            // Unir secuencia: primero datos usuario, luego datos cliente
            $response = array_merge($response, $clienteFields);
        }

        return response()->json($response);
    }
    public function getUsuarioSimple($id_usu)
    {
        // Traer el usuario junto con la relación 'cliente' para obtener img_cli
        $usuario = Usuario::with('cliente')->find($id_usu);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Construir la respuesta con solo los campos requeridos
        $response = [
            'nom_usu' => $usuario->nom_usu,
            'email_usu' => $usuario->email_usu,
            
            // img_cli está en la tabla cliente relacionada (si existe)
            'img_cli' => $usuario->cliente->img_cli ?? null,
        ];

        return response()->json($response);
    }
    public function getUsuarioById($id_usu)
    {
        // Obtener el usuario con su rol (para devolver solo los campos solicitados)
        $usuario = Usuario::with('rol')->find($id_usu);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $response = [
            'nom_rol' => $usuario->rol->nom_rol ?? null,
            'nom_usu' => $usuario->nom_usu,
            'cod_usu' => $usuario->cod_usu,
            'est_usu' => $usuario->est_usu,
            'email_usu' => $usuario->email_usu,
        ];

        return response()->json($response);
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20);

        $qb = QueryBuilder::for(Usuario::class)
            ->with('rol')
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('nom_usu', 'like', "%{$value}%")
                          ->orWhere('email_usu', 'like', "%{$value}%")
                          ->orWhere('cod_usu', 'like', "%{$value}%");
                    });
                }),
                AllowedFilter::callback('cod_usu', function ($query, $value) {
                    $query->where('cod_usu', 'like', "%{$value}%");
                }),
                AllowedFilter::callback('nom_usu', function ($query, $value) {
                    $query->where('nom_usu', 'like', "%{$value}%");
                }),
                AllowedFilter::callback('email_usu', function ($query, $value) {
                    $query->where('email_usu', 'like', "%{$value}%");
                }),
                AllowedFilter::callback('nom_rol', function ($query, $value) {
                    $query->whereHas('rol', function ($q) use ($value) {
                        $q->where('nom_rol', 'like', "%{$value}%");
                    });
                }),
                AllowedFilter::callback('est_usu', function ($query, $value) {
                    $query->where('est_usu', $value);
                }),
                'id_rol',
            ])
            ->allowedSorts(['nom_usu', 'email_usu', 'cod_usu', 'est_usu','nom_rol' ]);

        if (!$request->has('page') && !$request->has('per_page')) {
            $items = $qb->get()->map(function ($usuario) {
                return [
                    'id_usu' => $usuario->id_usu,
                    'nom_usu' => $usuario->nom_usu,
                    'email_usu' => $usuario->email_usu,
                    'est_usu' => $usuario->est_usu,
                    'cod_usu' => $usuario->cod_usu,
                    'nom_rol' => $usuario->rol->nom_rol ?? null,
                    'id_rol' => $usuario->id_rol,
                ];
            });

            return response()->json($items);
        }

        $paginator = $qb->paginate($perPage);

        // Transformar los items del paginator para mantener la forma esperada
        $paginator->getCollection()->transform(function ($usuario) {
            return [
                'id_usu' => $usuario->id_usu,
                'nom_usu' => $usuario->nom_usu,
                'email_usu' => $usuario->email_usu,
                'est_usu' => $usuario->est_usu,
                'cod_usu' => $usuario->cod_usu,
                'nom_rol' => $usuario->rol->nom_rol ?? null,
                'id_rol' => $usuario->id_rol,
            ];
        });

        return response()->json($paginator);
    }

    public function store(Request $request)
    {
        // Validación de los datos
        $request->validate([
            'nom_usu' => 'required|string|max:100',
            'email_usu' => 'required|email|max:200|unique:usuarios,email_usu',
            'est_usu' => 'required|boolean',
            'id_rol' => 'required|exists:roles,id_rol',
        ], [
            'nom_usu.required' => 'El nombre de usuario es obligatorio.',
            'nom_usu.string' => 'El nombre de usuario debe ser texto.',
            'nom_usu.max' => 'El nombre de usuario no puede exceder 100 caracteres.',
            'email_usu.required' => 'El correo electrónico es obligatorio.',
            'email_usu.email' => 'El correo electrónico debe ser válido.',
            'email_usu.max' => 'El correo electrónico no puede exceder 200 caracteres.',
            'email_usu.unique' => 'Este correo electrónico ya está registrado.',
            'est_usu.required' => 'El estado es obligatorio.',
            'est_usu.boolean' => 'El estado debe ser verdadero o falso.',
            'id_rol.required' => 'El rol es obligatorio.',
            'id_rol.exists' => 'El rol seleccionado no existe.',
        ]);

        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_usu = 'USU-' . $nextId;
            $nextId++;
        } while (Usuario::where('cod_usu', $cod_usu)->exists());

        // Crear el usuario con la contraseña encriptada
        // Generar contraseña aleatoria
        $password = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 10);

        $usuario = new Usuario();
        $usuario->cod_usu = $cod_usu;
        $usuario->nom_usu = $request->nom_usu;
        $usuario->email_usu = $request->email_usu;
        $usuario->pas_usu = Hash::make($password); // Encriptar la contraseña generada
        $usuario->est_usu = $request->est_usu;
        $usuario->id_rol = $request->id_rol;
        $usuario->save();

        // Enviar correo con las credenciales
        try {
            Mail::send('emails.credentials', [
                'name' => $usuario->nom_usu,
                'email' => $usuario->email_usu,
                'password' => $password, // Contraseña sin encriptar para el correo
                'codigo' => $usuario->cod_usu
            ], function($message) use ($usuario) {
                $message->to($usuario->email_usu, $usuario->nom_usu)
                        ->subject('Credenciales de acceso - ' . config('app.name', 'Sistema'));
            });
        } catch (\Exception $e) {
            // Log el error pero no afectar la creación del usuario
            Log::error('Error enviando email: ' . $e->getMessage());
        }

        return response()->json($usuario, 201);
    }

    public function show($id)
    {
        return Usuario::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);
        
        $request->validate([
            'nom_usu' => 'sometimes|required|string|max:100',
            'email_usu' => 'sometimes|required|email|max:200|unique:usuarios,email_usu,' . $id . ',id_usu',
            'est_usu' => 'sometimes|required|boolean',
            'id_rol' => 'sometimes|required|exists:roles,id_rol',
        ], [
            'nom_usu.required' => 'El nombre de usuario es obligatorio.',
            'nom_usu.string' => 'El nombre de usuario debe ser texto.',
            'nom_usu.max' => 'El nombre de usuario no puede exceder 100 caracteres.',
            'email_usu.required' => 'El correo electrónico es obligatorio.',
            'email_usu.email' => 'El correo electrónico debe ser válido.',
            'email_usu.max' => 'El correo electrónico no puede exceder 200 caracteres.',
            'email_usu.unique' => 'Este correo electrónico ya está registrado.',
            'est_usu.required' => 'El estado es obligatorio.',
            'est_usu.boolean' => 'El estado debe ser verdadero o falso.',
            'id_rol.required' => 'El rol es obligatorio.',
            'id_rol.exists' => 'El rol seleccionado no existe.',
        ]);
        
        $usuario->update($request->all());
        return response()->json($usuario);
    }

    public function destroy($id)
    {
        Usuario::destroy($id);
        return response()->json(null, 204);
    }

    public function cambiarEstado(Request $request, $id)
    {
        $request->validate([
            'est_usu' => 'required|boolean',
        ]);

        $usuario = Usuario::findOrFail($id);
        $usuario->est_usu = $request->est_usu;
        $usuario->save();

        return response()->json($usuario);
    }
    public function obtenerUsuariosSinRelaciones()
    {
        // Obtén los usuarios que no tienen registros en empleados ni clientes
        $usuariosSinRelaciones = Usuario::whereDoesntHave('empleado')
            ->whereDoesntHave('cliente')
            ->get();

        // Devuelve la respuesta (puede ser en formato JSON)
        return response()->json($usuariosSinRelaciones);
    }
    public function reporteUsuarios(Request $request)
    {
        // Obtiene los parámetros de filtrado
        $rolId = $request->input('id_rol');
        $estado = $request->input('est_usu');

        // Construye la consulta base
        $query = Usuario::with('rol');

        // Aplica filtro por rol si se proporciona
        if (!is_null($rolId)) {
            $query->where('id_rol', $rolId);
        }

        // Aplica filtro por estado si se proporciona
        if (!is_null($estado)) {
            $query->where('est_usu', $estado);
        }

        // Ejecuta la consulta y obtiene los resultados
        $usuarios = $query->get();

        // Genera el PDF usando una vista Blade (debes crear la vista 'usuarios.reporte')
        $pdf = Pdf::loadView('usuarios.reporte', compact('usuarios'));

        // Siempre mostrar el PDF en el navegador
        return $pdf->stream('reporte_usuarios.pdf'); // Vista previa en otra pestaña
    }
    public function exportarSQL()
{
    // 1. Obtener estructura de la tabla
    $table = 'usuarios';
    $schema = DB::select("SELECT column_name, data_type, character_maximum_length, is_nullable
                           FROM information_schema.columns
                           WHERE table_name = '$table'
                           ORDER BY ordinal_position");

    $createTableSQL = "DROP TABLE IF EXISTS \"$table\";\nCREATE TABLE \"$table\" (\n";

    $columns = [];

    foreach ($schema as $column) {
        $line = "  \"$column->column_name\" " . strtoupper($column->data_type);

        // Añadir longitud si aplica
        if ($column->character_maximum_length) {
            $line .= "({$column->character_maximum_length})";
        }

        // Añadir si es NOT NULL
        if ($column->is_nullable === 'NO') {
            $line .= " NOT NULL";
        }

        $columns[] = $line;
    }

    $createTableSQL .= implode(",\n", $columns) . "\n);\n\n";

    // 2. Obtener datos actuales
    $usuarios = \App\Models\Usuario::all();
    $insertSQL = "";

    foreach ($usuarios as $usuario) {
        $attrs = $usuario->getAttributes();
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
        ->header('Content-Disposition', 'attachment; filename=backup_usuarios.sql');
}

    /**
     * Obtener los permisos del usuario autenticado
     * GET /api/usuarios/{id_usu}/permisos
     */
    public function obtenerMisPermisos($id_usu)
    {
        $usuario = Usuario::with('rol.permisos')->find($id_usu);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $permisos = $usuario->rol ? $usuario->rol->permisos->pluck('nombre')->toArray() : [];

        return response()->json([
            'permisos' => $permisos,
        ]);
    }

    /**
     * Verificar si un usuario tiene un permiso específico
     * GET /api/usuarios/{id_usu}/verificar-permiso?permiso=nombre_permiso
     */
    public function verificarPermiso($id_usu, Request $request)
    {
        $usuario = Usuario::find($id_usu);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $request->validate([
            'permiso' => 'required|string',
        ]);

        $tienePermiso = $usuario->hasPermission($request->permiso);

        return response()->json([
            'id_usu' => $usuario->id_usu,
            'nom_usu' => $usuario->nom_usu,
            'permiso' => $request->permiso,
            'tiene_permiso' => $tienePermiso,
        ]);
    }

    /**
     * Verificar múltiples permisos de un usuario
     * POST /api/usuarios/{id_usu}/verificar-permisos
     */
    public function verificarMultiplesPermisos($id_usu, Request $request)
    {
        $usuario = Usuario::find($id_usu);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $request->validate([
            'permisos' => 'required|array',
            'permisos.*' => 'string',
        ]);

        $resultado = [];

        foreach ($request->permisos as $permiso) {
            $resultado[$permiso] = $usuario->hasPermission($permiso);
        }

        return response()->json([
            'id_usu' => $usuario->id_usu,
            'nom_usu' => $usuario->nom_usu,
            'permisos' => $resultado,
        ]);
    }
    
    
    
}

