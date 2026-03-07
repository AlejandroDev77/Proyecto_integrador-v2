<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Permisos;

class Rol extends Model
{
    use HasFactory;

    // Definir la tabla
    protected $table = 'roles';
    protected $primaryKey = 'id_rol';
    public $timestamps = false;

    // Los campos que pueden ser asignados de manera masiva
    protected $fillable = [
        'nom_rol',
        
    ];

    // Relación con la tabla usuarios
    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'id_rol');
    }
    
    // Relación many-to-many con permisos (tabla pivot: rol_permiso)
    public function permisos()
    {
        return $this->belongsToMany(Permisos::class, 'rol_permiso', 'id_rol', 'id_permiso');
    }
    
}
