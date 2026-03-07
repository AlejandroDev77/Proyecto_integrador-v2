<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Este método devuelve los datos del usuario autenticado
    public function index(Request $request)
    {
        return response()->json($request->user()); // Devuelve el usuario autenticado
    }
}
