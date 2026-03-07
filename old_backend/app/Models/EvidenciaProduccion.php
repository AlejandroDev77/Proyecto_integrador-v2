<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvidenciaProduccion extends Model
{
    use HasFactory;

    protected $table = 'evidencias_produccion';
    protected $primaryKey = 'id_evi';
    public $timestamps = false;

    protected $fillable = [
        'id_pro_eta',
        'tipo_evi',
        'archivo_evi',
        'descripcion',
        'fec_evi',
        'id_emp',
        'cod_evi',
    ];

    public function produccionEtapa()
    {
        return $this->belongsTo(ProduccionEtapa::class, 'id_pro_eta', 'id_pro_eta');
    }

    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_emp', 'id_emp');
    }
}
