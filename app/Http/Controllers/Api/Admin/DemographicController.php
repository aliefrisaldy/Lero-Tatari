<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Demographic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DemographicController extends Controller
{
    /**
     * Get demographic statistics.
     */
    public function show(): JsonResponse
    {
        $demographics = Demographic::firstOrCreate(
            ['id' => 1],
            [
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
            ]
        );

        return response()->json([
            'demographics' => $demographics,
        ]);
    }

    /**
     * Update demographic statistics.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'total_inhabitants' => ['required', 'integer', 'min:0'],
            'male_inhabitants' => ['required', 'integer', 'min:0'],
            'female_inhabitants' => ['required', 'integer', 'min:0'],
            'total_families' => ['required', 'integer', 'min:0'],
            'coconut_land_area' => ['required', 'string', 'max:50'],
            'coconut_production' => ['required', 'string', 'max:50'],
            'corn_land_area' => ['required', 'string', 'max:50'],
            'corn_production' => ['required', 'string', 'max:50'],
            'piped_water_families' => ['required', 'integer', 'min:0'],
            'healthy_wc_families' => ['required', 'integer', 'min:0'],
        ]);

        $demographics = Demographic::firstOrCreate(['id' => 1]);
        $demographics->update($validated);

        return response()->json([
            'message' => 'Data demografi Prodeskel berhasil diperbarui.',
            'demographics' => $demographics,
        ]);
    }
}
