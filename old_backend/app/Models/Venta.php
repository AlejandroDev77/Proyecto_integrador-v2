<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Cliente;
use App\Models\Empleado;
use App\Models\DetalleVenta;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'ventas';
    protected $primaryKey = 'id_ven';
    public $timestamps = false;

    protected $fillable = [
        'cod_ven',
        'fec_ven',
        'est_ven',
        'total_ven',
        'descuento',
        'id_cli',
        'id_emp',
        'notas',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cli' , 'id_cli');

    }
    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_emp' , 'id_emp');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleVenta::class, 'id_ven', 'id_ven');
    }

    
}
