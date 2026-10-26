<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\PostIndexRequest;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Services\CloudinaryService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(PostIndexRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $query = Post::where('status', '=', 'published')
            ->with(['author', 'category'])
            ->withCount('likes')->latest();

        if (isset($filters['category'])) {
            $categorySlug = $filters['category'];
            $query->whereHas('category', function (Builder $categoryQuery) use ($categorySlug): void {
                $categoryQuery->where('slug', $categorySlug);
            });
        }

        return PostResource::collection($query->paginate());
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
    public function show(Request $request, Post $post): PostResource
    {
        $user = $request->user('sanctum');
        abort_if(
            $post->status !== 'published' && $post->author_id !== $user?->id,
            404,
            'Post not found'
        );

        $post->load(['author', 'category'])->loadCount('likes');
        $post->setAttribute('is_liked', $user
            ? $post->likes()->whereKey($user->getKey())->exists()
            : false);

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
    public function destroy(Post $post, CloudinaryService $cloudinary)
    {
        abort_if(request()->user()->id !== $post->author_id, 403, 'You cannot delete others\' posts');

        if ($post->image) {
            $cloudinary->destroy($post->image);
        }

        $post->delete();

        return response()->noContent();
    }
}
