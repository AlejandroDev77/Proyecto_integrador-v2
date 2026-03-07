<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use App\Models\Mueble;
use App\Models\Material;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MuebleMaterial extends Model
{
    use HasFactory;
    
    protected $table = 'mueble_material';
    protected $primaryKey = 'id_mue_mat';
    public $timestamps = false;

    protected $fillable = [
        'cod_mue_mat',
        'id_mue',
        'id_mat',
        'cantidad',
    ];
    public function mueble()
{
    return $this->belongsTo(Mueble::class, 'id_mue');
}

public function material()
{
    return $this->belongsTo(Material::class, 'id_mat');
}
}
