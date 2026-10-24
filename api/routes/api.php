<?php

use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Controllers\Api\V1\LikeController;
use App\Http\Controllers\Api\V1\PostController;
use App\Http\Controllers\Api\V1\TagController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public

Route::middleware(['throttle:api'])->group(function () {
    Route::apiResource('posts', PostController::class)->only('index', 'show');
    Route::apiResource('categories', CategoryController::class)->only('index', 'show');
});

// Authenticated

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::prefix('v1')->group(function () {
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('tags', TagController::class);
        Route::apiResource('posts', PostController::class);
        Route::apiResource('comments', CommentController::class);
        Route::apiResource('likes', LikeController::class);
    });
});


require __DIR__.'/auth.php';
