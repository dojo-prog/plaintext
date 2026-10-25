<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;
use Override;

class RegisterRequest extends FormRequest
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
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'username' => ['sometimes', 'string', 'max:255', 'unique:'.User::class],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];
    }

    #[Override]
    public function messages()
    {
        return [
            'name.required' => 'Your name is required',
            'name.string' => 'Name must be a valid string',
            'name.min' => 'Name must be at least 2 characters long',
            'name.max' => 'Name cannot exceed :max characters',

            'username.string' => 'Username must be a valid string',
            'username.max' => 'Username cannot exceed :max characters',
            'username.unique' => 'This username is already used',

            'email.required' => 'Email is required',
            'email.string' => 'Email must be a valid string',
            'email.email' => 'Invalid email format',
            'email.max' => 'Email cannot exceed :max characters',
            'email.unique' => 'This email is already registered',

            'password.required' => 'Password is required',
        ];
    }
}
