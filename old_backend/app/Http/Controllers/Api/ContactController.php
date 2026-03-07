<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function enviarContacto(Request $request)
    {
        // Validación de los datos
        $request->validate([
            'nombre' => 'required|string|max:100',
            'email' => 'required|email|max:200',
            'telefono' => 'nullable|string|max:20',
            'mensaje' => 'required|string',
        ]);

        try {
            Mail::send('emails.contacto', [
                'nombre' => $request->nombre,
                'email' => $request->email,
                'telefono' => $request->telefono,
                'mensaje' => $request->mensaje,
                'fecha' => now()->format('d/m/Y H:i:s'),
            ], function($message) use ($request) {
                $message->to('bosquejo1@outlook.com', 'Bosquejo')
                        ->subject('Nuevo mensaje de contacto - ' . $request->nombre)
                        ->replyTo($request->email, $request->nombre);
            });

            return response()->json(['message' => 'Mensaje enviado correctamente'], 200);
        } catch (\Exception $e) {
            Log::error('Error enviando email de contacto: ' . $e->getMessage());
            return response()->json(['message' => 'Error al enviar el mensaje'], 500);
        }
    }
}