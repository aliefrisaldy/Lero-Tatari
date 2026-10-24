<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Demographic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DemographicController extends Controller
{
    /**
     * Display the demographics management page.
     */
    public function index(): Response
    {
        return Inertia::render('admin/demografi/index', [
            'demographics' => Demographic::firstOrCreate(['id' => 1]),
        ]);
    }

    /**
     * Update one section of the village demographic statistics.
     */
    public function update(Request $request): RedirectResponse
    {
        $section = $request->validate([
            'section' => ['required', Rule::in(['kependudukan', 'pendidikan', 'komoditas'])],
        ])['section'];

        $rules = match ($section) {
            'kependudukan' => [
                'total_inhabitants' => ['required', 'integer', 'min:0'],
                'male_inhabitants' => ['required', 'integer', 'min:0'],
                'female_inhabitants' => ['required', 'integer', 'min:0'],
                'total_families' => ['required', 'integer', 'min:0'],
                'population_growth_rate' => ['required', 'numeric', 'min:0'],
            ],
            'pendidikan' => [
                'sd_graduates' => ['required', 'integer', 'min:0'],
                'sltp_graduates' => ['required', 'integer', 'min:0'],
                'slta_graduates' => ['required', 'integer', 'min:0'],
                'higher_education_graduates' => ['required', 'integer', 'min:0'],
            ],
            'komoditas' => [
                'coconut_land_area' => ['required', 'numeric', 'min:0'],
                'coconut_production' => ['required', 'numeric', 'min:0'],
                'corn_land_area' => ['required', 'numeric', 'min:0'],
                'corn_production' => ['required', 'numeric', 'min:0'],
                'piped_water_families' => ['required', 'integer', 'min:0'],
                'healthy_wc_families' => ['required', 'integer', 'min:0'],
                'brick_houses' => ['required', 'integer', 'min:0'],
            ],
        };

        $validated = $request->validate($rules);

        $demographics = Demographic::firstOrCreate(['id' => 1]);
        $demographics->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data demografi berhasil diperbarui.']);

        return back();
    }
}
