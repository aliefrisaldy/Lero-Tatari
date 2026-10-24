<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Framework\SkippedWithMessageException;

$originalDefaultConnection = null;

beforeEach(function () use (&$originalDefaultConnection) {
    if (! extension_loaded('pdo_sqlite')) {
        throw new SkippedWithMessageException(
            'The pdo_sqlite extension is required to test the SQLite migration path.',
        );
    }

    $originalDefaultConnection = config('database.default');

    config([
        'database.default' => 'sqlite_migration_test',
        'database.connections.sqlite_migration_test' => [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => '',
            'foreign_key_constraints' => true,
        ],
    ]);

    DB::purge('sqlite_migration_test');

    Schema::create('demographics', function (Blueprint $table) {
        $table->id();
        $table->integer('total_inhabitants')->default(1694);
        $table->integer('male_inhabitants')->default(855);
        $table->integer('female_inhabitants')->default(839);
        $table->integer('total_families')->default(523);
        $table->string('coconut_land_area', 50)->nullable()->default('139 Ha');
        $table->string('coconut_production', 50)->nullable()->default('690 Ton/Ha');
        $table->string('corn_land_area', 50)->nullable()->default('57 Ha');
        $table->string('corn_production', 50)->nullable()->default('34.2 Ton/Ha');
        $table->integer('piped_water_families')->default(445);
        $table->integer('healthy_wc_families')->default(392);
        $table->timestamps();
    });
});

afterEach(function () use (&$originalDefaultConnection) {
    config(['database.default' => $originalDefaultConnection]);
    DB::purge('sqlite_migration_test');
});

/**
 * @param  array<string, mixed>  $overrides
 */
function insertLegacyDemographics(array $overrides = []): void
{
    DB::table('demographics')->insert(array_merge([
        'total_inhabitants' => 1694,
        'male_inhabitants' => 855,
        'female_inhabitants' => 839,
        'total_families' => 523,
        'coconut_land_area' => '139 Ha',
        'coconut_production' => '690 Ton/Ha',
        'corn_land_area' => '57 Ha',
        'corn_production' => '34.2 Ton/Ha',
        'piped_water_families' => 445,
        'healthy_wc_families' => 392,
        'created_at' => now(),
        'updated_at' => now(),
    ], $overrides));
}

function runCommodityMigration(string $method): void
{
    $migration = require database_path(
        'migrations/2026_10_24_030000_convert_commodity_columns_to_numeric_on_demographics_table.php',
    );

    $migration->{$method}();
}

test('legacy commodity strings are converted to decimals', function () {
    insertLegacyDemographics();

    runCommodityMigration('up');

    $row = DB::table('demographics')->first();

    expect((float) $row->coconut_land_area)->toEqualWithDelta(139, 0.001)
        ->and((float) $row->coconut_production)->toEqualWithDelta(690, 0.001)
        ->and((float) $row->corn_land_area)->toEqualWithDelta(57, 0.001)
        ->and((float) $row->corn_production)->toEqualWithDelta(34.2, 0.001);
});

test('decimal and thousands separators are normalized', function () {
    insertLegacyDemographics([
        'coconut_land_area' => '1.234,56 Ha',
        'coconut_production' => '1,234.56 Ton/Ha',
        'corn_land_area' => '1.234.567 Ha',
        'corn_production' => '-12,5 Ton/Ha',
    ]);

    runCommodityMigration('up');

    $row = DB::table('demographics')->first();

    expect((float) $row->coconut_land_area)->toEqualWithDelta(1234.56, 0.001)
        ->and((float) $row->coconut_production)->toEqualWithDelta(1234.56, 0.001)
        ->and((float) $row->corn_land_area)->toEqualWithDelta(1234567, 0.001)
        ->and((float) $row->corn_production)->toEqualWithDelta(-12.5, 0.001);
});

test('null and blank legacy values are preserved as null', function () {
    insertLegacyDemographics([
        'coconut_land_area' => null,
        'coconut_production' => '',
        'corn_land_area' => '   ',
        'corn_production' => null,
    ]);

    runCommodityMigration('up');

    $row = DB::table('demographics')->first();

    expect($row->coconut_land_area)->toBeNull()
        ->and($row->coconut_production)->toBeNull()
        ->and($row->corn_land_area)->toBeNull()
        ->and($row->corn_production)->toBeNull();
});

test('ambiguous or invalid values abort without changing data', function (string $value) {
    insertLegacyDemographics(['coconut_land_area' => $value]);

    expect(fn () => runCommodityMigration('up'))
        ->toThrow(RuntimeException::class);

    expect(DB::table('demographics')->value('coconut_land_area'))->toBe($value);
})->with([
    'ambiguous dot separator' => ['139.000 Ha'],
    'ambiguous comma separator' => ['139,123 Ha'],
    'unknown unit' => ['139 Kg'],
    'letters inside number' => ['12abc34 Ha'],
    'too many decimal places' => ['139,1234 Ha'],
    'outside decimal(10,2) range' => ['100000000 Ha'],
]);

test('rollback restores legacy unit strings and keeps nulls', function () {
    insertLegacyDemographics();
    insertLegacyDemographics([
        'coconut_land_area' => null,
        'coconut_production' => null,
        'corn_land_area' => null,
        'corn_production' => null,
    ]);

    runCommodityMigration('up');
    runCommodityMigration('down');

    $rows = DB::table('demographics')->orderBy('id')->get();

    expect($rows[0]->coconut_land_area)->toBe('139 Ha')
        ->and($rows[0]->coconut_production)->toBe('690 Ton/Ha')
        ->and($rows[0]->corn_land_area)->toBe('57 Ha')
        ->and($rows[0]->corn_production)->toBe('34.2 Ton/Ha')
        ->and($rows[1]->coconut_land_area)->toBeNull()
        ->and($rows[1]->coconut_production)->toBeNull()
        ->and($rows[1]->corn_land_area)->toBeNull()
        ->and($rows[1]->corn_production)->toBeNull();
});
