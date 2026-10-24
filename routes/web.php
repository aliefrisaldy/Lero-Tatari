<?php

use App\Http\Controllers\Admin\OfficialController;
use App\Http\Controllers\Admin\VisionMissionController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

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
    });

    Route::redirect('officials', 'admin/officials');
});

require __DIR__.'/settings.php';
