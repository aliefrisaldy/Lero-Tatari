<?php

use App\Models\News;
use App\Models\User;

test('public landing data returns complete payload', function () {
    $response = $this->getJson('/api/public/landing-data');

    $response->assertOk()
        ->assertJsonStructure([
            'officials',
            'vision',
            'missions',
            'demographics',
            'news',
            'destinations',
        ]);
});

test('public news detail returns published article', function () {
    $article = News::where('status', 'published')->first();

    $response = $this->getJson("/api/public/news/{$article->id}");

    $response->assertOk()
        ->assertJsonPath('article.id', $article->id)
        ->assertJsonPath('article.title', $article->title);
});

test('login endpoint returns bearer token for active user', function () {
    $response = $this->postJson('/api/auth/login', [
        'email' => 'admin@lerotatari.desa.id',
        'password' => 'password123',
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'message',
            'access_token',
            'token_type',
            'user' => ['id', 'name', 'email', 'role', 'status'],
        ]);
});

test('auth me and logout endpoints work with token', function () {
    $admin = User::where('role', 'super_admin')->first();

    $meResponse = $this->actingAs($admin, 'sanctum')->getJson('/api/auth/me');
    $meResponse->assertOk()->assertJsonPath('user.email', $admin->email);

    $token = $admin->createToken('test_token')->plainTextToken;
    $logoutResponse = $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/auth/logout');
    $logoutResponse->assertOk()->assertJsonPath('message', 'Logout berhasil.');
});

test('admin officials CRUD operations succeed', function () {
    $admin = User::where('role', 'super_admin')->first();

    // Create
    $create = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/officials', [
        'name' => 'Budi Santoso',
        'position' => 'STAF TEKNIS',
        'category' => 'kasi',
        'order_index' => 15,
        'is_active' => true,
    ]);
    $create->assertCreated();
    $id = $create->json('official.id');

    // Update
    $update = $this->actingAs($admin, 'sanctum')->putJson("/api/admin/officials/{$id}", [
        'name' => 'Budi Santoso, S.Kom',
        'position' => 'STAF IT DESA',
        'category' => 'kasi',
        'order_index' => 15,
        'is_active' => true,
    ]);
    $update->assertOk()->assertJsonPath('official.name', 'Budi Santoso, S.Kom');

    // Delete
    $delete = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/officials/{$id}");
    $delete->assertOk();
});

test('admin vision & missions management succeeds', function () {
    $admin = User::where('role', 'super_admin')->first();

    // Update vision
    $visionRes = $this->actingAs($admin, 'sanctum')->putJson('/api/admin/vision', [
        'vision_statement' => 'Desa Berkemajuan dan Berdaya Saing.',
        'period' => '2024–2029',
    ]);
    $visionRes->assertOk();

    // Add mission
    $missionRes = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/missions', [
        'description' => 'Misi pengujian otomatis.',
        'order_index' => 99,
    ]);
    $missionRes->assertCreated();
    $missionId = $missionRes->json('mission.id');

    // Delete mission
    $delMission = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/missions/{$missionId}");
    $delMission->assertOk();
});

test('admin demographics update succeeds', function () {
    $admin = User::where('role', 'super_admin')->first();

    $response = $this->actingAs($admin, 'sanctum')->putJson('/api/admin/demographics', [
        'total_inhabitants' => 1700,
        'male_inhabitants' => 860,
        'female_inhabitants' => 840,
        'total_families' => 525,
        'population_growth_rate' => 0.83,
        'sd_graduates' => 122,
        'sltp_graduates' => 110,
        'slta_graduates' => 226,
        'higher_education_graduates' => 65,
        'coconut_land_area' => 140,
        'coconut_production' => 700,
        'corn_land_area' => 60,
        'corn_production' => 35,
        'piped_water_families' => 450,
        'healthy_wc_families' => 400,
        'brick_houses' => 384,
    ]);

    $response->assertOk()
        ->assertJsonPath('demographics.total_inhabitants', 1700);
});

test('admin news CRUD operations succeed', function () {
    $admin = User::where('role', 'super_admin')->first();

    // Create draft
    $create = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/news', [
        'title' => 'Uji Berita Baru',
        'category' => 'Kegiatan',
        'content' => 'Isi berita pengujian.',
        'status' => 'draft',
    ]);
    $create->assertCreated();
    $newsId = $create->json('news.id');

    // Update to published
    $update = $this->actingAs($admin, 'sanctum')->putJson("/api/admin/news/{$newsId}", [
        'title' => 'Uji Berita Baru Terbit',
        'category' => 'Kegiatan',
        'content' => 'Isi berita sudah terbit.',
        'status' => 'published',
    ]);
    $update->assertOk()->assertJsonPath('news.status', 'published');

    // Delete
    $del = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/news/{$newsId}");
    $del->assertOk();
});

test('admin destinations CRUD operations succeed', function () {
    $admin = User::where('role', 'super_admin')->first();

    $create = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/destinations', [
        'title' => 'Air Terjun Tatari',
        'description' => 'Destinasi air terjun tersembunyi.',
        'location_url' => 'https://maps.google.com/?q=test',
        'is_active' => true,
    ]);
    $create->assertCreated();
    $destId = $create->json('destination.id');

    $del = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/destinations/{$destId}");
    $del->assertOk();
});

test('operator cannot access user management endpoints', function () {
    $operator = User::where('role', 'operator')->first();

    $response = $this->actingAs($operator, 'sanctum')
        ->getJson('/api/admin/users');

    $response->assertForbidden();
});

test('super admin can access and manage users', function () {
    $admin = User::where('role', 'super_admin')->first();

    // List users
    $list = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/users');
    $list->assertOk()->assertJsonStructure(['users']);

    // Create new operator
    $create = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/users', [
        'name' => 'Operator Baru',
        'email' => 'operator.baru@lerotatari.desa.id',
        'password' => 'password123',
        'role' => 'operator',
        'status' => 'active',
    ]);
    $create->assertCreated();
    $newUserId = $create->json('user.id');

    // Reset password
    $reset = $this->actingAs($admin, 'sanctum')
        ->patchJson("/api/admin/users/{$newUserId}/reset-password", [
            'password' => 'newpassword123',
        ]);
    $reset->assertOk();

    // Delete user
    $del = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/users/{$newUserId}");
    $del->assertOk();
});
