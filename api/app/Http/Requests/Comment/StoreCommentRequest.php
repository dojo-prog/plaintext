<?php

namespace App\Http\Requests\Comment;

use App\Models\Comment;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCommentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', $this->route('comment')) ?? false;
    }

    public function failedAuthorization()
    {
        throw new AuthorizationException('Only authenticated users can make a comments');
    }
    
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'post_id' => ['required', 'uuid', Rule::exists('posts', 'id')],
            'content' => 'required|string|min:1|max:240'
        ];
    }

    public function messages(): array
    {
        return [
            'post_id.required' => 'Post ID is required',
            'post_id.uuid' => 'Invalid post ID',
            'post_id.exists' => 'The selected post does not exist or has been deleted',

            'content.required' => 'Comment content is required',
            'content.min' => 'Comment content must be at least :min character long',
            'content.max' => 'Comment cannot exceed :max characters'
        ];
    }
}
