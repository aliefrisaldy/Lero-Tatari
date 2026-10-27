<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    /**
     * Display the news management page.
     */
    public function index(): Response
    {
        return Inertia::render('admin/berita/index', [
            'news' => News::with('author:id,name')->latest('id')->get(),
        ]);
    }

    /**
     * Store a newly created news article.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateNews($request);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $storedPath = $request->file('image')->store('news', 'public');

            if ($storedPath === false) {
                throw new \RuntimeException('Gagal menyimpan gambar berita.');
            }

            $imagePath = $storedPath;
        }

        News::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'content' => $validated['content'],
            'image_path' => $imagePath ? Storage::url($imagePath) : null,
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published' ? now() : null,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Berita berhasil dibuat.']);

        return back();
    }

    /**
     * Update the specified news article.
     */
    public function update(Request $request, News $news): RedirectResponse
    {
        $validated = $this->validateNews($request);

        if ($request->hasFile('image')) {
            $this->deleteImage($news->image_path);

            $storedPath = $request->file('image')->store('news', 'public');

            if ($storedPath === false) {
                throw new \RuntimeException('Gagal menyimpan gambar berita.');
            }

            $news->image_path = Storage::url($storedPath);
        }

        $willBePublished = $validated['status'] === 'published';

        $news->title = $validated['title'];
        $news->category = $validated['category'];
        $news->content = $validated['content'];
        $news->status = $validated['status'] === 'published'
            ? 'published'
            : 'draft';

        if ($willBePublished) {
            $news->published_at ??= Carbon::now();
        } else {
            $news->published_at = null;
        }

        $news->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Berita berhasil diperbarui.']);

        return back();
    }

    /**
     * Change the publication status of the specified news article.
     */
    public function toggleStatus(Request $request, News $news): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['published', 'draft'])],
        ]);

        $news->status = $validated['status'] === 'published'
            ? 'published'
            : 'draft';

        if ($news->status === 'published') {
            $news->published_at ??= Carbon::now();
        } else {
            $news->published_at = null;
        }

        $news->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $news->status === 'published'
                ? 'Berita berhasil dipublikasikan.'
                : 'Berita dikembalikan ke status draf.',
        ]);

        return back();
    }

    /**
     * Remove the specified news article.
     */
    public function destroy(News $news): RedirectResponse
    {
        $this->deleteImage($news->image_path);
        $news->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Berita berhasil dihapus.']);

        return back();
    }

    /**
     * Validate news article input.
     *
     * @return array{title: string, category: string, content: string, status: string, image?: mixed}
     */
    private function validateNews(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'content' => ['required', 'string'],
            'status' => ['required', Rule::in(['published', 'draft'])],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:1024'],
        ], [
            'title.required' => 'Judul berita wajib diisi.',
            'title.max' => 'Judul berita tidak boleh lebih dari 255 karakter.',
            'category.required' => 'Kategori berita wajib diisi.',
            'category.max' => 'Kategori berita tidak boleh lebih dari 100 karakter.',
            'content.required' => 'Isi berita wajib diisi.',
            'image.image' => 'Berkas yang dipilih harus berupa gambar.',
            'image.mimes' => 'Format gambar harus JPG, PNG, atau WEBP.',
            'image.max' => 'Ukuran gambar terlalu besar. Maksimal 1 MB.',
            'image.uploaded' => 'Gambar gagal diunggah. Pastikan ukurannya tidak melebihi 1 MB.',
        ]);
    }

    /**
     * Delete the stored image of a news article.
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
