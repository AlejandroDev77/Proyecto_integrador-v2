<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    use HasFactory;

    // Definir la tabla
    protected $table = 'proveedores';
    protected $primaryKey = 'id_prov';
    
    public $timestamps = false;


    // Los campos que pueden ser asignados de manera masiva
    protected $fillable = [
        'nom_prov',
        'cod_prov',
        'contacto_prov',
        'tel_prov',
        'email_prov',
        'dir_prov',
        'nit_prov',
        'est_prov',
    
    ];
    public function getEstProAttribute($value)
    {
        return $value == 1;
    }

    // Mutador para 'est_usu' para convertir de true/false a 1/0
    public function setEstProAttribute($value)
    {
        $this->attributes['est_prov'] = $value ? 1 : 0;
    }

}
