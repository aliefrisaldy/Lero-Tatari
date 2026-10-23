<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demographic extends Model
{
    use HasFactory;

    protected $fillable = [
        'total_inhabitants',
        'male_inhabitants',
        'female_inhabitants',
        'total_families',
        'coconut_land_area',
        'coconut_production',
        'corn_land_area',
        'corn_production',
        'piped_water_families',
        'healthy_wc_families',
    ];

    protected function casts(): array
    {
        return [
            'total_inhabitants' => 'integer',
            'male_inhabitants' => 'integer',
            'female_inhabitants' => 'integer',
            'total_families' => 'integer',
            'piped_water_families' => 'integer',
            'healthy_wc_families' => 'integer',
        ];
    }
}
