<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    // Definir la tabla
    protected $table = 'materiales';
    protected $primaryKey = 'id_mat';
    public $timestamps = false;


    // Los campos que pueden ser asignados de manera masiva
    protected $fillable = [
        'nom_mat',
        'cod_mat',
        'desc_mat',
        'stock_mat',
        'costo_mat',
        'unidad_medida',
        'img_mat',
        'est_mat',
        'stock_min',
        ''
    
    ];
    public function getEstUsuAttribute($value)
    {
        return $value == 1;
    }

    // Mutador para 'est_usu' para convertir de true/false a 1/0
    public function setEstMatAttribute($value)
    {
        $this->attributes['est_mat'] = $value ? 1 : 0;
    }

}
