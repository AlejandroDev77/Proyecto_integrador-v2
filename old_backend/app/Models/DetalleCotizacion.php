<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Cotizacion;
use App\Models\Mueble;

class DetalleCotizacion extends Model
{
    use HasFactory;

    protected $table = 'detalles_cotizacion';
    protected $primaryKey = 'id_det_cot';
    public $timestamps = false;

    protected $fillable = [
        'id_cot',
        'id_mue',
        'cod_det_cot',
        'desc_personalizacion',
        'cantidad',
        'precio_unitario',
        'subtotal',
        // Campos para muebles personalizados
        'nombre_mueble',
        'tipo_mueble',
        'dimensiones',
        'material_principal',
        'color_acabado',
        'img_referencia',
        'herrajes',
    ];

    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class, 'id_cot', 'id_cot');
    }
    
    public function mueble()
    {
        return $this->belongsTo(Mueble::class, 'id_mue', 'id_mue');
    }

    // Helper para obtener nombre del mueble para display
    public function getNombreDisplayAttribute()
    {
        if (isset($this->attributes['nombre_mueble']) && $this->attributes['nombre_mueble']) {
            return $this->attributes['nombre_mueble'];
        }
        return $this->mueble ? $this->mueble->nom_mue : 'Sin nombre';
    }
}

