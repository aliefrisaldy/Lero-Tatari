<?php

use App\Http\Controllers\Admin\DemographicController;
use App\Http\Controllers\Admin\DestinationController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\OfficialController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VisionMissionController;
use App\Http\Controllers\HomeController;
use App\Http\Middleware\EnsureSuperAdmin;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('officials', [OfficialController::class, 'index'])->name('officials.index');
        Route::post('officials', [OfficialController::class, 'store'])->name('officials.store');
        Route::put('officials/{official}', [OfficialController::class, 'update'])->name('officials.update');
        Route::delete('officials/{official}', [OfficialController::class, 'destroy'])->name('officials.destroy');

        Route::get('visi-misi', [VisionMissionController::class, 'index'])->name('visi-misi.index');
        Route::put('visi', [VisionMissionController::class, 'updateVision'])->name('visi.update');
        Route::post('misi', [VisionMissionController::class, 'storeMission'])->name('misi.store');
        Route::put('misi/{mission}', [VisionMissionController::class, 'updateMission'])->name('misi.update');
        Route::delete('misi/{mission}', [VisionMissionController::class, 'destroyMission'])->name('misi.destroy');
        Route::post('misi-reorder', [VisionMissionController::class, 'reorderMission'])->name('misi.reorder');

        Route::get('demografi', [DemographicController::class, 'index'])->name('demografi.index');
        Route::put('demografi', [DemographicController::class, 'update'])->name('demografi.update');

        Route::get('wisata', [DestinationController::class, 'index'])->name('wisata.index');
        Route::post('wisata', [DestinationController::class, 'store'])->name('wisata.store');
        Route::put('wisata/{destination}', [DestinationController::class, 'update'])->name('wisata.update');
        Route::delete('wisata/{destination}', [DestinationController::class, 'destroy'])->name('wisata.destroy');
        Route::patch('wisata/{destination}/status', [DestinationController::class, 'toggleActive'])->name('wisata.status');

        Route::get('berita', [NewsController::class, 'index'])->name('berita.index');
        Route::post('berita', [NewsController::class, 'store'])->name('berita.store');
        Route::put('berita/{news}', [NewsController::class, 'update'])->name('berita.update');
        Route::delete('berita/{news}', [NewsController::class, 'destroy'])->name('berita.destroy');
        Route::patch('berita/{news}/status', [NewsController::class, 'toggleStatus'])->name('berita.status');

        Route::middleware(EnsureSuperAdmin::class)->group(function () {
            Route::get('users', [UserController::class, 'index'])->name('users.index');
            Route::post('users', [UserController::class, 'store'])->name('users.store');
            Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
            Route::patch('users/{user}/status', [UserController::class, 'updateStatus'])->name('users.status');
            Route::patch('users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
            Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        });
    });

    Route::redirect('officials', 'admin/officials');
});

require __DIR__.'/settings.php';
