<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Material;
use App\Models\Mueble;
use App\Models\Venta;
use App\Models\Produccion;
use App\Models\CompraMaterial;
use App\Models\Devolucion;
use App\Models\Empleado;

class MovimientoInventario extends Model
{
    use HasFactory;

    protected $table = 'movimientos_inventario';
    protected $primaryKey = 'id_mov';
    public $timestamps = false;

    protected $fillable = [
        'cod_mov',
        'tipo_mov',
        'cantidad',
        'fecha_mov',
        'id_mat',
        'id_mue',
        'id_ven',
        'id_pro',
        'id_comp',
        'id_dev',
        'id_emp',
        'motivo',
        'stock_anterior',
        'stock_posterior',
    ];

    public function material()
    {
        return $this->belongsTo(Material::class, 'id_mat', 'id_mat');
    }
    public function mueble()
    {
        return $this->belongsTo(Mueble::class, 'id_mue', 'id_mue');
    }
    public function venta()
    {
        return $this->belongsTo(Venta::class, 'id_ven', 'id_ven');
    }
    public function produccion()
    {
        return $this->belongsTo(Produccion::class, 'id_pro', 'id_pro');
    }
    public function compraMaterial()
    {
        return $this->belongsTo(CompraMaterial::class, 'id_comp', 'id_comp');
    }
    public function devolucion()
    {
        return $this->belongsTo(Devolucion::class, 'id_dev', 'id_dev');
    }
    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_emp', 'id_emp');
    }


    
}
