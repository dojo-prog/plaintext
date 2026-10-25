<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StorePostImageRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Services\CloudinaryService;

class PostImageController extends Controller
{
    /**
     * Upload (or replace) the cover image of the specified resource via Cloudinary.
     */
    public function storeImage(StorePostImageRequest $request, Post $post, CloudinaryService $cloudinary)
    {
        $uploaded = $cloudinary->upload($request->file('image'));

        $previousImage = $post->image;

        $post->update([
            'image' => $uploaded['public_id'],
            'image_url' => $uploaded['url'],
        ]);

        if ($previousImage) {
            $cloudinary->destroy($previousImage);
        }

        return new PostResource($post->load('author'));
    }

    /**
     * Remove the cover image of the specified resource from storage.
     */
    public function destroyImage(Post $post, CloudinaryService $cloudinary)
    {
        abort_if(request()->user()->id !== $post->author_id, 403, 'You cannot modify others\' post');
        abort_if(is_null($post->image), 404, 'Post has no image');

        $cloudinary->destroy($post->image);

        $post->update(['image' => null, 'image_url' => null]);

        return response()->noContent();
    }
}
