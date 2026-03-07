<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Logs extends Model
{
    use HasFactory;


    protected $table = 'audit_logs';
    protected $primaryKey = 'id';
    public $timestamps = false;

    // Los campos que pueden ser asignados de manera masiva
    protected $fillable = [
        'user_id',
        'cod_usu',
        'table_name',
        'action',
        'record_id',
        'old_values',
        'new_values',
        'created_at',
        'updated_at',
    ];

   
}
