<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('missions', 'indicator')) {
            return;
        }

        Schema::table('missions', function (Blueprint $table) {
            $table->dropColumn('indicator');
        });
    }

    public function down(): void
    {
        if (Schema::hasColumn('missions', 'indicator')) {
            return;
        }

        Schema::table('missions', function (Blueprint $table) {
            $table->string('indicator')->nullable()->after('title');
        });
    }
};
