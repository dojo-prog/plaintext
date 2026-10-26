import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteComment } from "@/features/comment/hooks/useDeleteComment";
import { useUpdateComment } from "@/features/comment/hooks/useUpdateComment";
import {
  CreateCommentSchema,
  type CreateCommentBody,
} from "@/features/comment/schema";
import type { Comment } from "@/features/comment/schema";
import type { User } from "@/features/auth/schema";

type CommentItemProps = {
  comment: Comment;
  currentUser?: User;
};

const formatCommentDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const CommentItem = ({ comment, currentUser }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const form = useForm<CreateCommentBody>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: { content: comment.content },
  });
  const isOwner = currentUser?.id === comment.user?.id;

  const handleUpdate = (body: CreateCommentBody) => {
    updateComment.mutate(
      { commentId: comment.id, body },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleDelete = () => {
    if (window.confirm("Delete this comment? This action cannot be undone.")) {
      deleteComment.mutate(comment.id);
    }
  };

  return (
    <article className="rounded-xl border p-4">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">
            {comment.user?.name ?? "Unknown user"}
          </p>
          <time
            dateTime={comment.created_at}
            className="text-xs text-muted-foreground"
          >
            {formatCommentDate(comment.created_at)}
          </time>
        </div>
        {isOwner && !isEditing && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                form.reset({ content: comment.content });
                setIsEditing(true);
              }}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleteComment.isPending}
            >
              {deleteComment.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        )}
      </header>

      {isEditing ? (
        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-3">
          <Field>
            <FieldLabel htmlFor={`edit-comment-${comment.id}`}>
              Edit comment
            </FieldLabel>
            <Textarea
              id={`edit-comment-${comment.id}`}
              maxLength={240}
              aria-invalid={Boolean(form.formState.errors.content)}
              {...form.register("content")}
            />
            <FieldError errors={[form.formState.errors.content]} />
          </Field>
          <div className="flex gap-2">
            <Button type="submit" disabled={updateComment.isPending}>
              {updateComment.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset({ content: comment.content });
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {comment.content}
        </p>
      )}
    </article>
  );
};

export default CommentItem;
