<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Demographic;
use App\Models\Destination;
use App\Models\Mission;
use App\Models\News;
use App\Models\Official;
use App\Models\Vision;
use Illuminate\Http\JsonResponse;

class PublicController extends Controller
{
    /**
     * Single batch endpoint for landing page.
     */
    public function landingData(): JsonResponse
    {
        $officials = Official::where('is_active', true)
            ->orderBy('order_index')
            ->get();

        $vision = Vision::latest('updated_at')->first();

        $missions = Mission::orderBy('order_index')->get();

        $demographics = Demographic::first();

        $news = News::with('author:id,name')
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->take(6)
            ->get();

        $destinations = Destination::where('is_active', true)
            ->latest('id')
            ->get();

        return response()->json([
            'officials' => $officials,
            'vision' => $vision,
            'missions' => $missions,
            'demographics' => $demographics,
            'news' => $news,
            'destinations' => $destinations,
        ]);
    }

    /**
     * Get detail of a published news article.
     */
    public function newsDetail(int|string $id): JsonResponse
    {
        $article = News::with('author:id,name')
            ->where('status', 'published')
            ->find($id);

        if (! $article) {
            return response()->json([
                'message' => 'Berita tidak ditemukan atau belum dipublikasikan.',
            ], 404);
        }

        return response()->json([
            'article' => $article,
        ]);
    }
}
