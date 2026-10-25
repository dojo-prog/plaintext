<?php

use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Controllers\Api\V1\LikeController;
use App\Http\Controllers\Api\V1\PostController;
use App\Http\Controllers\Api\V1\TagController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public

Route::middleware(['throttle:api'])->prefix('v1')->group(function () {
    Route::get('posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('posts/{post}', [PostController::class, 'show'])->name('posts.show');

    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('categories/{category}', [CategoryController::class, 'show'])->name('categories.show');

    Route::get('tags', [TagController::class, 'index'])->name('tags.index');
    Route::get('tags/{tag}', [TagController::class, 'show'])->name('tags.show');

    Route::get('/posts/{post}/comments', [CommentController::class, 'index']);
});

// Authenticated 

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::prefix('v1')->group(function () {
        // Posts
        Route::prefix('posts')->group(function () {
            Route::post('/', [PostController::class, 'store'])->name('posts.store');
            Route::patch('/{post}', [PostController::class, 'update'])->name('posts.update');
            Route::delete('/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
            Route::post('/{post}/comments', [CommentController::class, 'store']);
            Route::post('/{post}/like', [LikeController::class, 'toggle'])->name('posts.likes.toggle');
        });

        // Categories
        Route::prefix('categories')->group(function () {
            Route::post('/', [CategoryController::class, 'store'])->name('categories.store');
            Route::put('/{category}', [CategoryController::class, 'update'])->name('categories.update');
            Route::patch('/{category}', [CategoryController::class, 'update'])->name('categories.update');
            Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
        });

        // Tags
        Route::apiResource('tags', TagController::class)->except(['index', 'show']);

        // Comments
        Route::apiResource('comments', CommentController::class)->except(['index', 'store']);

        // Likes
        Route::get('likes', [LikeController::class, 'index'])->name('likes.index');
    });
});

require __DIR__.'/auth.php';
