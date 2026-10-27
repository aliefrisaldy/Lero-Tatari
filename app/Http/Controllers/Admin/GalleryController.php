<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    /**
     * Display the gallery management page.
     */
    public function index(): Response
    {
        return Inertia::render('admin/galeri/index', [
            'galleries' => Gallery::orderBy('order_index')->orderBy('id')->get(),
        ]);
    }

    /**
     * Store a newly created gallery item.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateGallery($request);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $storedPath = $request->file('image')->store('galleries', 'public');

            if ($storedPath === false) {
                throw new \RuntimeException('Gagal menyimpan foto galeri.');
            }

            $imagePath = $storedPath;
        }

        Gallery::create([
            'title' => $validated['title'],
            'captured_at' => $validated['captured_at'] ?? null,
            'image_path' => $imagePath ? Storage::url($imagePath) : null,
            'is_active' => $request->boolean('is_active', true),
            'order_index' => $validated['order_index'] ?? ((int) Gallery::max('order_index') + 1),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Foto galeri berhasil ditambahkan.']);

        return back();
    }

    /**
     * Update the specified gallery item.
     */
    public function update(Request $request, Gallery $gallery): RedirectResponse
    {
        $validated = $this->validateGallery($request);

        if ($request->hasFile('image')) {
            $this->deleteImage($gallery->image_path);

            $storedPath = $request->file('image')->store('galleries', 'public');

            if ($storedPath === false) {
                throw new \RuntimeException('Gagal menyimpan foto galeri.');
            }

            $gallery->image_path = Storage::url($storedPath);
        }

        $gallery->update([
            'title' => $validated['title'],
            'captured_at' => $validated['captured_at'] ?? null,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $gallery->is_active,
            'order_index' => $validated['order_index'] ?? $gallery->order_index,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Foto galeri berhasil diperbarui.']);

        return back();
    }

    /**
     * Toggle whether the gallery item appears on the public homepage.
     */
    public function toggleActive(Request $request, Gallery $gallery): RedirectResponse
    {
        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $gallery->update([
            'is_active' => (bool) $validated['is_active'],
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $gallery->is_active
                ? 'Foto ditampilkan di beranda.'
                : 'Foto disembunyikan dari beranda.',
        ]);

        return back();
    }

    /**
     * Persist the drag & drop / reorder ordering of gallery items.
     *
     * Body: { order: number[] } — daftar ID galeri sesuai urutan tampil.
     */
    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', Rule::exists('galleries', 'id')],
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['order'] as $index => $galleryId) {
                Gallery::whereKey($galleryId)->update(['order_index' => $index + 1]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Urutan galeri diperbarui.']);

        return back();
    }

    /**
     * Remove the specified gallery item.
     */
    public function destroy(Gallery $gallery): RedirectResponse
    {
        $this->deleteImage($gallery->image_path);
        $gallery->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Foto galeri berhasil dihapus.']);

        return back();
    }

    /**
     * Validate gallery input.
     *
     * @return array{title: string, captured_at?: string|null, image?: mixed, order_index?: int|null, is_active?: bool|null}
     */
    private function validateGallery(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'captured_at' => ['nullable', 'date'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:1024'],
            'order_index' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ], [
            'title.required' => 'Judul foto wajib diisi.',
            'title.max' => 'Judul foto tidak boleh lebih dari 255 karakter.',
            'captured_at.date' => 'Tanggal harus berupa tanggal yang valid.',
            'image.image' => 'Berkas yang dipilih harus berupa gambar.',
            'image.mimes' => 'Format gambar harus JPG, PNG, atau WEBP.',
            'image.max' => 'Ukuran gambar terlalu besar. Maksimal 1 MB.',
            'image.uploaded' => 'Gambar gagal diunggah. Pastikan ukurannya tidak melebihi 1 MB.',
        ]);
    }

    /**
     * Delete the stored image of a gallery item.
     */
    private function deleteImage(?string $imagePath): void
    {
        if (! $imagePath) {
            return;
        }

        $oldPath = str_replace('/storage/', '', $imagePath);
        Storage::disk('public')->delete($oldPath);
    }
}
