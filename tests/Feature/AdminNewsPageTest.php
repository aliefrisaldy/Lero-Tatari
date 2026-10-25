<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page when opening kelola berita', function () {
    $response = $this->get(route('admin.berita.index'));

    $response->assertRedirect(route('login'));
});

test('authenticated users see the kelola berita page with news data', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.berita.index'));

    $response->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('admin/berita/index')
                ->has('news')
        );
});
