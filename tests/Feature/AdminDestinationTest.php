<?php

use App\Models\Destination;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Inertia\Testing\AssertableInertia as Assert;

uses(DatabaseTransactions::class);

test('admin can visit the destinations management page', function () {
    $admin = User::where('role', 'super_admin')->firstOrFail();

    $this->actingAs($admin)
        ->get(route('admin.wisata.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/wisata/index')
            ->has('destinations'));
});

test('admin can manage destinations', function () {
    $admin = User::where('role', 'super_admin')->firstOrFail();

    $this->actingAs($admin)
        ->post(route('admin.wisata.store'), [
            'title' => 'Destinasi Uji',
            'description' => 'Deskripsi destinasi uji.',
            'location_url' => 'https://maps.google.com/?q=test',
            'is_active' => '1',
        ])
        ->assertRedirect();

    $destination = Destination::where('title', 'Destinasi Uji')->firstOrFail();
    expect($destination->is_active)->toBeTrue();

    $this->actingAs($admin)
        ->put(route('admin.wisata.update', $destination), [
            'title' => 'Destinasi Uji Diperbarui',
            'description' => 'Deskripsi destinasi yang sudah diperbarui.',
            'location_url' => '',
            'is_active' => '0',
        ])
        ->assertRedirect();

    $destination->refresh();
    expect($destination->title)->toBe('Destinasi Uji Diperbarui')
        ->and($destination->is_active)->toBeFalse();

    $this->actingAs($admin)
        ->patch(route('admin.wisata.status', $destination), ['is_active' => true])
        ->assertRedirect();

    expect($destination->refresh()->is_active)->toBeTrue();

    $this->actingAs($admin)
        ->delete(route('admin.wisata.destroy', $destination))
        ->assertRedirect();

    $this->assertDatabaseMissing('destinations', ['id' => $destination->id]);
});

test('destination image must not exceed two megabytes', function () {
    $admin = User::where('role', 'super_admin')->firstOrFail();

    $this->actingAs($admin)
        ->post(route('admin.wisata.store'), [
            'title' => 'Destinasi Gambar Besar',
            'description' => 'Deskripsi destinasi uji.',
            'image' => UploadedFile::fake()->image('foto.jpg')->size(2049),
        ])
        ->assertSessionHasErrors([
            'image' => 'Ukuran gambar terlalu besar. Maksimal 2 MB.',
        ]);

    $this->assertDatabaseMissing('destinations', ['title' => 'Destinasi Gambar Besar']);
});
