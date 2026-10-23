<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use App\Models\Vision;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisionMissionController extends Controller
{
    /**
     * Get vision and all missions.
     */
    public function index(): JsonResponse
    {
        $vision = Vision::firstOrCreate(
            ['id' => 1],
            [
                'vision_statement' => 'Terwujudnya Desa Lero Tatari yang Mandiri, Sejahtera, Transparan, dan Berbudaya Berlandaskan Gotong Royong.',
                'period' => '2024–2029',
            ]
        );

        $missions = Mission::orderBy('order_index')->get();

        return response()->json([
            'vision' => $vision,
            'missions' => $missions,
        ]);
    }

    /**
     * Update the main vision statement.
     */
    public function updateVision(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vision_statement' => ['required', 'string'],
            'period' => ['nullable', 'string', 'max:50'],
        ]);

        $vision = Vision::firstOrCreate(['id' => 1]);
        $vision->update($validated);

        return response()->json([
            'message' => 'Visi desa berhasil diperbarui.',
            'vision' => $vision,
        ]);
    }

    /**
     * Store a new mission item.
     */
    public function storeMission(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'order_index' => ['nullable', 'integer'],
        ]);

        $mission = Mission::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'order_index' => $validated['order_index'] ?? (Mission::max('order_index') + 1),
        ]);

        return response()->json([
            'message' => 'Poin misi berhasil ditambahkan.',
            'mission' => $mission,
        ], 201);
    }

    /**
     * Update a mission item.
     */
    public function updateMission(Request $request, int|string $id): JsonResponse
    {
        $mission = Mission::findOrFail($id);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'order_index' => ['nullable', 'integer'],
        ]);

        $mission->update($validated);

        return response()->json([
            'message' => 'Poin misi berhasil diperbarui.',
            'mission' => $mission,
        ]);
    }

    /**
     * Delete a mission item.
     */
    public function destroyMission(int|string $id): JsonResponse
    {
        $mission = Mission::findOrFail($id);
        $mission->delete();

        return response()->json([
            'message' => 'Poin misi berhasil dihapus.',
        ]);
    }
}
