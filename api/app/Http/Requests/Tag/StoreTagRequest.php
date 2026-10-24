<?php

namespace App\Http\Requests\Tag;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTagRequest extends FormRequest
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
            'name' => 'required|string|unique:tags,name|min:2|max:100'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tag name is required',
            'name.string' => 'Tag name must be a valid string',
            'name.unique' => 'A tag with this name already exists',
            'name.min' => 'Tag name must at least be :min characters long',
            'name.max' => 'Tag name cannot exceed :max characters' 
        ];
    }
}
