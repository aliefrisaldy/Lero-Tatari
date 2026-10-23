<?php

use App\Http\Controllers\Admin\OfficialController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    // 1. Officials (Halaman Utama Admin Panel)
    Route::get('/officials', [OfficialController::class, 'index'])->name('officials');
    Route::post('/officials', [OfficialController::class, 'store'])->name('officials.store');
    Route::match(['put', 'post'], '/officials/{id}', [OfficialController::class, 'update'])->name('officials.update');
    Route::delete('/officials/{id}', [OfficialController::class, 'destroy'])->name('officials.destroy');

    // Redirect dashboard & admin to officials
    Route::redirect('dashboard', 'officials');
    Route::redirect('admin', 'officials');
});

require __DIR__.'/settings.php';
