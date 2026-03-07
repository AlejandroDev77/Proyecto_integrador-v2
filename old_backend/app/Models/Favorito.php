<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorito extends Model
{
    use HasFactory;

    protected $table = 'favoritos';
    protected $primaryKey = 'id_fav';
    public $timestamps = false;
    
    protected $fillable = [
        'id_cli',
        'id_mue',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cli', 'id_cli');
    }

    public function mueble()
    {
        return $this->belongsTo(Mueble::class, 'id_mue', 'id_mue');
    }
}
