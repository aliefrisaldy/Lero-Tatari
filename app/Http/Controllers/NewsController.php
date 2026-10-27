<?php

namespace App\Http\Controllers;

use App\Models\News;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    /**
     * Render the public detail page for a published news article.
     */
    public function show(News $news): Response
    {
        abort_unless($news->status === 'published', 404);

        $news->load('author:id,name');

        return Inertia::render('berita/show', [
            'article' => [
                'id' => $news->id,
                'title' => $news->title,
                'category' => $news->category,
                'content' => $news->content,
                'image_url' => $this->imageUrl($news->image_path),
                'published_at' => $news->published_at?->translatedFormat('j F Y'),
                'author' => $news->author?->name,
                'share_url' => route('berita.show', $news),
            ],
            'latestNews' => News::query()
                ->where('status', 'published')
                ->whereKeyNot($news->id)
                ->orderByDesc('published_at')
                ->limit(6)
                ->get(['id', 'title', 'image_path', 'published_at'])
                ->map(fn (News $article): array => [
                    'id' => $article->id,
                    'title' => $article->title,
                    'image_url' => $this->imageUrl($article->image_path),
                    'published_at' => $article->published_at?->translatedFormat('j M Y'),
                ]),
        ]);
    }
}
