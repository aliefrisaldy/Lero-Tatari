<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DestinationController extends Controller
{
    /**
     * Display the destinations management page.
     */
    public function index(): Response
    {
        return Inertia::render('admin/wisata/index', [
            'destinations' => Destination::latest('id')->get(),
        ]);
    }

    /**
     * Store a newly created destination.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateDestination($request);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $storedPath = $request->file('image')->store('destinations', 'public');

            if ($storedPath === false) {
                throw new \RuntimeException('Gagal menyimpan foto destinasi.');
            }

            $imagePath = $storedPath;
        }

        Destination::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'location_url' => $validated['location_url'] ?? null,
            'image_path' => $imagePath ? Storage::url($imagePath) : null,
            'is_active' => $request->boolean('is_active', true),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Destinasi wisata berhasil ditambahkan.']);

        return back();
    }

    /**
     * Update the specified destination.
     */
    public function update(Request $request, Destination $destination): RedirectResponse
    {
        $validated = $this->validateDestination($request);

        if ($request->hasFile('image')) {
            $this->deleteImage($destination->image_path);

            $storedPath = $request->file('image')->store('destinations', 'public');

            if ($storedPath === false) {
                throw new \RuntimeException('Gagal menyimpan foto destinasi.');
            }

            $destination->image_path = Storage::url($storedPath);
        }

        $destination->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'location_url' => $validated['location_url'] ?? null,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $destination->is_active,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Destinasi wisata berhasil diperbarui.']);

        return back();
    }

    /**
     * Remove the specified destination.
     */
    public function destroy(Destination $destination): RedirectResponse
    {
        $this->deleteImage($destination->image_path);
        $destination->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Destinasi wisata berhasil dihapus.']);

        return back();
    }

    /**
     * Toggle whether the destination appears on the public homepage.
     */
    public function toggleActive(Request $request, Destination $destination): RedirectResponse
    {
        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $destination->update([
            'is_active' => (bool) $validated['is_active'],
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $destination->is_active
                ? 'Destinasi ditampilkan di beranda.'
                : 'Destinasi disembunyikan dari beranda.',
        ]);

        return back();
    }

    /**
     * Validate destination input.
     *
     * @return array{title: string, description: string, location_url?: string|null, image?: mixed, is_active?: bool|null}
     */
    private function validateDestination(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location_url' => ['nullable', 'url', 'max:2048'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:1024'],
            'is_active' => ['nullable', 'boolean'],
        ], [
            'title.required' => 'Nama destinasi wajib diisi.',
            'title.max' => 'Nama destinasi tidak boleh lebih dari 255 karakter.',
            'description.required' => 'Deskripsi destinasi wajib diisi.',
            'location_url.url' => 'Tautan lokasi harus berupa URL yang valid.',
            'location_url.max' => 'Tautan lokasi tidak boleh lebih dari 2048 karakter.',
            'image.image' => 'Berkas yang dipilih harus berupa gambar.',
            'image.mimes' => 'Format gambar harus JPG, PNG, atau WEBP.',
            'image.max' => 'Ukuran gambar terlalu besar. Maksimal 1 MB.',
            'image.uploaded' => 'Gambar gagal diunggah. Pastikan ukurannya tidak melebihi 1 MB.',
        ]);
    }

    /**
     * Delete the stored image of a destination.
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
