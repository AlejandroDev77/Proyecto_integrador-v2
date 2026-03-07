<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use Tymon\JWTAuth\Facades\JWTAuth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        // Validación de los datos de entrada
        $request->validate([
            'nom_usu' => 'required|string',
            'password' => 'required',
        ]);

        // Buscar al usuario
        $usuario = Usuario::where('nom_usu', $request->nom_usu)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->pas_usu)) {
            return response()->json([
                'message' => 'Credenciales incorrectas',
            ], 401);
        }

        // 🔹 Generar el JWT con claims personalizados (ya definidos en el modelo Usuario)
        $token = JWTAuth::fromUser($usuario);

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 3000,
        ]);
    }

    // 🔹 Endpoint para devolver datos del usuario autenticado
    public function me()
    {
        return response()->json(['valid' => true]);
    }

    // 🔹 Logout: invalidar el token
    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Sesión cerrada correctamente.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'No se pudo cerrar la sesión.'], 500);
        }
    }
    
}
