<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Produccion;
use App\Models\EtapaProduccion;
use App\Models\Empleado;

class  ProduccionEtapa extends Model
{
    use HasFactory;

    protected $table = 'produccion_etapas';
    protected $primaryKey = 'id_pro_eta';
    public $timestamps = false;

    protected $fillable = [
        'id_pro_eta',
        'id_pro',
        'id_eta',
        'cod_pro_eta',
        'fec_ini',
        'fec_fin',
        'est_eta',
        'id_emp',
        'notas',
        'fotos_progreso',
    ];

    public function produccion()
    {
        return $this->belongsTo(Produccion::class, 'id_pro', 'id_pro');
    }
    public function etapa()
    {
        return $this->belongsTo(EtapaProduccion::class, 'id_eta', 'id_eta');
    }
    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_emp', 'id_emp');
    }

    public function evidencias()
    {
        return $this->hasMany(EvidenciaProduccion::class, 'id_pro_eta', 'id_pro_eta');
    }

    
}
