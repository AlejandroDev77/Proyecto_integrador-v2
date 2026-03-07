<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\categoriaMueble;

class Mueble extends Model
{
    use HasFactory;

    protected $table = 'muebles';
    protected $primaryKey = 'id_mue';
    public $timestamps = false;

    protected $fillable = [
        'nom_mue',
        'cod_mue',
        'desc_mue',
        'img_mue',
        'precio_venta',
        'precio_costo',
        'stock_min',
        'stock',
        'modelo_3d',
        'dimensiones',
        'est_mue',
        'id_cat',
    ];

    public function categoria()
    {
        return $this->belongsTo(CategoriaMueble::class, 'id_cat' , 'id_cat');
    }
    public function getEstMueAttribute($value)
    {
        return $value == 1;
    }

    // Mutador para 'est_usu' para convertir de true/false a 1/0
    public function setEstMueAttribute($value)
    {
        $this->attributes['est_mue'] = $value ? 1 : 0;
    }
    
}
