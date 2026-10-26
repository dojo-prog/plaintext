import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/features/category/schema";

type HomeFiltersProps = {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string | null) => void;
  onStatusChange: () => void;
  hasMoreCategories: boolean;
  isFetchingNextCategoryPage: boolean;
  isCategoriesError: boolean;
  onRetryCategories: () => void;
  onFetchNextCategoryPage: () => void;
};

const HomeFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onStatusChange,
  hasMoreCategories,
  isFetchingNextCategoryPage,
  isCategoriesError,
  onRetryCategories,
  onFetchNextCategoryPage,
}: HomeFiltersProps) => {
  return (
    <>
      <section
        aria-label="Filter posts"
        className="mb-8 flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-end"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="post-status" className="text-sm font-medium">
            Status
          </label>
          <Select value="published" onValueChange={onStatusChange}>
            <SelectTrigger id="post-status" className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="post-category" className="text-sm font-medium">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger id="post-category" className="w-full sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasMoreCategories && (
          <Button
            type="button"
            variant="ghost"
            onClick={onFetchNextCategoryPage}
            disabled={isFetchingNextCategoryPage}
          >
            {isFetchingNextCategoryPage
              ? "Loading categories..."
              : "More categories"}
          </Button>
        )}
      </section>

      {isCategoriesError && (
        <div
          role="alert"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm"
        >
          <p>
            Category options could not be loaded. You can still browse the
            current feed.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetryCategories}
          >
            Retry categories
          </Button>
        </div>
      )}
    </>
  );
};

export default HomeFilters;
