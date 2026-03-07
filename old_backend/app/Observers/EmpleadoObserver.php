<?php

namespace App\Observers;

use App\Models\Empleado;
use Illuminate\Support\Facades\DB;

class EmpleadoObserver
{
    public function created(Empleado $model)
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
            'table_name' => 'empleados',
            'action' => 'create',
            'record_id' => $model->id_emp,
            'old_values' => null,
            'new_values' => json_encode($model->getAttributes()),
            'created_at' => $fechaBolivia,
            'updated_at' => $fechaBolivia,
        ]);
    }
    public function updated(Empleado $model)
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
            'table_name' => 'empleados',
            'action' => 'update',
            'record_id' => $model->id_emp,
            'old_values' => json_encode($model->getOriginal()),
            'new_values' => json_encode($model->getAttributes()),
            'created_at' => $fechaBolivia,
            'updated_at' => $fechaBolivia,
        ]);
    }
    public function deleted(Empleado $model)
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
            'table_name' => 'empleados',
            'action' => 'delete',
            'record_id' => $model->id_emp,
            'old_values' => json_encode($model->getOriginal()),
            'new_values' => null,
            'created_at' => $fechaBolivia,
            'updated_at' => $fechaBolivia,
        ]);
    }
}
