<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('demographics', function (Blueprint $table) {
            // Population Metrics
            $table->decimal('population_growth_rate', 5, 2)->default(0.83)->after('total_families');

            // Education Metrics (SDM)
            $table->integer('sd_graduates')->default(122)->after('population_growth_rate');
            $table->integer('sltp_graduates')->default(110)->after('sd_graduates');
            $table->integer('slta_graduates')->default(226)->after('sltp_graduates');
            $table->integer('higher_education_graduates')->default(65)->after('slta_graduates');

            // Infrastructure & Facilities
            $table->integer('brick_houses')->default(384)->after('healthy_wc_families');
        });
    }

    public function down(): void
    {
        Schema::table('demographics', function (Blueprint $table) {
            $table->dropColumn([
                'population_growth_rate',
                'sd_graduates',
                'sltp_graduates',
                'slta_graduates',
                'higher_education_graduates',
                'brick_houses',
            ]);
        });
    }
};
