import { useSearchParams } from "react-router-dom";
import HomeFilters from "@/components/home/HomeFilters";
import HomeHero from "@/components/home/HomeHero";
import HomePostFeed from "@/components/home/HomePostFeed";
import { useCategories } from "@/features/category/hooks/useCategories";
import { usePosts } from "@/features/post/hooks/usePosts";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "all";
  const {
    data: categoryPages,
    isError: isCategoriesError,
    refetch: refetchCategories,
    fetchNextPage: fetchNextCategoryPage,
    hasNextPage: hasMoreCategories,
    isFetchingNextPage: isFetchingNextCategoryPage,
  } = useCategories({ page: 1 });
  const postsQuery = usePosts({
    page: 1,
    status: "published",
    category: selectedCategory === "all" ? undefined : selectedCategory,
  });
  const fetchNextPostsPage = postsQuery.fetchNextPage;
  const hasMorePosts = postsQuery.hasNextPage;
  const isFetchingNextPostsPage = postsQuery.isFetchingNextPage;
  const isNextPostsPageError = postsQuery.isFetchNextPageError;
  const categories = categoryPages?.pages.flatMap((page) => page.data) ?? [];
  const posts = postsQuery.data?.pages.flatMap((page) => page.data) ?? [];

  const handleCategoryChange = (value: string | null) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (value && value !== "all") {
      nextSearchParams.set("category", value);
    } else {
      nextSearchParams.delete("category");
    }

    nextSearchParams.delete("page");
    setSearchParams(nextSearchParams);
  };

  const handleStatusChange = () => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("status", "published");
    setSearchParams(nextSearchParams);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <HomeHero />

      <HomeFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        hasMoreCategories={hasMoreCategories}
        isFetchingNextCategoryPage={isFetchingNextCategoryPage}
        isCategoriesError={isCategoriesError}
        onRetryCategories={() => void refetchCategories()}
        onFetchNextCategoryPage={() => void fetchNextCategoryPage()}
      />

      <HomePostFeed
        posts={posts}
        isPending={postsQuery.isPending}
        isError={postsQuery.isError}
        isFetchingNextPage={isFetchingNextPostsPage}
        hasNextPage={hasMorePosts}
        isNextPageError={isNextPostsPageError}
        emptyDescription={
          selectedCategory === "all"
            ? "There are no posts to show right now. Please check back later."
            : "There are no published posts in this category yet. Try another category."
        }
        onRetry={() => void postsQuery.refetch()}
        onFetchNextPage={() => void fetchNextPostsPage()}
      />
    </div>
  );
};

export default HomePage;
