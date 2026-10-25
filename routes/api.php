<?php

use App\Http\Controllers\Api\Admin\DemographicController;
use App\Http\Controllers\Api\Admin\DestinationController;
use App\Http\Controllers\Api\Admin\GalleryController;
use App\Http\Controllers\Api\Admin\NewsController;
use App\Http\Controllers\Api\Admin\OfficialController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\VisionMissionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Middleware\EnsureSuperAdmin;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::prefix('public')->group(function () {
    Route::get('/landing-data', [PublicController::class, 'landingData']);
    Route::get('/news/{id}', [PublicController::class, 'newsDetail']);
});

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

/*
|--------------------------------------------------------------------------
| Admin Protected Routes (Sanctum Bearer Token)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    // 1. Officials
    Route::get('/officials', [OfficialController::class, 'index']);
    Route::post('/officials', [OfficialController::class, 'store']);
    Route::match(['put', 'post'], '/officials/{id}', [OfficialController::class, 'update']);
    Route::delete('/officials/{id}', [OfficialController::class, 'destroy']);

    // 2. Vision & Missions
    Route::get('/vision-mission', [VisionMissionController::class, 'index']);
    Route::put('/vision', [VisionMissionController::class, 'updateVision']);
    Route::post('/missions', [VisionMissionController::class, 'storeMission']);
    Route::put('/missions/{id}', [VisionMissionController::class, 'updateMission']);
    Route::delete('/missions/{id}', [VisionMissionController::class, 'destroyMission']);

    // 3. Demographics
    Route::get('/demographics', [DemographicController::class, 'show']);
    Route::put('/demographics', [DemographicController::class, 'update']);

    // 4. News
    Route::get('/news', [NewsController::class, 'index']);
    Route::post('/news', [NewsController::class, 'store']);
    Route::match(['put', 'post'], '/news/{id}', [NewsController::class, 'update']);
    Route::delete('/news/{id}', [NewsController::class, 'destroy']);

    // 5. Destinations
    Route::get('/destinations', [DestinationController::class, 'index']);
    Route::post('/destinations', [DestinationController::class, 'store']);
    Route::match(['put', 'post'], '/destinations/{id}', [DestinationController::class, 'update']);
    Route::delete('/destinations/{id}', [DestinationController::class, 'destroy']);

    // 5b. Gallery
    Route::get('/galleries', [GalleryController::class, 'index']);
    Route::post('/galleries', [GalleryController::class, 'store']);
    Route::match(['put', 'post'], '/galleries/{id}', [GalleryController::class, 'update']);
    Route::delete('/galleries/{id}', [GalleryController::class, 'destroy']);

    // 6. Users (Super Admin Only)
    Route::middleware(EnsureSuperAdmin::class)->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::patch('/users/{id}/reset-password', [UserController::class, 'resetPassword']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});
