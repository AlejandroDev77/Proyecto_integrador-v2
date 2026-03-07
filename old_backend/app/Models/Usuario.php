<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Models\Empleado;
use App\Models\Cliente;
use App\Models\Permisos;

class Usuario extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usu';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'nom_usu',
        'email_usu',
        'pas_usu',
        'est_usu',
        'cod_usu',
        'id_rol',
    ];

    protected $hidden = [
        'pas_usu',
    ];

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol');
    }

    public function getEstUsuAttribute($value)
    {
        return $value == 1;
    }

    public function setEstUsuAttribute($value)
    {
        $this->attributes['est_usu'] = $value ? 1 : 0;
    }

    public function cliente()
    {
        return $this->hasOne(Cliente::class, 'id_usu', 'id_usu');
    }

    public function empleado()
    {
        return $this->hasOne(Empleado::class, 'id_usu', 'id_usu');
    }

    /**
     * Comprueba si el usuario tiene un permiso por nombre.
     * Busca el permiso a través del rol asignado.
     * @param string $permName
     * @return bool
     */
    public function hasPermission(string $permName): bool
    {
        if (! $this->rol) {
            return false;
        }

        return $this->rol->permisos()->where('nombre', $permName)->exists();
    }

    // 🔹 Métodos obligatorios de JWT
    public function getJWTIdentifier()
    {
        return $this->getKey(); // id_usu
    }

    public function getJWTCustomClaims()
    {
        // Asegurarse de cargar rol y permisos para incluirlos en el token
        $this->loadMissing('rol.permisos');

        $permisos = [];
        if ($this->rol && $this->rol->permisos) {
            $permisos = $this->rol->permisos->pluck('nombre')->toArray();
        }

        return [
            'id_usu' => $this->id_usu,
            'id_rol' => $this->id_rol,
            'cod_usu' => $this->cod_usu,
            'permisos' => $permisos,
        ];
    }
}
