<?php

namespace App\Http\Controllers;

use App\Models\Demographic;
use App\Models\Destination;
use App\Models\Gallery;
use App\Models\Mission;
use App\Models\News;
use App\Models\Official;
use App\Models\Vision;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Render the public landing page with data from the database.
     */
    public function __invoke(): Response
    {
        return Inertia::render('welcome', [
            'officials' => Official::query()
                ->where('is_active', true)
                ->orderBy('order_index')
                ->get(['name', 'position', 'category', 'photo_path'])
                ->map(fn (Official $official): array => [
                    'name' => $official->name,
                    'position' => $official->position,
                    'category' => $official->category,
                    'photo_url' => $this->imageUrl($official->photo_path),
                ]),
            'vision' => Vision::query()->latest('updated_at')->first(['vision_statement', 'period']),
            'missions' => Mission::query()
                ->orderBy('order_index')
                ->get(['id', 'description'])
                ->map(fn (Mission $mission): array => [
                    'id' => $mission->id,
                    // Nomor urut di awal teks dibuang karena daftar misi sudah bernomor.
                    'description' => preg_replace('/^\s*\d+[.)]\s*/u', '', $mission->description),
                ]),
            'demographic' => Demographic::query()->first(),
            'news' => News::query()
                ->where('status', 'published')
                ->orderByDesc('published_at')
                ->get(['id', 'title', 'category', 'content', 'image_path', 'published_at'])
                ->map(fn (News $article): array => [
                    'id' => $article->id,
                    'title' => $article->title,
                    'category' => $article->category,
                    'excerpt' => str($article->content)->stripTags()->limit(180)->toString(),
                    'image_url' => $this->imageUrl($article->image_path),
                    'published_at' => $article->published_at?->translatedFormat('j F Y'),
                ]),
            'destinations' => Destination::query()
                ->where('is_active', true)
                ->latest('id')
                ->get(['id', 'title', 'description', 'image_path', 'location_url'])
                ->map(fn (Destination $destination): array => [
                    'id' => $destination->id,
                    'title' => $destination->title,
                    'description' => $destination->description,
                    'image_url' => $this->imageUrl($destination->image_path),
                    'location_url' => $destination->location_url,
                ]),
            'galleries' => Gallery::query()
                ->where('is_active', true)
                ->orderBy('order_index')
                ->orderBy('id')
                ->get(['id', 'title', 'captured_at', 'image_path'])
                ->map(fn (Gallery $gallery): array => [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'captured_at' => $gallery->captured_at?->translatedFormat('j F Y'),
                    'image_url' => $this->imageUrl($gallery->image_path),
                ]),
        ]);
    }

    /**
     * Normalise a stored image value into a browsable URL.
     */
    private function imageUrl(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        return str_starts_with($path, 'http') || str_starts_with($path, '/')
            ? $path
            : Storage::url($path);
    }
}
