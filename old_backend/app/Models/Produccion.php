<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Venta;
use App\Models\Empleado;
use App\Models\Cotizacion;

class Produccion extends Model
{
    use HasFactory;

    protected $table = 'produccion';
    protected $primaryKey = 'id_pro';
    public $timestamps = false;

    protected $fillable = [
        'cod_pro',
        'fec_ini',
        'fec_fin_estimada',
        'fec_fin',
        'est_pro',
        'prioridad',
        'id_ven',
        'id_cot',
        'id_emp',
        'notas',
    

    ];

    public function venta()
    {
        return $this->belongsTo(Venta::class, 'id_ven' , 'id_ven');
    }
    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_emp' , 'id_emp');
    }
    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class, 'id_cot', 'id_cot');
    }

    public function produccionEtapas()
    {
        return $this->hasMany(ProduccionEtapa::class, 'id_pro', 'id_pro');
    }
}
