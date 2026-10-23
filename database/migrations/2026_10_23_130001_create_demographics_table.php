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
        Schema::create('demographics', function (Blueprint $table) {
            $table->id();
            $table->integer('total_inhabitants')->default(1694);
            $table->integer('male_inhabitants')->default(855);
            $table->integer('female_inhabitants')->default(839);
            $table->integer('total_families')->default(523);
            $table->string('coconut_land_area', 50)->default('139 Ha');
            $table->string('coconut_production', 50)->default('690 Ton/Ha');
            $table->string('corn_land_area', 50)->default('57 Ha');
            $table->string('corn_production', 50)->default('34.2 Ton/Ha');
            $table->integer('piped_water_families')->default(445);
            $table->integer('healthy_wc_families')->default(392);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demographics');
    }
};
