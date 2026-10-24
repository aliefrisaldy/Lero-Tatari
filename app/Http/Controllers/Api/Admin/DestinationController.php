<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DestinationController extends Controller
{
    /**
     * Display a listing of destinations.
     */
    public function index(): JsonResponse
    {
        $destinations = Destination::latest('id')->get();

        return response()->json([
            'destinations' => $destinations,
        ]);
    }

    /**
     * Store a newly created destination.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateDestination($request);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('destinations', 'public');

            if ($imagePath === false) {
                return response()->json(['message' => 'Gagal menyimpan gambar.'], 500);
            }
        }

        $destination = Destination::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'location_url' => $validated['location_url'] ?? null,
            'image_path' => $imagePath ? Storage::url($imagePath) : null,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return response()->json([
            'message' => 'Objek wisata berhasil ditambahkan.',
            'destination' => $destination,
        ], 201);
    }

    /**
     * Update the specified destination.
     */
    public function update(Request $request, int|string $id): JsonResponse
    {
        $destination = Destination::findOrFail($id);

        $validated = $this->validateDestination($request);

        if ($request->hasFile('image')) {
            if ($destination->image_path) {
                $oldPath = str_replace('/storage/', '', $destination->image_path);
                Storage::disk('public')->delete($oldPath);
            }
            $imagePath = $request->file('image')->store('destinations', 'public');

            if ($imagePath === false) {
                return response()->json(['message' => 'Gagal menyimpan gambar.'], 500);
            }

            $destination->image_path = Storage::url($imagePath);
        }

        $destination->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'location_url' => $validated['location_url'] ?? null,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $destination->is_active,
        ]);

        return response()->json([
            'message' => 'Objek wisata berhasil diperbarui.',
            'destination' => $destination->fresh(),
        ]);
    }

    /**
     * Validate the destination payload.
     *
     * @return array<string, mixed>
     */
    private function validateDestination(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location_url' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'is_active' => ['nullable', 'boolean'],
        ], [
            'title.required' => 'Nama destinasi wajib diisi.',
            'title.max' => 'Nama destinasi tidak boleh lebih dari 255 karakter.',
            'description.required' => 'Deskripsi destinasi wajib diisi.',
            'image.image' => 'Berkas yang dipilih harus berupa gambar.',
            'image.mimes' => 'Format gambar harus JPG, PNG, atau WEBP.',
            'image.max' => 'Ukuran gambar terlalu besar. Maksimal 2 MB.',
            'image.uploaded' => 'Gambar gagal diunggah. Pastikan ukurannya tidak melebihi 2 MB.',
        ]);
    }

    /**
     * Remove the specified destination.
     */
    public function destroy(int|string $id): JsonResponse
    {
        $destination = Destination::findOrFail($id);

        if ($destination->image_path) {
            $oldPath = str_replace('/storage/', '', $destination->image_path);
            Storage::disk('public')->delete($oldPath);
        }

        $destination->delete();

        return response()->json([
            'message' => 'Objek wisata berhasil dihapus.',
        ]);
    }
}
