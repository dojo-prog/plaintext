<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Category::class);

        return CategoryResource::collection(Category::paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        $this->authorize('create', Category::class);

        $validated = $request->validated();

        $slug = Str::slug($validated['name']);
        $count = Category::where('slug', 'ILIKE', "{$slug}%")->count();

        $validated['slug'] = $count ? "{$slug}-{$count}" : $slug;

        $category = Category::create($validated);

        return (new CategoryResource($category))->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $this->authorize('view', $category);

        return new CategoryResource($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->authorize('update', $category);

        $validated = $request->validated();

        $validated['slug'] = Str::slug($validated['name']);

        $category->update($validated);

        return new CategoryResource($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        $category->delete();

        return response()->noContent();
    }
}
