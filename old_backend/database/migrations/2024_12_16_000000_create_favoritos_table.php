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
        Schema::create('favoritos', function (Blueprint $table) {
            $table->id('id_fav');
            $table->unsignedBigInteger('id_cli');
            $table->unsignedBigInteger('id_mue');
            $table->timestamps();

            $table->foreign('id_cli')->references('id_cli')->on('clientes')->onDelete('cascade');
            $table->foreign('id_mue')->references('id_mue')->on('muebles')->onDelete('cascade');
            
            // Prevent duplicate favorites
            $table->unique(['id_cli', 'id_mue']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favoritos');
    }
};
