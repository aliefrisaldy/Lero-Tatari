<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('missions', 'title')) {
            return;
        }

        Schema::table('missions', function (Blueprint $table) {
            $table->dropColumn('title');
        });
    }

    public function down(): void
    {
        if (Schema::hasColumn('missions', 'title')) {
            return;
        }

        Schema::table('missions', function (Blueprint $table) {
            $table->string('title')->nullable()->after('id');
        });
    }
};
