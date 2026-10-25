<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LikeController extends Controller
{
    /**
     * Like or unlike a post for the authenticated user.
     */
    public function toggle(Request $request, Post $post): JsonResponse
    {
        $result = $request->user()->likedPosts()->toggle([$post->id]);

        return response()->json([
            'liked' => count($result['attached']) > 0,
            'likes_count' => $post->likes()->count(),
        ]);
    }

    /**
     * List the posts the authenticated user has liked.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $posts = $request->user()
            ->likedPosts()
            ->with(['author', 'category'])
            ->withCount('likes')
            ->orderByPivot('created_at', 'desc')
            ->paginate();

        return PostResource::collection($posts);
    }
}
