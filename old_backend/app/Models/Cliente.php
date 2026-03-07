<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';
    protected $primaryKey = 'id_cli';
    public $timestamps = false;

    protected $fillable = [
        'nom_cli',
        'ap_pat_cli',
        'ap_mat_cli',
        'cel_cli',
        'dir_cli',
        'fec_nac_cli',
        'ci_cli',
        'img_cli',
        'est_cli',
        'cod_cli',
        'id_usu',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usu', 'id_usu');
        
    }
    
}
