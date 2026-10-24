<?php

namespace App\Http\Requests\Category;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
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
            'name' => 'required|string|unique:categories,name|min:2|max:100'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Category name is required',
            'name.string' => 'Category name must be a valid string',
            'name.unique' => 'A category with this name already exists',
            'name.min' => 'Category name must at least be :min characters long',
            'name.max' => 'Category name cannot exceed :max characters' 
        ];
    }
}
