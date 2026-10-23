<?php

use App\Http\Controllers\Admin\OfficialController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('officials', [OfficialController::class, 'index'])->name('officials.index');
        Route::post('officials', [OfficialController::class, 'store'])->name('officials.store');
        Route::put('officials/{official}', [OfficialController::class, 'update'])->name('officials.update');
        Route::delete('officials/{official}', [OfficialController::class, 'destroy'])->name('officials.destroy');
    });

    Route::redirect('officials', 'admin/officials');
});

require __DIR__.'/settings.php';
