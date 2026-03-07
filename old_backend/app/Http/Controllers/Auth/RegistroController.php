<?php

namespace App\Http\Controllers\Auth;

use App\Models\Usuario;
use App\Models\Rol;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegistroController extends Controller
{
    /**
     * Registrar un nuevo usuario.
     */
    public function register(Request $request)
    {
        // Validar los datos del formulario
        $validator = Validator::make($request->all(), [
            'nom_usu' => 'required|string|max:100|unique:usuarios,nom_usu', // Validar que el nombre de usuario sea único
            'email_usu' => 'required|email|unique:usuarios,email_usu',
            'pas_usu' => 'required|string|min:6',
            'id_rol' => 'required|exists:roles,id_rol', // Validar que el rol existe
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Generar código automáticamente
        $nextId = 1;
        do {
            $cod_usu = 'USU-' . $nextId;
            $nextId++;
        } while (Usuario::where('cod_usu', $cod_usu)->exists());

        // Crear el nuevo usuario
        $usuario = Usuario::create([
            'cod_usu' => $cod_usu,
            'nom_usu' => $request->nom_usu,
            'email_usu' => $request->email_usu,
            'pas_usu' => Hash::make($request->pas_usu), // Encriptar la contraseña
            'est_usu' => true,  // Por defecto el usuario está activo
            'id_rol' => $request->id_rol,  // Asignar rol
        ]);

        return response()->json(['message' => 'Usuario registrado correctamente']);
    }
}
