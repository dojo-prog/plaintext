<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Support\Str;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::where('status', '=', 'published')->with('author')->paginate();

        return PostResource::collection($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        $validated = $request->validated();

        $slug = Str::slug($validated['title']);
        $count = Post::where('slug', 'ILIKE', "{$slug}%")->count();

        $validated['slug'] = $count ? "{$slug}-{$count}" : $slug;
        $validated['author_id'] = request()->user()->id;

        $post = Post::create($validated)->load('author');

        return new PostResource($post);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        abort_if($post->status !== 'published', 404, 'Post not found');

        $post->load('author');

        return new PostResource($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        $validated = $request->validated();

        $validated['slug'] = Str::slug($validated['title'] ?? $post->title);

        $post->update($validated);

        return new PostResource($post);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        abort_if(request()->user()->id !== $post->author_id, 403, 'You cannot delete others\' posts');
        
        $post->delete();

        return response()->noContent();
    }
}
