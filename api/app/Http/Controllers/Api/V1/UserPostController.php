<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\UserPostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;

class UserPostController extends Controller
{
    /**
     * Display User Posts
     */
    public function index(UserPostRequest $request)
    {
        $validated = $request->validated();

        $user = $request->user();

        $query = $user->posts()
            ->with('author');
            
        if (isset($validated['status'])) {
            $query->where('status', $validated['status']);
        };

        return PostResource::collection($query->paginate());
    }

    public function publish(Post $post) 
    {
        abort_if($post->author_id !== request()->user()->id, 403, 'You cannot modify other\'s post');

        abort_if($post->status === 'published', 409, 'Post is already published');

        $post->update([
            'status' => 'published', 
            'published_at' => now()
        ]);

        return new PostResource($post);
    }

    public function draft(Post $post) 
    {
        abort_if($post->author_id !== request()->user()->id, 403, 'You cannot modify other\'s post');

        abort_if($post->status === 'draft', 409, 'Post is already set to draft');

        $post->update([
            'status' => 'draft', 
            'published_at' => null
        ]);

        return new PostResource($post);
    }
}
