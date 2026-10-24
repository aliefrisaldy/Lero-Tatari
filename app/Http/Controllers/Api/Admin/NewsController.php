<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class NewsController extends Controller
{
    /**
     * Display a listing of all news articles.
     */
    public function index(): JsonResponse
    {
        $news = News::with('author:id,name')
            ->latest('id')
            ->get();

        return response()->json([
            'news' => $news,
        ]);
    }

    /**
     * Store a newly created news article.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'content' => ['required', 'string'],
            'status' => ['required', Rule::in(['published', 'draft'])],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news', 'public');

            if ($imagePath === false) {
                return response()->json(['message' => 'Gagal menyimpan gambar.'], 500);
            }
        }

        $news = News::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'content' => $validated['content'],
            'image_path' => $imagePath ? Storage::url($imagePath) : null,
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published' ? now() : null,
        ]);

        return response()->json([
            'message' => 'Berita berhasil dibuat.',
            'news' => $news->load('author:id,name'),
        ], 201);
    }

    /**
     * Update the specified news article.
     */
    public function update(Request $request, int|string $id): JsonResponse
    {
        $news = News::findOrFail($id);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'content' => ['required', 'string'],
            'status' => ['required', Rule::in(['published', 'draft'])],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        if ($request->hasFile('image')) {
            if ($news->image_path) {
                $oldPath = str_replace('/storage/', '', $news->image_path);
                Storage::disk('public')->delete($oldPath);
            }
            $imagePath = $request->file('image')->store('news', 'public');

            if ($imagePath === false) {
                return response()->json(['message' => 'Gagal menyimpan gambar.'], 500);
            }

            $news->image_path = Storage::url($imagePath);
        }

        $wasDraft = $news->status === 'draft';
        $willBePublished = $validated['status'] === 'published';

        $news->title = $validated['title'];
        $news->category = $validated['category'];
        $news->content = $validated['content'];
        $news->status = $validated['status'];

        if ($wasDraft && $willBePublished && ! $news->published_at) {
            $news->published_at = now();
        }

        $news->save();

        return response()->json([
            'message' => 'Berita berhasil diperbarui.',
            'news' => $news->load('author:id,name'),
        ]);
    }

    /**
     * Remove the specified news article.
     */
    public function destroy(int|string $id): JsonResponse
    {
        $news = News::findOrFail($id);

        if ($news->image_path) {
            $oldPath = str_replace('/storage/', '', $news->image_path);
            Storage::disk('public')->delete($oldPath);
        }

        $news->delete();

        return response()->json([
            'message' => 'Berita berhasil dihapus.',
        ]);
    }
}
