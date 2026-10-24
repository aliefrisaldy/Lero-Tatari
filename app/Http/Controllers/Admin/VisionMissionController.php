<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use App\Models\Vision;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VisionMissionController extends Controller
{
    /**
     * Display the vision & mission management page.
     */
    public function index(): Response
    {
        return Inertia::render('admin/visi-misi/index', [
            'vision' => Vision::first(),
            'missions' => Mission::orderBy('order_index')->get(),
        ]);
    }

    /**
     * Update the (single) village vision statement.
     */
    public function updateVision(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'vision_statement' => ['required', 'string', 'min:10', 'max:600'],
            'period' => ['required', 'string', 'max:50'],
        ]);

        $vision = Vision::first();

        if ($vision) {
            $vision->update($validated);
        } else {
            $vision = Vision::create($validated);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Naskah visi & periode berhasil disimpan dan disinkronkan ke Web Publik.']);

        return back();
    }

    /**
     * Store a newly created mission.
     */
    public function storeMission(Request $request): RedirectResponse
    {
        $validated = $this->validateMission($request);

        $order = (int) Mission::max('order_index') + 1;

        Mission::create($validated + ['order_index' => $order]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Misi baru berhasil ditambahkan.']);

        return back();
    }

    /**
     * Update the specified mission.
     */
    public function updateMission(Request $request, Mission $mission): RedirectResponse
    {
        $validated = $this->validateMission($request);

        $mission->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Misi berhasil diperbarui.']);

        return back();
    }

    /**
     * Remove the specified mission.
     */
    public function destroyMission(Mission $mission): RedirectResponse
    {
        $mission->delete();

        // Rapatkan ulang urutan agar tetap 1..n tanpa celah.
        Mission::orderBy('order_index')->get()->values()->each(function (Mission $m, int $i) {
            if ($m->order_index !== $i + 1) {
                $m->update(['order_index' => $i + 1]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Misi telah dihapus.']);

        return back();
    }

    /**
     * Persist the drag & drop ordering of missions.
     *
     * Body: { order: number[] } — daftar ID misi sesuai urutan tampil.
     */
    public function reorderMission(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', Rule::exists('missions', 'id')],
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['order'] as $index => $missionId) {
                Mission::whereKey($missionId)->update(['order_index' => $index + 1]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Urutan prioritas misi diperbarui.']);

        return back();
    }

    /**
     * Validate mission input fields.
     *
     * @return array{title: string, indicator: string|null, description: string}
     */
    private function validateMission(Request $request): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'indicator' => ['nullable', 'string', 'max:150'],
            'description' => ['required', 'string', 'max:500'],
        ]);

        $validated['indicator'] = $validated['indicator'] ?? null;

        return $validated;
    }
}
