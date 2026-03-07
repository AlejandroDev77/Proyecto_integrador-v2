<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Cotizacion;

class Diseño extends Model
{
    use HasFactory;

    protected $table = 'diseños';
    protected $primaryKey = 'id_dis';
    public $timestamps = false;

    protected $fillable = [
        'cod_dis',
        'nom_dis',
        'desc_dis',
        'archivo_3d',
        'img_dis',
        'id_cot',
    ];

    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class, 'id_cot', 'id_cot');
    }
    
    
}
