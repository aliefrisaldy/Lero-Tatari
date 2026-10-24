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
     * Display the officials management page.
     */
    public function index(Request $request): Response
    {
        $officials = Official::orderBy('order_index')->get();

        return Inertia::render('admin/officials/index', [
            'officials' => $officials,
        ]);
    }

    /**
     * Store a newly created official.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateOfficial($request);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('officials', 'public');
        }

        Official::create([
            'name' => $validated['name'],
            'position' => $validated['position'],
            'category' => $validated['category'],
            'photo_path' => $photoPath ? '/storage/'.$photoPath : null,
            'order_index' => $validated['order_index'] ?? 0,
            'is_active' => $request->boolean('is_active', true),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data aparat berhasil ditambahkan.']);

        return back();
    }

    /**
     * Update the specified official.
     */
    public function update(Request $request, Official $official): RedirectResponse
    {
        $validated = $this->validateOfficial($request);

        if ($request->hasFile('photo')) {
            $this->deletePhoto($official->photo_path);

            $photoPath = $request->file('photo')->store('officials', 'public');
            $official->photo_path = '/storage/'.$photoPath;
        }

        $official->update([
            'name' => $validated['name'],
            'position' => $validated['position'],
            'category' => $validated['category'],
            'order_index' => $validated['order_index'] ?? $official->order_index,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $official->is_active,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data aparat berhasil diperbarui.']);

        return back();
    }

    /**
     * Remove the specified official.
     */
    public function destroy(Official $official): RedirectResponse
    {
        $this->deletePhoto($official->photo_path);
        $official->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data aparat berhasil dihapus.']);

        return back();
    }

    /**
     * Validate official input.
     *
     * @return array{name: string, position: string, category: string, photo?: mixed, order_index?: int|null, is_active?: bool|null}
     */
    private function validateOfficial(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['pimpinan', 'sekretariat', 'kasi', 'kadusun'])],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'order_index' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * Delete the stored photo of an official.
     */
    private function deletePhoto(?string $photoPath): void
    {
        if (! $photoPath) {
            return;
        }

        $oldPath = str_replace('/storage/', '', $photoPath);
        Storage::disk('public')->delete($oldPath);
    }
}
