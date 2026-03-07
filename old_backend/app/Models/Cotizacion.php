<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Cliente;
use App\Models\Empleado;

class Cotizacion extends Model
{
    use HasFactory;

    protected $table = 'cotizaciones';
    protected $primaryKey = 'id_cot';
    public $timestamps = false;

    protected $fillable = [
        'cod_cot',
        'fec_cot',
        'est_cot',
        'validez_dias',
        'total_cot',
        'descuento',
        'notas',
        'id_cli',
        'id_emp',
        'presupuesto_cliente',
        'plazo_esperado',
        'tiempo_entrega',
        'direccion_instalacion',
        'tipo_proyecto',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cli' , 'id_cli');

    }
    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_emp' , 'id_emp');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleCotizacion::class, 'id_cot', 'id_cot');
    }

    public function costos()
    {
        return $this->hasOne(CostoCotizacion::class, 'id_cot', 'id_cot');
    }

    public function disenos()
    {
        return $this->hasMany(Diseño::class, 'id_cot', 'id_cot');
    }

    
}
