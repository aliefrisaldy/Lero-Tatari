<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Official;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OfficialController extends Controller
{
    /**
     * Tampilkan halaman pengelolaan aparat desa.
     */
    public function index(): Response
    {
        $officials = Official::orderBy('order_index')->get();

        return Inertia::render('officials', [
            'officials' => $officials,
        ]);
    }

    /**
     * Tambahkan data aparat desa baru.
     */
    public function store(Request $request): RedirectResponse
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
        }

        Official::create([
            'name' => $validated['name'],
            'position' => $validated['position'],
            'category' => $validated['category'],
            'photo_path' => $photoPath ? Storage::url($photoPath) : null,
            'order_index' => $validated['order_index'] ?? (Official::max('order_index') + 1),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Data aparat berhasil ditambahkan.');
    }

    /**
     * Perbarui data aparat desa.
     */
    public function update(Request $request, int $id): RedirectResponse
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
            $official->photo_path = Storage::url($photoPath);
        }

        $official->update([
            'name' => $validated['name'],
            'position' => $validated['position'],
            'category' => $validated['category'],
            'order_index' => $validated['order_index'] ?? $official->order_index,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $official->is_active,
        ]);

        return back()->with('success', 'Data aparat berhasil diperbarui.');
    }

    /**
     * Hapus data aparat desa.
     */
    public function destroy(int $id): RedirectResponse
    {
        $official = Official::findOrFail($id);

        if ($official->photo_path) {
            $oldPath = str_replace('/storage/', '', $official->photo_path);
            Storage::disk('public')->delete($oldPath);
        }

        $official->delete();

        return back()->with('success', 'Data aparat berhasil dihapus.');
    }
}
