<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Venta;
use App\Models\Empleado;

class Devolucion extends Model
{
    use HasFactory;

    protected $table = 'devoluciones';
    protected $primaryKey = 'id_dev';
    
    public $timestamps = false;

    protected $fillable = [
        'cod_dev',
        'fec_dev',
        'motivo_dev',
        'total_dev',
        'est_dev',
        'id_ven',
        'id_emp',
        
    ];

    public function venta()
    {
        return $this->belongsTo(Venta::class, 'id_ven', 'id_ven');
    }
    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_emp', 'id_emp');
    }

    
}
