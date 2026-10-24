<?php

namespace App\Http\Requests\Post;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['sometimes', 'nullable', 'uuid', Rule::exists('categories', 'id')],
            'title' => [
                'sometimes',
                'required',
                'string',
                'min:2',
                'max:200',
                Rule::unique('posts', 'title')->where('author_id', request()->user()->id)->ignore($this->route('post')),
            ],
            'content' => 'sometimes|required|string|min:10|max:2000',
            'status' => ['sometimes', 'string', Rule::in(['draft', 'published'])],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.exists' => 'The selected category does not exist',

            'title.required' => 'Post title is required',
            'title.string' => 'Post title must be a valid string',
            'title.unique' => 'A post with this title already exists',
            'title.min' => 'Post title must be at least :min characters long',
            'title.max' => 'Post title cannot exceed :max characters',

            'content.required' => 'Post content is required',
            'content.string' => 'Post content must be a valid string',
            'content.min' => 'Post content must be at least :min characters long',
            'content.max' => 'Post content cannot exceed :max characters',

            'status.string' => 'Post status must be a valid string',
            'status.in' => 'Post status must be one of the following: :values',
        ];
    }
}
