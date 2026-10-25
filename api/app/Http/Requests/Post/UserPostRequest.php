<?php

namespace App\Http\Requests\Post;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Override;

class UserPostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = request()->user();

        return !!$user;
    }

    #[Override]
    public function failedAuthorization()
    {
        throw new AuthorizationException('Only authenticated users can view their own posts');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "status" => ['sometimes', 'string',  'in:draft,published']
            
        ];
    }

    #[Override]
    public function messages()
    {
        return [
            'status.string' => 'Status query must be a valid string',
            'status.in' => 'Invalid status query',
        ];
    }
}
