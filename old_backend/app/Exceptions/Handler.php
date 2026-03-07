<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Log;

class Handler extends ExceptionHandler
{
    /**
     * Lista de excepciones que no se reportan.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * Inputs que nunca deben mostrarse en validaciones.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Registrar callbacks para manejo de excepciones.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        // ⚠️ Token expirado
        $this->renderable(function (TokenExpiredException $e, $request) {
            Log::warning("⚠️ Token expirado desde IP: " . $request->ip());
            return response()->json(['error' => 'El token ha expirado'], 401);
        });

        // ❌ Token inválido
        $this->renderable(function (TokenInvalidException $e, $request) {
            Log::error("❌ Token inválido desde IP: " . $request->ip());
            return response()->json(['error' => 'Token inválido'], 401);
        });

        // 🚫 Token no encontrado
        $this->renderable(function (JWTException $e, $request) {
            Log::error("🚫 Token no encontrado en la request desde IP: " . $request->ip());
            return response()->json(['error' => 'Token no encontrado'], 401);
        });
    }
}
