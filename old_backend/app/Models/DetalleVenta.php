<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Mueble;
use App\Models\Venta;

class  DetalleVenta extends Model
{
    use HasFactory;

    protected $table = 'detalles_venta';
    protected $primaryKey = 'id_det_ven';
    public $timestamps = false;

    protected $fillable = [
        'cod_det_ven',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'descuento_item',
        'id_ven',
        'id_mue',
    ];

    public function venta()
    {
        return $this->belongsTo(Venta::class, 'id_ven' , 'id_ven');

    }
    public function mueble()
    {
        return $this->belongsTo(Mueble::class, 'id_mue' , 'id_mue');
    }

    
}
