<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate dynamic XML sitemap for search engines.
     */
    public function __invoke(): Response
    {
        $articles = News::query()
            ->where('status', 'published')
            ->orderByDesc('updated_at')
            ->get(['id', 'updated_at', 'published_at']);

        $latestNewsUpdate = $articles->first()?->updated_at?->toAtomString() ?? now()->toAtomString();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // Homepage
        $xml .= "  <url>\n";
        $xml .= '    <loc>' . htmlspecialchars(route('home'), ENT_XML1, 'UTF-8') . "</loc>\n";
        $xml .= '    <lastmod>' . $latestNewsUpdate . "</lastmod>\n";
        $xml .= "    <changefreq>daily</changefreq>\n";
        $xml .= "    <priority>1.0</priority>\n";
        $xml .= "  </url>\n";

        // Published News Articles
        foreach ($articles as $article) {
            $lastmod = ($article->updated_at ?? $article->published_at ?? now())->toAtomString();
            $xml .= "  <url>\n";
            $xml .= '    <loc>' . htmlspecialchars(route('berita.show', $article), ENT_XML1, 'UTF-8') . "</loc>\n";
            $xml .= '    <lastmod>' . $lastmod . "</lastmod>\n";
            $xml .= "    <changefreq>weekly</changefreq>\n";
            $xml .= "    <priority>0.8</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
