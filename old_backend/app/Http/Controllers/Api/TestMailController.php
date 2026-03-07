<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;

class TestMailController extends Controller
{
    public function testMail()
    {
        try {
            Mail::raw('Prueba de correo desde Laravel', function($message) {
                $message->to('dylanpoma4@gmail.com')
                        ->subject('Test de Correo');
            });

            return response()->json(['message' => 'Correo enviado exitosamente']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al enviar el correo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
