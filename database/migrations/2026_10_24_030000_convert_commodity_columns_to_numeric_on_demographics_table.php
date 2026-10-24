<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Buang satuan dari nilai lama (contoh: "139 Ha" -> 139) sebelum tipe diubah.
        DB::table('demographics')->update([
            'coconut_land_area' => DB::raw("CAST(REGEXP_REPLACE(coconut_land_area, '[^0-9.]', '') AS DECIMAL(10, 2))"),
            'coconut_production' => DB::raw("CAST(REGEXP_REPLACE(coconut_production, '[^0-9.]', '') AS DECIMAL(10, 2))"),
            'corn_land_area' => DB::raw("CAST(REGEXP_REPLACE(corn_land_area, '[^0-9.]', '') AS DECIMAL(10, 2))"),
            'corn_production' => DB::raw("CAST(REGEXP_REPLACE(corn_production, '[^0-9.]', '') AS DECIMAL(10, 2))"),
        ]);

        Schema::table('demographics', function (Blueprint $table) {
            $table->decimal('coconut_land_area', 10, 2)->default(139)->change();
            $table->decimal('coconut_production', 10, 2)->default(690)->change();
            $table->decimal('corn_land_area', 10, 2)->default(57)->change();
            $table->decimal('corn_production', 10, 2)->default(34.2)->change();
        });
    }

    public function down(): void
    {
        Schema::table('demographics', function (Blueprint $table) {
            $table->string('coconut_land_area', 50)->default('139 Ha')->change();
            $table->string('coconut_production', 50)->default('690 Ton/Ha')->change();
            $table->string('corn_land_area', 50)->default('57 Ha')->change();
            $table->string('corn_production', 50)->default('34.2 Ton/Ha')->change();
        });

        DB::table('demographics')->update([
            'coconut_land_area' => DB::raw("CONCAT(coconut_land_area, ' Ha')"),
            'coconut_production' => DB::raw("CONCAT(coconut_production, ' Ton/Ha')"),
            'corn_land_area' => DB::raw("CONCAT(corn_land_area, ' Ha')"),
            'corn_production' => DB::raw("CONCAT(corn_production, ' Ton/Ha')"),
        ]);
    }
};
