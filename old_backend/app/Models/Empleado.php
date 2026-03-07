<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    use HasFactory;

    protected $table = 'empleados';
    protected $primaryKey = 'id_emp';
    public $timestamps = false;

    protected $fillable = [
        'nom_emp',
        'ap_pat_emp',
        'ap_mat_emp',
        'cel_emp',
        'dir_emp',
        'fec_nac_emp',
        'ci_emp',
        'img_emp',
        'car_emp',
        'est_emp',
        'cod_emp',
        'id_usu',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usu', 'id_usu');
        
    }
    
    
}
