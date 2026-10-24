<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Official;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class OfficialController extends Controller
{
    /**
     * Display a listing of officials.
     */
    public function index(): JsonResponse
    {
        $officials = Official::orderBy('order_index')->get();

        return response()->json([
            'officials' => $officials,
        ]);
    }

    /**
     * Store a newly created official.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['pimpinan', 'sekretariat', 'kasi', 'kadusun'])],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'order_index' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('officials', 'public');

            if ($photoPath === false) {
                return response()->json(['message' => 'Gagal menyimpan foto.'], 500);
            }
        }

        $official = Official::create([
            'name' => $validated['name'],
            'position' => $validated['position'],
            'category' => $validated['category'],
            'photo_path' => $photoPath ? Storage::url($photoPath) : null,
            'order_index' => $validated['order_index'] ?? 0,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return response()->json([
            'message' => 'Data aparat berhasil ditambahkan.',
            'official' => $official,
        ], 201);
    }

    /**
     * Update the specified official.
     */
    public function update(Request $request, int|string $id): JsonResponse
    {
        $official = Official::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['pimpinan', 'sekretariat', 'kasi', 'kadusun'])],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'order_index' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('photo')) {
            if ($official->photo_path) {
                $oldPath = str_replace('/storage/', '', $official->photo_path);
                Storage::disk('public')->delete($oldPath);
            }
            $photoPath = $request->file('photo')->store('officials', 'public');

            if ($photoPath === false) {
                return response()->json(['message' => 'Gagal menyimpan foto.'], 500);
            }

            $official->photo_path = Storage::url($photoPath);
        }

        $official->update([
            'name' => $validated['name'],
            'position' => $validated['position'],
            'category' => $validated['category'],
            'order_index' => $validated['order_index'] ?? $official->order_index,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $official->is_active,
        ]);

        return response()->json([
            'message' => 'Data aparat berhasil diperbarui.',
            'official' => $official->fresh(),
        ]);
    }

    /**
     * Remove the specified official.
     */
    public function destroy(int|string $id): JsonResponse
    {
        $official = Official::findOrFail($id);

        if ($official->photo_path) {
            $oldPath = str_replace('/storage/', '', $official->photo_path);
            Storage::disk('public')->delete($oldPath);
        }

        $official->delete();

        return response()->json([
            'message' => 'Data aparat berhasil dihapus.',
        ]);
    }
}
