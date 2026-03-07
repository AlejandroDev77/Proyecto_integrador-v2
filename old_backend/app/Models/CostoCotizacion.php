<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CostoCotizacion extends Model
{
    use HasFactory;

    protected $table = 'costos_cotizacion';
    protected $primaryKey = 'id_costo';
    public $timestamps = false;

    protected $fillable = [
        'id_cot',
        'costo_materiales',
        'costo_mano_obra',
        'costos_indirectos',
        'margen_ganancia',
        'costo_total',
        'precio_sugerido',
    ];

    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class, 'id_cot', 'id_cot');
    }
}
