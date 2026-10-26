import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import LoadingGrid from "@/components/post/LoadingGrid";
import PostCard from "@/components/post/PostCard";
import { useCurrentUserPosts } from "@/features/post/hooks/useCurrentUserPosts";
import { useDeletePost } from "@/features/post/hooks/useDeletePost";
import { useDraft } from "@/features/post/hooks/useDraftPost";
import { usePublish } from "@/features/post/hooks/usePublishPost";
import type { Post } from "@/features/post/schema";

const ProfilePosts = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Post["status"]>("published");
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const userPosts = useCurrentUserPosts({ page: 1, status });
  const publishPost = usePublish();
  const draftPost = useDraft();
  const deletePost = useDeletePost();
  const posts = userPosts.data?.pages.flatMap((page) => page.data) ?? [];

  const handleDeletePost = () => {
    if (!postToDelete) {
      return;
    }

    deletePost.mutate(postToDelete.id, {
      onSuccess: () => setPostToDelete(null),
    });
  };

  return (
    <section aria-labelledby="your-posts-heading">
      <div className="mb-5">
        <h2 id="your-posts-heading" className="text-2xl font-bold">
          Your posts
        </h2>
        <p className="mt-1 text-muted-foreground">
          Manage published posts and drafts.
        </p>
      </div>

      <Tabs
        value={status}
        onValueChange={(value) => {
          if (value === "draft" || value === "published") {
            setStatus(value);
          }
        }}
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value={status} className="mt-5">
          {userPosts.isPending ? (
            <LoadingGrid />
          ) : (
            <>
              {userPosts.isError && (
                <ErrorState
                  title={
                    posts.length > 0
                      ? "Could not refresh your posts"
                      : "Could not load your posts"
                  }
                  description="Your posts are unavailable right now. Please try again."
                  onRetry={() => void userPosts.refetch()}
                />
              )}

              {!userPosts.isError && posts.length === 0 && (
                <EmptyState
                  title={
                    status === "published"
                      ? "No published posts yet"
                      : "No drafts yet"
                  }
                  description={
                    status === "published"
                      ? "Publish a post and it will appear here."
                      : "Posts you save as drafts will appear here."
                  }
                />
              )}

              {posts.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => {
                    const isPublishing =
                      publishPost.isPending &&
                      publishPost.variables === post.id;
                    const isDrafting =
                      draftPost.isPending && draftPost.variables === post.id;

                    return (
                      <article key={post.id} className="flex flex-col gap-3">
                        <PostCard post={post} />
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(`/posts/${post.id}/edit`)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={isPublishing || isDrafting}
                            onClick={() =>
                              post.status === "draft"
                                ? publishPost.mutate(post.id)
                                : draftPost.mutate(post.id)
                            }
                          >
                            {isPublishing
                              ? "Publishing..."
                              : isDrafting
                                ? "Saving..."
                                : post.status === "draft"
                                  ? "Publish"
                                  : "Move to draft"}
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setPostToDelete(post)}
                            disabled={deletePost.isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {userPosts.hasNextPage && (
                <div className="mt-8 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void userPosts.fetchNextPage()}
                    disabled={userPosts.isFetchingNextPage}
                  >
                    {userPosts.isFetchingNextPage
                      ? "Loading posts..."
                      : "Load more posts"}
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog
        open={Boolean(postToDelete)}
        onOpenChange={(open) => {
          if (!open && !deletePost.isPending) {
            setPostToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this post?</DialogTitle>
            <DialogDescription>
              “{postToDelete?.title}” will be permanently deleted. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPostToDelete(null)}
              disabled={deletePost.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeletePost}
              disabled={deletePost.isPending}
            >
              {deletePost.isPending ? "Deleting..." : "Delete post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProfilePosts;
