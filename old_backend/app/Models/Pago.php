<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Venta;


class Pago extends Model
{
    use HasFactory;

    protected $table = 'pagos';
    protected $primaryKey = 'id_pag';
    public $timestamps = false;

    protected $fillable = [
        'cod_pag',
        'monto',
        'fec_pag',
        'metodo_pag',
        'referencia_pag',
        'id_ven',
    ];

    public function venta()
    {
        return $this->belongsTo(Venta::class, 'id_ven', 'id_ven');
    }
    

    
}
