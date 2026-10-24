<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Demographic extends Model
{
    protected $fillable = [
        'total_inhabitants',
        'male_inhabitants',
        'female_inhabitants',
        'total_families',
        'population_growth_rate',
        'sd_graduates',
        'sltp_graduates',
        'slta_graduates',
        'higher_education_graduates',
        'coconut_land_area',
        'coconut_production',
        'corn_land_area',
        'corn_production',
        'piped_water_families',
        'healthy_wc_families',
        'brick_houses',
    ];

    protected function casts(): array
    {
        return [
            'total_inhabitants' => 'integer',
            'male_inhabitants' => 'integer',
            'female_inhabitants' => 'integer',
            'total_families' => 'integer',
            'population_growth_rate' => 'decimal:2',
            'sd_graduates' => 'integer',
            'sltp_graduates' => 'integer',
            'slta_graduates' => 'integer',
            'higher_education_graduates' => 'integer',
            'coconut_land_area' => 'decimal:2',
            'coconut_production' => 'decimal:2',
            'corn_land_area' => 'decimal:2',
            'corn_production' => 'decimal:2',
            'piped_water_families' => 'integer',
            'healthy_wc_families' => 'integer',
            'brick_houses' => 'integer',
        ];
    }
}
