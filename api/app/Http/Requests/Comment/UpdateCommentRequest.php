<?php

namespace App\Http\Requests\Comment;

use App\Models\Comment;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCommentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('comment')) ?? false;
    }

    public function failedAuthorization()
    {
        throw new AuthorizationException('You cannot modify someone else\'s comment');
    }
    
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'content' => 'sometimes|required|string|min:1|max:240'
        ];
    }

    public function messages(): array
    {
        return [
            'content.required' => 'Comment content is required',
            'content.min' => 'Comment content must be at least :min character long',
            'content.max' => 'Comment cannot exceed :max characters'
        ];
    }
}
