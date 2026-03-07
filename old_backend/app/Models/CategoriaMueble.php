<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriaMueble extends Model
{
    use HasFactory;


    protected $table = 'categorias_muebles';
    protected $primaryKey = 'id_cat';
    public $timestamps = false;

    // Los campos que pueden ser asignados de manera masiva
    protected $fillable = [
        'cod_cat',
        'nom_cat',
        'desc_cat',
        
    ];

   
}
