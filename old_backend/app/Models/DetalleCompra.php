<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\CompraMaterial;
use App\Models\Material;

class DetalleCompra extends Model
{
    use HasFactory;

    protected $table = 'detalles_compra';
    protected $primaryKey = 'id_det_comp';
    public $timestamps = false;

    protected $fillable = [
        'cod_det_comp',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'id_comp',
        'id_mat',
    ];

    public function compramaterial()
    {
        return $this->belongsTo(CompraMaterial::class, 'id_comp' , 'id_comp');

    }
    public function material()
    {
        return $this->belongsTo(Material::class, 'id_mat' , 'id_mat');
    }

    
}
