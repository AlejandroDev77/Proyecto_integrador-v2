<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EtapaProduccion extends Model
{
    use HasFactory;

    
    protected $table = 'etapas_produccion';
    protected $primaryKey = 'id_eta';
    public $timestamps = false;

    // Los campos que pueden ser asignados de manera masiva
    protected $fillable = [
        'cod_eta',
        'nom_eta',
        'desc_eta',
        'duracion_estimada',
        'orden_secuencia',
        
    ];  

    
 
    public function etapaproduccion()
    {
        return $this->hasMany(ProduccionEtapa::class, 'id_eta', 'id_eta');
    }
}
