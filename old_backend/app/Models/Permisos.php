<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Rol;

class Permisos extends Model
{
    use HasFactory;

    // Definir la tabla
    protected $table = 'permisos';
    protected $primaryKey = 'id_permiso';
    public $timestamps = false;

    // Los campos que pueden ser asignados de manera masiva
    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    // Relación many-to-many con roles (tabla pivot: rol_permiso)
    public function roles()
    {
        return $this->belongsToMany(Rol::class, 'rol_permiso', 'id_permiso', 'id_rol');
    }

    
    
}
