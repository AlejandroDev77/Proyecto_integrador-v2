<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Devolucion;
use App\Models\Mueble;

class DetalleDevolucion extends Model
{
    use HasFactory;

    protected $table = 'detalles_devolucion';
    protected $primaryKey = 'id_det_dev';
    public $timestamps = false;

    protected $fillable = [
        'cod_det_dev',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'id_dev',
        'id_mue',
    ];

    public function devolucion()
    {
        return $this->belongsTo(Devolucion::class, 'id_dev', 'id_dev');
    }
    public function mueble()
    {
        return $this->belongsTo(Mueble::class, 'id_mue', 'id_mue');
    }

    
}
