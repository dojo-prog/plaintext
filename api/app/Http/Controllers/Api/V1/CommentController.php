<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Comment\StoreCommentRequest;
use App\Http\Requests\Comment\UpdateCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Post $post)
    {
        $this->authorize('viewAny', Comment::class);

        $comments = Comment::where('post_id', '===', $post->id); 

        return CommentResource::collection($comments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommentRequest $request)
    {
        $validated = $request->validated();

        $validated['user_id'] = request()->user()->id;

        $comment = Comment::create($validated)->load('user');

        return (new CommentResource($comment))->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommentRequest $request, Comment $comment)
    {
        $validated = $request->validated();

        abort_if($validated->content === $comment->content, 400, 'No changes has been made');

        $comment->update($validated);

        $comment->load('user');

        return new CommentResource($comment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        abort_if($comment->user_id !== request()->user()->id, 400, 'You cannot delete someone else\'s comment');

        $comment->delete();

        return response()->noContent(); 
    }
}
