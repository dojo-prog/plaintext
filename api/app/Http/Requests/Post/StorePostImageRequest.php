<?php

namespace App\Http\Requests\Post;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePostImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $post = $this->route('post');

        return $post && $this->user()->can('update', $post);
    }

    protected function failedAuthorization()
    {
        throw new AuthorizationException('You cannot modify others\' posts');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => 'Post image is required',
            'image.image' => 'Post image must be a valid image file',
            'image.mimes' => 'Post image must be a file of type: :values',
            'image.max' => 'Post image cannot exceed :max kilobytes',
        ];
    }
}
