<?php

use App\Models\News;
use App\Models\User;
use App\Support\HtmlSanitizer;

test('news content is sanitized of script tags on write', function () {
    $admin = User::where('role', 'super_admin')->first();

    $response = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/news', [
        'title' => 'Berita XSS',
        'category' => 'Keamanan',
        'content' => '<p>Halo</p><script>alert("xss")</script><img src=x onerror=alert(1)>',
        'status' => 'draft',
    ]);

    $response->assertCreated();

    $content = $response->json('news.content');

    expect($content)
        ->not->toContain('<script')
        ->not->toContain('onerror=')
        ->not->toContain('alert(');
});

test('html sanitizer strips scripts, event handlers and foreign tags', function () {
    $dirty = '<p>Halo <strong>desa</strong></p>'
        .'<script>alert(1)</script>'
        .'<a href="javascript:alert(2)" onclick="x()">link</a>'
        .'<iframe src="https://evil.example"></iframe>';

    $clean = HtmlSanitizer::clean($dirty);

    expect($clean)
        ->not->toContain('<script')
        ->not->toContain('<iframe')
        ->not->toContain('onclick=')
        ->not->toContain('javascript:');
});

test('html sanitizer preserves safe text markup and safe links', function () {
    $dirty = '<p><strong>Judul</strong> teks <em>miring</em></p>'
        .'<a href="https://example.com">tautan</a>';

    $clean = HtmlSanitizer::clean($dirty);

    expect($clean)
        ->toContain('<strong>')
        ->toContain('<em>')
        ->toContain('href="https://example.com"');
});

test('unpublishing a news article clears its published_at', function () {
    $admin = User::where('role', 'super_admin')->first();

    $create = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/news', [
        'title' => 'Berita Terbit',
        'category' => 'Pengumuman',
        'content' => '<p>Isi</p>',
        'status' => 'published',
    ]);
    $create->assertCreated();
    $id = $create->json('news.id');
    expect($create->json('news.published_at'))->not->toBeNull();

    $update = $this->actingAs($admin, 'sanctum')->putJson("/api/admin/news/{$id}", [
        'title' => 'Berita Terbit',
        'category' => 'Pengumuman',
        'content' => '<p>Isi</p>',
        'status' => 'draft',
    ]);
    $update->assertOk();
    expect($update->json('news.published_at'))->toBeNull();

    News::find($id)?->delete();
});
