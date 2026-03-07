<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Proveedor;
use App\Models\Empleado;

class CompraMaterial extends Model
{
    use HasFactory;

    protected $table = 'compras_materiales';
    protected $primaryKey = 'id_comp';
    public $timestamps = false;

    protected $fillable = [
        'fec_comp',
        'est_comp',
        'cod_comp',
        'total_comp',
        'id_prov',
        'id_emp',
    ];

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_prov' , 'id_prov');

    }
    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_emp' , 'id_emp');
    }

    
}
