<?php

namespace App\Observers;

use App\Models\Cliente;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ClienteObserver
{
    public function created(Cliente $cliente)
    {
        $userId = request()->header('X-USER-ID', null);
        $userId = is_numeric($userId) ? (int)$userId : null;
        $codUsu = null;
        if ($userId) {
            $codUsu = DB::table('usuarios')->where('id_usu', $userId)->value('cod_usu');
        }
        $fechaBolivia = now()->setTimezone('America/La_Paz');
        DB::table('audit_logs')->insert([
            'user_id' => $userId,
            'cod_usu' => $codUsu,
            'table_name' => 'clientes',
            'action' => 'create',
            'record_id' => $cliente->id_cli,
            'old_values' => null,
            'new_values' => json_encode($cliente->getAttributes()),
            'created_at' => $fechaBolivia,
            'updated_at' => $fechaBolivia,
        ]);
    }

    public function updated(Cliente $cliente)
    {
        $userId = request()->header('X-USER-ID', null);
        $userId = is_numeric($userId) ? (int)$userId : null;
        $codUsu = null;
        if ($userId) {
            $codUsu = DB::table('usuarios')->where('id_usu', $userId)->value('cod_usu');
        }
        $fechaBolivia = now()->setTimezone('America/La_Paz');
        DB::table('audit_logs')->insert([
            'user_id' => $userId,
            'cod_usu' => $codUsu,
            'table_name' => 'clientes',
            'action' => 'actualizado',
            'record_id' => $cliente->id_cli,
            'old_values' => json_encode($cliente->getOriginal()),
            'new_values' => json_encode($cliente->getAttributes()),
            'created_at' => $fechaBolivia,
            'updated_at' => $fechaBolivia,
        ]);
    }

    public function deleted(Cliente $cliente)
    {
        $userId = request()->header('X-USER-ID', null);
        $userId = is_numeric($userId) ? (int)$userId : null;
        $codUsu = null;
        if ($userId) {
            $codUsu = DB::table('usuarios')->where('id_usu', $userId)->value('cod_usu');
        }
        $fechaBolivia = now()->setTimezone('America/La_Paz');
        DB::table('audit_logs')->insert([
            'user_id' => $userId,
            'cod_usu' => $codUsu,
            'table_name' => 'clientes',
            'action' => 'delete',
            'record_id' => $cliente->id_cli,
            'old_values' => json_encode($cliente->getOriginal()),
            'new_values' => null,
            'created_at' => $fechaBolivia,
            'updated_at' => $fechaBolivia,
        ]);
    }
}
