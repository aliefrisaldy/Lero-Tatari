<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Commodity columns, their accepted legacy units, and defaults.
     *
     * @var array<string, array{units: list<string>, decimal_default: int|float, legacy_default: string}>
     */
    private const COLUMNS = [
        'coconut_land_area' => [
            'units' => ['ha', 'hektar'],
            'decimal_default' => 139,
            'legacy_default' => '139 Ha',
        ],
        'coconut_production' => [
            'units' => ['ton', 'ton/ha'],
            'decimal_default' => 690,
            'legacy_default' => '690 Ton/Ha',
        ],
        'corn_land_area' => [
            'units' => ['ha', 'hektar'],
            'decimal_default' => 57,
            'legacy_default' => '57 Ha',
        ],
        'corn_production' => [
            'units' => ['ton', 'ton/ha'],
            'decimal_default' => 34.2,
            'legacy_default' => '34.2 Ton/Ha',
        ],
    ];

    private const MAX_DECIMAL = 99999999.99;

    public function up(): void
    {
        $columns = array_keys(self::COLUMNS);

        $rows = DB::table('demographics')
            ->select(['id', ...$columns])
            ->get();

        $updates = [];

        foreach ($rows as $row) {
            $values = [];

            foreach ($columns as $column) {
                $values[$column] = $this->toDecimal(
                    $row->{$column},
                    $column,
                    (int) $row->id,
                );
            }

            $updates[(int) $row->id] = $values;
        }

        // Validate every row before writing anything, so ambiguous data does
        // not leave the table half-converted.
        DB::transaction(function () use ($updates): void {
            foreach ($updates as $id => $values) {
                DB::table('demographics')->where('id', $id)->update($values);
            }
        });

        Schema::table('demographics', function (Blueprint $table): void {
            foreach (self::COLUMNS as $column => $config) {
                $table->decimal($column, 10, 2)
                    ->nullable()
                    ->default($config['decimal_default'])
                    ->change();
            }
        });
    }

    public function down(): void
    {
        Schema::table('demographics', function (Blueprint $table): void {
            foreach (self::COLUMNS as $column => $config) {
                $table->string($column, 50)
                    ->nullable()
                    ->default($config['legacy_default'])
                    ->change();
            }
        });

        $columns = array_keys(self::COLUMNS);

        $rows = DB::table('demographics')
            ->select(['id', ...$columns])
            ->get();

        $updates = [];

        foreach ($rows as $row) {
            $values = [];

            foreach ($columns as $column) {
                $values[$column] = $this->toLegacyString(
                    $row->{$column},
                    $column,
                    (int) $row->id,
                );
            }

            $updates[(int) $row->id] = $values;
        }

        DB::transaction(function () use ($updates): void {
            foreach ($updates as $id => $values) {
                DB::table('demographics')->where('id', $id)->update($values);
            }
        });
    }

    private function toDecimal(mixed $value, string $column, int $id): ?string
    {
        if ($value === null) {
            return null;
        }

        if (is_int($value) || is_float($value)) {
            return $this->numericToDecimal((float) $value, $column, $id);
        }

        $original = trim((string) $value);

        if ($original === '') {
            return null;
        }

        if (! preg_match('/^([+-]?\d[\d.,\s]*?)\s*([^\d]*)$/u', $original, $matches)) {
            throw $this->invalidValue($column, $id, $original);
        }

        $suffix = strtolower(trim((string) preg_replace('/\s+/u', ' ', $matches[2])));
        $suffix = rtrim($suffix, '.');
        $suffix = (string) preg_replace('/\s*\/\s*/', '/', $suffix);

        if ($suffix !== '' && ! in_array($suffix, self::COLUMNS[$column]['units'], true)) {
            throw $this->invalidValue($column, $id, $original);
        }

        $number = (string) preg_replace('/\s+/u', '', $matches[1]);

        if ($number === '') {
            throw $this->invalidValue($column, $id, $original);
        }

        return $this->normalizeNumber($number, $column, $id, $original);
    }

    private function numericToDecimal(float $value, string $column, int $id): string
    {
        if (! is_finite($value) || abs($value) > self::MAX_DECIMAL) {
            throw $this->invalidValue($column, $id, (string) $value);
        }

        return number_format($value, 2, '.', '');
    }

    private function normalizeNumber(
        string $number,
        string $column,
        int $id,
        string $original,
    ): string {
        $sign = '';

        if ($number[0] === '-' || $number[0] === '+') {
            $sign = $number[0] === '-' ? '-' : '';
            $number = substr($number, 1);
        }

        if ($number === '' || ! preg_match('/^\d[\d.,]*$/', $number)) {
            throw $this->invalidValue($column, $id, $original);
        }

        $dot = strrpos($number, '.');
        $comma = strrpos($number, ',');

        if ($dot !== false && $comma !== false) {
            $decimalSeparator = $dot > $comma ? '.' : ',';
            $thousandsSeparator = $decimalSeparator === '.' ? ',' : '.';
            $parts = explode($decimalSeparator, $number);

            if (count($parts) !== 2) {
                throw $this->invalidValue($column, $id, $original);
            }

            [$integer, $fraction] = $parts;
            $integer = $this->stripThousands(
                $integer,
                $thousandsSeparator,
                $column,
                $id,
                $original,
            );
        } elseif ($dot !== false || $comma !== false) {
            $separator = $dot !== false ? '.' : ',';
            $parts = explode($separator, $number);

            if (count($parts) > 2) {
                $integer = array_shift($parts);

                if ($integer === '' || strlen($integer) > 3 || ! ctype_digit($integer)) {
                    throw $this->invalidValue($column, $id, $original);
                }

                foreach ($parts as $group) {
                    if (strlen($group) !== 3 || ! ctype_digit($group)) {
                        throw $this->invalidValue($column, $id, $original);
                    }
                }

                $integer .= implode('', $parts);
                $fraction = '';
            } else {
                [$integer, $fraction] = $parts;

                if ($fraction === '' || ! ctype_digit($fraction)) {
                    throw $this->invalidValue($column, $id, $original);
                }

                if (strlen($fraction) === 3) {
                    throw new RuntimeException(sprintf(
                        'Nilai %s pada demographics id %d ambigu ("%s"): pemisah "%s" dapat berarti desimal atau ribuan. Gunakan format angka yang eksplisit sebelum migrasi.',
                        $column,
                        $id,
                        $original,
                        $separator,
                    ));
                }
            }
        } else {
            $integer = $number;
            $fraction = '';
        }

        if ($integer === '' || ! ctype_digit($integer)) {
            throw $this->invalidValue($column, $id, $original);
        }

        if ($fraction !== '' && ! ctype_digit($fraction)) {
            throw $this->invalidValue($column, $id, $original);
        }

        if (strlen($fraction) > 2) {
            throw new RuntimeException(sprintf(
                'Nilai %s pada demographics id %d ("%s") memiliki lebih dari 2 angka desimal dan akan kehilangan presisi pada kolom decimal(10,2).',
                $column,
                $id,
                $original,
            ));
        }

        $integer = ltrim($integer, '0');
        $integer = $integer === '' ? '0' : $integer;

        if (strlen($integer) > 8) {
            throw new RuntimeException(sprintf(
                'Nilai %s pada demographics id %d ("%s") melebihi batas kolom decimal(10,2).',
                $column,
                $id,
                $original,
            ));
        }

        return $sign.$integer.'.'.str_pad($fraction, 2, '0');
    }

    private function stripThousands(
        string $integer,
        string $separator,
        string $column,
        int $id,
        string $original,
    ): string {
        if ($separator === '') {
            throw $this->invalidValue($column, $id, $original);
        }

        if (! str_contains($integer, $separator)) {
            if ($integer === '' || ! ctype_digit($integer)) {
                throw $this->invalidValue($column, $id, $original);
            }

            return $integer;
        }

        $groups = explode($separator, $integer);
        $first = array_shift($groups);

        if ($first === '' || strlen($first) > 3 || ! ctype_digit($first)) {
            throw $this->invalidValue($column, $id, $original);
        }

        foreach ($groups as $group) {
            if (strlen($group) !== 3 || ! ctype_digit($group)) {
                throw $this->invalidValue($column, $id, $original);
            }
        }

        return $first.implode('', $groups);
    }

    private function toLegacyString(mixed $value, string $column, int $id): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (! is_numeric($value)) {
            throw $this->invalidValue($column, $id, (string) $value);
        }

        $number = (float) $value;

        if (! is_finite($number)) {
            throw $this->invalidValue($column, $id, (string) $value);
        }

        $formatted = rtrim(rtrim(number_format($number, 2, '.', ''), '0'), '.');

        if ($formatted === '-0') {
            $formatted = '0';
        }

        $unit = in_array($column, ['coconut_land_area', 'corn_land_area'], true)
            ? 'Ha'
            : 'Ton/Ha';

        return $formatted.' '.$unit;
    }

    private function invalidValue(string $column, int $id, string $value): RuntimeException
    {
        return new RuntimeException(sprintf(
            'Nilai %s pada demographics id %d tidak dapat dikonversi secara aman: "%s". Perbaiki data sebelum menjalankan migrasi.',
            $column,
            $id,
            $value,
        ));
    }
};
