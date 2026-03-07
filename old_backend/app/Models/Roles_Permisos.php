<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Roles_Permisos extends Pivot
{
    protected $table = 'rol_permiso';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_rol',
        'id_permiso',
    ];
}
