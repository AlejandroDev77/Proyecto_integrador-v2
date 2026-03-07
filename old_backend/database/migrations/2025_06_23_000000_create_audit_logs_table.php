<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // Usuario que realizó la acción
            $table->string('cod_usu')->nullable(); // Código del usuario que realizó la acción
            $table->string('table_name'); // Nombre de la tabla afectada
            $table->string('action'); // create, update, delete
            $table->unsignedBigInteger('record_id')->nullable(); // ID del registro afectado
            $table->json('old_values')->nullable(); // Valores antes del cambio
            $table->json('new_values')->nullable(); // Valores después del cambio
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
