<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Kolom indikator capaian utama per butir misi (desain Stitch Kelola Visi & Misi).
     */
    public function up(): void
    {
        Schema::table('missions', function (Blueprint $table) {
            $table->string('indicator')->nullable()->after('title');
        });
    }

    public function down(): void
    {
        Schema::table('missions', function (Blueprint $table) {
            $table->dropColumn('indicator');
        });
    }
};
