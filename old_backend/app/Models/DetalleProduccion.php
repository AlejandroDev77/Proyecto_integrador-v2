<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Mueble;
use App\Models\Produccion;


class DetalleProduccion extends Model
{
    use HasFactory;

    protected $table = 'detalles_produccion';
    protected $primaryKey = 'id_det_pro';
    public $timestamps = false;

    protected $fillable = [
        'cod_det_pro',
        'id_pro',
        'id_mue',
        'cantidad',
        'est_det_pro',
    ];

    public function produccion()
    {
        return $this->belongsTo(Produccion::class, 'id_pro', 'id_pro');
    }
    public function mueble()
    {
        return $this->belongsTo(Mueble::class, 'id_mue', 'id_mue');
    }
}
