import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/features/category/hooks/useCategories";
import type { Post } from "@/features/post/schema";
import {
  CreatePostSchema,
  PostImageSchema,
  type CreatePostBody,
  type UpdatePostBody,
} from "@/features/post/schema";
import { useCreatePost } from "@/features/post/hooks/useCreatePost";
import { useDeletePost } from "@/features/post/hooks/useDeletePost";
import { useDeletePostImage } from "@/features/post/hooks/useDeletePostImage";
import { useUpdatePost } from "@/features/post/hooks/useUpdatePost";
import { useUploadPostImage } from "@/features/post/hooks/useUploadPostImage";
import { capitalize } from "@/utils/capitalize";

type PostFormProps = {
  initialPost?: Post;
};

const PostForm = ({ initialPost }: PostFormProps) => {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const uploadPostImage = useUploadPostImage();
  const deletePostImage = useDeletePostImage();
  const {
    data: categoryPages,
    isError: isCategoriesError,
    refetch: refetchCategories,
    fetchNextPage: fetchNextCategoryPage,
    hasNextPage: hasMoreCategories,
    isFetchingNextPage: isFetchingNextCategoryPage,
  } = useCategories({ page: 1 });
  const categories = categoryPages?.pages.flatMap((page) => page.data) ?? [];
  const categoryItems = {
    none: capitalize("No category"),
    ...Object.fromEntries(
      categories.map((category) => [
        category.id,
        capitalize(category.name),
      ]),
    ),
  };
  const statusItems = {
    draft: capitalize("Draft"),
    published: capitalize("Published"),
  };
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isCurrentImageRemoved, setIsCurrentImageRemoved] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null);
  const form = useForm<CreatePostBody>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: initialPost?.title ?? "",
      content: initialPost?.content ?? "",
      category_id: initialPost?.category?.id,
      status: initialPost?.status ?? "draft",
    },
  });
  const selectedCategoryId = useWatch({
    control: form.control,
    name: "category_id",
  });
  const selectedStatus = useWatch({
    control: form.control,
    name: "status",
  });

  useEffect(() => {
    return () => {
      if (selectedImagePreview) {
        URL.revokeObjectURL(selectedImagePreview);
      }
    };
  }, [selectedImagePreview]);

  const isSaving =
    createPost.isPending ||
    updatePost.isPending ||
    uploadPostImage.isPending ||
    deletePostImage.isPending;
  const imagePreview =
    selectedImagePreview ??
    (isCurrentImageRemoved ? null : initialPost?.image_url ?? null);

  const handleImageChange = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const result = PostImageSchema.safeParse(file);

    if (!result.success) {
      setSelectedImage(null);
      setSelectedImagePreview(null);
      setImageError(result.error.issues[0]?.message ?? "Invalid image file");
      return;
    }

    setImageError(null);
    setSelectedImage(file);
    setSelectedImagePreview(URL.createObjectURL(file));
    setIsCurrentImageRemoved(false);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setSelectedImagePreview(null);
    setImageError(null);
    if (initialPost?.image && !selectedImage) {
      setIsCurrentImageRemoved(true);
    } else if (!initialPost?.image) {
      setIsCurrentImageRemoved(false);
    }
  };

  const handleSubmit = async (values: CreatePostBody) => {
    const savedPost = initialPost
      ? await updatePost.mutateAsync({
          postId: initialPost.id,
          body: {
            title: values.title,
            content: values.content,
            category_id: values.category_id ?? null,
            status: values.status ?? "draft",
          } satisfies UpdatePostBody,
        })
      : await createPost.mutateAsync({
          ...values,
          status: values.status ?? "draft",
        });

    try {
      if (selectedImage) {
        await uploadPostImage.mutateAsync({
          postId: savedPost.id,
          image: selectedImage,
        });
      } else if (initialPost?.image && isCurrentImageRemoved) {
        await deletePostImage.mutateAsync(savedPost.id);
      }
    } catch {
      if (!initialPost) {
        navigate(`/posts/${savedPost.id}/edit`, { replace: true });
      }
      return;
    }

    navigate(
      savedPost.status === "published" ? `/posts/${savedPost.id}` : "/profile",
      { replace: true },
    );
  };

  const handleDeletePost = () => {
    if (!initialPost) {
      return;
    }

    deletePost.mutate(initialPost.id, {
      onSuccess: () => navigate("/profile", { replace: true }),
    });
  };

  return (
    <section className="mx-auto w-full max-w-3xl">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">
          {initialPost ? "Post settings" : "Share with the community"}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {initialPost ? "Edit post" : "Create a post"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {initialPost
            ? "Update your post details, image, or publication status."
            : "Write something useful, then publish it or save it as a draft."}
        </p>
      </header>

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 rounded-xl border bg-card p-5 sm:p-8"
      >
        <Field>
          <FieldLabel htmlFor="post-title">Title</FieldLabel>
          <Input
            id="post-title"
            maxLength={200}
            placeholder="A clear, descriptive title"
            aria-invalid={Boolean(form.formState.errors.title)}
            {...form.register("title")}
          />
          <FieldError errors={[form.formState.errors.title]} />
          <FieldDescription>Use 2 to 200 characters.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="post-content">Content</FieldLabel>
          <Textarea
            id="post-content"
            maxLength={2000}
            className="min-h-48"
            placeholder="Share your ideas..."
            aria-invalid={Boolean(form.formState.errors.content)}
            {...form.register("content")}
          />
          <FieldError errors={[form.formState.errors.content]} />
          <FieldDescription>Use 10 to 2,000 characters.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="post-category">Category</FieldLabel>
          <Select
            items={categoryItems}
            value={selectedCategoryId ?? "none"}
            onValueChange={(value) =>
              form.setValue(
                "category_id",
                value === "none" ? undefined : (value ?? undefined),
                { shouldDirty: true, shouldValidate: true },
              )
            }
          >
            <SelectTrigger id="post-category" className="w-full sm:w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {capitalize(category.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isCategoriesError && (
            <div className="flex items-center gap-3 text-sm text-destructive">
              <span>Categories could not be loaded.</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void refetchCategories()}
              >
                Retry
              </Button>
            </div>
          )}
          {hasMoreCategories && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void fetchNextCategoryPage()}
              disabled={isFetchingNextCategoryPage}
            >
              {isFetchingNextCategoryPage
                ? "Loading categories..."
                : "Load more categories"}
            </Button>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="post-status">Status</FieldLabel>
          <Select
            items={statusItems}
            value={selectedStatus ?? "draft"}
            onValueChange={(value) =>
              form.setValue(
                "status",
                value === "published" || value === "draft"
                  ? value
                  : undefined,
                { shouldDirty: true, shouldValidate: true },
              )
            }
          >
            <SelectTrigger id="post-status" className="w-full sm:w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">{statusItems.draft}</SelectItem>
              <SelectItem value="published">{statusItems.published}</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            Drafts are only visible to you until published.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="post-image">Cover image</FieldLabel>
          <Input
            id="post-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              handleImageChange(event.target.files?.[0]);
              event.currentTarget.value = "";
            }}
            aria-invalid={Boolean(imageError)}
          />
          <FieldError>{imageError}</FieldError>
          <FieldDescription>
            JPG, PNG, or WebP. Maximum file size is 5 MB.
          </FieldDescription>
          {imagePreview && (
            <div className="mt-2 space-y-3">
              <img
                src={imagePreview}
                alt="Post cover preview"
                className="max-h-72 w-full rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImageRemove}
              >
                Remove image
              </Button>
            </div>
          )}
          {isCurrentImageRemoved && initialPost?.image && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCurrentImageRemoved(false)}
            >
              Undo image removal
            </Button>
          )}
        </Field>

        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          {initialPost ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isSaving || deletePost.isPending}
            >
              Delete post
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/profile")}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || Boolean(imageError)}>
              {isSaving
                ? "Saving..."
                : initialPost
                  ? "Save changes"
                  : selectedStatus === "published"
                    ? "Publish post"
                    : "Save draft"}
            </Button>
          </div>
        </div>
      </form>

      {initialPost && (
        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this post?</DialogTitle>
              <DialogDescription>
                “{initialPost.title}” will be permanently deleted. This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
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
      )}
    </section>
  );
};

export default PostForm;
