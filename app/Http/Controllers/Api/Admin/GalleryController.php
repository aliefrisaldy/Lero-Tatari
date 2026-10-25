<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    /**
     * Display a listing of gallery items.
     */
    public function index(): JsonResponse
    {
        $galleries = Gallery::orderBy('order_index')->orderBy('id')->get();

        return response()->json([
            'galleries' => $galleries,
        ]);
    }

    /**
     * Store a newly created gallery item.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateGallery($request);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('galleries', 'public');

            if ($imagePath === false) {
                return response()->json(['message' => 'Gagal menyimpan foto.'], 500);
            }
        }

        $gallery = Gallery::create([
            'title' => $validated['title'],
            'captured_at' => $validated['captured_at'] ?? null,
            'image_path' => $imagePath ? Storage::url($imagePath) : null,
            'is_active' => $request->boolean('is_active', true),
            'order_index' => $validated['order_index'] ?? ((int) Gallery::max('order_index') + 1),
        ]);

        return response()->json([
            'message' => 'Foto galeri berhasil ditambahkan.',
            'gallery' => $gallery,
        ], 201);
    }

    /**
     * Update the specified gallery item.
     */
    public function update(Request $request, int|string $id): JsonResponse
    {
        $gallery = Gallery::findOrFail($id);

        $validated = $this->validateGallery($request);

        if ($request->hasFile('image')) {
            if ($gallery->image_path) {
                $oldPath = str_replace('/storage/', '', $gallery->image_path);
                Storage::disk('public')->delete($oldPath);
            }

            $imagePath = $request->file('image')->store('galleries', 'public');

            if ($imagePath === false) {
                return response()->json(['message' => 'Gagal menyimpan foto.'], 500);
            }

            $gallery->image_path = Storage::url($imagePath);
        }

        $gallery->update([
            'title' => $validated['title'],
            'captured_at' => $validated['captured_at'] ?? null,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $gallery->is_active,
            'order_index' => $validated['order_index'] ?? $gallery->order_index,
        ]);

        return response()->json([
            'message' => 'Foto galeri berhasil diperbarui.',
            'gallery' => $gallery->fresh(),
        ]);
    }

    /**
     * Remove the specified gallery item.
     */
    public function destroy(int|string $id): JsonResponse
    {
        $gallery = Gallery::findOrFail($id);

        if ($gallery->image_path) {
            $oldPath = str_replace('/storage/', '', $gallery->image_path);
            Storage::disk('public')->delete($oldPath);
        }

        $gallery->delete();

        return response()->json([
            'message' => 'Foto galeri berhasil dihapus.',
        ]);
    }

    /**
     * Validate the gallery payload.
     *
     * @return array<string, mixed>
     */
    private function validateGallery(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'captured_at' => ['nullable', 'date'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'order_index' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ], [
            'title.required' => 'Judul foto wajib diisi.',
            'title.max' => 'Judul foto tidak boleh lebih dari 255 karakter.',
            'captured_at.date' => 'Tanggal harus berupa tanggal yang valid.',
            'image.image' => 'Berkas yang dipilih harus berupa gambar.',
            'image.mimes' => 'Format gambar harus JPG, PNG, atau WEBP.',
            'image.max' => 'Ukuran gambar terlalu besar. Maksimal 2 MB.',
            'image.uploaded' => 'Gambar gagal diunggah. Pastikan ukurannya tidak melebihi 2 MB.',
        ]);
    }
}
