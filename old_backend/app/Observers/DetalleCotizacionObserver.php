<?php

namespace App\Observers;

use App\Models\DetalleCotizacion;
use Illuminate\Support\Facades\DB;

class DetalleCotizacionObserver
{
    public function created(DetalleCotizacion $model)
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
            'table_name' => 'detalles_cotizacion',
            'action' => 'create',
            'record_id' => $model->id_det_cot,
            'old_values' => null,
            'new_values' => json_encode($model->getAttributes()),
            'created_at' => $fechaBolivia,
            'updated_at' => $fechaBolivia,
        ]);
    }
    public function updated(DetalleCotizacion $model)
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
            'table_name' => 'detalles_cotizacion',
            'action' => 'update',
            'record_id' => $model->id_det_cot,
            'old_values' => json_encode($model->getOriginal()),
            'new_values' => json_encode($model->getAttributes()),
            'created_at' => $fechaBolivia,
            'updated_at' => $fechaBolivia,
        ]);
    }
    public function deleted(DetalleCotizacion $model)
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
            'table_name' => 'detalles_cotizacion',
            'action' => 'delete',
            'record_id' => $model->id_det_cot,
            'old_values' => json_encode($model->getOriginal()),
            'new_values' => null,
            'created_at' => $fechaBolivia,
            'updated_at' => $fechaBolivia,
        ]);
    }
}
